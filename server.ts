import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Gemini chat endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, language = 'en', context = '' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'API key not configured on server',
        fallback: true,
      });
    }

    const systemInstruction = `You are "AI Sahayak", an official-grade, citizen-centric assistance AI for the MP Online (Madhya Pradesh) public service portal.
Your mission: Help rural, student, farmer, and everyday citizens access public services easily.
Guidelines:
1. Speak simply and clearly. If user asks in Hindi, reply in simple conversational Hindi (Devanagari). If user asks in Hinglish, reply warmly in Hinglish/Hindi. If in English, reply in plain, friendly English.
2. Be direct and helpful. Never invent official rules, eligibility, fee amounts, or restoration dates. If reliable info isn't available, say: "I could not verify this information from the available official data. Please check the official service information."
3. Guide users step by step: Required documents, basic eligibility, next actions.
4. Keep answers concise (max 3-4 bullet points or short paragraphs). Do not use bureaucratic jargon.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: context ? `Context: ${context}\n\nUser Question (${language}): ${prompt}` : prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error?.message || 'Server error',
      fallback: true,
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
