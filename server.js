app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ reply: "Message vide !" });

  const apiKey = "AIzaSyAE_I9csyHDhhUtE9JYnCk5BcxXcUF6HRo";

  try {
    // ON PASSE DE v1beta à v1 ICI :
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
        return res.json({ reply: "Erreur technique Google, réessaie." });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "L'IA n'a pas pu répondre.";
    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Le serveur est fatigué, réessaie." });
  }
});
