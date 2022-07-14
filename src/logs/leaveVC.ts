import { Client, Member } from "eris"

module.exports = {
    name: 'leaveVC', 
    description: "Este comando dá informações sobre quando alguém sai de um vc!",
    execute(bot: Client, member: Member, oldChannel) {

        let embed = {
            author: {name: member.username+"#"+member.discriminator, icon_url: member.avatarURL },
            description: `<@${member.id}> saiu do canal de voz \`\`${oldChannel.name}\`\``,
            footer: { text: "Member ID: " + member.id },
            timestamp: new Date
          }

          bot.createMessage("944874431111634974", { embeds: [embed] })
    }
        
}