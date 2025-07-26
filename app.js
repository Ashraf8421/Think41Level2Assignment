const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const User = require("./models/user.js");
const session = require("./models/session.js");
const message = require("./models/message.js");
const message = require("./models/message.js");


app.set(express.urlencoded({extended: true}));
app.set(express.json());

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
}


app.post("/users", async(req,res)=>{

    let user = new user(req.body);
    let newUser =  await user.save();

    res.send(newUser);
    console.log(newUser);
})

app.post("/messages",(req,res)=>{
    let message = new message(req.body);
    let newMessage = message.save();

    res.send(newMessage);
    console.log(newMessage);
})

app.post("/sessions",(req,res)=>{
    let session  = new session(req.body);
    let newSession = session.save();
    res.send(newSession);
    console.log(newSession);
})

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







app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
