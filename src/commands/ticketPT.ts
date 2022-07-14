import { Button } from "eris";

module.exports = {
  name: "ticketPT",
  description: "Abre um ticket!",
  async execute(msg, bot) {

    const guild = bot.guilds.get('594204660814839838')
    const cansee = guild.roles.find(role => role.name === "〘⚔️〙Mod")
    const staffrole = guild.roles.find(role => role.name === "〘👑〙Hypers")
    const membro = guild.members.get(msg.author.id)
    const ticketopencategoryid = "938178890868875345"
    const channelPT = guild.channels.get("927546371244970015")

    if (!membro.roles.includes(staffrole.id)) {
      return;
    } else if (msg.channel.id == channelPT.id) {
      msg.delete()

      const one = 'Ticket Aberto |  [Departamento Comercial  <:money:928384247524380722> ]'
      const two = 'Ticket Aberto |  [Departamento Técnico 💻 ]'
      const three = 'Ticket Aberto |  [Configuração De Bots Públicos & Layouts De Servidores  <a:w_:928443226220789760> ]'
      const four = 'Ticket Aberto |  [Codificação De Bots Privados Customizados/Sistemas  <:clyde:928402457455890485> ]'
      const five = 'Ticket Aberto |  [API/Framework com SourceCode  ⚙️ ]'
      const six = 'Ticket Aberto |  [Web & Base De Dados (Sem Free Hosting)  <a:rgear:928452093935775776> ]'
      const seven = 'Ticket Aberto |  [Configs CS:GO/Minecraft/Rust/FiveM  <:settings:928740481649754213> ]'
      const eight = 'Ticket Aberto |  [Plugins/Scripting/Extensões/Models/Map Design  <:puzzle:928741322087616623> ]'
      const nine = 'Ticket Aberto |  [Suporte Discord 💠 ]'
      const ten = 'Ticket Aberto |  [Outros Assuntos 🎟️ ]'

      const embed = {
        color: 0x6666FF,
        title: '▬▬▬▬▬▬  <:programar:928380576497561712>  Sistema de Tickets  <:programar:928380576497561712>  ▬▬▬▬▬▬',
        description: '**Assistência/Suporte/Reports/Informações/Compras**\n*Escolhe o departamento na área em que te podemos ajudar:*\n\n          **Departamento Comercial <a:arrowglow:948193618575884339>  <:money:928384247524380722>**\n*Usa este departamento para falar acerca de alguma compra ou pedir mais informações sobre um produto*\n\n          **Departamento Técnico -> 💻**\n*Usa este departamento para reportar situações que tenhas com algum dos teus produtos. Maioritariamente usado para resolver problemas técnicos*\n\n          **Configuração De Bots Públicos & Layouts De Servidores -> <a:w_:928443226220789760>**\n*Descrição Dy*\n\n          **Codificação De Bots Privados Customizados/Sistemas ->  <:clyde:928402457455890485>**\n*Descrição Dy*\n\n          **API/Framework com SourceCode ->  <a:rgear:928452093935775776>**\n*Descrição Dy*\n\n          **Web & Base De Dados (Sem Free Hosting) ->  asdasdsaddsasdasdasdsdadsasd**\n*Descrição Dy*\n\n          **Configs CS:GO/Minecraft/Rust/FiveM ->  <:settings:928740481649754213>**\n*Usa este departamento para comprares configurações de servidores de jogo e conseguires informações essenciais sobre o serviço ou para pedires uma alteração nas nossas bases*\n\n          **Plugins/Scripting/Extensões/Models/Map Design ->  <:puzzle:928741322087616623>**\n*Descrição Dy*\n\n          **Suporte Discord -> 💠**\n*Usa este departamento caso tenhas alguma dúvida sobre como funcionam os sistemas ou queiras reportar um usuário*\n\n          **Outros Assuntos -> 🎟️**\n*Usa este departamento para falar de algo que os departamentos acima não englobem*',
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

      const row1PT = {
        type: 1,
        content: "Primeira row de botões",
        components: [
          {
            type: 2,
            label: "Abrir",
            style: 1,
            emoji: {
              id: '928384247524380722',
              name: 'money'
            },
            custom_id: one
          },
          {
            type: 2,
            label: "Abrir",
            style: 1,
            emoji: {
              id: null,
              name: '💻'
            },
            custom_id: two
          },
          {
            type: 2,
            label: "Abrir",
            style: 1,
            emoji: {
              id: '928443226220789760',
              name: 'w_'
            },
            custom_id: three
          },
          {
            type: 2,
            label: "Abrir",
            style: 1,
            emoji: {
              id: '928402457455890485',
              name: 'c_'
            },
            custom_id: four
          },
          {
            type: 2,
            label: "Abrir",
            style: 1,
            emoji: {
              id: "928452093935775776",
              name: 'rgear',
              aniamted: true
            },
            custom_id: five
          }
        ]
      }

      const row2PT = {
        type: 1,
        content: "Segunda row de botões",
        components: [
          {
            type: 2,
            label: "Abrir",
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
            label: "Abrir",
            style: 1,
            emoji: {
              id: '928740481649754213',
              name: 'settings'
            },
            custom_id: seven
          },
          {
            type: 2,
            label: "Abrir",
            style: 1,
            emoji: {
              id: '928741322087616623',
              name: 'puzzle'
            },
            custom_id: eight
          },
          {
            type: 2,
            label: "Abrir",
            style: 1,
            emoji: {
              id: null,
              name: '💠'
            },
            custom_id: nine
          },
          {
            type: 2,
            label: "Abrir",
            style: 1,
            emoji: {
              id: null,
              name: '🎟️'
            },
            custom_id: ten
          }
        ]
      }

      bot.createMessage(msg.channel.id, ({ embeds: [embed], components: [row1PT, row2PT] }))
    }
  }
}