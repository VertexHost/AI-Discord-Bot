require("../src/errorHandler")
const { Client, EmbedBuilder, GatewayIntentBits,MessageFlags , Events } = require("discord.js")
const { GoogleGenAI  } = require("@google/genai")

require("dotenv").config()
const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildPresences,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildVoiceStates,
        ],
      });



      client.on(Events.ClientReady, async (client) => {
        console.log(`${client.user.username} is ready`)
        require("../src/deploySlashCommand")
      })

      
const ai = new GoogleGenAI({
     apiKey: process.env.GeminiApiKey
});


      client.on(Events.InteractionCreate, async (interaction) => {
        if(!interaction.isCommand()) return

        if(interaction.commandName === "ask-gemini") {
            const query = interaction.options.getString("query")

            console.log(query)


async function response() {
   await interaction.deferReply({ })
  const prompt = query;

 const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt}`,
  });

  console.log(response.text);

  const embed = new EmbedBuilder()
  .setColor("Blue")
  .setTitle("Gemini AI")
  .setDescription(`\`\`\`${response.text}\`\`\``)
  .setFooter({text: 'Response'})
  .setTimestamp()
  
  await interaction.editReply({embeds: [embed]})
  

}
        response()
        }

      })


      client.login(process.env.appToken)