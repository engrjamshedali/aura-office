# AuraOffice System Architecture & Engineering Specification

**Product:** AuraOffice — AI-Powered Office Productivity Suite  
**Organization:** AuraNix Technologies  
**Author & Lead Architect:** Jamshed Ali ([@engrjamshedali](https://github.com/engrjamshedali))  
**Repository:** [https://github.com/engrjamshedali/aura-office](https://github.com/engrjamshedali/aura-office)

---

## 1. Architectural Overview

AuraOffice is architected as a modular, full-stack TypeScript single-page application (SPA) served by an Express.js backend and bundled with Vite. The platform unifies ten distinct productivity applications around a shared state and storage service (`AuraStorageService`), a global navigation shell, a keyboard-first Command Palette (`Ctrl+K` / `Cmd+K`), and a server-side Gemini AI proxy (`POST /api/gemini/assist`).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AuraOffice Client Shell                          │
│  ┌──────────────────┐  ┌─────────────────────────┐  ┌────────────────┐  │
│  │  GlobalHeader    │  │   CommandPalette (⌘K)   │  │ AuraAIPanel    │  │
│  └────────┬─────────┘  └────────────┬────────────┘  └───────┬────────┘  │
│           │                         │                       │           │
│  ┌────────▼─────────────────────────▼───────────────────────▼────────┐  │
│  │               10 Integrated Productivity Modules                  │  │
│  │  • AuraDrive     • AuraWrite    • AuraSheets    • AuraSlides      │  │
│  │  • AuraDatabase  • AuraNotes    • AuraMail      • AuraForms       │  │
│  │  • AuraDesign    • AuraPDF      • Templates     • Settings        │  │
│  └────────────────────────────────┬──────────────────────────────────┘  │
│                                   │                                     │
│  ┌────────────────────────────────▼──────────────────────────────────┐  │
│  │            AuraStorageService & Client Formula Engine             │  │
│  │   LocalStorage Persistence • Seed Data Hydration • DOCX/CSV I/O   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ HTTP / REST (/api/*)
┌───────────────────────────────────▼─────────────────────────────────────┐
│                      Express.js Backend (server.ts)                     │
│  • GET  /api/health        → Suite health & version telemetry           │
│  • GET  /api/admin/stats   → Organization metrics & activity stream     │
│  • POST /api/gemini/assist → Server-side @google/genai AI proxy         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### 2.1 Unified Storage & Persistence (`src/services/storage.ts`)
- **Zero-Latency Local Persistence:** All documents, spreadsheets, slide decks, relational databases, notebooks, emails, forms, and graphic designs are persisted in structured `localStorage` namespaces (`aura_office_*`).
- **Deterministic Seed Hydration (`src/services/seedData.ts`):** On first launch (or upon workspace reset in Settings), AuraOffice automatically hydrates rich, realistic enterprise sample files across all 10 applications.
- **Native File Export Generators:**
  - **DOCX Export:** Generates Microsoft Word-compatible XML/HTML documents (`application/vnd.ms-word`).
  - **CSV Export:** Serializes computed multi-column spreadsheet matrices into RFC-4180 CSV files.
  - **PDF / Print Pipeline:** Invokes print-optimized page layouts (`window.print()`).
  - **Workspace JSON Backup:** Exports the entire workspace state into a portable `.json` archive.

### 2.2 Spreadsheet Formula Engine (`src/features/sheets/formulaEngine.ts`)
- Evaluates spreadsheet formulas (`=SUM`, `=AVERAGE`, `=MIN`, `=MAX`, `=COUNT`, `=IF`, and arithmetic expressions) across cell ranges (`A1:B10`).
- Automatically recalculates dependent cells on every cell edit prior to persisting state.

### 2.3 Relational Database Engine (`src/features/database/AuraDatabaseView.tsx`)
- Provides a browser-based Microsoft Access alternative supporting multiple tables, typed columns (`text`, `number`, `currency`, `date`, `boolean`, `select`, `email`), primary keys, table relationships (`one-to-one`, `one-to-many`, `many-to-many`), interactive record forms, and an in-memory `SELECT ... FROM ... WHERE ... ORDER BY` SQL query runner.

### 2.4 Server-Side AI Proxy (`server.ts` & `src/services/aiService.ts`)
- Keeps the `GEMINI_API_KEY` strictly on the server side (`server.ts`) using the official `@google/genai` SDK (`gemini-3.8-flash`).
- Dynamically adapts system instructions based on the active application (`write`, `sheets`, `slides`, `notes`, `forms`, or `general`) and attaches active document context.
- Includes a graceful offline/unconfigured fallback mode so the UI remains fully functional even before a user configures `GEMINI_API_KEY`.
