import mongoose, { mongo } from 'mongoose';
import testSchema from '../database/test-schema';

module.exports = {
    name: 'invite', 
    description: "Este comando rastreia quem deu invite a quem!",
    async execute (message) {

        const result = await testSchema.find()

        let user = message.author;
        let invites = await message.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id)

        if (userInv.size <= 0) {
            return message.channels.send(`${user} doesn't have any invites`)
        }
        let i = 0;
        userInv.forEach(inv => i += inv.uses)

        message.channel.send(`${user} has ${i} invites`)

    }
}