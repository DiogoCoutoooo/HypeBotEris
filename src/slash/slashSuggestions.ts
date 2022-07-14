module.exports = {
    name: 'suggestion', 
    description: "Este comando cria uma sugestão!",
    async execute (interaction) {

        const user = interaction.member.user

        let avatarURL = user.avatarURL

        const suggestionChannel = "811200276290732032"

        let messageArgs = interaction.data.options[0].value

        if (suggestionChannel != interaction.channel.id) {
            await interaction.acknowledge()
            interaction.createFollowup({ content: "You can only use this command on the <#863038456452481054>" })
        }

        else if (suggestionChannel == interaction.channel.id) {
            await interaction.acknowledge()

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

            const reply = await interaction.createFollowup({ embeds: [embed] })
            reply.addReaction(':sim:927874382670483516');
            reply.addReaction(':nao:927874512643555339');
        }
    }
}