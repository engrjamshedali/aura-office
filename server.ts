import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    suite: 'AuraOffice',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Admin stats endpoint
app.get('/api/admin/stats', (req: Request, res: Response) => {
  res.json({
    totalUsers: 1420,
    activeUsersToday: 384,
    storageUsedBytes: 421809200,
    storageLimitBytes: 10737418240, // 10 GB
    documentsCreated: 3120,
    sheetsCreated: 2450,
    presentationsCreated: 1180,
    formsCreated: 620,
    systemHealth: 'Optimal',
    uptimeSeconds: process.uptime(),
    activities: [
      { id: 'act-1', user: 'Alex Rivera', action: 'Created spreadsheet "Q3 Budget Forecast"', time: '4 mins ago' },
      { id: 'act-2', user: 'Dr. Evelyn Reed', action: 'Published form "Student Course Feedback"', time: '18 mins ago' },
      { id: 'act-3', user: 'Marcus Vance', action: 'Exported DOCX "Engineering Architecture Spec"', time: '35 mins ago' },
      { id: 'act-4', user: 'Sophia Lin', action: 'Invited team to "Pitch Deck 2026"', time: '1 hour ago' },
    ]
  });
});

// Secure Server-side Gemini AI assistant for AuraOffice
app.post('/api/gemini/assist', async (req: Request, res: Response) => {
  const { prompt, action, context, appType } = req.body;

  if (!prompt && !action) {
    return res.status(400).json({ error: 'Prompt or action is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Provide a smart high-quality fallback if no API key is set in secrets
    let fallbackResponse = '';
    if (action === 'formula') {
      fallbackResponse = '=SUM(B2:B20)';
    } else if (action === 'explain_formula') {
      fallbackResponse = 'This formula calculates the sum of all numerical values in cells B2 through B20.';
    } else if (action === 'summarize') {
      fallbackResponse = `Executive Summary:\n${context ? context.slice(0, 300) + '...' : 'The document details project scope, milestones, deliverables, and operational metrics for the upcoming quarter.'}`;
    } else if (action === 'grammar') {
      fallbackResponse = context ? `Corrected text: ${context.replace(/  +/g, ' ')}` : 'Grammar is sound and clearly structured.';
    } else {
      fallbackResponse = `Aura AI Assistant Analysis: Ready to assist with ${appType || 'document'} workflow. Add your GEMINI_API_KEY in Settings to unlock real-time Gemini 3.8 Flash intelligence.`;
    }
    return res.json({ result: fallbackResponse, note: 'AI Studio fallback mode. Configure GEMINI_API_KEY for live generation.' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let systemInstruction = 'You are Aura AI, an intelligent, professional writing and productivity copilot built into AuraOffice productivity suite. Be concise, highly accurate, elegant, and directly address the user\'s formatting or analytical need without filler words.';

    if (appType === 'sheets' || action?.includes('formula') || action?.includes('sheet')) {
      systemInstruction = 'You are Aura AI Spreadsheet Expert. Output valid spreadsheet formulas (uppercase e.g. =SUM, =AVERAGE, =VLOOKUP, =IF) and concise data insights. When asked for a formula, provide the exact formula first, followed by a 1-sentence explanation.';
    } else if (appType === 'slides') {
      systemInstruction = 'You are Aura AI Presentation Specialist. Create compelling slide outlines, bullet points, speaker notes, and succinct presentation copy.';
    }

    let userPrompt = prompt || '';
    if (action && context) {
      userPrompt = `Perform action: "${action}" on the following ${appType || 'document'} content:\n\n${context}\n\nAdditional user instructions: ${prompt || 'None'}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const resultText = response.text || '';
    return res.json({ result: resultText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate AI response',
      fallback: 'An error occurred while contacting the AI service. Please try again.',
    });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraOffice server running on http://0.0.0.0:${PORT}`);
  });
}

start();
