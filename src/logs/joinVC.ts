import { Client, Member } from "eris"

module.exports = {
    name: 'joinVC', 
    description: "Este comando dá informações sobre quando alguém entra num vc!",
    execute(bot: Client, member: Member, newChannel) {

        let embed = {
            author: {name: member.username+"#"+member.discriminator, icon_url: member.avatarURL },
            description: `<@${member.id}> entrou no canal de voz \`\`${newChannel.name}\`\``,
            footer: { text: "Member ID: " + member.id },
            timestamp: new Date
          }

          bot.createMessage("944874431111634974", { embeds: [embed] })
    }
        
}