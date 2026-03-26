import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 1️⃣ Servir tous les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, "public")));

// 2️⃣ Route IA pour ton chat IA
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ reply: "Message vide !" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Pas de réponse.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Erreur serveur IA." });
  }
});

// 3️⃣ Toujours renvoyer index.html pour toutes les autres routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur IA lancé sur le port ${PORT}`));
