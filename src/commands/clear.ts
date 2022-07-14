import { Client } from "eris";

module.exports = {
    name: 'clear', 
    description: "Este comando apaga as mensagens!",
    async execute(msg, bot: Client, args) {

        const guild = bot.guilds.get('594204660814839838')

        const staffrole = guild.roles.find(role => role.name === "〘👑〙Hypers")
        const staffid = staffrole.id
        const membro = guild.members.get(msg.author.id)

        if(!args[0]) return bot.createMessage(msg.channel.id, ("Por favor diz-me o número de mensagens que queres eliminar!"))
        if(isNaN((args[0]))) return bot.createMessage(msg.channel.id, ("Por favor usa apenas números!"))


        if(parseInt(args[0]) < 1) return bot.createMessage(msg.channel.id, ("Tens de eliminar pelo menos uma mensagem!"))
        
        if (!membro.roles.includes(staffid)) return bot.createMessage(msg.channel.id, ("Não tens permissão para executar este comando!"))
            msg.channel.purge(parseInt(args[0]) + 1).then(async (msgs) => {
            const deletar = await msg.channel.createMessage(`Foram eliminadas ${msgs} mensagens`)

            setTimeout(() => { bot.deleteMessage(msg.channel.id, deletar.id)
            .catch(error => {
                console.error('Erro ao eliminar mensagem temporária:', error);
            }) }, 2000)
        })
    }
}