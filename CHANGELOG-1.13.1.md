# JARVIS 1.13.1

- Removed the external paid video-generation gateway and its configuration script.
- The attachment picker now accepts any file extension for safe analysis.
- Added direct text ingestion for SQL, PHP, Java, HTML, common programming languages, configuration files, and structured data.
- Added `/learnfiles`: extracts attached content, asks for approval, and saves bounded chunks to Memory Vault for RAG.
- Uploaded source code and data are always treated as untrusted reference material and are never executed.
- Blocks obvious private-key and credential files from Memory Vault ingestion.
- Increased a single selection to 12 files, with bounded file and memory limits.
- Updated Help Center and Windows build metadata to 1.13.1.

Binary formats depend on the safe document converter. Encrypted, proprietary, executable, archive, or database-binary files may need export to a readable format such as SQL, CSV, JSON, TXT, PDF, DOCX, XLSX, or PPTX.
