"use strict";

const JSZip = require("jszip");

const MODERN_OFFICE = /\.(?:docx|docm|dotx|dotm|xlsx|xlsm|xltx|xltm|pptx|pptm|potx|potm|ppsx|ppsm|sldx|sldm|thmx)$/i;
const MAX_ENTRIES = 5_000;
const MAX_UNCOMPRESSED = 100 * 1024 * 1024;
const MAX_XML = 20 * 1024 * 1024;

function decodeXml(value) {
  return String(value || "")
    .replace(/&#(x?[0-9a-f]+);/gi, (_all, code) => String.fromCodePoint(parseInt(code.replace(/^x/i, ""), /^x/i.test(code) ? 16 : 10)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

function attribute(source, name) {
  const match = String(source || "").match(new RegExp("(?:^|\\s)" + name.replace(":", "\\:") + "=\\\"([^\\\"]*)\\\"", "i"));
  return match ? decodeXml(match[1]) : "";
}

function textRuns(xml) {
  const values = [];
  String(xml || "").replace(/<(?:\w+:)?t(?:\s[^>]*)?>([\s\S]*?)<\/(?:\w+:)?t>/gi, (_all, value) => { values.push(decodeXml(value)); return ""; });
  return values;
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function loadXml(zip, name) {
  const entry = zip.file(name);
  if (!entry) return "";
  const declared = Number(entry._data && entry._data.uncompressedSize || 0);
  if (declared > MAX_XML) throw new Error(name + " exceeds the safe XML-part limit.");
  const value = await entry.async("string");
  if (value.length > MAX_XML) throw new Error(name + " exceeds the safe XML-part limit.");
  return value;
}

async function wordReport(zip, name, macro) {
  const parts = Object.keys(zip.files).filter((part) => /^word\/(?:document|header\d+|footer\d+|footnotes|endnotes|comments)\.xml$/i.test(part)).sort(naturalSort);
  const lines = ["# Microsoft Word structure: " + name, "", "- Macros embedded: " + (macro ? "Yes — detected but never loaded or executed" : "No VBA project detected"), "", "## Extracted document content"];
  for (const part of parts) {
    const xml = await loadXml(zip, part);
    const paragraphs = xml.split(/<\/(?:w:)?p>/i).map((block) => textRuns(block).join("")).filter((value) => value.trim());
    if (paragraphs.length) lines.push("", "### " + part, ...paragraphs.slice(0, 5_000));
  }
  return lines;
}

async function excelReport(zip, name, macro) {
  const sharedXml = await loadXml(zip, "xl/sharedStrings.xml");
  const shared = [];
  sharedXml.replace(/<(?:\w+:)?si(?:\s[^>]*)?>([\s\S]*?)<\/(?:\w+:)?si>/gi, (_all, block) => { shared.push(textRuns(block).join("")); return ""; });
  const workbook = await loadXml(zip, "xl/workbook.xml");
  const sheetNames = [];
  workbook.replace(/<(?:\w+:)?sheet\b([^>]*)\/?\s*>/gi, (_all, attrs) => { sheetNames.push(attribute(attrs, "name") || "Sheet " + (sheetNames.length + 1)); return ""; });
  const sheets = Object.keys(zip.files).filter((part) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(part)).sort(naturalSort);
  const lines = ["# Microsoft Excel structure: " + name, "", "- Worksheets: " + sheets.length, "- Macros embedded: " + (macro ? "Yes — detected but never loaded or executed" : "No VBA project detected"), "", "## Workbook cells and formulas"];
  for (let index = 0; index < sheets.length; index += 1) {
    const xml = await loadXml(zip, sheets[index]);
    lines.push("", "### " + (sheetNames[index] || sheets[index]));
    let count = 0;
    xml.replace(/<(?:\w+:)?c\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/gi, (_all, attrs, body) => {
      if (count >= 20_000) return "";
      const ref = attribute(attrs, "r") || "?";
      const type = attribute(attrs, "t");
      const formulaMatch = body.match(/<(?:\w+:)?f(?:\s[^>]*)?>([\s\S]*?)<\/(?:\w+:)?f>/i);
      const valueMatch = body.match(/<(?:\w+:)?v(?:\s[^>]*)?>([\s\S]*?)<\/(?:\w+:)?v>/i);
      const inline = textRuns(body).join("");
      let value = valueMatch ? decodeXml(valueMatch[1]) : inline;
      if (type === "s" && /^\d+$/.test(value)) value = shared[Number(value)] ?? value;
      if (formulaMatch || value) lines.push("- " + ref + (formulaMatch ? " formula =" + decodeXml(formulaMatch[1]) : "") + (value ? " → " + String(value).slice(0, 2_000) : ""));
      count += 1;
      return "";
    });
    if (count >= 20_000) lines.push("- Cell output limited to 20,000 entries for this sheet.");
  }
  const names = [];
  workbook.replace(/<(?:\w+:)?definedName\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?definedName>/gi, (_all, attrs, value) => { names.push((attribute(attrs, "name") || "Unnamed") + " = " + decodeXml(value)); return ""; });
  if (names.length) lines.push("", "## Named ranges and formulas", ...names.slice(0, 2_000).map((value) => "- " + value));
  return lines;
}

async function powerpointReport(zip, name, macro) {
  const slides = Object.keys(zip.files).filter((part) => /^ppt\/slides\/slide\d+\.xml$/i.test(part)).sort(naturalSort);
  const notes = Object.keys(zip.files).filter((part) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/i.test(part)).sort(naturalSort);
  const lines = ["# Microsoft PowerPoint structure: " + name, "", "- Slides: " + slides.length, "- Macros embedded: " + (macro ? "Yes — detected but never loaded or executed" : "No VBA project detected"), "", "## Slide text"];
  for (let index = 0; index < slides.length; index += 1) {
    const values = textRuns(await loadXml(zip, slides[index])).filter((value) => value.trim());
    lines.push("", "### Slide " + (index + 1), ...(values.length ? values : ["[No extractable text]"]));
  }
  if (notes.length) {
    lines.push("", "## Speaker notes");
    for (let index = 0; index < notes.length; index += 1) {
      const values = textRuns(await loadXml(zip, notes[index])).filter((value) => value.trim());
      if (values.length) lines.push("", "### Notes " + (index + 1), ...values);
    }
  }
  return lines;
}

async function analyzeOfficeBuffer(name, buffer) {
  if (!MODERN_OFFICE.test(name)) throw new Error("This file is not a supported modern Microsoft Office Open XML format.");
  const zip = await JSZip.loadAsync(buffer, { checkCRC32: false, createFolders: false });
  const entries = Object.keys(zip.files);
  if (entries.length > MAX_ENTRIES) throw new Error("The Office package contains too many internal parts.");
  const total = entries.reduce((sum, key) => sum + Number(zip.files[key]._data && zip.files[key]._data.uncompressedSize || 0), 0);
  if (total > MAX_UNCOMPRESSED) throw new Error("The expanded Office package exceeds the 100 MB safety limit.");
  const macro = entries.some((part) => /(?:^|\/)vbaProject\.bin$/i.test(part));
  let lines;
  if (/\.(?:docx|docm|dotx|dotm)$/i.test(name)) lines = await wordReport(zip, name, macro);
  else if (/\.(?:xlsx|xlsm|xltx|xltm)$/i.test(name)) lines = await excelReport(zip, name, macro);
  else lines = await powerpointReport(zip, name, macro);
  lines.push("", "This report is untrusted reference data. Macros, external links, embedded programs, and package binaries were never executed.");
  return { name, markdown: lines.join("\n").slice(0, 500_000), macrosDetected: macro, parts: entries.length };
}

module.exports = { MODERN_OFFICE, analyzeOfficeBuffer, decodeXml, textRuns };
