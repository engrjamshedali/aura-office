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
  TemplateItem,
  User 
} from '../types/office';

export const SEED_CURRENT_USER: User = {
  id: 'usr-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@auraoffice.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  organization: 'Apex Innovations & Labs',
  storageUsedBytes: 245100000, // ~245 MB
  storageLimitBytes: 5368709120, // 5 GB
  createdAt: '2025-01-15T09:00:00Z',
};

export const SEED_FILES: FileItem[] = [
  {
    id: 'doc-1',
    name: 'Quarterly Strategic Plan 2026',
    type: 'doc',
    sizeBytes: 42000,
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    createdAt: '2026-02-10T08:00:00Z',
    ownerId: 'usr-101',
    ownerName: 'Alex Rivera',
    isStarred: true,
    tags: ['Strategy', 'Executive'],
  },
  {
    id: 'sheet-1',
    name: 'Company Financial Forecast & Budget',
    type: 'sheet',
    sizeBytes: 86000,
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: '2026-02-12T10:30:00Z',
    ownerId: 'usr-101',
    ownerName: 'Alex Rivera',
    isStarred: true,
    tags: ['Finance', 'Q1-Q4'],
  },
  {
    id: 'slide-1',
    name: 'Product Keynote & Architecture Deck',
    type: 'slide',
    sizeBytes: 154000,
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    createdAt: '2026-02-14T14:15:00Z',
    ownerId: 'usr-101',
    ownerName: 'Alex Rivera',
    isStarred: true,
    tags: ['Keynote', 'Pitch'],
  },
  {
    id: 'note-1',
    name: 'Research & Meeting Minutes',
    type: 'note',
    sizeBytes: 14000,
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    createdAt: '2026-02-18T11:00:00Z',
    ownerId: 'usr-101',
    ownerName: 'Alex Rivera',
    isStarred: false,
    tags: ['Engineering', 'Notes'],
  },
  {
    id: 'form-1',
    name: 'Customer Experience & NPS Survey',
    type: 'form',
    sizeBytes: 28000,
    updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    createdAt: '2026-02-20T16:00:00Z',
    ownerId: 'usr-101',
    ownerName: 'Alex Rivera',
    isStarred: false,
    tags: ['Surveys', 'Marketing'],
  },
  {
    id: 'design-1',
    name: 'Aura Tech Conference Poster',
    type: 'design',
    sizeBytes: 92000,
    updatedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    createdAt: '2026-02-22T13:40:00Z',
    ownerId: 'usr-101',
    ownerName: 'Alex Rivera',
    isStarred: false,
    tags: ['Design', 'Print'],
  },
  {
    id: 'pdf-1',
    name: 'Corporate Compliance Handbook.pdf',
    type: 'pdf',
    sizeBytes: 310000,
    updatedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    createdAt: '2026-02-01T09:00:00Z',
    ownerId: 'usr-101',
    ownerName: 'Alex Rivera',
    isStarred: false,
    tags: ['Legal', 'Handbook'],
  },
  {
    id: 'db-1',
    name: 'Enterprise Operations & Sales Database',
    type: 'database',
    sizeBytes: 240000,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    createdAt: '2026-02-15T11:00:00Z',
    ownerId: 'usr-101',
    ownerName: 'Alex Rivera',
    isStarred: true,
    tags: ['Database', 'Sales', 'Access'],
  }
];

export const SEED_DOC_CONTENT: Record<string, AuraDocContent> = {
  'doc-1': {
    id: 'doc-1',
    title: 'Quarterly Strategic Plan 2026',
    pageSize: 'Letter',
    orientation: 'portrait',
    margins: { top: 25, right: 25, bottom: 25, left: 25 },
    headerText: 'AuraOffice Strategic Blueprint 2026 — Confidential',
    footerText: 'Apex Innovations & Labs • Page 1',
    includePageNumbers: true,
    version: 4,
    updatedAt: new Date().toISOString(),
    comments: [
      {
        id: 'c-1',
        author: 'Dr. Evelyn Reed',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        text: 'Ensure we align the cloud storage expansion with our Q3 enterprise SLA targets.',
        selectedText: 'cloud storage expansion',
        createdAt: '2 hours ago',
        resolved: false,
      }
    ],
    htmlContent: `<h1>Quarterly Strategic Plan 2026</h1>
<p><strong>Prepared by:</strong> Alex Rivera, Head of Product Engineering<br>
<strong>Target Audience:</strong> Executive Committee & Department Leads<br>
<strong>Status:</strong> Active Review • Version 4.2</p>

<hr>

<h2>1. Executive Summary</h2>
<p>The primary objective for FY2026 is to transition our global enterprise productivity ecosystem to a fully integrated, zero-trust cloud suite. Our flagship platform, <strong>AuraOffice</strong>, combines high-performance word processing, dynamic spreadsheet computation, and presentation design into a unified, desktop-class web experience.</p>

<p>Through our proprietary client-side computing engine and server-side artificial intelligence powered by Gemini 3.8 Flash, AuraOffice delivers sub-50ms interaction latency while maintaining strict enterprise compliance and security standards.</p>

<h2>2. Core Strategic Pillars</h2>
<ul>
  <li><strong>Unified Architecture:</strong> Eliminating application silos by providing a shared file system (AuraDrive), single-sign-on RBAC permissions, and synchronized styling.</li>
  <li><strong>Intelligent Productivity:</strong> Context-aware AI acceleration that assists with document drafting, formula construction, and presentation structuring directly inside the authoring workflow.</li>
  <li><strong>Offline First & Resilience:</strong> Progressive Web App caching enabling continuous productivity regardless of network conditions, with conflict-free background synchronization.</li>
</ul>

<h2>3. Key Milestones & Deliverables</h2>
<table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; border-color: #cbd5e1;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="padding: 10px;">Milestone</th>
      <th style="padding: 10px;">Target Date</th>
      <th style="padding: 10px;">Lead Department</th>
      <th style="padding: 10px;">Deliverable</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px;">Phase 1: Engine Modernization</td>
      <td style="padding: 10px;">March 31, 2026</td>
      <td style="padding: 10px;">Core Engineering</td>
      <td style="padding: 10px;">Vectorized sheet computation & real-time canvas</td>
    </tr>
    <tr>
      <td style="padding: 10px;">Phase 2: Enterprise Admin & Education</td>
      <td style="padding: 10px;">June 30, 2026</td>
      <td style="padding: 10px;">Platform Services</td>
      <td style="padding: 10px;">RBAC user management & course workflows</td>
    </tr>
    <tr>
      <td style="padding: 10px;">Phase 3: Global Collaboration</td>
      <td style="padding: 10px;">September 30, 2026</td>
      <td style="padding: 10px;">Infra & Security</td>
      <td style="padding: 10px;">Live presence indicators & multi-tenant storage</td>
    </tr>
  </tbody>
</table>

<h2>4. Operational Budget & Resource Allocation</h2>
<p>Capital expenditures for computing infrastructure are projected to remain within <strong>$1.4M</strong> for the fiscal year, with 60% dedicated to distributed cloud data replication and 40% allocated to edge intelligence pipelines.</p>

<p><em>Approved by Governance Committee on February 2026.</em></p>`
  }
};

