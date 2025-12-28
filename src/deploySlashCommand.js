const { REST, Routes, SlashCommandBuilder } = require("discord.js")
require("dotenv").config()

const appId = process.env.clientID
const appToken = process.env.appToken

const rest = new REST().setToken(appToken)

const slashRegister = async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(appId, process.env.guildID),
      {
        body: [
          new SlashCommandBuilder()
            .setName("ask-gemini")
            .setDescription("Ask Gemini something.")
            .addStringOption(option =>
              option
                .setName("query")
                .setDescription("The question you have")
                .setRequired(true)
            )
            .toJSON()
        ]
      }
    )
    console.log("Command registered")
  } catch (error) {
    console.error(error)
  }
}

slashRegister()
