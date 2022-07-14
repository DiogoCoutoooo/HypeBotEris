import { Client, Message } from 'eris';
import testSchema from '../database/test-schema';

module.exports = {
    name: 'userinfo', 
    description: "Este comando dá informações sobre um utilizador!",
    async execute(msg: Message, bot: Client) {

        const user = msg.mentions[0] || msg.member.user

        console.log(user)

        let avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=128`

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
        
        bot.createMessage(msg.channel.id, ({ embeds: [embed] }))
    }
}