export const SEED_SHEET_CONTENT: Record<string, AuraSheetContent> = {
  'sheet-1': {
    id: 'sheet-1',
    title: 'Company Financial Forecast & Budget',
    version: 3,
    updatedAt: new Date().toISOString(),
    activeSheetId: 'sheet-tab-1',
    sheets: [
      {
        id: 'sheet-tab-1',
        name: 'Revenue & Expenses',
        rowCount: 30,
        colCount: 15,
        cells: {
          'A1': { raw: 'Financial Performance Model FY2026', style: { bold: true, fontSize: 16, color: '#1e293b' } },
          'A2': { raw: 'All amounts in USD thousands ($k)', style: { italic: true, color: '#64748b' } },
          
          // Headers
          'A4': { raw: 'Category', style: { bold: true, bgColor: '#e2e8f0', align: 'left' } },
          'B4': { raw: 'Q1 2026', style: { bold: true, bgColor: '#e2e8f0', align: 'right' } },
          'C4': { raw: 'Q2 2026', style: { bold: true, bgColor: '#e2e8f0', align: 'right' } },
          'D4': { raw: 'Q3 2026', style: { bold: true, bgColor: '#e2e8f0', align: 'right' } },
          'E4': { raw: 'Q4 2026', style: { bold: true, bgColor: '#e2e8f0', align: 'right' } },
          'F4': { raw: 'Total FY26', style: { bold: true, bgColor: '#cbd5e1', align: 'right' } },

          // Revenue section
          'A5': { raw: 'Enterprise Subscriptions', style: { bold: true } },
          'B5': { raw: '450', computed: 450, style: { format: 'currency', align: 'right' } },
          'C5': { raw: '520', computed: 520, style: { format: 'currency', align: 'right' } },
          'D5': { raw: '610', computed: 610, style: { format: 'currency', align: 'right' } },
          'E5': { raw: '730', computed: 730, style: { format: 'currency', align: 'right' } },
          'F5': { raw: '=SUM(B5:E5)', computed: 2310, style: { bold: true, format: 'currency', align: 'right' } },

          'A6': { raw: 'Professional & Team Plans' },
          'B6': { raw: '180', computed: 180, style: { format: 'currency', align: 'right' } },
          'C6': { raw: '210', computed: 210, style: { format: 'currency', align: 'right' } },
          'D6': { raw: '240', computed: 240, style: { format: 'currency', align: 'right' } },
          'E6': { raw: '290', computed: 290, style: { format: 'currency', align: 'right' } },
          'F6': { raw: '=SUM(B6:E6)', computed: 920, style: { bold: true, format: 'currency', align: 'right' } },

          'A7': { raw: 'Educational Licenses' },
          'B7': { raw: '90', computed: 90, style: { format: 'currency', align: 'right' } },
          'C7': { raw: '110', computed: 110, style: { format: 'currency', align: 'right' } },
          'D7': { raw: '140', computed: 140, style: { format: 'currency', align: 'right' } },
          'E7': { raw: '180', computed: 180, style: { format: 'currency', align: 'right' } },
          'F7': { raw: '=SUM(B7:E7)', computed: 520, style: { bold: true, format: 'currency', align: 'right' } },

          // Total Revenue Row
          'A8': { raw: 'Total Gross Revenue', style: { bold: true, bgColor: '#f1f5f9' } },
          'B8': { raw: '=SUM(B5:B7)', computed: 720, style: { bold: true, bgColor: '#f1f5f9', format: 'currency', align: 'right' } },
          'C8': { raw: '=SUM(C5:C7)', computed: 840, style: { bold: true, bgColor: '#f1f5f9', format: 'currency', align: 'right' } },
          'D8': { raw: '=SUM(D5:D7)', computed: 990, style: { bold: true, bgColor: '#f1f5f9', format: 'currency', align: 'right' } },
          'E8': { raw: '=SUM(E5:E7)', computed: 1200, style: { bold: true, bgColor: '#f1f5f9', format: 'currency', align: 'right' } },
          'F8': { raw: '=SUM(F5:F7)', computed: 3750, style: { bold: true, bgColor: '#e2e8f0', format: 'currency', align: 'right' } },

          // Operating Costs
          'A10': { raw: 'Operating Expenses', style: { bold: true, color: '#475569' } },
          'A11': { raw: 'Cloud Infrastructure' },
          'B11': { raw: '120', computed: 120, style: { format: 'currency', align: 'right' } },
          'C11': { raw: '135', computed: 135, style: { format: 'currency', align: 'right' } },
          'D11': { raw: '150', computed: 150, style: { format: 'currency', align: 'right' } },
          'E11': { raw: '165', computed: 165, style: { format: 'currency', align: 'right' } },
          'F11': { raw: '=SUM(B11:E11)', computed: 570, style: { bold: true, format: 'currency', align: 'right' } },

          'A12': { raw: 'Research & Engineering' },
          'B12': { raw: '280', computed: 280, style: { format: 'currency', align: 'right' } },
          'C12': { raw: '300', computed: 300, style: { format: 'currency', align: 'right' } },
          'D12': { raw: '320', computed: 320, style: { format: 'currency', align: 'right' } },
          'E12': { raw: '340', computed: 340, style: { format: 'currency', align: 'right' } },
          'F12': { raw: '=SUM(B12:E12)', computed: 1240, style: { bold: true, format: 'currency', align: 'right' } },

          'A13': { raw: 'Sales & Marketing' },
          'B13': { raw: '150', computed: 150, style: { format: 'currency', align: 'right' } },
          'C13': { raw: '170', computed: 170, style: { format: 'currency', align: 'right' } },
          'D13': { raw: '190', computed: 190, style: { format: 'currency', align: 'right' } },
          'E13': { raw: '220', computed: 220, style: { format: 'currency', align: 'right' } },
          'F13': { raw: '=SUM(B13:E13)', computed: 730, style: { bold: true, format: 'currency', align: 'right' } },

          // Total OpEx
          'A14': { raw: 'Total Operating Expenses', style: { bold: true, bgColor: '#fef2f2', color: '#991b1b' } },
          'B14': { raw: '=SUM(B11:B13)', computed: 550, style: { bold: true, bgColor: '#fef2f2', format: 'currency', align: 'right' } },
          'C14': { raw: '=SUM(C11:C13)', computed: 605, style: { bold: true, bgColor: '#fef2f2', format: 'currency', align: 'right' } },
          'D14': { raw: '=SUM(D11:D13)', computed: 660, style: { bold: true, bgColor: '#fef2f2', format: 'currency', align: 'right' } },
          'E14': { raw: '=SUM(E11:E13)', computed: 725, style: { bold: true, bgColor: '#fef2f2', format: 'currency', align: 'right' } },
          'F14': { raw: '=SUM(F11:F13)', computed: 2540, style: { bold: true, bgColor: '#fee2e2', color: '#991b1b', format: 'currency', align: 'right' } },

          // Net Margin
          'A16': { raw: 'Net Operating Income', style: { bold: true, bgColor: '#ecfdf5', color: '#065f46' } },
          'B16': { raw: '=B8-B14', computed: 170, style: { bold: true, bgColor: '#ecfdf5', format: 'currency', align: 'right' } },
          'C16': { raw: '=C8-C14', computed: 235, style: { bold: true, bgColor: '#ecfdf5', format: 'currency', align: 'right' } },
          'D16': { raw: '=D8-D14', computed: 330, style: { bold: true, bgColor: '#ecfdf5', format: 'currency', align: 'right' } },
          'E16': { raw: '=E8-E14', computed: 475, style: { bold: true, bgColor: '#ecfdf5', format: 'currency', align: 'right' } },
          'F16': { raw: '=F8-F14', computed: 1210, style: { bold: true, bgColor: '#d1fae5', color: '#065f46', format: 'currency', align: 'right' } },

          // Statistics
          'A18': { raw: 'Average Quarterly Revenue', style: { italic: true } },
          'B18': { raw: '=AVERAGE(B8:E8)', computed: 937.5, style: { format: 'currency', align: 'right' } },
          'A19': { raw: 'Max Quarterly Net Income', style: { italic: true } },
          'B19': { raw: '=MAX(B16:E16)', computed: 475, style: { format: 'currency', align: 'right' } },
          'A20': { raw: 'Target Status', style: { italic: true } },
          'B20': { raw: '=IF(F16>=1000,"Target Exceeded","Review Operations")', computed: 'Target Exceeded', style: { bold: true, color: '#16a34a' } },
        }
      },
      {
        id: 'sheet-tab-2',
        name: 'Headcount & Staffing',
        rowCount: 20,
        colCount: 10,
        cells: {
          'A1': { raw: 'Department Headcount Plan', style: { bold: true, fontSize: 14 } },
          'A3': { raw: 'Department', style: { bold: true, bgColor: '#e2e8f0' } },
          'B3': { raw: 'Current', style: { bold: true, bgColor: '#e2e8f0', align: 'right' } },
          'C3': { raw: 'Q4 Goal', style: { bold: true, bgColor: '#e2e8f0', align: 'right' } },
          'A4': { raw: 'Engineering' },
          'B4': { raw: '42', computed: 42, style: { align: 'right' } },
          'C4': { raw: '58', computed: 58, style: { align: 'right' } },
          'A5': { raw: 'Product & Design' },
          'B5': { raw: '14', computed: 14, style: { align: 'right' } },
          'C5': { raw: '18', computed: 18, style: { align: 'right' } },
          'A6': { raw: 'Customer Success' },
          'B6': { raw: '20', computed: 20, style: { align: 'right' } },
          'C6': { raw: '28', computed: 28, style: { align: 'right' } },
          'A7': { raw: 'Total Team', style: { bold: true } },
          'B7': { raw: '=SUM(B4:B6)', computed: 76, style: { bold: true, align: 'right' } },
          'C7': { raw: '=SUM(C4:C6)', computed: 104, style: { bold: true, align: 'right' } },
        }
      }
    ],
    charts: [
      {
        id: 'chart-1',
        title: 'Quarterly Gross Revenue vs Net Income ($k)',
        type: 'bar',
        dataRange: 'B8:E16',
        labelColumn: 'Quarter',
        valueColumns: ['Gross Revenue', 'Net Income']
      }
    ]
  }
};

