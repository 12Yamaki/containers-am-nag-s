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

// Route pour vérifier que le serveur répond (Tape ton-url.com/ping dans ton navigateur)
app.get("/ping", (req, res) => res.send("Serveur OK"));

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ reply: "Message vide !" });

  // On utilise la clé en dur pour être SÛR à 100% qu'elle est lue
  const apiKey = "AIzaSyAE_I9csyHDhhUtE9JYnCk5BcxXcUF6HRo";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    
    // Log précis pour voir l'erreur dans Render
    if (data.error) {
        console.error("ERREUR GOOGLE:", JSON.stringify(data.error));
        return res.json({ reply: "Erreur Google : " + data.error.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "L'IA n'a pas pu répondre.";
    res.json({ reply });

  } catch (err) {
    console.error("ERREUR SERVEUR:", err);
    res.json({ reply: "Le serveur est fatigué, réessaie dans 2 secondes." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur prêt sur le port ${PORT}`));
