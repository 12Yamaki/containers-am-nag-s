
import express from "express";

const app = express();
app.use(express.json());

// 🔑 clé IA (sécurisée via Render)
const HF_TOKEN = process.env.HF_TOKEN;

// 🤖 IA
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message vide" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: userMessage
        })
      }
    );

    const data = await response.json();

    let reply = "Erreur IA";

    if (data?.[0]?.generated_text) {
      reply = data[0].generated_text;
    } 
    else if (data?.error) {
      reply = "Erreur API : " + data.error;
    }

    res.json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Erreur serveur 😢" });
  }
});

// 🌐 Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});