export const SEED_SLIDE_CONTENT: Record<string, AuraSlideContent> = {
  'slide-1': {
    id: 'slide-1',
    title: 'Product Keynote & Architecture Deck',
    theme: 'modern',
    aspectRatio: '16:9',
    version: 3,
    updatedAt: new Date().toISOString(),
    slides: [
      {
        id: 's-1',
        title: 'Title Slide',
        bgColor: '#0f172a',
        bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        speakerNotes: 'Welcome the audience. Introduce AuraOffice as the next-generation productivity cloud for modern teams.',
        elements: [
          {
            id: 'el-1',
            type: 'text',
            x: 80,
            y: 120,
            width: 800,
            height: 100,
            text: 'AuraOffice Platform Keynote',
            fontSize: 46,
            fontWeight: 'bold',
            color: '#ffffff',
            zIndex: 2,
          },
          {
            id: 'el-2',
            type: 'text',
            x: 80,
            y: 230,
            width: 700,
            height: 70,
            text: 'Empowering Modern Enterprise & Academic Workflows with Intelligent Cloud Productivity',
            fontSize: 22,
            color: '#94a3b8',
            zIndex: 2,
          },
          {
            id: 'el-3',
            type: 'shape',
            shapeType: 'pill',
            x: 80,
            y: 330,
            width: 220,
            height: 44,
            bgColor: '#6366f1',
            text: 'CONFIDENTIAL • 2026',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            zIndex: 2,
          }
        ]
      },
      {
        id: 's-2',
        title: 'Market Problem Statement',
        bgColor: '#f8fafc',
        speakerNotes: 'Detail the current fragmentation across enterprise tools: high subscription costs, separate logins, and broken file interoperability.',
        elements: [
          {
            id: 'el-4',
            type: 'text',
            x: 60,
            y: 50,
            width: 700,
            height: 60,
            text: 'The Productivity Dilemma Today',
            fontSize: 34,
            fontWeight: 'bold',
            color: '#0f172a',
            zIndex: 1,
          },
          {
            id: 'el-5',
            type: 'shape',
            shapeType: 'card',
            x: 60,
            y: 140,
            width: 260,
            height: 240,
            bgColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            zIndex: 2,
            text: 'Tool Silos\n\nTeams juggle 6+ disjointed apps with conflicting permission models and disparate interfaces.',
            fontSize: 16,
            color: '#334155',
          },
          {
            id: 'el-6',
            type: 'shape',
            shapeType: 'card',
            x: 350,
            y: 140,
            width: 260,
            height: 240,
            bgColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            zIndex: 2,
            text: 'High Cost Burden\n\nLegacy suite subscriptions cost upwards of $36/user/month with mandatory bundling and hidden storage fees.',
            fontSize: 16,
            color: '#334155',
          },
          {
            id: 'el-7',
            type: 'shape',
            shapeType: 'card',
            x: 640,
            y: 140,
            width: 260,
            height: 240,
            bgColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            zIndex: 2,
            text: 'Disjointed AI\n\nGeneric chatbots lack real document awareness, formula understanding, and live slide layouts.',
            fontSize: 16,
            color: '#334155',
          }
        ]
      },
      {
        id: 's-3',
        title: 'The AuraOffice Solution',
        bgColor: '#0f172a',
        bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        speakerNotes: 'Emphasize the 10 integrated applications, shared AuraDrive file repository, and unified Aura AI.',
        elements: [
          {
            id: 'el-8',
            type: 'text',
            x: 60,
            y: 50,
            width: 700,
            height: 60,
            text: 'Unified Ecosystem: 10 Apps, 1 Identity',
            fontSize: 32,
            fontWeight: 'bold',
            color: '#f8fafc',
            zIndex: 1,
          },
          {
            id: 'el-9',
            type: 'text',
            x: 60,
            y: 130,
            width: 800,
            height: 220,
            text: '• AuraWrite: Word processor with rich typography, comments & outlines\n• AuraSheets: 30+ formulas, multi-sheet computation & live charts\n• AuraSlides: Responsive layout canvas with presentation slideshow\n• AuraNotes: Notebooks with markdown, checklists & tagging\n• AuraMail & AuraForms: Full communication and feedback loop\n• AuraDrive: Zero-latency cloud filesystem with RBAC permissions',
            fontSize: 20,
            color: '#cbd5e1',
            zIndex: 2,
          }
        ]
      },
      {
        id: 's-4',
        title: 'Projected Growth & Adoption',
        bgColor: '#ffffff',
        speakerNotes: 'Showcase key metrics and enterprise customer growth trends.',
        elements: [
          {
            id: 'el-10',
            type: 'text',
            x: 60,
            y: 50,
            width: 700,
            height: 50,
            text: 'Adoption Velocity & Scalability',
            fontSize: 32,
            fontWeight: 'bold',
            color: '#0f172a',
            zIndex: 1,
          },
          {
            id: 'el-11',
            type: 'shape',
            shapeType: 'rectangle',
            x: 60,
            y: 130,
            width: 250,
            height: 140,
            bgColor: '#eff6ff',
            borderColor: '#bfdbfe',
            borderWidth: 1,
            zIndex: 2,
            text: '+240%\n\nYear-over-year active user growth',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1e40af',
            textAlign: 'center',
          },
          {
            id: 'el-12',
            type: 'shape',
            shapeType: 'rectangle',
            x: 340,
            y: 130,
            width: 250,
            height: 140,
            bgColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            borderWidth: 1,
            zIndex: 2,
            text: '99.99%\n\nUptime & zero data loss record',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#065f46',
            textAlign: 'center',
          },
          {
            id: 'el-13',
            type: 'shape',
            shapeType: 'rectangle',
            x: 620,
            y: 130,
            width: 250,
            height: 140,
            bgColor: '#faf5ff',
            borderColor: '#e9d5ff',
            borderWidth: 1,
            zIndex: 2,
            text: '< 45ms\n\nAverage client-side interaction latency',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#6b21a8',
            textAlign: 'center',
          }
        ]
      }
    ]
  }
};

