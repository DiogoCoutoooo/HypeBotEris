import { Interaction } from 'eris'
import fetch from 'node-fetch'

module.exports = {
    name: 'weather',
    description: "Este comando mostra o tempo na localização especificada!",
    async execute(interaction) {
        await interaction.acknowledge()

        console.log(interaction.data.options)
        console.log("\n\n\n")
        console.log(interaction.data.options[0].value)
        console.log("\n\n\n")
        console.log(interaction.data.options[1].value)

        const place = interaction.data.options[0].value
        const value = interaction.data.options[1].value

        if (value[1] == "metric") {
            const medida = "ºC"
        }
        if (value[1] == "imperial") {
            const medida = "ºF"
        }

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=${value}&appid=96f8afb0b26fe4a724fda9e90ff21986`

        console.log(url)

        fetch(url)
            .then(function (serverPromise) {
                serverPromise.json()
                    .then(function (api) {
                        console.log(api)
                        if (JSON.stringify(api) == '{"cod":"404","message":"city not found"}') {
                            interaction.createFollowup("Sorry, i couldn't find that country/city :(")
                        }
                        else {
                            let clock = api.dt + api.timezone

                            function timeConverterMetric(UNIX_timestamp) {
                                var a = new Date(clock * 1000);
                                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                var year = a.getFullYear();
                                var month = months[a.getMonth()];
                                var date = a.getDate();
                                var hour = a.getHours();
                                var min = a.getMinutes();
                                var sec = a.getSeconds();
                                let horas = hour.toString();
                                let minutos = min.toString();
                                let segundos = sec.toString()
                                if (hour < 10) { horas = "0" + horas };
                                if (min < 10) { minutos = "0" + minutos };
                                if (sec < 10) { segundos = "0" + segundos }
                                var time = date + '/' + month + '/' + year + ', ' + horas + ':' + minutos + ':' + segundos;
                                return time;
                            }

                            function timeConverterImperial(UNIX_timestamp) {
                                var a = new Date(clock * 1000);
                                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                var year = a.getFullYear();
                                var month = months[a.getMonth()];
                                var date = a.getDate();
                                var hour = a.getHours();
                                var min = a.getMinutes();
                                var sec = a.getSeconds()
                                let horas = hour.toString();
                                let minutos = min.toString();
                                let segundos = sec.toString()
                                if (hour < 10) { horas = "0" + horas };
                                if (min < 10) { minutos = "0" + minutos };
                                if (sec < 10) { segundos = "0" + segundos }
                                var time = month + '/' + date + '/' + year + ',  ' + horas + ':' + minutos + ':' + segundos;
                                return time;
                            }

                            let visibilidadeMetric = api.visibility / 1000
                            let visibilidadeImperial = api.visibility * 0.000621

                            if (value == "metric") {
                                const weatherEmbed = {
                                    color: 0x6666FF,
                                    thumbnail: {
                                        url: `https://openweathermap.org/img/wn/${api.weather[0].icon}@4x.png`
                                    },
                                    title: `Weather in ${place}`,
                                    description: `**${api.weather[0].main}** with **${api.main.humidity}%** humidity`,
                                    footer: {
                                        name: 'By Hype | Staff',
                                        icon_url: 'https://cdn.discordapp.com/attachments/824221935507341363/948186290975834132/hype.png'
                                    },
                                    fields: [
                                        {
                                            name: `**🌡️  Temp:**\n`,
                                            value: `**${api.main.temp} ºC**`,
                                            inline: true
                                        },
                                        {
                                            name: "⠀",
                                            value: "⠀",
                                            inline: true
                                        },
                                        {
                                            name: `**🤷‍♂️  Feel:**\n`,
                                            value: `**${api.main.feels_like} ºC**`,
                                            inline: true
                                        },
                                        {
                                            name: `**⬇️  ⬆️  Min/Max:**\n`,
                                            value: `${api.main.temp_min} ºC/${api.main.temp_max} ºC`,
                                            inline: true
                                        },
                                        {
                                            name: "⠀",
                                            value: "⠀",
                                            inline: true
                                        },
                                        {
                                            name: `**💨  Wind Speed**\n`,
                                            value: `${api.wind.speed} m/s`,
                                            inline: true
                                        },
                                        {
                                            name: `**👀  Visibility:**\n`,
                                            value: `${visibilidadeMetric} km`,
                                            inline: true
                                        },
                                        {
                                            name: "⠀",
                                            value: "⠀",
                                            inline: true
                                        },
                                        {
                                            name: `**🕒  Date/Time**\n`,
                                            value: `${timeConverterMetric(0)}`,
                                            inline: true
                                        }
                                    ]
                                }

                                interaction.createFollowup({ embeds: [weatherEmbed] })
                            }
                            if (value == "imperial") {
                                const weatherEmbed = {
                                    color: 0x6666FF,
                                    thumbnail: {
                                        url: `https://openweathermap.org/img/wn/${api.weather[0].icon}@4x.png`
                                    },
                                    title: `Weather in ${place}`,
                                    description: `**${api.weather[0].main}** with **${api.main.humidity}%** humidity`,
                                    footer: {
                                        name: 'By Hype | Staff',
                                        icon_url: 'https://cdn.discordapp.com/attachments/824221935507341363/948186290975834132/hype.png'
                                    },
                                    fields: [
                                        {
                                            name: `**🌡️  Temp:**\n`,
                                            value: `**${api.main.temp} ºF**`,
                                            inline: true
                                        },
                                        {
                                            name: "⠀",
                                            value: "⠀",
                                            inline: true
                                        },
                                        {
                                            name: `**🤷‍♂️  Feel:**\n`,
                                            value: `**${api.main.feels_like} ºF**`,
                                            inline: true
                                        },
                                        {
                                            name: `**⬇️  ⬆️  Min/Max:**\n`,
                                            value: `${api.main.temp_min} ºF/${api.main.temp_max} ºF`,
                                            inline: true
                                        },
                                        {
                                            name: "⠀",
                                            value: "⠀",
                                            inline: true
                                        },
                                        {
                                            name: `**💨  Wind Speed**\n`,
                                            value: `${api.wind.speed} mph`,
                                            inline: true
                                        },
                                        {
                                            name: `**👀  Visibility:**\n`,
                                            value: `${visibilidadeImperial} mi`,
                                            inline: true
                                        },
                                        {
                                            name: "⠀",
                                            value: "⠀",
                                            inline: true
                                        },
                                        {
                                            name: `**🕒  Date/Time**\n`,
                                            value: `${timeConverterImperial(0)}`,
                                            inline: true
                                        }
                                    ]
                                }

                                interaction.createFollowup({ embeds: [weatherEmbed] })
                            }
                        }
                    })
            })
    }
}