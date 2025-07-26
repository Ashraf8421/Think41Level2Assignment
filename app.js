if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const User = require("./models/user.js");
const session = require("./models/session.js");
const message = require("./models/message.js");
const message = require("./models/message.js");

app.set(express.urlencoded({ extended: true }));
app.set(express.json());

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
}

app.post("/users", async (req, res) => {
  let user = new user(req.body);
  let newUser = await user.save();

  res.send(newUser);
  console.log(newUser);
});

app.post("/messages", (req, res) => {
  let message = new message(req.body);
  let newMessage = message.save();

  res.send(newMessage);
  console.log(newMessage);
});

app.post("/sessions", (req, res) => {
  let session = new session(req.body);
  let newSession = session.save();
  res.send(newSession);
  console.log(newSession);
});

app.get("/users/:userId/sessions", async (req, res) => {
  const sessions = await Session.find({ userId: req.params.userId });
  res.send(sessions);
});

app.get("/sessions/:sessionId/messages", async (req, res) => {
  const messages = await Message.find({ sessionId: req.params.sessionId }).sort(
    { timestamp: 1 }
  );
  res.send(messages);
});

const generateAIResponse = async (userMessage) => {
  if (userMessage.toLowerCase().includes("orders for july")) {
    const orders = await db.orders.find({ date: /2025-07/ });
    const summary = `You had ${orders.length} orders in July.`;
    return summary;
  }

  const res = await axios.post(
    process.env.Groq_Api,
    {
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that asks clarifying questions before answering. Only give a final answer if you’re confident.",
        },
        { role: "user", content: userMessage },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
};

app.post("/chat", async (req, res) => {
  const { message, conversation_id, user_id } = req.body;

  if (!message || !user_id) {
    return res.status(400).json({ error: "Message and user_id are required." });
  }

  let sessionId = conversation_id;

 
  if (!sessionId) {
    const newSession = new Session({
      userId: new mongoose.Types.ObjectId(user_id),
      sessionName: `Chat - ${new Date().toISOString()}`,
    });
    await newSession.save();
    sessionId = newSession._id;
  }

  // Save user's message
  const userMsg = new Message({
    sessionId,
    sender: "user",
    message,
    timestamp: new Date(),
  });
  await userMsg.save();

  // Generate AI response
  const aiReply = await generateAIResponse(message);

  // Save AI's response
  const aiMsg = new Message({
    sessionId,
    sender: "ai",
    message: aiReply,
    timestamp: new Date(),
  });
  await aiMsg.save();

  res.json({
    session_id: sessionId,
    user_message: userMsg,
    ai_response: aiMsg,
  });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
