module.exports = {
    name: "slashCommandCreator",
    description: "Creates the application slash commands!",
    execute(bot) {
        console.log('√ Slash Commands were successfully registered!')
        const guild = bot.guilds.get('811194465993097246')

        bot.createGuildCommand(guild.id, {
            name: "rules",
            description: "The server rules",
            type: 1,   
        }).catch(error => console.error(error))

        bot.createGuildCommand(guild.id, {
            name: "weather",
            description: "The specified location's weather",
            type: 1,
            options: [
                {
                    name: "place",
                    description: "The place you wanna check the weather",
                    type: 3,
                    required: true
                },
                {
                    name: "units",
                    description: "The units you want the temperature to be in",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "ºC (metric)",
                            value: "metric"
                        },
                        {
                            name: "ºF (imperial)",
                            value: "imperial"
                        }
                    ]
                }
            ],   
        }).catch(error => console.error(error))

        bot.createGuildCommand(guild.id, {
            name: "userinfo",
            description: "The specified user's info",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user's info you wanna see",
                    type: 6,
                    required: true
                },
            ],   
        }).catch(error => console.error(error))

        bot.createGuildCommand(guild.id, {
            name: "suggest",
            description: "The suggestions slash command",
            type: 1,
            options: [
                {
                    name: "text",
                    description: "What you wanna suggest",
                    type: 3,
                    required: true
                },
            ],   
        }).catch(error => console.error(error))
    }
}