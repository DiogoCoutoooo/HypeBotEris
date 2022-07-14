module.exports = {
    name: 'info', 
    description: "Este comando dá informações sobre o bot!",
    execute(msg, bot) {

        bot.createMessage(msg.channel.id, 'Sou um bot inútil');
        
    }
}