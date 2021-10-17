const express = require("express");
let ejs = require("ejs");
const path = require("path");
const db = require("./customdb");
const socketIO = require("socket.io");
const session = require("express-session");

const app = express();

app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");

//HTTP
const http = require("http");
const server = http.createServer(app);
const port = 80;

app.get("/", async (req, res) => {
  var d = await db.getRecord();
  //var data = await cursor(`select * from data;`);
  res.render("index", { data: d });
});

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("test", (data) => {
    io.emit("data", data);
  });
  socket.on("clear", (data) => {});
});

server.listen(process.env.PORT || port, (res) => {
  console.log("Running");
});

const token =
  process.env.BOT_TOKEN ||
  "none";

console.log(token);
if (token != "none") {
  const { RTMClient } = require("@slack/rtm-api");
  const rtm = new RTMClient(token);
  rtm.start().catch(console.error);

  rtm.on("message", (event) => {
    if (!event) return;
    if (!event.text) return;
    var message = event.text;
    if (message.indexOf("has been listed") == -1) return;
    var name = message.substring(
      message.indexOf("|") + 1,
      message.indexOf(">")
    );
    var s = message.split("<")[2];
    var exc = s.substring(s.indexOf("|") + 1, s.lastIndexOf(">"));
    var link = s.substring(s.indexOf("|"), 0);
    console.log("1: " + name, "\n2:", exc, "\n3:", link);
    var date_time = new Date().getTime();
    toSend = {
      name: name,
      date_time: date_time,
      exc: exc,
      link: link,
    };
    io.emit("data", toSend);
    db.createNewRecord({ name, date_time, exc, link });
  });
}
