export interface AIAssistParams {
  prompt: string;
  action?: string;
  context?: string;
  appType?: 'write' | 'sheets' | 'slides' | 'notes' | 'forms' | 'general';
}

export interface AIAssistResponse {
  result: string;
  note?: string;
  error?: string;
}

export async function requestAuraAI(params: AIAssistParams): Promise<AIAssistResponse> {
  try {
    const response = await fetch('/api/gemini/assist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      result: data.result || '',
      note: data.note,
    };
  } catch (error: any) {
    console.error('Aura AI request error:', error);
    return {
      result: '',
      error: error.message || 'Failed to connect to Aura AI. Please check server connectivity.',
    };
  }
}