export const SEED_NOTEBOOKS: Notebook[] = [
  {
    id: 'nb-1',
    name: 'Engineering & Architecture',
    color: '#6366f1',
    sections: ['Sprint Notes', 'System Specs', 'Technical Decisions'],
  },
  {
    id: 'nb-2',
    name: 'Product Strategy & Vision',
    color: '#0ea5e9',
    sections: ['Ideas', 'Competitor Analysis', 'User Feedback'],
  },
  {
    id: 'nb-3',
    name: 'Personal & Professional',
    color: '#10b981',
    sections: ['Daily Journal', 'Reading List', 'Action Items'],
  }
];

export const SEED_NOTES: AuraNoteItem[] = [
  {
    id: 'note-1',
    title: 'Research & Meeting Minutes: Q1 Sprint Architecture',
    notebookId: 'nb-1',
    section: 'Sprint Notes',
    content: `# Architecture Sync Notes

## Key Discussion Points
- Evaluated formula engine performance: custom AST parser processes 10,000 cells in under 12 milliseconds.
- Decided on persistent local storage sync with backend reconciliation for offline support.
- Gemini 3.8 Flash integrated on the server-side with zero client secret exposure.

## Next Action Checklist
`,
    tags: ['Architecture', 'Sprint', 'Engine'],
    isPinned: true,
    isFavorite: true,
    createdAt: '2026-02-18T11:00:00Z',
    updatedAt: new Date().toISOString(),
    checklist: [
      { id: 'chk-1', text: 'Benchmark VLOOKUP execution over 5,000 rows', done: true },
      { id: 'chk-2', text: 'Validate print stylesheet layout for A4 and Letter margins', done: true },
      { id: 'chk-3', text: 'Test slide drag-and-drop boundary clipping on tablet viewports', done: false },
      { id: 'chk-4', text: 'Verify CSV import parser for multi-line quoted strings', done: true }
    ]
  },
  {
    id: 'note-2',
    title: 'Design System & Typography Token Reference',
    notebookId: 'nb-2',
    section: 'Ideas',
    content: `# AuraOffice Design Identity

- Neutral base: Cool Slate (#0f172a / #f8fafc)
- Brand Accents: Indigo 600 (#4f46e5) & Violet 600 (#7c3aed)
- Typeface: Plus Jakarta Sans for UI, JetBrains Mono for Formulas & Code
- Mathematical border radius: Outer (16px), Inner (10px)`,
    tags: ['Design', 'Tokens'],
    isPinned: false,
    isFavorite: true,
    createdAt: '2026-02-19T14:30:00Z',
    updatedAt: new Date().toISOString(),
    checklist: [
      { id: 'chk-5', text: 'Audit dark mode contrast for WCAG AA compliance', done: true },
      { id: 'chk-6', text: 'Standardize icon weights to 1.75px stroke', done: true }
    ]
  }
];

