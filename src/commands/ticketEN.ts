import { Button } from "eris";

module.exports = {
  name: "ticketEN",
  description: "Opens a ticket!",
  async execute(msg, bot) {

    const guild = bot.guilds.get('594204660814839838')
    const cansee = guild.roles.find(role => role.name === "〘⚔️〙Mod")
    const staffrole = guild.roles.find(role => role.name === "〘👑〙Hypers")
    const membro = guild.members.get(msg.author.id)
    const ticketopencategoryid = "927872297749061642"
    const channelEN = guild.channels.get("771844176828301332")

    if (!membro.roles.includes(staffrole.id)) {
      return;
    } else if (msg.channel.id == channelEN.id) {
      msg.delete()

      const one = 'Open Ticket |  [Comercial Department  <:money:928384247524380722> ]'
      const two = 'Open Ticket |  [Technical Department 💻 ]'
      const three = 'Open Ticket |  [Server Layout & Public Bots Configuration  <a:w_:928443226220789760> ]'
      const four = 'Open Ticket |  [Private Bots & Systems Codification  <:clyde:928402457455890485> ]'
      const five = 'Open Ticket |  [API/Framework with SourceCode  ⚙️ ]'
      const six = 'Open Ticket |  [Web & Database (No Free Hosting)  <a:rgear:928452093935775776> ]'
      const seven = 'Open Ticket |  [CS:GO/Minecraft/Rust/FiveM Configs  <:settings:928740481649754213> ]'
      const eight = 'Open Ticket |  [Plugins/Scripting/Extensions/Models/Map Design  <:puzzle:928741322087616623> ]'
      const nine = 'Open Ticket |  [Discord Support 💠 ]'
      const ten = 'Open Ticket |  [Other Matters 🎟️ ]'

      const embed = {
        color: 0x6666FF,
        title: 'Ticket System  <:programar:928380576497561712>',
        description: '**Assistence/Support/Reports/Informations/Purchases**\n*Choose the department in which we can help you:*\n\n          **Comercial Department ->  <:money:928384247524380722>**\n*Use this department to talk about a purchase or ask for more information about a product*\n\n          **Technical Department -> 💻**\n*Use this department to report situations you have with one of your products. Mostly used to solve technical problems*\n\n          **Server Layout & Public Bot Configuration -> <a:w_:928443226220789760>**\n*Descrição Dy*\n\n          **Private Bots & Systems Codification ->  <:clyde:928402457455890485>**\n*Descrição Dy*\n\n          **API/Framework with SourceCode -> ⚙️**\n*Descrição Dy*\n\n          **Web & Database (No Free Hosting) ->  <a:rgear:928452093935775776>**\n*Descrição Dy*\n\n          **CS:GO/Minecraft/Rust/FiveM Configs ->  <:settings:928740481649754213>**\n*Use this department to buy game server configurations and get essential information about the service or to request a change in our bases*\n\n          **Plugins/Scripting/Extensions/Models/Map Design ->  <:puzzle:928741322087616623>**\n*Descrição Dy*\n\n          **Discord Support -> 💠**\n*Use this department if you have any questions about how the systems work or want to report a user*\n\n          **Other Matters -> 🎟️**\n*Use this department to talk about something that the above departments do not cover*',
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/824221935507341363/948186290975834132/hype.png'
        },
        footer: {
          text: 'By Hype | Staff',
          icon_url: 'https://cdn.discordapp.com/attachments/824221935507341363/948186290975834132/hype.png'
        },
        author: {
          name: 'Hype Services/Comunity',
          icon_url: 'https://cdn.discordapp.com/emojis/928380371542900736.gif?size=48&quality=lossless'
        }
      }

      const row1EN = {
        type: 1,
        content: "First row of buttons",
        components: [
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: '928384247524380722',
              name: 'money'
            },
            custom_id: one
          },
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: null,
              name: '💻'
            },
            custom_id: two
          },
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: '928443226220789760',
              name: 'w_'
            },
            custom_id: three
          },
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: '928402457455890485',
              name: 'c_'
            },
            custom_id: four
          },
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: null,
              name: '⚙️'
            },
            custom_id: five
          }
        ]
      }

      const row2EN = {
        type: 1,
        content: "Second row of buttons",
        components: [
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: '928452093935775776',
              name: 'rgear',
              animated: true
            },
            custom_id: six
          },
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: '928740481649754213',
              name: 'settings'
            },
            custom_id: seven
          },
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: '928741322087616623',
              name: 'puzzle'
            },
            custom_id: eight
          },
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: null,
              name: '💠'
            },
            custom_id: nine
          },
          {
            type: 2,
            label: "Open",
            style: 1,
            emoji: {
              id: null,
              name: '🎟️'
            },
            custom_id: ten
          }
        ]
      }

      bot.createMessage(msg.channel.id, ({ embeds: [embed], components: [row1EN, row2EN] }))
    }
  }
}