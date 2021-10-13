const token = "2002317302:AAF-1xqBqMrhFRZkDhJFY38M8DqWZe1YHjM";

// Express.js + Slimbot
const express = require("express");
const app = express();

const Slimbot = require("slimbot");
const slimbot = new Slimbot(token);

slimbot.on("message", (message) => {
  console.log("here");
  if (message.text === "/login") {
    let optionalParams = {
      parse_mode: "Markdown",
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: "Login",
              login_url: {
                url: "http://50be-2409-4050-2d35-2cde-604e-d2cc-6900-53dd.ngrok.io/login",
              },
            },
          ],
        ],
      }),
    };

    slimbot.sendMessage(
      message.chat.id,
      "Click this button to login!",
      optionalParams
    );
  } else if (message.text === "/start") {
    slimbot.sendMessage(
      message.chat.id,
      "Click /login or type it into the chat to begin login!"
    );
  }
});

slimbot.startPolling(() => {
  console.log("started");
});
app.get("/login", (req, res) => {
  console.log(req.query);
});

app.listen(9999, () => {
  console.log("Server started on port 9999");
});
