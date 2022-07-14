import { Button, Interaction } from "eris"
const config = require("../../../config.json")

module.exports = {
  name: "interactionCreate",
  description: "Executa sempre que o evento interactionCreate é usado",
  async execute(interaction, bot) {

    const guild = bot.guilds.get('811194465993097246')
    const cansee = guild.roles.find(role => role.name === "〘⚔️〙Mod")
    const staffrole = guild.roles.find(role => role.name === "〘👑〙Hypers")
    const ticketopencategoryid = "927872297749061642"
    const channelPT = guild.channels.get("929022147991597116")

    if (interaction.data.custom_id != "finalPT" && interaction.channel.id != channelPT.id) {
      return;
    }
    else if (interaction.channel.id == channelPT.id) {

      const autor = interaction.member.user
      let avatarURL = `https://cdn.discordapp.com/avatars/${autor.id}/${autor.avatar}.webp?size=128`

      if (interaction.data.custom_id != "finalPT" && interaction.channel.id == channelPT.id) {

        console.log("\n\n\n PTPTPTPTPTPT \n\n\n")

        config.a = config.a + 1
        await interaction.acknowledge()

        const channel = await guild.createChannel(`Ticket: ${config.a}`, 0, { parentID: ticketopencategoryid });

        channel.editPermission(guild.id, 0, 1024, "role")
        channel.editPermission(autor.id, 2048, 0, "member")
        channel.editPermission(cansee.id, 1024, 0, "role")

        var temp = new Date();
        const dateStr = padStr(temp.getHours()) +
          (":") +
          padStr(temp.getMinutes());

        function padStr(i) {
          return (i < 10) ? "0" + i : "" + i;
        }

        const embedresponsePT = {
          color: 0x6666FF,
          title: interaction.data.custom_id,
          description: `${interaction.member.mention}, pedimos que esperes pela chegada de um staff`,
          thumbnail: {
            url: avatarURL
          },
          footer: {
            text: `Ticket aberto às ${dateStr}`,
          },
          author: {
            name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
            icon_url: avatarURL
          }
        }

        const rowresponsePT = {
          type: 1,
          content: "Primeira row de botões de resposta",
          components: [
            {
              type: 2,
              label: "Fechar Ticket",
              style: 4,
              emoji: {
                id: '927874512643555339',
                name: 'nao'
              },
              custom_id: "finalPT"
            }
          ]
        }

        bot.createMessage(channel.id, { content: `${cansee.mention}`, embeds: [embedresponsePT], components: [rowresponsePT] });
      }
    }
    else if (interaction.data.custom_id == "finalPT" && !interaction.member.roles.includes(cansee.id)) {
      interaction.createFollowup({ content: "Apenas um staff pode fechar o ticket. Pede a um staff que feche o ticket", flags: 64 });
    }
    else if (interaction.data.custom_id == "finalPT" && interaction.member.roles.includes(cansee.id)) {
      var temp = new Date();
      const dateStr = padStr(temp.getHours()) +
        (":") +
        padStr(temp.getMinutes());

      function padStr(i) {
        return (i < 10) ? "0" + i : "" + i;
      }

      const rowresponsePTdisabled = {
        type: 1,
        content: "Primeira row de botões desabilitados",
        components: [
          {
            type: 2,
            label: "Fechar Ticket",
            style: 4,
            emoji: {
              id: '927874512643555339',
              name: 'nao'
            },
            custom_id: "final",
            disabled: true
          }
        ]
      }

      const embedresponseFinal = {
        color: 0x6666FF,
        title: 'Ticket Fechado',
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/824221935507341363/948186290975834132/hype.png'
        },
        footer: {
          text: `Ticket Fechado às ${dateStr}`,
        },
        author: {
          name: `Hype Services/Community`,
          icon_url: 'https://cdn.discordapp.com/attachments/824221935507341363/948186290975834132/hype.png'
        }
      }

      await interaction.acknowledge()

      await interaction.channel.edit({ parentID: null })

      interaction.channel.editPermission(guild.id, 0, 1024, "role")
      interaction.channel.editPermission(staffrole.id, 1024, 2048, "role")
      interaction.channel.editPermission(cansee.id, 1024, 2048, "role")

      await interaction.channel.createMessage({ embeds: [embedresponseFinal] });

      interaction.editMessage(interaction.message.id, { components: [rowresponsePTdisabled], disabled: true })
    }
  }
}