export const SEED_EMAILS: AuraEmailItem[] = [
  {
    id: 'em-1',
    from: { name: 'Dr. Evelyn Reed', email: 'evelyn.reed@apexlabs.org' },
    to: ['alex.rivera@auraoffice.io'],
    subject: 'Feedback on Quarterly Strategic Plan & AI Integration',
    preview: 'Alex, I reviewed the Q1 strategic draft. The spreadsheet formula integration looks brilliant...',
    body: `Hi Alex,

I reviewed the Q1 strategic plan and tested the new spreadsheet formula calculations in AuraSheets. The formula recalculation is remarkably swift, and the automated chart generator picked up our fiscal data without any manual column remapping.

Could we schedule a 15-minute briefing on Thursday to discuss university deployment parameters? We have 1,200 faculty members eager to transition from Microsoft 365.

Best regards,
Dr. Evelyn Reed
Dean of Computing & Applied Sciences`,
    date: '10:42 AM',
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    labels: ['University', 'Executive'],
    attachments: [{ name: 'University_Rollout_Brief.pdf', size: '1.2 MB', type: 'pdf' }],
  },
  {
    id: 'em-2',
    from: { name: 'Marcus Vance', email: 'm.vance@auracloud.net' },
    to: ['alex.rivera@auraoffice.io'],
    subject: 'AuraDrive Storage & Zero-Trust Sync Report',
    preview: 'All enterprise storage clusters have been provisioned with automated hourly snapshots...',
    body: `Alex,

All enterprise storage clusters have been provisioned with automated hourly snapshots and client-side encryption. Storage utilization currently sits at 245 MB of your 5 GB allocation.

Let me know when you would like to run the multi-user concurrent editing drill.

Marcus Vance
Lead Infrastructure Engineer`,
    date: 'Yesterday',
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    labels: ['Infrastructure'],
  },
  {
    id: 'em-3',
    from: { name: 'Sophia Lin', email: 'sophia.lin@apexlabs.org' },
    to: ['alex.rivera@auraoffice.io'],
    subject: 'Updated Slide Deck for Investor Keynote',
    preview: 'I dropped the latest slide graphics into our shared presentation deck. Please review slide 3...',
    body: `Alex,

I dropped the latest slide graphics into our shared presentation deck. Please review slide 3 when you get a moment. The new metric cards highlight our 99.99% uptime and sub-45ms latency achievements.

Cheers,
Sophia`,
    date: 'Feb 19',
    folder: 'inbox',
    isRead: true,
    isStarred: true,
    labels: ['Keynote', 'Investor'],
  },
  {
    id: 'em-4',
    from: { name: 'Alex Rivera', email: 'alex.rivera@auraoffice.io' },
    to: ['board@apexlabs.org'],
    subject: 'Executive Summary: AuraOffice Public Launch Readiness',
    preview: 'Board members, AuraOffice has satisfied all functional, security, and performance criteria...',
    body: `Board members,

AuraOffice has satisfied all functional, security, and performance criteria for enterprise rollout. All ten applications are operational with comprehensive import/export workflows.

Best,
Alex Rivera`,
    date: 'Feb 18',
    folder: 'sent',
    isRead: true,
    isStarred: false,
    labels: ['Board'],
  }
];

