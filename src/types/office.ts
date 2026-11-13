export type OfficeAppId = 
  | 'drive' 
  | 'write' 
  | 'sheets' 
  | 'slides' 
  | 'notes' 
  | 'mail' 
  | 'database'
  | 'forms' 
  | 'design' 
  | 'pdf' 
  | 'templates' 
  | 'admin' 
  | 'settings';

export type UserRole = 'user' | 'admin' | 'org_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  organization?: string;
  storageUsedBytes: number;
  storageLimitBytes: number;
  createdAt: string;
}

export type FileType = 'doc' | 'sheet' | 'slide' | 'note' | 'database' | 'form' | 'design' | 'pdf' | 'folder';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  parentId?: string | null;
  sizeBytes: number;
  updatedAt: string;
  createdAt: string;
  ownerId: string;
  ownerName: string;
  isStarred?: boolean;
  isTrash?: boolean;
  sharedWith?: { email: string; permission: 'view' | 'comment' | 'edit' }[];
  tags?: string[];
  thumbnail?: string;
}

// AuraWrite Types
export interface AuraDocContent {
  id: string;
  title: string;
  htmlContent: string;
  plainText?: string;
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: { top: number; right: number; bottom: number; left: number }; // in mm
  headerText?: string;
  footerText?: string;
  includePageNumbers?: boolean;
  version: number;
  updatedAt: string;
  comments?: DocComment[];
}

export interface DocComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  selectedText?: string;
  createdAt: string;
  resolved?: boolean;
}

// AuraSheets Types
export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  color?: string;
  bgColor?: string;
  align?: 'left' | 'center' | 'right';
  format?: 'general' | 'number' | 'currency' | 'percent' | 'date';
}

export interface CellValue {
  raw: string; // raw input e.g. "=SUM(A1:A5)" or "150" or "Hello"
  computed?: string | number | boolean;
  error?: string;
  style?: CellStyle;
}

export interface SheetData {
  id: string;
  name: string;
  rowCount: number;
  colCount: number;
  cells: Record<string, CellValue>; // e.g. "A1": { raw: "42" }
  colWidths?: Record<number, number>;
  rowHeights?: Record<number, number>;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'column' | 'line' | 'pie' | 'area';
  dataRange: string; // e.g. "A1:B6"
  labelColumn: string;
  valueColumns: string[];
}

export interface AuraSheetContent {
  id: string;
  title: string;
  sheets: SheetData[];
  activeSheetId: string;
  charts: ChartConfig[];
  version: number;
  updatedAt: string;
}

// AuraSlides Types
export interface SlideElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'table' | 'chart';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  // content specific
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
  shapeType?: 'rectangle' | 'circle' | 'pill' | 'triangle' | 'star' | 'card';
  imageUrl?: string;
  chartType?: 'bar' | 'pie' | 'line';
  chartData?: { name: string; value: number }[];
}

export interface Slide {
  id: string;
  title: string;
  bgColor: string;
  bgGradient?: string;
  elements: SlideElement[];
  speakerNotes: string;
}

export interface AuraSlideContent {
  id: string;
  title: string;
  slides: Slide[];
  theme: 'modern' | 'minimal' | 'executive' | 'creative' | 'midnight';
  aspectRatio: '16:9' | '4:3';
  version: number;
  updatedAt: string;
}

// AuraNotes Types
export interface AuraNoteItem {
  id: string;
  title: string;
  notebookId: string;
  section: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: string;
  createdAt: string;
  checklist?: { id: string; text: string; done: boolean }[];
}

export interface Notebook {
  id: string;
  name: string;
  color: string;
  sections: string[];
}

// AuraMail Types
export interface AuraEmailItem {
  id: string;
  from: { name: string; email: string };
  to: string[];
  subject: string;
  body: string;
  preview: string;
  date: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'starred' | 'spam' | 'trash';
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  attachments?: { name: string; size: string; type: string }[];
}

// AuraForms Types
export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'number' | 'date' | 'dropdown' | 'radio' | 'checkbox' | 'rating';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for dropdown, radio, checkbox
}

export interface AuraFormContent {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  theme: 'default' | 'ocean' | 'sunset' | 'emerald' | 'purple';
  isPublished: boolean;
  responses: Array<{
    id: string;
    submittedAt: string;
    answers: Record<string, any>;
  }>;
  updatedAt: string;
}

// AuraDesign Types
export interface DesignElement {
  id: string;
  type: 'text' | 'shape' | 'badge' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bgColor?: string;
  borderRadius?: number;
  opacity?: number;
  shadow?: boolean;
}

export interface AuraDesignContent {
  id: string;
  title: string;
  format: 'poster' | 'social_post' | 'flyer' | 'card' | 'banner';
  width: number;
  height: number;
  background: string;
  elements: DesignElement[];
  updatedAt: string;
}

// AuraPDF Types
export interface PDFToolState {
  activeFile?: FileItem;
  pageCount: number;
  currentPage: number;
  zoom: number;
  rotation: number;
}

// Templates
export interface TemplateItem {
  id: string;
  title: string;
  category: 'Resume' | 'Invoice' | 'Report' | 'Proposal' | 'Presentation' | 'Spreadsheet' | 'Design' | 'Education';
  appType: 'write' | 'sheets' | 'slides' | 'forms' | 'design';
  description: string;
  icon: string;
  previewColor: string;
}

// AuraDatabase (Access Alternative) Types
export type DbColumnType = 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'select' | 'email';

export interface DbColumn {
  id: string;
  name: string;
  type: DbColumnType;
  required?: boolean;
  primaryKey?: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface DbRecord {
  id: string;
  [key: string]: any;
}

export interface DbTable {
  id: string;
  name: string;
  description?: string;
  columns: DbColumn[];
  records: DbRecord[];
}

export interface DbRelationship {
  id: string;
  name: string;
  fromTableId: string;
  fromColumnId: string;
  toTableId: string;
  toColumnId: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface DbQuery {
  id: string;
  name: string;
  sql: string;
  description?: string;
}

export interface AuraDatabaseContent {
  id: string;
  title: string;
  description?: string;
  tables: DbTable[];
  activeTableId: string;
  relationships: DbRelationship[];
  queries: DbQuery[];
  updatedAt: string;
}

