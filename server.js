import express from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Serve the static files in the current directory (like index.html)
app.use(express.static("."));

// Parse raw SDP payloads posted from the browser
app.use(express.text({ type: ["application/sdp", "text/plain"] }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const sessionConfig = JSON.stringify({
  type: "realtime",
  model: "gpt-realtime-2",
  audio: { output: { voice: "marin" } },
});

// An endpoint which creates a Realtime API session.
app.post("/session", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing in .env");
    return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });
  }

  const fd = new FormData();
  fd.set("sdp", req.body);
  fd.set("session", sessionConfig);

  try {
    const r = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: fd,
    });
    
    if (!r.ok) {
        const errText = await r.text();
        console.error("OpenAI API error:", errText);
        return res.status(r.status).send(`OpenAI API error: ${errText}`);
    }
    
    // Send back the SDP we received from the OpenAI REST API
    const sdp = await r.text();
    res.send(sdp);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
