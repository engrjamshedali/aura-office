import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  ListTodo, 
  Heading1, 
  Heading2, 
  Heading3, 
  Table as TableIcon, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Minus, 
  Undo, 
  Redo, 
  Search, 
  Download, 
  Upload, 
  FileText, 
  Maximize2, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  FileCode, 
  Check, 
  X,
  History,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { AuraDocContent, DocComment } from '../../types/office';
import { AuraStorageService } from '../../services/storage';

interface AuraWriteEditorProps {
  doc: AuraDocContent;
  onSave: (doc: AuraDocContent) => void;
  onOpenAI: (selectedText?: string) => void;
}

export function AuraWriteEditor({
  doc,
  onSave,
  onOpenAI,
}: AuraWriteEditorProps) {
  const [content, setContent] = useState(doc.htmlContent);
  const [pageSize, setPageSize] = useState<'Letter' | 'A4' | 'Legal'>(doc.pageSize || 'Letter');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(doc.orientation || 'portrait');
  const [headerText, setHeaderText] = useState(doc.headerText || '');
  const [footerText, setFooterText] = useState(doc.footerText || '');
  const [includePageNumbers, setIncludePageNumbers] = useState(doc.includePageNumbers ?? true);
  
  // Find & Replace
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  // Comments
  const [comments, setComments] = useState<DocComment[]>(doc.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedQuote, setSelectedQuote] = useState('');

  // Outline / Table of Contents Drawer
  const [showOutline, setShowOutline] = useState(false);
  const [outlineItems, setOutlineItems] = useState<{ id: string; text: string; level: number }[]>([]);

  // Version history modal
  const [showHistory, setShowHistory] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  // Keep state synced if external doc changes
  useEffect(() => {
    setContent(doc.htmlContent);
    setPageSize(doc.pageSize || 'Letter');
    setOrientation(doc.orientation || 'portrait');
    setHeaderText(doc.headerText || '');
    setFooterText(doc.footerText || '');
    setComments(doc.comments || []);
  }, [doc.id]);

  // Extract outline headings from HTML content
  useEffect(() => {
    if (!editorRef.current) return;
    const headings = editorRef.current.querySelectorAll('h1, h2, h3');
    const items: { id: string; text: string; level: number }[] = [];
    headings.forEach((h, idx) => {
      const level = parseInt(h.tagName.substring(1), 10);
      const text = h.textContent || `Heading ${idx + 1}`;
      if (!h.id) h.id = `heading-${idx}`;
      items.push({ id: h.id, text, level });
    });
    setOutlineItems(items);
  }, [content]);

  // Calculate statistics (Word count, char count, reading time)
  const stats = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readingTimeMinutes };
  }, [content]);

  // Auto-save on content changes (debounced 1 sec)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({
        ...doc,
        htmlContent: content,
        pageSize,
        orientation,
        headerText,
        footerText,
        includePageNumbers,
        comments,
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [content, pageSize, orientation, headerText, footerText, includePageNumbers, comments]);

  // Formatting commands
  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertHeading = (tag: 'h1' | 'h2' | 'h3' | 'p') => {
    document.execCommand('formatBlock', false, tag === 'p' ? '<p>' : `<${tag}>`);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table border="1" style="border-collapse: collapse; width: 100%; margin: 16px 0; border-color: #cbd5e1;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Header 1</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Header 2</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Data 1</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Data 2</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Data 3</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Data 4</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Data 5</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">Data 6</td>
          </tr>
        </tbody>
      </table><p><br></p>
    `;
    document.execCommand('insertHTML', false, tableHtml);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const insertImage = () => {
    const url = prompt('Enter Image URL:', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80');
    if (url) {
      document.execCommand('insertImage', false, url);
      if (editorRef.current) setContent(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
      if (editorRef.current) setContent(editorRef.current.innerHTML);
    }
  };

  const handleFindReplace = () => {
    if (!findText || !editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const regex = new RegExp(findText, 'gi');
    const matches = html.match(regex);
    setMatchCount(matches ? matches.length : 0);

    if (replaceText !== '') {
      const updated = html.replace(regex, replaceText);
      editorRef.current.innerHTML = updated;
      setContent(updated);
    }
  };

  // Add comment on selected text
  const handleAddComment = () => {
    const selection = window.getSelection();
    const selText = selection ? selection.toString() : '';
    setSelectedQuote(selText);
    setShowComments(true);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const comment: DocComment = {
      id: `c-${Date.now()}`,
      author: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      text: newCommentText.trim(),
      selectedText: selectedQuote,
      createdAt: 'Just now',
      resolved: false,
    };
    setComments([...comments, comment]);
    setNewCommentText('');
    setSelectedQuote('');
  };

  // Import file handler
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (file.name.endsWith('.md')) {
        // Simple markdown to HTML conversion
        const converted = text
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
          .replace(/\*(.*)\*/gim, '<em>$1</em>')
          .replace(/\n\n/gim, '</p><p>')
          .replace(/\n/gim, '<br>');
        setContent(`<p>${converted}</p>`);
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        setContent(text);
      } else {
        // TXT or other
        setContent(`<p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`);
      }
    };
    reader.readAsText(file);
  };

  // Export actions
  const exportDocx = () => {
    AuraStorageService.exportDocAsDocx({ ...doc, htmlContent: content });
  };

  const exportPdf = () => {
    AuraStorageService.exportAsPdfPrint();
  };

  const exportMarkdown = () => {
    const temp = document.createElement('div');
    temp.innerHTML = content;
    const text = temp.innerText || '';
    AuraStorageService.downloadFile(`${doc.title || 'Document'}.md`, text, 'text/markdown');
  };

  const exportHtml = () => {
    AuraStorageService.downloadFile(`${doc.title || 'Document'}.html`, content, 'text/html');
  };

  const exportTxt = () => {
    const temp = document.createElement('div');
    temp.innerHTML = content;
    AuraStorageService.downloadFile(`${doc.title || 'Document'}.txt`, temp.innerText, 'text/plain');
  };

  // Page dimension calculations
  const getPageStyle = () => {
    let width = '816px'; // Letter portrait standard
    let minHeight = '1056px';

    if (pageSize === 'A4') {
      width = orientation === 'portrait' ? '794px' : '1123px';
      minHeight = orientation === 'portrait' ? '1123px' : '794px';
    } else if (pageSize === 'Legal') {
      width = orientation === 'portrait' ? '816px' : '1344px';
      minHeight = orientation === 'portrait' ? '1344px' : '816px';
    } else {
      // Letter
      width = orientation === 'portrait' ? '816px' : '1056px';
      minHeight = orientation === 'portrait' ? '1056px' : '816px';
    }

    return { width, minHeight };
  };

  const pageStyle = getPageStyle();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/70 dark:bg-slate-950 overflow-hidden select-none">
      {/* 1. Main Document Ribbon / Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0 z-20">
        <div className="flex items-center flex-wrap gap-1">
          {/* History / Undo / Redo */}
          <button onClick={() => exec('undo')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Undo">
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('redo')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Redo">
            <Redo className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Heading Dropdown */}
          <select
            onChange={(e) => insertHeading(e.target.value as any)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
            defaultValue="p"
          >
            <option value="p">Normal text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          {/* Font styling: Bold, Italic, Underline, Strikethrough */}
          <button onClick={() => exec('bold')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold" title="Bold (Ctrl+B)">
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('italic')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Italic (Ctrl+I)">
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('underline')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Underline (Ctrl+U)">
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('strikeThrough')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Strikethrough">
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Text Color Picker */}
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-slate-400 font-bold">A</label>
            <input
              type="color"
              onChange={(e) => exec('foreColor', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
              title="Text Color"
              defaultValue="#0f172a"
            />
            <label className="text-[10px] text-amber-500 font-bold ml-1">Highlight</label>
            <input
              type="color"
              onChange={(e) => exec('hiliteColor', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
              title="Highlight Color"
              defaultValue="#fef08a"
            />
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Alignments */}
          <button onClick={() => exec('justifyLeft')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Align Left">
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('justifyCenter')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Align Center">
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('justifyRight')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Align Right">
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('justifyFull')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Justify">
            <AlignJustify className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Lists */}
          <button onClick={() => exec('insertUnorderedList')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Bulleted List">
            <List className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('insertOrderedList')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Numbered List">
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Inserts: Table, Image, Link, Horizontal Line */}
          <button onClick={insertTable} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Insert Table">
            <TableIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={insertImage} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Insert Image">
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={insertLink} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Insert Link">
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => exec('insertHorizontalRule')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Insert Divider Line">
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right side options: Find, Outline, Comments, Page setup, Export */}
        <div className="flex items-center gap-1.5">
          {/* Find & Replace toggle */}
          <button
            onClick={() => setShowFindReplace(!showFindReplace)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              showFindReplace ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Find & Replace"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Outline toggle */}
          <button
            onClick={() => setShowOutline(!showOutline)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              showOutline ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Document Outline"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Outline</span>
          </button>

          {/* Add Comment on selection */}
          <button
            onClick={handleAddComment}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1"
            title="Add Comment on selected text"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Comment</span>
          </button>

          {/* Ask AI about this document */}
          <button
            onClick={() => onOpenAI(content)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 text-xs font-semibold"
            title="Aura AI Writing Assistant"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Polish</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Page setup dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200">
              <span>{pageSize}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1.5 z-50 text-xs">
              <div className="font-semibold text-slate-400 px-2 py-1 text-[10px] uppercase">Page Size</div>
              {(['Letter', 'A4', 'Legal'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`w-full text-left px-2 py-1 rounded text-xs ${pageSize === size ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {size}
                </button>
              ))}
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
              <div className="font-semibold text-slate-400 px-2 py-1 text-[10px] uppercase">Orientation</div>
              {(['portrait', 'landscape'] as const).map((orient) => (
                <button
                  key={orient}
                  onClick={() => setOrientation(orient)}
                  className={`w-full text-left px-2 py-1 rounded capitalize text-xs ${orientation === orient ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {orient}
                </button>
              ))}
            </div>
          </div>

          {/* Import / Export Menu */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1.5 z-50 text-xs">
              <button onClick={exportDocx} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Microsoft Word (.docx)</span>
                <FileText className="w-3.5 h-3.5 text-blue-500" />
              </button>
              <button onClick={exportPdf} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>PDF Document (.pdf)</span>
                <FileCheck className="w-3.5 h-3.5 text-red-500" />
              </button>
              <button onClick={exportMarkdown} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Markdown (.md)</span>
                <FileCode className="w-3.5 h-3.5 text-purple-500" />
              </button>
              <button onClick={exportHtml} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>HTML Webpage (.html)</span>
                <FileCode className="w-3.5 h-3.5 text-emerald-500" />
              </button>
              <button onClick={exportTxt} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Plain Text (.txt)</span>
                <FileText className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
              <label className="w-full cursor-pointer text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Import File (MD/TXT/HTML)</span>
                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                <input type="file" accept=".md,.txt,.html,.htm" onChange={handleImportFile} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Find & Replace Bar (Collapsible) */}
      {showFindReplace && (
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-2 text-xs animate-in slide-in-from-top-2 duration-150">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Find text..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          />
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          />
          <button
            onClick={handleFindReplace}
            className="px-2.5 py-1 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Find / Replace
          </button>
          {matchCount > 0 && (
            <span className="text-slate-500 font-mono text-[11px]">
              {matchCount} match{matchCount > 1 ? 'es' : ''}
            </span>
          )}
          <button onClick={() => setShowFindReplace(false)} className="ml-auto text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Canvas Scroll Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Outline Drawer */}
        {showOutline && (
          <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto space-y-3 z-10 shrink-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Document Outline
              </h4>
              <button onClick={() => setShowOutline(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {outlineItems.length > 0 ? (
              <div className="space-y-1">
                {outlineItems.map((item, i) => (
                  <a
                    key={i}
                    href={`#${item.id}`}
                    className={`block text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 truncate hover:underline ${
                      item.level === 1 ? 'font-bold' : item.level === 2 ? 'pl-3 font-medium' : 'pl-6 text-[11px]'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Add headings (H1, H2, H3) to populate the outline.</p>
            )}
          </div>
        )}

        {/* Center: Printable / Realistic Document Page */}
        <div className="flex-1 overflow-y-auto py-8 px-4 flex justify-center bg-slate-100/70 dark:bg-slate-950">
          <div
            id="printable-document"
            style={{
              width: pageStyle.width,
              minHeight: pageStyle.minHeight,
            }}
            className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-sm p-12 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-all"
          >
            {/* Document Header */}
            {headerText && (
              <div className="text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 mb-6 flex justify-between select-none">
                <span>{headerText}</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            )}

            {/* Editable Content Canvas */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: content }}
              className="flex-1 outline-none prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                minHeight: '600px',
              }}
            />

            {/* Document Footer */}
            {(footerText || includePageNumbers) && (
              <div className="text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 mt-8 flex justify-between select-none">
                <span>{footerText}</span>
                {includePageNumbers && <span>Page 1 of 1</span>}
              </div>
            )}
          </div>
        </div>

        {/* Right: Comments Drawer */}
        {showComments && (
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col z-10 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Comments ({comments.length})
              </h4>
              <button onClick={() => setShowComments(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Comment list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.author}</span>
                    <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                  </div>
                  {c.selectedText && (
                    <div className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-[11px] italic border-l-2 border-amber-400">
                      "{c.selectedText}"
                    </div>
                  )}
                  <p className="text-slate-700 dark:text-slate-300">{c.text}</p>
                </div>
              ))}
            </div>

            {/* New Comment Input */}
            <form onSubmit={submitComment} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {selectedQuote && (
                <div className="text-[11px] text-slate-500 italic truncate">
                  Commenting on: "{selectedQuote}"
                </div>
              )}
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 3. Bottom Status Bar */}
      <div className="h-7 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span>{stats.words} words</span>
          <span>•</span>
          <span>{stats.chars} characters</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {stats.readingTimeMinutes} min read
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>{pageSize} ({orientation})</span>
          <span>•</span>
          <span className="font-medium text-indigo-600 dark:text-indigo-400">100% Zoom</span>
        </div>
      </div>
    </div>
  );
}
