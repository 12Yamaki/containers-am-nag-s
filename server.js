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

  // CETTE LIGNE VA LIRE TA CLÉ SUR RENDER DIRECTEMENT
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    
    // Si Google renvoie une erreur, on l'affiche dans les logs Render
    if (data.error) {
        console.error("Erreur Google API:", data.error);
        return res.status(500).json({ reply: "Erreur de clé API Google." });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "L'IA est indisponible.";
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
