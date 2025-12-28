
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { EmbedBuilder, WebhookClient } = require("discord.js");
const util = require("util");


const webhookURL = process.env.WebhookURL

if (!webhookURL) {
  console.error("Missing webhook URL. Set `WebhookURL` (or `WEBHOOK_URL`) in your .env");
  process.exit(1);
}


const webhook = new WebhookClient({ url: webhookURL });


function serializeError(err) {
  if (err instanceof Error) return err.stack || err.toString();
  if (typeof err === "string") return err;
  try {
    return util.inspect(err, { depth: 5, maxArrayLength: null });
  } catch (e) {
    return String(err);
  }
}


function truncate(s, max = 3900) {
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 3) + "..." : s;
}

async function sendEmbed(errorText) {
  try {
    const embed = new EmbedBuilder()
      .setTitle("Bot Error")
      .setDescription("```js\n" + truncate(errorText, 3900) + "\n```")
      .setColor(0xff0000)
      .setFooter({ text: "Occurred" }) 
      .setTimestamp();

    await webhook.send({ embeds: [embed] });
  } catch (err) {
    console.error("Failed to send embed:", err);
  }
}


function handleAndExit(text) {

  sendEmbed(text)
    .catch((e) => console.error("sendEmbed failed:", e))
    .finally(() => {
  
      setTimeout(() => process.exit(1), 2000);
    });
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "Reason:", reason);
  const text = `Unhandled Rejection:\n${serializeError(reason)}\nPromise: ${util.inspect(promise)}`;
  handleAndExit(text);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  const text = `Uncaught Exception:\n${serializeError(err)}`;
  handleAndExit(text);
});


process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.error("Uncaught Exception Monitor:", err, "Origin:", origin);
  sendEmbed(`Uncaught Exception Monitor:\n${serializeError(err)}\nOrigin: ${origin}`);
});
