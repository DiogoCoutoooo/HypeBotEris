module.exports = {
  name: 'info',
  description: "Este comando dá informações sobre o bot!",
  async execute(interaction) {

    await interaction.acknowledge()

    if (interaction.data.custom_id == "SelectMenu") {

      const { data, member } = interaction

      const components = interaction.message.components[0].components[0]
      const removed = components.options.filter((option) => {
        return !data.values.includes(option.value)
      })

      for (const id of removed) {
        member.removeRole(id.value)
      }

      for (const id of data.values) {
        member.addRole(id)
      }

      interaction.createFollowup({ content: "Roles Updated!", flags: 64 }).catch(error => { console.error('Erro ao enviar mensagem efémera:', error) })

    }
  }
}