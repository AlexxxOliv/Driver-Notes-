// Clean up global __dirname injected by tsx that interferes with vite-plugin-pwa under Node 22
delete (globalThis as Record<string, unknown>).__dirname;
delete (global as Record<string, unknown>).__dirname;

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemInstruction, temperature = 0.7 } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Nenhuma mensagem foi fornecida.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor. Configure nos Segredos do AI Studio ou use sua chave no app.',
      });
    }

    // Format contents for @google/genai
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash'];
    let lastError: any = null;
    let replyText = '';

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: systemInstruction || undefined,
            temperature: typeof temperature === 'number' ? temperature : 0.7,
          },
        });
        replyText = response.text || '';
        lastError = null;
        break;
      } catch (err: any) {
        console.warn(`Tentativa com ${modelName} falhou:`, err?.message || err);
        lastError = err;
      }
    }

    if (lastError && !replyText) {
      throw lastError;
    }

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Erro na chamada Gemini:', error);
    return res.status(500).json({
      error: error?.message || 'Ocorreu um erro ao processar a resposta do Gemini.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
