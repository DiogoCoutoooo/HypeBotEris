import { ActionRow, Client, Message, } from "eris";

module.exports = {
  name: 'roles',
  description: "Este comando cria um reaction role!",
  async execute(msg: Message, bot) {

    const guild = bot.guilds.get('594204660814839838')
    const staffrole = guild.roles.find(role => role.name === "〘👑〙Hypers")
    const membro = guild.members.get(msg.author.id)

    if (!membro.roles.includes(staffrole.id)) {
      return;
    } else {
      msg.delete()

      const um = guild.roles.find(role => role.name === "Minecraft");
      const dois = guild.roles.find(role => role.name === "CS:GO");
      const três = guild.roles.find(role => role.name === "Fortnite");
      const quatro = guild.roles.find(role => role.name === "LoL");
      const cinco = guild.roles.find(role => role.name === "Rust");

      const rowch: ActionRow = {
        type: 1,
        components: [
          {
            type: 3,
            custom_id: "SelectMenu",
            options: [
              {
                label: "Minecraft",
                value: um.id,
                emoji: {
                  id: null,
                  name: '🍅'
                },
              },
              {
                label: "CS:GO",
                value: dois.id,
                emoji: {
                  id: null,
                  name: '🫐'
                },
              },
              {
                label: "Fortnite",
                value: três.id,
                emoji: {
                  id: null,
                  name: '🍋'
                },
              },
              {
                label: "LoL",
                value: quatro.id,
                emoji: {
                  id: '822891785062711336',
                  name: 'colour_pink'
                },
              },
              {
                label: "Rust",
                value: cinco.id,
                emoji: {
                  id: null,
                  name: '🌊'
                },
              },
            ],
            placeholder: "Nothing selected",
            min_values: 0,
            max_values: 5
          }
        ]
      }

      bot.createMessage("941055447983591454", { content: 'Reaction Roles!', components: [rowch] })
    }
  }
}