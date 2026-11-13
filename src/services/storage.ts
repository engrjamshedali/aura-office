import {
  FileItem,
  AuraDocContent,
  AuraSheetContent,
  AuraSlideContent,
  AuraNoteItem,
  Notebook,
  AuraEmailItem,
  AuraFormContent,
  AuraDesignContent,
  AuraDatabaseContent,
  User,
  UserRole,
  FileType,
} from '../types/office';
import {
  SEED_FILES,
  SEED_DOC_CONTENT,
  SEED_SHEET_CONTENT,
  SEED_SLIDE_CONTENT,
  SEED_NOTEBOOKS,
  SEED_NOTES,
  SEED_EMAILS,
  SEED_FORMS,
  SEED_DESIGNS,
  SEED_DATABASE_CONTENT,
  SEED_CURRENT_USER,
} from './seedData';
import { recalculateSheetCells } from '../features/sheets/formulaEngine';

const STORAGE_KEYS = {
  FILES: 'aura_office_files',
  DOCS: 'aura_office_docs',
  SHEETS: 'aura_office_sheets',
  SLIDES: 'aura_office_slides',
  NOTES: 'aura_office_notes',
  NOTEBOOKS: 'aura_office_notebooks',
  EMAILS: 'aura_office_emails',
  FORMS: 'aura_office_forms',
  DESIGNS: 'aura_office_designs',
  DATABASES: 'aura_office_databases',
  USER: 'aura_office_user',
  THEME: 'aura_office_theme',
};

// Safe LocalStorage helpers
function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed or quota exceeded', e);
  }
}

export class AuraStorageService {
  // Current user & auth
  static getUser(): User {
    return getItem<User>(STORAGE_KEYS.USER, SEED_CURRENT_USER);
  }

  static updateUser(user: Partial<User>): User {
    const current = this.getUser();
    const updated = { ...current, ...user };
    setItem(STORAGE_KEYS.USER, updated);
    return updated;
  }

  // Theme
  static getTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  static setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Files & Drive
  static getFiles(): FileItem[] {
    return getItem<FileItem[]>(STORAGE_KEYS.FILES, SEED_FILES);
  }

  static setFiles(files: FileItem[]): void {
    setItem(STORAGE_KEYS.FILES, files);
  }