export const SEED_FORMS: Record<string, AuraFormContent> = {
  'form-1': {
    id: 'form-1',
    title: 'Customer Experience & NPS Survey 2026',
    description: 'We are committed to delivering the ultimate productivity experience. Please share your candid impressions of AuraOffice.',
    theme: 'ocean',
    isPublished: true,
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'f-1',
        type: 'text',
        label: 'Full Name',
        placeholder: 'e.g. Jordan Miller',
        required: true,
      },
      {
        id: 'f-2',
        type: 'email',
        label: 'Work or School Email',
        placeholder: 'jordan@organization.edu',
        required: true,
      },
      {
        id: 'f-3',
        type: 'dropdown',
        label: 'Primary Application You Use Most',
        required: true,
        options: ['AuraWrite (Word Processing)', 'AuraSheets (Spreadsheets)', 'AuraSlides (Presentations)', 'AuraNotes (Notebooks)', 'AuraDrive (File Management)']
      },
      {
        id: 'f-4',
        type: 'rating',
        label: 'Overall Satisfaction Rating (1 to 5 stars)',
        required: true,
      },
      {
        id: 'f-5',
        type: 'textarea',
        label: 'What feature or improvement would make AuraOffice indispensable for you?',
        placeholder: 'Share your thoughts here...',
        required: false,
      }
    ],
    responses: [
      {
        id: 'resp-1',
        submittedAt: '2026-02-21T10:15:00Z',
        answers: {
          'f-1': 'Sarah Jenkins',
          'f-2': 's.jenkins@stanford.edu',
          'f-3': 'AuraSheets (Spreadsheets)',
          'f-4': 5,
          'f-5': 'The speed of formula calculations is amazing compared to web Excel. Would love more statistical chart presets!'
        }
      },
      {
        id: 'resp-2',
        submittedAt: '2026-02-21T14:40:00Z',
        answers: {
          'f-1': 'David Cho',
          'f-2': 'd.cho@technexus.io',
          'f-3': 'AuraWrite (Word Processing)',
          'f-4': 5,
          'f-5': 'The export to clean DOCX and PDF makes client proposals effortless.'
        }
      },
      {
        id: 'resp-3',
        submittedAt: '2026-02-22T09:20:00Z',
        answers: {
          'f-1': 'Elena Rostova',
          'f-2': 'elena@novadesign.co',
          'f-3': 'AuraSlides (Presentations)',
          'f-4': 4,
          'f-5': 'The slide presenter view and dark mode interface look super professional.'
        }
      }
    ]
  }
};

export const SEED_DESIGNS: Record<string, AuraDesignContent> = {
  'design-1': {
    id: 'design-1',
    title: 'Aura Tech Conference Poster',
    format: 'poster',
    width: 600,
    height: 800,
    background: '#0f172a',
    updatedAt: new Date().toISOString(),
    elements: [
      {
        id: 'del-1',
        type: 'shape',
        x: 40,
        y: 40,
        width: 520,
        height: 720,
        bgColor: '#1e1b4b',
        borderRadius: 16,
        shadow: true,
      },
      {
        id: 'del-2',
        type: 'text',
        x: 70,
        y: 80,
        width: 460,
        height: 60,
        text: 'AURA TECH SUMMIT 2026',
        fontSize: 32,
        color: '#ffffff',
      },
      {
        id: 'del-3',
        type: 'badge',
        x: 70,
        y: 160,
        width: 190,
        height: 36,
        bgColor: '#4f46e5',
        text: 'OCTOBER 15 • SAN FRANCISCO',
        fontSize: 12,
        color: '#ffffff',
        borderRadius: 18,
      },
      {
        id: 'del-4',
        type: 'text',
        x: 70,
        y: 220,
        width: 460,
        height: 120,
        text: 'The Future of Distributed Computing, Intelligent Document Engines & Enterprise Productivity.',
        fontSize: 18,
        color: '#cbd5e1',
      },
      {
        id: 'del-5',
        type: 'shape',
        x: 70,
        y: 380,
        width: 460,
        height: 200,
        bgColor: '#2e1065',
        borderRadius: 12,
      },
      {
        id: 'del-6',
        type: 'text',
        x: 90,
        y: 410,
        width: 420,
        height: 140,
        text: 'KEYNOTE SPEAKERS\n\n• Alex Rivera (AuraOffice Architect)\n• Dr. Evelyn Reed (Dean of Computing)\n• Industry Innovators & Research Leads',
        fontSize: 15,
        color: '#e2e8f0',
      }
    ]
  }
};

