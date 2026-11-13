<div align="center">

<img src="docs/assets/auraoffice-banner.svg" alt="AuraOffice — One Workspace. Endless Possibilities." width="100%" />

<br />

<img src="docs/assets/auraoffice-logo.svg" alt="AuraOffice Logo" width="88" height="88" />

# AuraOffice

### *One Workspace. Endless Possibilities.*

**An AI-powered productivity ecosystem designed to simplify modern digital work.**

Developed by **[AuraNix Technologies](https://github.com/engrjamshedali)** • Engineered by **[Jamshed Ali](https://github.com/engrjamshedali)**

[![GitHub Repository](https://img.shields.io/badge/GitHub-engrjamshedali%2Faura--office-181717?style=for-the-badge&logo=github)](https://github.com/engrjamshedali/aura-office)
[![Status](https://img.shields.io/badge/Status-Active%20v1.0.0-10B981?style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Google GenAI SDK](https://img.shields.io/badge/Google_GenAI_SDK-2.4.0-4F46E5?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

<p align="center">
  <a href="#-project-overview">Overview</a> •
  <a href="#-screenshots-gallery">Screenshots</a> •
  <a href="#-suite-applications-at-a-glance">Applications</a> •
  <a href="#-features">Features</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-installation-and-setup">Installation</a> •
  <a href="#-project-structure">Architecture</a> •
  <a href="#-usage-guide">Usage Guide</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-author-and-company-information">Author</a>
</p>

</div>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Suite Applications at a Glance](#-suite-applications-at-a-glance)
3. [Screenshots Gallery](#-screenshots-gallery)
4. [Features](#-features)
   - [Document Creation and Editing (AuraWrite)](#1-document-creation-and-editing--aurawrite)
   - [Spreadsheet Management (AuraSheets)](#2-spreadsheet-management--aurasheets)
   - [Presentation Creation (AuraSlides)](#3-presentation-creation--auraslides)
   - [Relational Database Management (AuraDatabase)](#4-relational-database-management--auradatabase)
   - [PDF Management (AuraPDF)](#5-pdf-management--aurapdf)
   - [Notebooks, Mail, Forms & Graphic Design](#6-notebooks-mail-forms--graphic-design)
   - [AI-Powered Productivity (Aura AI)](#7-ai-powered-productivity--aura-ai)
   - [File Management & Templates (AuraDrive)](#8-file-management--templates--auradrive)
   - [User Experience & Responsive Design](#9-user-experience--responsive-design)
   - [Security and Privacy](#10-security-and-privacy)
   - [Feature Implementation Matrix](#feature-implementation-matrix)
5. [Technology Stack](#-technology-stack)
6. [Installation and Setup](#-installation-and-setup)
7. [Project Structure](#-project-structure)
8. [Usage Guide](#-usage-guide)
9. [Roadmap](#-roadmap)
10. [Contribution Guidelines](#-contribution-guidelines)
11. [Author and Company Information](#-author-and-company-information)
12. [License and Acknowledgements](#-license-and-acknowledgements)

---

## 🌐 Project Overview

**AuraOffice** is a modern, web-based AI office productivity suite engineered by **AuraNix Technologies**. It unifies ten dedicated workspace applications—word processing, spreadsheets, presentations, relational databases, structured notebooks, email management, survey forms, graphic publishing, PDF inspection, and file management—inside a single cohesive browser environment.

### What Problems AuraOffice Solves

- **Application Fragmentation:** Traditional digital workflows force individuals and teams to switch constantly between separate document editors, spreadsheet tools, database utilities, form builders, and PDF viewers, each with inconsistent navigation and file handling.
- **Context-Blind AI Assistants:** Standalone chat interfaces require users to manually copy and paste paragraphs, formulas, or slide outlines back and forth. AuraOffice embeds **Aura AI** directly inside the workspace with live awareness of the active application and document context.
- **Heavy Setup & Friction:** AuraOffice runs immediately in any modern web browser with instant client-side persistence, deterministic enterprise starter templates, native `.docx` and `.csv` export pipelines, and sub-50ms local state interactions.

### Who Can Use AuraOffice

- **Executives & Operations Teams:** Draft strategic reports, model quarterly budgets, and inspect relational customer/order databases in one unified interface.
- **Educators & Researchers:** Organize multi-section research notebooks, build academic papers from ready-made templates, and collect student or peer survey responses.
- **Software Engineers & Product Managers:** Document system specifications, manage sprint checklists, run SQL queries over tabular datasets, and build product keynote decks.
- **Designers & Marketers:** Create event posters, social graphics, and branded survey forms without leaving the productivity workspace.

---

## 🧩 Suite Applications at a Glance

| Application | Module Role | Core Capabilities | Primary File Format / Output |
| :--- | :--- | :--- | :--- |
| **AuraDrive** | Cloud File Manager & Hub | Grid/List views, type filtering, sorting, search, favorites, trash recovery, file upload | All AuraOffice file types |
| **AuraWrite** | Rich Document Editor | Typography toolbar, page sizing (`Letter`, `A4`, `Legal`), outline drawer, comments, find/replace, word count | `.docx` (Word XML), Print/PDF |
| **AuraSheets** | Spreadsheet & Formula Engine | Multi-tab sheets, formula engine (`=SUM`, `=AVERAGE`, `=IF`, `=MIN`, `=MAX`), cell styling, Recharts bar/line/pie charts | `.csv` (RFC-4180), CSV Import |
| **AuraSlides** | Presentation Studio | 16:9 slide canvas, theme presets, text/shape/card elements, speaker notes, fullscreen slideshow mode | Print / Slide Deck |
| **AuraDatabase** | Relational Database Manager | Multi-table datasheets, schema design view, record form view, entity relationships, interactive SQL query runner | `.csv` table export |
| **AuraNotes** | Multi-Notebook Organizer | Color-coded notebooks, markdown notes, interactive task checklists, tag filtering, pinning | Local workspace & JSON backup |
| **AuraMail** | Integrated Email Client | Inbox, Sent, Starred, and Trash folders, search, thread reader, and modal email composer | Internal workspace mail |
| **AuraForms** | Survey & Form Builder | Drag-free field builder (text, email, dropdown, rating, textarea), theme selector, live preview, response analytics | Live form responses |
| **AuraDesign** | Graphic & Poster Studio | Format presets (Poster, Social 1:1, Web Banner 16:9, Business Card), layered text/shape/badge canvas | Print / Graphic canvas |
| **AuraPDF** | PDF Inspector & Signer | Zoom (`50%–150%`), 90° rotation, security watermarks (`CONFIDENTIAL`, `DRAFT`, `APPROVED`), digital signature stamp | Print / Save as PDF |

---

## 📸 Screenshots Gallery

All screenshots below are captured directly from the live running **AuraOffice** application (`docs/screenshots/`).

### Flagship Workspace Views

#### 1. Main Dashboard & File Manager (`AuraDrive`)
![AuraOffice Main Dashboard and File Manager](docs/screenshots/01-main-dashboard-drive.png)

#### 2. Rich Word Processor (`AuraWrite`)
![AuraWrite Document Editor](docs/screenshots/03-aurawrite-document-editor.png)

#### 3. Spreadsheet & Financial Modeling Studio (`AuraSheets`)
![AuraSheets Spreadsheet Editor](docs/screenshots/04-aurasheets-spreadsheet-editor.png)

#### 4. Relational Database & SQL Manager (`AuraDatabase`)
![AuraDatabase Relational Manager](docs/screenshots/06-auradatabase-relational-manager.png)

---

### Complete Interface Gallery

| **Main Dashboard (`AuraDrive`)** | **Templates Gallery** |
| :---: | :---: |
| ![Main Dashboard](docs/screenshots/01-main-dashboard-drive.png) | ![Templates Gallery](docs/screenshots/02-templates-gallery.png) |
| *Unified file explorer with type filters, search, star badges, and sorting.* | *One-click templates across Business, Finance, Education, and Creative categories.* |

| **Document Editor (`AuraWrite`)** | **Spreadsheet Editor (`AuraSheets`)** |
| :---: | :---: |
| ![AuraWrite Editor](docs/screenshots/03-aurawrite-document-editor.png) | ![AuraSheets Editor](docs/screenshots/04-aurasheets-spreadsheet-editor.png) |
| *Page-accurate document authoring with formatting toolbar, headers/footers, and live stats.* | *Multi-tab spreadsheet grid with formula bar (`fx`), cell formatting, and chart generation.* |

| **Presentation Studio (`AuraSlides`)** | **Relational Database (`AuraDatabase`)** |
| :---: | :---: |
| ![AuraSlides Editor](docs/screenshots/05-auraslides-presentation-editor.png) | ![AuraDatabase Manager](docs/screenshots/06-auradatabase-relational-manager.png) |
| *Visual slide deck editor with slide thumbnails, theme presets, element inspector, and speaker notes.* | *Microsoft Access-inspired relational database with Datasheet, Form, Schema Design, SQL Queries, and Relationships.* |

| **PDF Inspector & Signer (`AuraPDF`)** | **Notebooks & Checklists (`AuraNotes`)** |
| :---: | :---: |
| ![AuraPDF Tools](docs/screenshots/07-aurapdf-inspector-signer.png) | ![AuraNotes View](docs/screenshots/08-auranotes-notebooks.png) |
| *Document viewer featuring zoom controls, rotation, security watermarks, and digital signature blocks.* | *Three-pane notebook workspace with color-coded notebooks, tags, and interactive action checklists.* |

| **Email Client (`AuraMail`)** | **Survey & Form Builder (`AuraForms`)** |
| :---: | :---: |
| ![AuraMail Client](docs/screenshots/09-auramail-client.png) | ![AuraForms Builder](docs/screenshots/10-auraforms-builder.png) |
| *Integrated mail client with folder navigation, starred messages, attachments display, and message composer.* | *Interactive survey creator with custom field types, live respondent preview, and response logs.* |

| **Graphic Design Studio (`AuraDesign`)** | **Navigation Sidebar & "+ New" Menu** |
| :---: | :---: |
| ![AuraDesign Studio](docs/screenshots/11-auradesign-studio.png) | ![Navigation Sidebar & New Menu](docs/screenshots/12-navigation-sidebar-new-menu.png) |
| *Canvas-based poster, banner, and social graphic designer with element positioning and styling controls.* | *Collapsible global sidebar with instant creation menu for all AuraOffice document types.* |

| **Global Command Palette (`Ctrl+K`)** | **User Profile, Roles & Suite Settings** |
| :---: | :---: |
| ![Command Palette](docs/screenshots/13-command-palette.png) | ![User Profile and Settings](docs/screenshots/14-user-profile-and-settings.png) |
| *Keyboard-driven command center for searching files, creating documents, and switching apps.* | *Role switcher (`User`, `Admin`, `Org Admin`), storage quota meter, and workspace backup/reset controls.* |

| **Aura AI Context-Aware Copilot** | **Dark Mode Workspace** |
| :---: | :---: |
| ![Aura AI Assistant](docs/screenshots/15-aura-ai-assistant.png) | ![Dark Mode Interface](docs/screenshots/16-dark-mode-workspace.png) |
| *Slide-over AI assistant drawer with attached document context and one-click intelligent actions.* | *Full dark-slate theme across the global header, sidebar, and workspace canvas.* |

<div align="center">

#### Mobile Responsive Interface (`430 × 932` Viewport)

<img src="docs/screenshots/17-mobile-responsive-interface.png" alt="AuraOffice Mobile Responsive Interface" width="360" />

*Adaptive layout with collapsible icon-rail sidebar and touch-friendly action controls.*

</div>

---

## ✨ Features

### 1. Document Creation and Editing — `AuraWrite`
- **Rich Text & Typography Controls:** Bold, italic, underline, strikethrough, headings (`H1`, `H2`, `H3`), text color, highlight color, text alignment (left, center, right, justify), bulleted lists, numbered lists, and interactive checklists.
- **Insertable Elements:** Data tables, inline images, hyperlinks, and horizontal dividers.
- **Page Layout Engine:** Configurable page sizes (`Letter`, `A4`, `Legal`), orientation (`Portrait` / `Landscape`), custom running header and footer text, and automatic page numbering.
- **Document Intelligence & Review:**
  - Auto-extracted **Document Outline / Table of Contents** drawer based on heading hierarchy.
  - **Find & Replace** toolbar with live match counts.
  - **Comments & Annotations** drawer supporting quoted text selections and comment resolution.
  - **Version History** modal and real-time word count, character count, and estimated reading time (`200 wpm`) status bar.
- **Import & Export:** Export directly to Microsoft Word `.docx` (`AuraStorageService.exportDocAsDocx`), Print/PDF, or import local `.txt`/`.html` files.

### 2. Spreadsheet Management — `AuraSheets`
- **Custom Formula Evaluation Engine (`formulaEngine.ts`):**
  - Supports range and scalar formulas including `=SUM(A1:B5)`, `=AVERAGE(...)`, `=MIN(...)`, `=MAX(...)`, `=COUNT(...)`, `=IF(condition, trueVal, falseVal)`, and arithmetic expressions (`+`, `-`, `*`, `/`).
  - Automatic dependency recalculation whenever cell values are updated.
- **Multi-Sheet Workbooks:** Create, switch, and manage multiple worksheet tabs within a single spreadsheet file (e.g., *Revenue & Expenses* and *Headcount & Staffing*).
- **Cell Formatting & Sorting:** Bold, italic, underline, text/background colors, horizontal alignment, currency (`$`) and percentage (`%`) formatting, and A–Z / Z–A column sorting.
- **Visual Data Charting:** Built-in chart generator powered by **Recharts** supporting interactive **Bar**, **Line**, and **Pie** charts over selectable cell ranges.
- **CSV Interoperability:** One-click RFC-4180 `.csv` export and local `.csv` file import.

### 3. Presentation Creation — `AuraSlides`
- **Visual Slide Canvas:** 16:9 widescreen presentation stage with multi-slide thumbnail navigator, slide duplication, reordering, and deletion.
- **Theme Presets:** Instant deck styling with `Modern`, `Light`, `Ocean`, `Sunset`, and `Minimal` color and gradient palettes.
- **Canvas Elements:** Add and customize positioned text boxes, geometric shapes, pills, and content cards with configurable font size, weight, color, background fill, and coordinates.
- **Presenter Workflow:** Dedicated speaker notes panel per slide and a fullscreen **Presentation Mode** with keyboard navigation (`ArrowRight`, `Space`, `ArrowLeft`, `Escape`).

### 4. Relational Database Management — `AuraDatabase`
- **Five Integrated Database Modes:**
  1. **Datasheet View:** High-density tabular grid with inline cell editing, record addition/deletion, instant search filtering, and column sorting.
  2. **Form View:** Single-record detail inspector with first/previous/next/last record navigation.
  3. **Design View:** Visual table schema builder supporting typed columns (`text`, `number`, `currency`, `date`, `boolean`, `select`, `email`), primary keys, and required constraints.
  4. **SQL Queries View:** Interactive SQL query editor and execution engine supporting `SELECT`, `FROM`, `WHERE` (`=`, `!=`, `>`, `<`, `>=`, `<=`, `AND`), and `ORDER BY` (`ASC`/`DESC`) clauses, plus pre-built enterprise query presets.
  5. **Relationships View:** Entity-relationship diagrammer visualizing `one-to-one`, `one-to-many`, and `many-to-many` foreign-key links across tables.

### 5. PDF Management — `AuraPDF`
- **Inspection Controls:** Precision zoom scaling (`50%` to `150%`) and 90-degree clockwise page rotation (`0°`, `90°`, `180°`, `270°`).
- **Security Watermarking:** Apply or clear diagonal document watermarks (`CONFIDENTIAL`, `DRAFT`, `APPROVED`, `FINAL`).
- **Digital Signature Stamping:** Apply a verified cryptographic-style signature block with signer name and timestamp, and export via the browser's Print-to-PDF pipeline.

### 6. Notebooks, Mail, Forms & Graphic Design
- **`AuraNotes`:** Three-column notebook organizer featuring color-coded notebooks, markdown-friendly note editing, interactive task checklists with progress tracking, tag management, and note pinning.
- **`AuraMail`:** Integrated email client with `Inbox`, `Sent`, `Starred`, and `Trash` views, live search across senders and subjects, attachment badges, and a modal email composer.
- **`AuraForms`:** Survey and questionnaire builder with 9 field types (`text`, `textarea`, `email`, `number`, `date`, `dropdown`, `radio`, `checkbox`, `rating`), 5 color themes, interactive live respondent preview, and a response submissions table.
- **`AuraDesign`:** Graphic publishing canvas with preset dimensions (`Poster / Flyer`, `Social Square 1:1`, `Web Banner 16:9`, `Business Card`), layered typography, badges, shapes, and inspector controls.

### 7. AI-Powered Productivity — `Aura AI`
- **Server-Side Gemini Integration:** Powered by the official `@google/genai` SDK (`gemini-3.8-flash`) via a secure Express proxy endpoint (`POST /api/gemini/assist`).
- **Context-Aware Copilot Drawer (`Ctrl+J` / `Cmd+J`):** Automatically detects the active application (`write`, `sheets`, `slides`, `notes`, `forms`, or `general`), attaches selected or active document text, and provides tailored quick actions:
  - *AuraWrite:* Improve Grammar & Tone, Executive Summary, Expand Section, Shorten & Condense, Generate Formal Outline.
  - *AuraSheets:* Generate Formula (`=SUM`, `=VLOOKUP`, `=IF`), Explain Active Formula, Analyze Financial Trends.
  - *AuraSlides:* Generate 5-Slide Pitch Outline, Write Speaker Notes, Punchy Headline Suggestions.
- **Resilient Fallback Mode:** Continues to provide deterministic formula and summarization assistance even when running offline or before a `GEMINI_API_KEY` is configured.

### 8. File Management & Templates — `AuraDrive`
- **Centralized File Repository:** Browse all workspace documents in **Grid** or **List** layout, filter by file type, sort by Last Modified, Name, or Size, star favorite files, and manage soft-deleted items in Trash.
- **Templates Gallery:** Launch new documents from curated starter blueprints across *Business*, *Finance*, *Education*, *Creative*, and *Productivity* categories.

### 9. User Experience & Responsive Design
- **Global Command Palette (`Ctrl+K` / `Cmd+K`):** Instant keyboard-driven modal to search across all files, create any document type, switch applications, toggle Dark Mode, or launch Aura AI.
- **Theme Engine:** Instant switching between **Light Mode** and **Dark Mode** (`dark` class + CSS custom variant support).
- **Responsive Layout:** Collapsible navigation sidebar (`w-60` expanded / `w-16` icon rail) and adaptive toolbars that scale from mobile screens to ultrawide desktop monitors.

### 10. Security and Privacy
- **Zero Client-Side Secret Exposure:** The `GEMINI_API_KEY` is read exclusively by the Node.js/Express server (`server.ts`) and is never bundled into client browser code.
- **Local-First Data Ownership:** All user documents and workspace records are stored locally in the browser (`localStorage`) with one-click JSON workspace backup export and factory reset controls in Settings.
- **Role-Based Access Control (RBAC) Simulation:** Built-in role switcher (`User`, `Admin`, `Org Admin`) and document sharing permission modal (`Owner`, `Editor`, `Viewer`).

---

### Feature Implementation Matrix

| Capability / Module | Status | Notes |
| :--- | :---: | :--- |
| **10 Core Suite Applications** (`Drive`, `Write`, `Sheets`, `Slides`, `Database`, `Notes`, `Mail`, `Forms`, `Design`, `PDF`) | ✅ **Implemented** | Fully interactive with seeded enterprise data and auto-save |
| **Server-Side Gemini AI Assistant** (`POST /api/gemini/assist`) | ✅ **Implemented** | Uses `@google/genai` with graceful local fallback mode |
| **Spreadsheet Formula Engine & Recharts Visualization** | ✅ **Implemented** | Supports `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`, `IF`, and Bar/Line/Pie charts |
| **Relational Database Engine & SQL Runner** | ✅ **Implemented** | Multi-table schema, relationships, form view, and `SELECT` SQL engine |
| **DOCX, CSV & Workspace JSON Export** | ✅ **Implemented** | Native client-side file generators in `AuraStorageService` |
| **Global Command Palette (`Ctrl+K`) & Dark Mode** | ✅ **Implemented** | Keyboard shortcuts (`Ctrl+K`, `Ctrl+J`, `Ctrl+S`) |
| **Admin & Education Telemetry Endpoint** (`GET /api/admin/stats`) | 🔄 **Under Development** | Backend endpoint implemented in `server.ts`; dedicated Admin UI view in progress |
| **Real-Time Multi-User WebSocket Co-Editing** | 🗓️ **Planned** | Planned for cloud-synchronized collaborative sessions |
| **Cloud Database Persistence (PostgreSQL / Firestore)** | 🗓️ **Planned** | Currently uses browser `localStorage` with JSON backup/restore |

---

## 🛠 Technology Stack

Every entry below is verified directly from `package.json`, `tsconfig.json`, `vite.config.ts`, and `server.ts`.

| Layer | Technology | Version | Purpose in AuraOffice |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | [React](https://react.dev/) (`react`, `react-dom`) | `^19.0.1` | Component architecture, state hooks, and interactive editors |
| **Programming Language** | [TypeScript](https://www.typescriptlang.org/) | `^7.0.2` | Strict static typing across client views, storage models, and Express server |
| **Styling System** | [Tailwind CSS](https://tailwindcss.com/) + `@tailwindcss/vite` | `^4.3.3` | Utility-first styling, responsive layouts, and dark mode theming |
| **Iconography** | [Lucide React](https://lucide.dev/) (`lucide-react`) | `^0.546.0` | Consistent vector icons across all 10 productivity applications |
| **Data Visualization** | [Recharts](https://recharts.org/) | `^3.10.1` | Responsive Bar, Line, and Pie charts in `AuraSheets` |
| **Animation Library** | [Motion](https://motion.dev/) (`motion`) | `^12.23.24` | Smooth UI transitions and micro-interactions |
| **Backend Runtime & Server** | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | `^4.21.2` | Full-stack HTTP server, static production asset host, and REST API endpoints |
| **Artificial Intelligence** | [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) | `^2.4.0` | Server-side `gemini-3.8-flash` integration for **Aura AI** |
| **Environment Config** | [dotenv](https://www.npmjs.com/package/dotenv) | `^17.2.3` | Loads `.env` environment variables (`GEMINI_API_KEY`, `APP_URL`) |
| **Build & Bundling Tools** | [Vite](https://vite.dev/) + [esbuild](https://esbuild.github.io/) + [tsx](https://tsx.is/) | Vite `^8.3.0` / esbuild `^0.25.0` | Vite HMR middleware in development; Vite SPA build + esbuild CJS server bundle for production |
| **Data Persistence** | Browser `localStorage` (`AuraStorageService`) | Web API | Zero-latency local persistence with structured JSON serialization |

---

## 🚀 Installation and Setup

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js** `v20.0.0` or higher (includes `npm`)
- **Git**
- *(Optional)* A **Google Gemini API Key** to enable live `gemini-3.8-flash` responses in Aura AI (the application also includes an automatic built-in fallback mode if no key is provided).

### 1. Clone the Repository

```bash
git clone https://github.com/engrjamshedali/aura-office.git
cd aura-office
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and configure the documented variables (matching `.env.example`):

```env
# GEMINI_API_KEY: Required for live Gemini AI API calls in /api/gemini/assist.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this application is hosted.
APP_URL="http://localhost:3000"
```

### 4. Start the Development Server

AuraOffice runs a unified Express + Vite middleware server on port `3000`:

```bash
npm run dev
```

Open **`http://localhost:3000`** in your browser.

### 5. Type-Checking, Production Build & Start

Verify TypeScript types across the entire project:

```bash
npm run lint
```

Build the frontend SPA (`dist/`) and bundle the Express server (`dist/server.cjs`):

```bash
npm run build
```

Start the compiled production server:

```bash
npm run start
```

### Available Package Scripts (`package.json`)

| Script | Command Executed | Description |
| :--- | :--- | :--- |
| `npm run dev` | `tsx server.ts` | Starts the Express server with Vite SPA development middleware on `http://0.0.0.0:3000` |
| `npm run build` | `vite build && esbuild server.ts ... --outfile=dist/server.cjs` | Compiles production frontend assets and bundles the Node.js server |
| `npm run start` | `node dist/server.cjs` | Runs the production build on port `3000` |
| `npm run preview` | `vite preview` | Previews the static Vite frontend build |
| `npm run lint` | `tsc --noEmit` | Runs full TypeScript type verification |
| `npm run clean` | `rm -rf dist server.js` | Removes compiled build artifacts |

---

## 📂 Project Structure

```text
aura-office/
├── docs/                                   # Project documentation & visual assets
│   ├── assets/
│   │   ├── auraoffice-banner.svg           # Official AuraOffice hero banner SVG
│   │   ├── auraoffice-logo.svg             # Official AuraOffice icon mark SVG
│   │   └── auranix-logo.svg                # Official AuraNix Technologies emblem SVG
│   ├── screenshots/                        # Real browser-rendered application screenshots
│   │   ├── 01-main-dashboard-drive.png
│   │   ├── 02-templates-gallery.png
│   │   ├── 03-aurawrite-document-editor.png
│   │   ├── 04-aurasheets-spreadsheet-editor.png
│   │   ├── 05-auraslides-presentation-editor.png
│   │   ├── 06-auradatabase-relational-manager.png
│   │   ├── 07-aurapdf-inspector-signer.png
│   │   ├── 08-auranotes-notebooks.png
│   │   ├── 09-auramail-client.png
│   │   ├── 10-auraforms-builder.png
│   │   ├── 11-auradesign-studio.png
│   │   ├── 12-navigation-sidebar-new-menu.png
│   │   ├── 13-command-palette.png
│   │   ├── 14-user-profile-and-settings.png
│   │   ├── 15-aura-ai-assistant.png
│   │   ├── 16-dark-mode-workspace.png
│   │   └── 17-mobile-responsive-interface.png
│   └── ARCHITECTURE.md                     # Detailed system architecture specification
├── public/                                 # Static public assets
├── src/
│   ├── components/                         # Global suite shell components
│   │   ├── CommandPalette.tsx              # Ctrl+K / Cmd+K quick search & action modal
│   │   ├── GlobalHeader.tsx                # Top bar: file rename, save status, share, AI, theme, profile
│   │   └── GlobalSidebar.tsx               # Collapsible sidebar navigation & "+ New" creation menu
│   ├── features/                           # 10 modular productivity applications + views
│   │   ├── ai/
│   │   │   └── AuraAIPanel.tsx             # Context-aware Aura AI Copilot drawer
│   │   ├── database/
│   │   │   └── AuraDatabaseView.tsx        # Relational database manager (Datasheet, Form, Design, SQL, ER)
│   │   ├── design/
│   │   │   └── AuraDesignView.tsx          # Graphic & poster design canvas studio
│   │   ├── drive/
│   │   │   └── AuraDriveView.tsx           # Cloud file manager with Grid/List views, filters & trash
│   │   ├── forms/
│   │   │   └── AuraFormsView.tsx           # Survey builder, live preview & response viewer
│   │   ├── mail/
│   │   │   └── AuraMailView.tsx            # Email client with folders, search & composer
│   │   ├── notes/
│   │   │   └── AuraNotesView.tsx           # Multi-notebook markdown notes & checklist manager
│   │   ├── pdf/
│   │   │   └── AuraPdfView.tsx             # PDF viewer, watermark tool & digital signature stamp
│   │   ├── settings/
│   │   │   └── SettingsView.tsx            # User profile, display preferences & JSON backup/reset
│   │   ├── sheets/
│   │   │   ├── AuraSheetsEditor.tsx        # Multi-tab spreadsheet editor & Recharts visualizer
│   │   │   └── formulaEngine.ts            # Spreadsheet formula parser & range calculator
│   │   ├── slides/
│   │   │   └── AuraSlidesEditor.tsx        # Slide deck editor & fullscreen slideshow presenter
│   │   ├── templates/
│   │   │   └── TemplatesGalleryView.tsx    # Curated document, sheet, slide, form & design templates
│   │   └── writer/
│   │       └── AuraWriteEditor.tsx         # Rich text word processor with outline, comments & export
│   ├── services/
│   │   ├── aiService.ts                    # Frontend client for POST /api/gemini/assist
│   │   ├── seedData.ts                     # Default enterprise documents, sheets, slides & databases
│   │   └── storage.ts                      # AuraStorageService (localStorage CRUD + DOCX/CSV exports)
│   ├── types/
│   │   └── office.ts                       # Shared TypeScript interfaces for all 10 suite apps
│   ├── App.tsx                             # Root application router, keyboard shortcuts & state manager
│   ├── index.css                           # Tailwind CSS v4 entry & custom scrollbar/typography styles
│   └── main.tsx                            # React DOM root mount
├── .env.example                            # Documented environment variable template
├── index.html                              # HTML entry point with SEO & OpenGraph metadata
├── metadata.json                           # Application metadata & capability declarations
├── package.json                            # Project scripts and dependencies
├── server.ts                               # Express.js backend server & Gemini AI proxy
├── tsconfig.json                           # TypeScript compiler configuration
└── vite.config.ts                          # Vite bundler, React plugin & Tailwind configuration
```

For an in-depth technical breakdown of data flows and subsystems, see [**`docs/ARCHITECTURE.md`**](docs/ARCHITECTURE.md).

---

## 📖 Usage Guide

### 1. Navigating the Workspace & Creating Files

When you launch **AuraOffice**, you land in **AuraDrive** (`My Files`), pre-populated with realistic sample documents across every application in the suite.

- **Open Any File:** Click any card in the file grid (such as *Quarterly Strategic Plan 2026* or *Company Financial Forecast & Budget*) to open it directly in its dedicated editor.
- **Create a New Document:** Click the **`+ New`** button at the top of the left sidebar to create a new **AuraWrite Document**, **AuraSheets Spreadsheet**, **AuraSlides Presentation**, **AuraNotes Notebook**, **AuraDatabase**, **AuraForms Survey**, **AuraDesign Graphic**, or **Folder**.

<div align="center">
  <img src="docs/screenshots/12-navigation-sidebar-new-menu.png" alt="Creating a New File from the Global Sidebar" width="85%" />
</div>

---

### 2. Using the Global Command Palette (`Ctrl+K` / `Cmd+K`)

Press **`Ctrl+K`** (Windows/Linux) or **`Cmd+K`** (macOS)—or click **`Search... Ctrl+K`** in the top header—to open the **Command Palette**:
- Type any keyword to filter files, productivity apps, and quick actions in real time.
- Launch a new document, switch between suite applications, or toggle Dark Mode without touching the mouse.

<div align="center">
  <img src="docs/screenshots/13-command-palette.png" alt="Global Command Palette" width="85%" />
</div>

---

### 3. Authoring Documents, Spreadsheets, Presentations & Databases

- **In `AuraWrite`:** Use the top formatting toolbar to style headings, insert tables, toggle the **Outline** or **Comment** drawers, change page dimensions (`Letter`, `A4`, `Legal`), and click **`Export`** to download a `.docx` file or print to PDF.
- **In `AuraSheets`:** Click any cell to enter values or formulas (e.g., `=SUM(B5:E5)` or `=IF(F16>=1000,"Target Exceeded","Review Operations")`) in the `fx` formula bar. Click **`Chart`** to visualize ranges as Bar, Line, or Pie charts, or click **`CSV`** to export.
- **In `AuraSlides`:** Add text, shapes, or cards to the 16:9 slide canvas, switch visual themes, add speaker notes at the bottom, and click **`Present`** for fullscreen slideshow mode.
- **In `AuraDatabase`:** Switch seamlessly between **Datasheet**, **Form View**, **Design View**, **SQL Queries**, and **Relationships** tabs to manage relational tables (`Customers`, `Orders`, `Products`) and execute SQL queries.

---

### 4. Invoking the Aura AI Assistant (`Ctrl+J` / `Cmd+J`)

Click the **`Aura AI`** button in the top-right header (or press **`Ctrl+J`** / **`Cmd+J`**) from any editor:
1. Aura AI automatically detects your current application mode and attaches active document context.
2. Select a one-click **Quick AI Action** (such as *Executive Summary*, *Improve Grammar & Tone*, or *Generate Formula*) or type a custom prompt at the bottom of the drawer.
3. Copy the generated response with one click or apply it directly to your workflow.

<div align="center">
  <img src="docs/screenshots/15-aura-ai-assistant.png" alt="Aura AI Context-Aware Copilot" width="85%" />
</div>

---

### 5. Managing User Profile, Roles & Workspace Backups

- **Role Switcher & Storage Meter:** Click the user avatar in the top-right corner of the header to inspect your active organization role, switch between **`User`**, **`Admin`**, and **`Org Admin`** modes, and view cloud storage utilization.
- **Suite Settings:** Click **`Settings`** in the left sidebar to customize your profile name/email, default typography, auto-save interval, Aura AI system persona, export a full **`AuraOffice_Workspace_Backup.json`**, or reset the workspace to factory default seed data.

<div align="center">
  <img src="docs/screenshots/14-user-profile-and-settings.png" alt="User Profile and Suite Settings" width="85%" />
</div>

---

## 🗺 Roadmap

### ✅ Completed
- [x] Unified 10-application workspace shell (`GlobalHeader`, `GlobalSidebar`, `CommandPalette`).
- [x] **AuraDrive** file manager with Grid/List layouts, type filters, search, favorites, and trash recovery.
- [x] **AuraWrite** word processor with rich formatting, document outline extraction, comments, find/replace, and `.docx` export.
- [x] **AuraSheets** spreadsheet editor with custom formula calculation engine, multi-sheet tabs, Recharts visualizations, and CSV import/export.
- [x] **AuraSlides** presentation studio with theme presets, positioned canvas elements, speaker notes, and fullscreen presenter mode.
- [x] **AuraDatabase** relational database manager with Datasheet, Form View, Schema Design, Relationships, and interactive SQL query runner.
- [x] **AuraNotes**, **AuraMail**, **AuraForms**, **AuraDesign**, and **AuraPDF** (with watermarks and digital signature stamping).
- [x] **Aura AI** context-aware assistant powered by `@google/genai` (`POST /api/gemini/assist`) with offline fallback support.
- [x] **Templates Gallery** and **Suite Settings** with full JSON workspace backup and restore.

### 🔄 In Progress
- [ ] Dedicated **Admin & Education Dashboard UI** connected to the existing `GET /api/admin/stats` backend telemetry endpoint.
- [ ] Extended spreadsheet formula library (`VLOOKUP`, `INDEX/MATCH`, `CONCATENATE`, `SUMIF` range criteria).
- [ ] Enhanced drag-and-drop element resizing handles on the `AuraSlides` and `AuraDesign` canvases.

### 🗓️ Planned
- [ ] Cloud database persistence layer (PostgreSQL / Firebase Firestore) for cross-device account synchronization.
- [ ] Real-time multi-user collaborative editing and live cursor presence via WebSockets.
- [ ] Progressive Web App (PWA) service worker registration for installable desktop and offline cache packages.
- [ ] Native binary `.xlsx` and `.pptx` import/export parsers.

---

## 🤝 Contribution Guidelines

Contributions that improve editor capabilities, formula coverage, accessibility, or UI polish are welcome. Please follow this standard workflow:

1. **Fork the Repository**
   Click the **Fork** button at [https://github.com/engrjamshedali/aura-office](https://github.com/engrjamshedali/aura-office) and clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/aura-office.git
   cd aura-office
   ```
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Implement Your Changes**
   - Follow strict TypeScript typing (`src/types/office.ts`).
   - Keep application modules self-contained inside `src/features/<module>/`.
   - Use Tailwind CSS classes consistent with both Light and Dark themes (`dark:*`).
4. **Test and Validate**
   Ensure zero TypeScript errors and verify that the production bundle compiles cleanly:
   ```bash
   npm run lint
   npm run build
   ```
5. **Submit a Pull Request**
   Push your branch and open a Pull Request against `main` with a clear description of the changes and screenshots of any updated UI views.

---

## 👨‍💻 Author and Company Information

<div align="center">

<img src="docs/assets/auranix-logo.svg" alt="AuraNix Technologies" width="340" />

### **Created and Developed by Jamshed Ali**

**Founder & Developer — AuraNix Technologies**

[![GitHub Profile](https://img.shields.io/badge/GitHub-@engrjamshedali-181717?style=for-the-badge&logo=github)](https://github.com/engrjamshedali)
[![Repository](https://img.shields.io/badge/Repository-aura--office-4F46E5?style=for-the-badge&logo=git&logoColor=white)](https://github.com/engrjamshedali/aura-office)

| Attribute | Details |
| :--- | :--- |
| **Developer** | **Jamshed Ali** |
| **Role** | Founder & Developer |
| **Company** | **AuraNix Technologies** |
| **GitHub** | [https://github.com/engrjamshedali](https://github.com/engrjamshedali) |
| **Project Repository** | [https://github.com/engrjamshedali/aura-office](https://github.com/engrjamshedali/aura-office) |

</div>

---

## 📄 License and Acknowledgements

### License

This repository is currently configured as a private software project (`"private": true` in `package.json`) with no separate open-source `LICENSE` file committed to the repository.

**Copyright © AuraNix Technologies — Jamshed Ali. All Rights Reserved.**  
*(If an open-source or commercial license file is added by the repository owner in a future release, its terms will govern the distribution and modification of this software.)*

### Acknowledgements

AuraOffice is built upon the following open-source frameworks, libraries, and platforms:
- [**React**](https://react.dev/) — Declarative UI component library
- [**TypeScript**](https://www.typescriptlang.org/) — Type-safe JavaScript superset
- [**Vite**](https://vite.dev/) & [**esbuild**](https://esbuild.github.io/) — Next-generation frontend and server build tooling
- [**Tailwind CSS**](https://tailwindcss.com/) — Utility-first CSS framework
- [**Express**](https://expressjs.com/) — Fast, unopinionated web framework for Node.js
- [**Google GenAI SDK (`@google/genai`)**](https://ai.google.dev/) — Official SDK powering the **Aura AI** assistant
- [**Lucide Icons (`lucide-react`)**](https://lucide.dev/) — Crisp vector iconography
- [**Recharts**](https://recharts.org/) — Composable charting library for React

---

<div align="center">

**AuraOffice** — *One Workspace. Endless Possibilities.*  
Engineered with precision by **Jamshed Ali** at **AuraNix Technologies**

[⬆ Back to Top](#auraoffice)

</div>
