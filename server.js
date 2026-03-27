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

  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // Changement ici : on utilise gemini-1.5-flash-latest
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
        console.error("Erreur détaillée Google API:", JSON.stringify(data.error, null, 2));
        return res.status(500).json({ reply: "L'IA a un petit souci technique, réessaie." });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "L'IA n'a pas pu répondre.";
    res.json({ reply });
  } catch (err) {
    console.error("Erreur Serveur:", err);
    res.status(500).json({ reply: "Erreur connexion serveur." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur IA prêt sur le port ${PORT}`));