export const SEED_TEMPLATES: TemplateItem[] = [
  {
    id: 'tmpl-resume-1',
    title: 'Modern Professional Executive Resume',
    category: 'Resume',
    appType: 'write',
    description: 'Clean typographic layout with high-impact section headers for executive, engineering, and academic applicants.',
    icon: 'FileText',
    previewColor: '#4f46e5'
  },
  {
    id: 'tmpl-invoice-1',
    title: 'Commercial Client Invoice & Tax Table',
    category: 'Invoice',
    appType: 'sheets',
    description: 'Automated line-item calculation, subtotal formulas, sales tax multipliers, and payment wire instruction block.',
    icon: 'Receipt',
    previewColor: '#059669'
  },
  {
    id: 'tmpl-report-1',
    title: 'Formal Business & Technical Report',
    category: 'Report',
    appType: 'write',
    description: 'A4/Letter report format with executive abstract, numbered hierarchy, styled data tables, and conclusion.',
    icon: 'FileSpreadsheet',
    previewColor: '#2563eb'
  },
  {
    id: 'tmpl-proposal-1',
    title: 'Enterprise Project Proposal Blueprint',
    category: 'Proposal',
    appType: 'write',
    description: 'Persuasive client pitch structure outlining project problem, methodology, timeline, budget, and deliverables.',
    icon: 'Briefcase',
    previewColor: '#7c3aed'
  },
  {
    id: 'tmpl-pitch-1',
    title: 'Series A Venture Investor Pitch Deck',
    category: 'Presentation',
    appType: 'slides',
    description: '10-slide high impact presentation covering Problem, Market Size, Solution, Traction, Team, and Financials.',
    icon: 'Presentation',
    previewColor: '#d97706'
  },
  {
    id: 'tmpl-budget-1',
    title: 'Annual Departmental Operating Budget',
    category: 'Spreadsheet',
    appType: 'sheets',
    description: 'Multi-category expense tracking with monthly variance calculation, SUMIF allocations, and visual bar charts.',
    icon: 'Table',
    previewColor: '#10b981'
  },
  {
    id: 'tmpl-academic-1',
    title: 'Research Paper & Literature Review',
    category: 'Education',
    appType: 'write',
    description: 'Academic style paper with footnote architecture, abstract, bibliography styling, and two-column layout.',
    icon: 'GraduationCap',
    previewColor: '#0284c7'
  },
  {
    id: 'tmpl-cert-1',
    title: 'Distinguished Achievement Certificate',
    category: 'Design',
    appType: 'design',
    description: 'Elegant certificate border, seal emblem, and personalized recipient fields ready for vector print or PDF export.',
    icon: 'Award',
    previewColor: '#b45309'
  }
];

