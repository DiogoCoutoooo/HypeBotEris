import { Client, Message } from "eris"

module.exports = {
    name: 'deletedMessage', 
    description: "Este comando dá informações sobre quando alguém elimina uma mensagem!",
    execute(msg: Message, bot: Client) {

        if (msg.channel.id == "940688429388292096") return

        let embed = {
            author: {name: msg.author.username+"#"+msg.author.discriminator, icon_url: msg.author.avatarURL },
            description: `<@${msg.author.id}> deleted a message, that was in <#${msg.channel.id}>\n\nContent: ${msg.content}`,
            footer: { text: "Author ID: " + msg.author.id },
            timestamp: new Date
          }

          bot.createMessage("938183694236143656", { embeds: [embed] })
    }
        
}
