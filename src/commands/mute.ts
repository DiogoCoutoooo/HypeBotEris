module.exports = {
    name: 'mute',
    description: "Este comando dá mute a um utilizador!",
    async execute(msg, bot) {

        const guild = bot.guilds.get('594204660814839838')
        const membro = guild.members.get(msg.author.id)

        if (!membro.roles.includes("820698469362434119")) {
            return;
        } else if (membro.roles.includes("820698469362434119")) {

            let mensagem

            const user = msg.mentions[0]

            const cortar = `<${user}>`

            const moreArgs = msg.content.slice(cortar.length).split(/ +/)

            const finalArgs = moreArgs.join(' ')

            if (user == undefined) return bot.createMessage(msg.channel.id, 'That user is not in the server!')
            
            bot.editGuildMember("594204660814839838", `${user.id}`, { mute: true }, `${finalArgs}`).then( mensagem = await bot.createMessage(msg.channel.id, `${user.mention} was muted`))
            .catch(error => {
                console.error('Erro ao mutar utilizador', error)
            })

            setTimeout(() => { bot.deleteMessage(msg.channel.id, mensagem.id).catch(error => {
                console.error('Erro ao eliminar mensagem temporária:', error);
            }) }, 2000)

            let embed = {
                author: {name: user.username+"#"+user.discriminator, icon_url: user.avatarURL },
                description: `<@${user.id}> was muted. \nReason: ${finalArgs}`,
                footer: { text: "Muted Member ID: " + user.id },
                timestamp: new Date
            }

            bot.createMessage("942015231318700053", { embeds: [embed] })
        }
    }
}