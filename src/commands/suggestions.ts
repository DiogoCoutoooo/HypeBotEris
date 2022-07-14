module.exports = {
    name: 'suggestion', 
    description: "Este comando cria uma sugestão!",
    async execute (msg, bot, args) {

        const user = msg.member.user

        const av = {
            size: 256,
            x: 385,
            y: 35
        }

        let avatarURL = user.avatarURL

        const suggestionChannel = "863038456452481054"

        let messageArgs = args.join(' ')

        if (suggestionChannel != msg.channel.id) {
            bot.createMessage(msg.channel.id, ({ content: "You can only use this command on the <#863038456452481054>" }))
        }

        else if (suggestionChannel == msg.channel.id) {
            msg.delete()

            const embed = {
                color: 0x6666FF,
                author: {
                    name: 'Sugestão',
                    icon_url: 'https://cdn.discordapp.com/emojis/928380371542900736.gif?size=48&quality=lossless'
                },
                thumbnail: {
                    url: avatarURL
                },
                description: `**Autor**\n${user.username}\n\n   **Suggestion**\n${messageArgs}`,
                footer: {
                    text: 'By Hype | Staff',
                    icon_url: 'https://cdn.discordapp.com/attachments/824221935507341363/948186290975834132/hype.png'
                }
            }

            console.log(embed)

            const reply = await bot.createMessage(msg.channel.id, ({ embeds: [embed] }))
            console.log(reply)
            reply.addReaction(':sim:927874382670483516');
            reply.addReaction(':nao:927874512643555339');
        }
    }
}