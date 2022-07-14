import { Client, Embed, Message } from "eris";

module.exports = {
    name: 'incomes',
    description: "Este comando mostra os incomes por role!",
    execute(msg: Message, bot: Client) {
        msg.delete()

        const guild = bot.guilds.get('594204660814839838')

        const Begginer = guild.roles.find(role => role.name === "Begginer");
        const EliteWarrior = guild.roles.find(role => role.name === "Elite Warrior");
        const Mage = guild.roles.find(role => role.name === "Mage");
        const MysticWitcher = guild.roles.find(role => role.name === "Mystic Witcher");
        const Wizard = guild.roles.find(role => role.name === "Wizard");
        const MagicalLegend = guild.roles.find(role => role.name === "Magical Legend");
        const DarkEnergyController = guild.roles.find(role => role.name === "Dark Energy Controller");
        const MultidimensionalSpirit = guild.roles.find(role => role.name === "Multidimensional Spirit");
        const Ghost = guild.roles.find(role => role.name === "Ghost");
        const UltraFighter = guild.roles.find(role => role.name === "Ultra Fighter");
        const GodOfPower = guild.roles.find(role => role.name === "God Of Power");
        const HypeChampion = guild.roles.find(role => role.name === "Hype Champion");

        const lvls0: Embed = {
            title: 'Escalões do servidor',
            description: `Aqui podes verificar quantos coins é que ganhas diariamente, dependendo do teu escalão`,
            footer: {
                text: 'Parte 1/7'
            }
        }

        const lvls1: Embed = {
            color: 0xAC0000,
            description: `De ${Begginer.mention} até ${EliteWarrior.mention} ➤ 250 coins por dia`,
            footer: {
                text: 'Parte 2/7'
            }
        }

        const lvls2: Embed = {
            color: 0x00AC03,
            description: `De ${Mage.mention} até ${MysticWitcher.mention} ➤ 750 coins por dia`,
            footer: {
                text: 'Parte 3/7'
            }
        }

        const lvls3: Embed = {
            color: 0x0003AC,
            description: `De ${Wizard.mention} até ${MagicalLegend.mention} ➤ 2.000 coins por dia`,
            footer: {
                text: 'Parte 4/7'
            }
        }

        const lvls4: Embed = {
            color: 0xffffff,
            description: `De ${DarkEnergyController.mention} até ${MultidimensionalSpirit.mention} ➤ 5.000 coins por dia`,
            footer: {
                text: 'Parte 5/7'
            }
        }

        const lvls5: Embed = {
            color: 0x00E2FF,
            description: `De ${Ghost.mention} até ${UltraFighter.mention} ➤ 15.000 coins por dia`,
            footer: {
                text: 'Parte 6/7'
            }
        }

        const lvls6: Embed = {
            color: 0x7018D3,
            description: `De ${GodOfPower.mention} até ${HypeChampion.mention} ➤ 50.000 coins por dia`,
            footer: {
                text: 'Parte 7/7'
            }
        }

        bot.createMessage(msg.channel.id, ({ embeds: [lvls0, lvls1, lvls2, lvls3, lvls4, lvls5, lvls6] }))

    }
}