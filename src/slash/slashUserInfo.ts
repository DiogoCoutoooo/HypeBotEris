import { Client } from 'eris';
import testSchema from '../database/test-schema';

module.exports = {
    name: 'userinfo', 
    description: "Este comando dá informações sobre um utilizador!",
    async execute(interaction, bot: Client) {
        await interaction.acknowledge()

        const guild = bot.guilds.get('594204660814839838')
        const user = guild.members.get(interaction.data.options[0].value)

        let avatarURL = `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.webp?size=128`

        const result = await testSchema.findOne({
            memberId: user.id
        })

        const embed = {
            color: 0x6666FF,
            author: {
                name: user.username,
                icon_url: avatarURL
            },
            fields: [
                {
                    name: 'Invites',
                    value: `${result.invNumber}`,
                },
                {
                    name: 'Hype Coins',
                    value: `${result.coins}`,
                },
                {
                    name: 'Hype XP',
                    value: `${result.realxp}`,
                },
                {
                    name: 'Rank',
                    value: `:/`,
                }
            ]
        }
        
        interaction.createFollowup({ embeds: [embed] })
    }
}