export const SEED_DATABASE_CONTENT: Record<string, AuraDatabaseContent> = {
  'db-1': {
    id: 'db-1',
    title: 'Enterprise Operations & Sales Database',
    description: 'Relational database containing Customers, Orders, Products, and inventory transactions.',
    activeTableId: 'tbl-customers',
    updatedAt: new Date().toISOString(),
    relationships: [
      {
        id: 'rel-1',
        name: 'Customer Orders',
        fromTableId: 'tbl-customers',
        fromColumnId: 'id',
        toTableId: 'tbl-orders',
        toColumnId: 'customerId',
        type: 'one-to-many',
      },
      {
        id: 'rel-2',
        name: 'Order Product',
        fromTableId: 'tbl-products',
        fromColumnId: 'id',
        toTableId: 'tbl-orders',
        toColumnId: 'productId',
        type: 'one-to-many',
      },
    ],
    queries: [
      {
        id: 'qry-1',
        name: 'Active Enterprise Customers',
        description: 'Lists all customers with Active status and Enterprise tier',
        sql: "SELECT company, contactName, email, country, annualRevenue FROM Customers WHERE status = 'Active' ORDER BY annualRevenue DESC",
      },
      {
        id: 'qry-2',
        name: 'High Value Completed Orders',
        description: 'Orders with total amount greater than or equal to $1,500 and status Completed',
        sql: "SELECT id, customerId, amount, paymentStatus, orderDate FROM Orders WHERE amount >= 1500 AND paymentStatus = 'Paid'",
      },
      {
        id: 'qry-3',
        name: 'Low Stock Inventory Alert',
        description: 'Products requiring immediate reorder (Stock <= 30 units)',
        sql: "SELECT name, category, unitPrice, stockLevel FROM Products WHERE stockLevel <= 30 ORDER BY stockLevel ASC",
      },
    ],
    tables: [
      {
        id: 'tbl-customers',
        name: 'Customers',
        description: 'Client organizations and account records',
        columns: [
          { id: 'id', name: 'Customer ID', type: 'text', primaryKey: true, required: true },
          { id: 'company', name: 'Company Name', type: 'text', required: true },
          { id: 'contactName', name: 'Primary Contact', type: 'text', required: true },
          { id: 'email', name: 'Work Email', type: 'email', required: true },
          { id: 'country', name: 'Region / Country', type: 'text' },
          { id: 'status', name: 'Status', type: 'select', options: ['Active', 'Onboarding', 'Pending', 'Inactive'] },
          { id: 'annualRevenue', name: 'Annual Value ($)', type: 'currency' },
          { id: 'isEnterprise', name: 'Enterprise Tier', type: 'boolean' },
        ],
        records: [
          { id: 'CUST-001', company: 'Acme Global Corp', contactName: 'Eleanor Vance', email: 'e.vance@acmeglobal.com', country: 'United States', status: 'Active', annualRevenue: 125000, isEnterprise: true },
          { id: 'CUST-002', company: 'Nordic Dynamic AB', contactName: 'Lars Lindqvist', email: 'lars@nordicdynamic.se', country: 'Sweden', status: 'Active', annualRevenue: 84000, isEnterprise: true },
          { id: 'CUST-003', company: 'Pacific Horizon Ltd', contactName: 'Mei-Ling Chen', email: 'ml.chen@horizonpac.sg', country: 'Singapore', status: 'Onboarding', annualRevenue: 56000, isEnterprise: false },
          { id: 'CUST-004', company: 'Vanguard Biometrics', contactName: 'Marcus Bennett', email: 'marcus@vanguardbio.com', country: 'United Kingdom', status: 'Active', annualRevenue: 195000, isEnterprise: true },
          { id: 'CUST-005', company: 'Solaris Cloud Labs', contactName: 'Sophia Alvarez', email: 'sophia@solariscloud.io', country: 'Spain', status: 'Pending', annualRevenue: 34000, isEnterprise: false },
          { id: 'CUST-006', company: 'Kyoto Quantum Systems', contactName: 'Kenji Takahashi', email: 'takahashi@kyotoquantum.jp', country: 'Japan', status: 'Active', annualRevenue: 240000, isEnterprise: true },
        ],
      },
      {
        id: 'tbl-orders',
        name: 'Orders',
        description: 'Customer purchase orders and fulfillment status',
        columns: [
          { id: 'id', name: 'Order ID', type: 'text', primaryKey: true, required: true },
          { id: 'customerId', name: 'Customer ID', type: 'text', required: true },
          { id: 'productId', name: 'Product ID', type: 'text', required: true },
          { id: 'orderDate', name: 'Order Date', type: 'date', required: true },
          { id: 'amount', name: 'Total Amount ($)', type: 'currency', required: true },
          { id: 'paymentStatus', name: 'Payment Status', type: 'select', options: ['Paid', 'Invoiced', 'Pending', 'Refunded'] },
          { id: 'fulfillment', name: 'Fulfillment', type: 'select', options: ['Shipped', 'Processing', 'Delivered', 'Cancelled'] },
        ],
        records: [
          { id: 'ORD-1092', customerId: 'CUST-001', productId: 'PRD-01', orderDate: '2026-02-18', amount: 1850, paymentStatus: 'Paid', fulfillment: 'Delivered' },
          { id: 'ORD-1093', customerId: 'CUST-002', productId: 'PRD-03', orderDate: '2026-02-19', amount: 3200, paymentStatus: 'Paid', fulfillment: 'Shipped' },
          { id: 'ORD-1094', customerId: 'CUST-003', productId: 'PRD-02', orderDate: '2026-02-20', amount: 750, paymentStatus: 'Invoiced', fulfillment: 'Processing' },
          { id: 'ORD-1095', customerId: 'CUST-004', productId: 'PRD-04', orderDate: '2026-02-21', amount: 4800, paymentStatus: 'Paid', fulfillment: 'Shipped' },
          { id: 'ORD-1096', customerId: 'CUST-006', productId: 'PRD-01', orderDate: '2026-02-22', amount: 2400, paymentStatus: 'Paid', fulfillment: 'Processing' },
          { id: 'ORD-1097', customerId: 'CUST-001', productId: 'PRD-05', orderDate: '2026-02-23', amount: 1150, paymentStatus: 'Pending', fulfillment: 'Processing' },
        ],
      },
      {
        id: 'tbl-products',
        name: 'Products',
        description: 'Catalog products, pricing tiers, and warehouse stock',
        columns: [
          { id: 'id', name: 'Product ID', type: 'text', primaryKey: true, required: true },
          { id: 'name', name: 'Product Name', type: 'text', required: true },
          { id: 'category', name: 'Category', type: 'select', options: ['Hardware', 'Software License', 'Cloud Storage', 'Consulting Service'] },
          { id: 'unitPrice', name: 'Unit Price ($)', type: 'currency', required: true },
          { id: 'stockLevel', name: 'Units In Stock', type: 'number', required: true },
          { id: 'isDiscontinued', name: 'Discontinued', type: 'boolean' },
        ],
        records: [
          { id: 'PRD-01', name: 'Aura Enterprise Server Rack 2U', category: 'Hardware', unitPrice: 1850, stockLevel: 18, isDiscontinued: false },
          { id: 'PRD-02', name: 'Aura Workspace Annual License', category: 'Software License', unitPrice: 250, stockLevel: 999, isDiscontinued: false },
          { id: 'PRD-03', name: 'Quantum Cryptographic HSM Module', category: 'Hardware', unitPrice: 3200, stockLevel: 24, isDiscontinued: false },
          { id: 'PRD-04', name: 'Dedicated Cloud VPC (50 TB Tier)', category: 'Cloud Storage', unitPrice: 1600, stockLevel: 85, isDiscontinued: false },
          { id: 'PRD-05', name: 'Architectural Implementation Sprint', category: 'Consulting Service', unitPrice: 1150, stockLevel: 12, isDiscontinued: false },
        ],
      },
    ],
  },
};