  static createFile(name: string, type: FileType, parentId?: string | null): FileItem {
    const id = `${type}-${Date.now()}`;
    const user = this.getUser();
    const newFile: FileItem = {
      id,
      name,
      type,
      parentId: parentId || null,
      sizeBytes: 1024,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ownerId: user.id,
      ownerName: user.name,
      isStarred: false,
      isTrash: false,
    };

    const files = this.getFiles();
    this.setFiles([newFile, ...files]);

    // Initialize content based on type
    if (type === 'doc') {
      this.saveDocContent({
        id,
        title: name,
        pageSize: 'Letter',
        orientation: 'portrait',
        margins: { top: 25, right: 25, bottom: 25, left: 25 },
        includePageNumbers: true,
        version: 1,
        updatedAt: new Date().toISOString(),
        htmlContent: `<h1>${name}</h1><p>Start drafting your document here with AuraWrite...</p>`,
      });
    } else if (type === 'sheet') {
      this.saveSheetContent({
        id,
        title: name,
        version: 1,
        updatedAt: new Date().toISOString(),
        activeSheetId: 'sheet-1',
        sheets: [
          {
            id: 'sheet-1',
            name: 'Sheet1',
            rowCount: 25,
            colCount: 12,
            cells: {
              'A1': { raw: 'Item', style: { bold: true, bgColor: '#e2e8f0' } },
              'B1': { raw: 'Amount', style: { bold: true, bgColor: '#e2e8f0', align: 'right' } },
              'A2': { raw: 'Sample 1' },
              'B2': { raw: '100', computed: 100, style: { format: 'currency', align: 'right' } },
              'A3': { raw: 'Sample 2' },
              'B3': { raw: '250', computed: 250, style: { format: 'currency', align: 'right' } },
              'A4': { raw: 'Total', style: { bold: true } },
              'B4': { raw: '=SUM(B2:B3)', computed: 350, style: { bold: true, format: 'currency', align: 'right' } },
            }
          }
        ],
        charts: []
      });
    } else if (type === 'slide') {
      this.saveSlideContent({
        id,
        title: name,
        theme: 'modern',
        aspectRatio: '16:9',
        version: 1,
        updatedAt: new Date().toISOString(),
        slides: [
          {
            id: `s-${Date.now()}`,
            title: 'Welcome Slide',
            bgColor: '#0f172a',
            bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            speakerNotes: 'Introduce your topic with AuraSlides.',
            elements: [
              {
                id: `el-1-${Date.now()}`,
                type: 'text',
                x: 80,
                y: 120,
                width: 750,
                height: 100,
                text: name,
                fontSize: 42,
                fontWeight: 'bold',
                color: '#ffffff',
                zIndex: 1,
              },
              {
                id: `el-2-${Date.now()}`,
                type: 'text',
                x: 80,
                y: 220,
                width: 650,
                height: 60,
                text: 'Created with AuraOffice Productivity Suite',
                fontSize: 20,
                color: '#94a3b8',
                zIndex: 1,
              }
            ]
          }
        ]
      });
    } else if (type === 'form') {
      this.saveFormContent({
        id,
        title: name,
        description: 'Fill out this form to submit your response.',
        theme: 'ocean',
        isPublished: true,
        updatedAt: new Date().toISOString(),
        fields: [
          { id: 'f-1', type: 'text', label: 'Your Name', required: true, placeholder: 'Enter your full name' },
          { id: 'f-2', type: 'email', label: 'Email Address', required: true, placeholder: 'user@example.com' },
          { id: 'f-3', type: 'rating', label: 'Satisfaction Score', required: true }
        ],
        responses: []
      });
    } else if (type === 'design') {
      this.saveDesignContent({
        id,
        title: name,
        format: 'poster',
        width: 600,
        height: 750,
        background: '#0f172a',
        updatedAt: new Date().toISOString(),
        elements: [
          {
            id: 'del-1',
            type: 'text',
            x: 50,
            y: 80,
            width: 500,
            height: 70,
            text: name.toUpperCase(),
            fontSize: 32,
            color: '#ffffff',
          }
        ]
      });
    } else if (type === 'database') {
      this.saveDatabaseContent({
        id,
        title: name,
        description: 'Relational database created with AuraDatabase',
        activeTableId: 'tbl-1',
        relationships: [],
        queries: [
          {
            id: 'qry-1',
            name: 'All Records',
            sql: 'SELECT * FROM Table1',
          }
        ],
        updatedAt: new Date().toISOString(),
        tables: [
          {
            id: 'tbl-1',
            name: 'Table1',
            description: 'Default data table',
            columns: [
              { id: 'id', name: 'ID', type: 'text', primaryKey: true, required: true },
              { id: 'title', name: 'Title', type: 'text', required: true },
              { id: 'status', name: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
              { id: 'created', name: 'Created Date', type: 'date' },
            ],
            records: [
              { id: 'REC-001', title: 'Initial Project Record', status: 'Active', created: new Date().toISOString().slice(0, 10) },
              { id: 'REC-002', title: 'Secondary Project Asset', status: 'Pending', created: new Date().toISOString().slice(0, 10) },
            ],
          }
        ]
      });
    }

    return newFile;
  }

  static renameFile(id: string, newName: string): void {
    const files = this.getFiles().map(f => f.id === id ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  static toggleStar(id: string): void {
    const files = this.getFiles().map(f => f.id === id ? { ...f, isStarred: !f.isStarred } : f);
    this.setFiles(files);
  }

  static moveToTrash(id: string): void {
    const files = this.getFiles().map(f => f.id === id ? { ...f, isTrash: true, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  static restoreFromTrash(id: string): void {
    const files = this.getFiles().map(f => f.id === id ? { ...f, isTrash: false, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  static permanentlyDelete(id: string): void {
    const files = this.getFiles().filter(f => f.id !== id);
    this.setFiles(files);
  }

  static touchFile(id: string): void {
    const files = this.getFiles().map(f => f.id === id ? { ...f, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  static updateUserRole(role: UserRole): void {
    const user = this.getUser();
    this.updateUser({ ...user, role });
  }

  static resetSeedData(): void {
    localStorage.removeItem(STORAGE_KEYS.FILES);
    localStorage.removeItem(STORAGE_KEYS.DOCS);
    localStorage.removeItem(STORAGE_KEYS.SHEETS);
    localStorage.removeItem(STORAGE_KEYS.SLIDES);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.NOTEBOOKS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.FORMS);
    localStorage.removeItem(STORAGE_KEYS.DESIGNS);
    localStorage.removeItem(STORAGE_KEYS.DATABASES);
  }

  // Document (AuraWrite)
  static getDocContent(id: string): AuraDocContent {
    const all = getItem<Record<string, AuraDocContent>>(STORAGE_KEYS.DOCS, SEED_DOC_CONTENT);
    if (all[id]) return all[id];

    // Create default if not present
    return {
      id,
      title: 'Untitled Document',
      pageSize: 'Letter',
      orientation: 'portrait',
      margins: { top: 25, right: 25, bottom: 25, left: 25 },
      includePageNumbers: true,
      version: 1,
      updatedAt: new Date().toISOString(),
      htmlContent: '<h1>Document Title</h1><p>Start writing with AuraWrite...</p>',
    };
  }

  static saveDocContent(doc: AuraDocContent): void {
    const all = getItem<Record<string, AuraDocContent>>(STORAGE_KEYS.DOCS, SEED_DOC_CONTENT);
    all[doc.id] = { ...doc, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.DOCS, all);

    // Update corresponding file entry
    const files = this.getFiles();
    const updatedFiles = files.map(f => f.id === doc.id ? { ...f, name: doc.title, updatedAt: new Date().toISOString() } : f);
    this.setFiles(updatedFiles);
  }

  // Spreadsheet (AuraSheets)
  static getSheetContent(id: string): AuraSheetContent {
    const all = getItem<Record<string, AuraSheetContent>>(STORAGE_KEYS.SHEETS, SEED_SHEET_CONTENT);
    if (all[id]) return all[id];

    return {
      id,
      title: 'Untitled Spreadsheet',
      version: 1,
      updatedAt: new Date().toISOString(),
      activeSheetId: 'sheet-1',
      sheets: [
        {
          id: 'sheet-1',
          name: 'Sheet1',
          rowCount: 30,
          colCount: 15,
          cells: {
            'A1': { raw: 'Column A', style: { bold: true, bgColor: '#f1f5f9' } },
            'B1': { raw: 'Column B', style: { bold: true, bgColor: '#f1f5f9' } },
            'A2': { raw: '10' },
            'B2': { raw: '20' },
            'A3': { raw: '=SUM(A2:B2)', computed: 30, style: { bold: true } },
          }
        }
      ],
      charts: []
    };
  }

  static saveSheetContent(sheet: AuraSheetContent): void {
    // Ensure all sheets are calculated
    const computedSheets = sheet.sheets.map(s => ({
      ...s,
      cells: recalculateSheetCells(s.cells)
    }));

    const updatedSheet: AuraSheetContent = {
      ...sheet,
      sheets: computedSheets,
      updatedAt: new Date().toISOString()
    };

    const all = getItem<Record<string, AuraSheetContent>>(STORAGE_KEYS.SHEETS, SEED_SHEET_CONTENT);
    all[sheet.id] = updatedSheet;
    setItem(STORAGE_KEYS.SHEETS, all);

    // Update file
    const files = this.getFiles().map(f => f.id === sheet.id ? { ...f, name: sheet.title, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  // Presentation (AuraSlides)
  static getSlideContent(id: string): AuraSlideContent {
    const all = getItem<Record<string, AuraSlideContent>>(STORAGE_KEYS.SLIDES, SEED_SLIDE_CONTENT);
    if (all[id]) return all[id];

    return {
      id,
      title: 'Untitled Presentation',
      theme: 'modern',
      aspectRatio: '16:9',
      version: 1,
      updatedAt: new Date().toISOString(),
      slides: [
        {
          id: `s-1`,
          title: 'Title Slide',
          bgColor: '#0f172a',
          speakerNotes: 'Slide speaker notes...',
          elements: [
            {
              id: 'el-1',
              type: 'text',
              x: 80,
              y: 140,
              width: 700,
              height: 90,
              text: 'AuraSlides Presentation',
              fontSize: 40,
              fontWeight: 'bold',
              color: '#ffffff',
              zIndex: 1,
            }
          ]
        }
      ]
    };
  }

  static saveSlideContent(slides: AuraSlideContent): void {
    const all = getItem<Record<string, AuraSlideContent>>(STORAGE_KEYS.SLIDES, SEED_SLIDE_CONTENT);
    all[slides.id] = { ...slides, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.SLIDES, all);

    const files = this.getFiles().map(f => f.id === slides.id ? { ...f, name: slides.title, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  // Notes (AuraNotes)
  static getNotebooks(): Notebook[] {
    return getItem<Notebook[]>(STORAGE_KEYS.NOTEBOOKS, SEED_NOTEBOOKS);
  }

  static saveNotebooks(nbs: Notebook[]): void {
    setItem(STORAGE_KEYS.NOTEBOOKS, nbs);
  }

  static getNotes(): AuraNoteItem[] {
    return getItem<AuraNoteItem[]>(STORAGE_KEYS.NOTES, SEED_NOTES);
  }

  static saveNotes(notes: AuraNoteItem[]): void {
    setItem(STORAGE_KEYS.NOTES, notes);
  }

  // Emails (AuraMail)
  static getEmails(): AuraEmailItem[] {
    return getItem<AuraEmailItem[]>(STORAGE_KEYS.EMAILS, SEED_EMAILS);
  }

  static saveEmails(emails: AuraEmailItem[]): void {
    setItem(STORAGE_KEYS.EMAILS, emails);
  }

  static sendEmail(email: Omit<AuraEmailItem, 'id' | 'date' | 'isRead' | 'folder' | 'isStarred'>): AuraEmailItem {
    const newEmail: AuraEmailItem = {
      ...email,
      id: `em-${Date.now()}`,
      date: 'Just now',
      folder: 'sent',
      isRead: true,
      isStarred: false,
    };
    const emails = this.getEmails();
    this.saveEmails([newEmail, ...emails]);
    return newEmail;
  }

  // Forms (AuraForms)
  static getFormContent(id: string): AuraFormContent {
    const all = getItem<Record<string, AuraFormContent>>(STORAGE_KEYS.FORMS, SEED_FORMS);
    if (all[id]) return all[id];

    return {
      id,
      title: 'Untitled Form',
      description: 'Please complete the questionnaire below.',
      theme: 'default',
      isPublished: true,
      updatedAt: new Date().toISOString(),
      fields: [
        { id: 'f-1', type: 'text', label: 'Full Name', required: true }
      ],
      responses: []
    };
  }

  static saveFormContent(form: AuraFormContent): void {
    const all = getItem<Record<string, AuraFormContent>>(STORAGE_KEYS.FORMS, SEED_FORMS);
    all[form.id] = { ...form, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.FORMS, all);

    const files = this.getFiles().map(f => f.id === form.id ? { ...f, name: form.title, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  static submitFormResponse(formId: string, answers: Record<string, any>): void {
    const form = this.getFormContent(formId);
    const newResponse = {
      id: `resp-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      answers,
    };
    form.responses.push(newResponse);
    this.saveFormContent(form);
  }

  // Design (AuraDesign)
  static getDesignContent(id: string): AuraDesignContent {
    const all = getItem<Record<string, AuraDesignContent>>(STORAGE_KEYS.DESIGNS, SEED_DESIGNS);
    if (all[id]) return all[id];

    return {
      id,
      title: 'Untitled Design',
      format: 'poster',
      width: 600,
      height: 750,
      background: '#0f172a',
      updatedAt: new Date().toISOString(),
      elements: [
        {
          id: 'del-1',
          type: 'text',
          x: 50,
          y: 80,
          width: 500,
          height: 60,
          text: 'Design Headline',
          fontSize: 28,
          color: '#ffffff'
        }
      ]
    };
  }

  static saveDesignContent(design: AuraDesignContent): void {
    const all = getItem<Record<string, AuraDesignContent>>(STORAGE_KEYS.DESIGNS, SEED_DESIGNS);
    all[design.id] = { ...design, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.DESIGNS, all);

    const files = this.getFiles().map(f => f.id === design.id ? { ...f, name: design.title, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  // Database (AuraDatabase - Access Alternative)
  static getDatabaseContent(id: string): AuraDatabaseContent {
    const all = getItem<Record<string, AuraDatabaseContent>>(STORAGE_KEYS.DATABASES, SEED_DATABASE_CONTENT);
    if (all[id]) return all[id];

    return {
      id,
      title: 'Untitled Database',
      description: 'Relational database workspace',
      activeTableId: 'tbl-1',
      relationships: [],
      queries: [],
      updatedAt: new Date().toISOString(),
      tables: [
        {
          id: 'tbl-1',
          name: 'Records',
          columns: [
            { id: 'id', name: 'ID', type: 'text', primaryKey: true, required: true },
            { id: 'title', name: 'Title', type: 'text', required: true },
            { id: 'status', name: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
          ],
          records: [
            { id: 'REC-001', title: 'Example Entry 1', status: 'Active' },
            { id: 'REC-002', title: 'Example Entry 2', status: 'Pending' },
          ],
        },
      ],
    };
  }

  static saveDatabaseContent(database: AuraDatabaseContent): void {
    const all = getItem<Record<string, AuraDatabaseContent>>(STORAGE_KEYS.DATABASES, SEED_DATABASE_CONTENT);
    all[database.id] = { ...database, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.DATABASES, all);

    const files = this.getFiles().map(f => f.id === database.id ? { ...f, name: database.title, updatedAt: new Date().toISOString() } : f);
    this.setFiles(files);
  }

  // Export File Generators
  static downloadFile(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static exportDocAsDocx(doc: AuraDocContent): void {
    // Generate valid Microsoft Word HTML/XML document package
    const docxHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${doc.title}</title>
        <!--[if gte mso 9]>
        <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin: 1in; font-size: 11pt; line-height: 1.5; color: #1e293b; }
          h1 { font-size: 24pt; color: #0f172a; margin-bottom: 8pt; }
          h2 { font-size: 18pt; color: #1e293b; margin-top: 14pt; margin-bottom: 6pt; }
          h3 { font-size: 14pt; color: #334155; margin-top: 10pt; }
          p { margin-bottom: 6pt; }
          table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
          th, td { border: 1px solid #cbd5e1; padding: 6pt 10pt; font-size: 10pt; }
          th { background-color: #f1f5f9; font-weight: bold; }
        </style>
      </head>
      <body>
        ${doc.htmlContent}
      </body>
      </html>
    `;
    this.downloadFile(`${doc.title || 'Document'}.docx`, docxHtml, 'application/vnd.ms-word');
  }

  static exportSheetAsCsv(sheet: AuraSheetContent, sheetIndex = 0): void {
    const currentSheet = sheet.sheets[sheetIndex] || sheet.sheets[0];
    if (!currentSheet) return;

    let csvContent = '';
    for (let r = 1; r <= currentSheet.rowCount; r++) {
      const rowVals: string[] = [];
      for (let c = 0; c < currentSheet.colCount; c++) {
        // letter
        const colLetter = String.fromCharCode(65 + c);
        const cellKey = `${colLetter}${r}`;
        const cell = currentSheet.cells[cellKey];
        const val = cell ? (cell.computed !== undefined ? cell.computed : cell.raw) : '';
        const escaped = `"${String(val).replace(/"/g, '""')}"`;
        rowVals.push(escaped);
      }
      csvContent += rowVals.join(',') + '\r\n';
    }

    this.downloadFile(`${sheet.title || 'Spreadsheet'}_${currentSheet.name}.csv`, csvContent, 'text/csv;charset=utf-8;');
  }

  static exportAsPdfPrint(): void {
    window.print();
  }
}
