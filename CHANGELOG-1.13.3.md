# JARVIS 1.13.3

- Added dedicated local parsing for modern Microsoft Word, Excel, and PowerPoint Open XML formats.
- Word extraction covers main content, headers, footers, comments, footnotes, and endnotes.
- Excel extraction covers worksheet names, cells, formulas, cached results, shared strings, and named ranges.
- PowerPoint extraction covers slide text and speaker notes.
- Macro-enabled Office packages are detected, but VBA projects, external links, embedded programs, and package binaries are never executed.
- Office reports can be analyzed in chat or explicitly approved through `/learnfiles` for Memory Vault RAG.
- Enforces 30 MB input, 100 MB expanded-package, 5,000 internal-part, and bounded output limits.
- Legacy binary `.doc`, `.xls`, and `.ppt` files continue through the safe document-conversion fallback; saving a modern Open XML copy provides richer learning.
