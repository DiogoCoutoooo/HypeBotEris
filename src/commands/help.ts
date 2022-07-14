import { Client, Embed, Message } from "eris";

module.exports = {
    name: 'help', 
    description: "Este comando dá informações os comandos que o bot executa!",
    execute(msg: Message, bot: Client) {

        const embed: Embed = {
            color: 0x6666FF,
            title: 'Help Command  <:programar:928380576497561712>',
            description: 'Here you can see all the available commands for our server',
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
            },
            fields: [
                { 
                    name: `**>suggest <Text>**\n`,
                    value: `Makes a suggestion`,
                    inline:true
                },
                { 
                    name: `**>userinfo <@User>**\n`,
                    value: `Gives info about a specific user`,
                    inline:true
                },
                {
                    name: `**>weather <Location> <Units>**`,
                    value: `Gives the weather of a specific country. \nUnits are either metric or imperial`,
                    inline:true
                }
            ]
        }

        bot.createMessage(msg.channel.id, ({ embeds: [embed] }))
    }
}