import { Client, Member } from "eris"

module.exports = {
    name: 'switchVC', 
    description: "Este comando dá informações sobre quando alguém muda de vc!",
    execute(bot: Client, member: Member, newChannel, oldChannel) {

        let embed = {
            author: {name: member.username+"#"+member.discriminator, icon_url: member.avatarURL },
            description: `<@${member.id}> mudou de canal de voz \`\`${oldChannel.name} -> ${newChannel.name}\`\``,
            footer: { text: "Member ID: " + member.id },
            timestamp: new Date
          }

          bot.createMessage("944874431111634974", { embeds: [embed] })
    }
        
}