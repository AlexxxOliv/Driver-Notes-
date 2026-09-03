import { GoogleGenAI } from '@google/genai';
import { ChatMessage, AppConfig } from '../types';

export async function sendChatMessage(
  messages: ChatMessage[],
  config: AppConfig
): Promise<string> {
  const formattedMessages = messages.map((m) => ({
    role: m.role,
    text: m.text,
  }));

  // If user provided a client-side API key for GitHub Pages static hosting
  if (config.customApiKey && config.customApiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({
        apiKey: config.customApiKey.trim(),
      });

      const contents = formattedMessages.map((m) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash'];
      let lastErr: any = null;
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: config.systemInstruction || undefined,
              temperature: config.temperature,
            },
          });
          if (response.text) return response.text;
        } catch (e: any) {
          lastErr = e;
        }
      }
      if (lastErr) throw lastErr;
      return 'Sem resposta do modelo.';
    } catch (err: any) {
      throw new Error(`Erro com sua chave Gemini: ${err?.message || 'Falha na requisição'}`);
    }
  }

  // Otherwise, default to full-stack server endpoint /api/chat
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
        systemInstruction: config.systemInstruction,
        temperature: config.temperature,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }

    // If 404 or backend unavailable (e.g. deployed on static GitHub Pages)
    if (res.status === 404) {
      throw new Error(
        'Servidor backend não encontrado (modo GitHub Pages estático). Abra as "Configurações" (⚙️) no topo e insira sua chave da API do Gemini gratuita para funcionar no GitHub Pages.'
      );
    }

    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Erro do servidor (${res.status})`);
  } catch (error: any) {
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error(
        'Não foi possível conectar ao servidor. No GitHub Pages (hospedagem estática), vá nas Configurações (⚙️) e adicione sua chave de API do Gemini.'
      );
    }
    throw error;
  }
}
