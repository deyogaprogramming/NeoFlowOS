import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Ensure Gemini key is present server-side
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not set in the environment. AI generation will fail.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes placeholder
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/moodboard-analyses", (req, res) => {
    const analysis = req.body;
    console.log("Received moodboard analysis:", analysis.styleFingerprint);
    // In a real app, we would save this to a database
    res.status(201).json({ 
      message: "Analysis saved successfully", 
      id: analysis.id 
    });
  });

  // AI Routes
  const ai = new GoogleGenAI({ apiKey: geminiApiKey || "" });

  app.post("/api/caption", async (req, res) => {
    try {
      const { prompt } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
      });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Sinyal AI terganggu." });
    }
  });

  app.post("/api/moodboard", async (req, res) => {
    try {
      const { prompt, images } = req.body;
      
      const imageParts = images.map((img: string) => {
        const base64Data = img.split(',')[1];
        const mimeType = img.split(',')[0].split(':')[1].split(';')[0];
        return {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        };
      });

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: prompt }, ...imageParts] }
        ],
      });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Terjadi kesalahan saat menganalisis gambar." });
    }
  });

  app.post("/api/prompt-analysis", async (req, res) => {
    try {
      const { systemPrompt } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] }
        ],
      });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Gangguan pada neural engine." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
