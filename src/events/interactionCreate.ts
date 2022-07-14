module.exports = {
    name: "interactionCreate",
    description: "Executa sempre que o evento interactionCreate é usado",
    execute(interaction) {
        console.log(interaction.channel.id)
        if (interaction.channel.id) return
    }
}