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
app.use(express.static(path.join(__dirname, "public")));

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ reply: "Message vide !" });

  const apiKey = "AIzaSyAE_I9csyHDhhUtE9JYnCk5BcxXcUF6HRo";

  try {
    // URL CORRIGÉE : Passage en v1 et modèle flash standard
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
        console.error("ERREUR GOOGLE:", JSON.stringify(data.error));
        return res.json({ reply: "Désolé, j'ai un petit souci technique. Réessaie ?" });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas pu générer de réponse.";
    res.json({ reply });

  } catch (err) {
    console.error("ERREUR SERVEUR:", err);
    res.json({ reply: "Connexion perdue avec le cerveau de l'IA." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur Gemini Stable prêt`));





