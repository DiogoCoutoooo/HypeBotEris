import { Embed } from "eris";

module.exports = {
    name: 'levels', 
    description: "Este comando mostra os roles da ladder!",
    execute(msg, bot) {
        msg.delete()

        const Begginer = msg.channel.guild.roles.find(role => role.name === "Begginer");
        const SkilledBegginer = msg.channel.guild.roles.find(role => role.name === "Skilled Begginer");
        const Warrior = msg.channel.guild.roles.find(role => role.name === "Warrior");
        const EliteWarrior = msg.channel.guild.roles.find(role => role.name === "Elite Warrior");
        const Mage = msg.channel.guild.roles.find(role => role.name === "Mage");
        const AdvancedMage = msg.channel.guild.roles.find(role => role.name === "Advanced Mage");
        const Witcher = msg.channel.guild.roles.find(role => role.name === "Witcher");
        const MysticWitcher = msg.channel.guild.roles.find(role => role.name === "Mystic Witcher");
        const Wizard = msg.channel.guild.roles.find(role => role.name === "Wizard");
        const ElementalWizard = msg.channel.guild.roles.find(role => role.name === "Elemental Wizard");
        const MagicalMaster = msg.channel.guild.roles.find(role => role.name === "Magical Master");
        const MagicalLegend = msg.channel.guild.roles.find(role => role.name === "Magical Legend");
        const DarkEnergyController = msg.channel.guild.roles.find(role => role.name === "Dark Energy Controller");
        const DarkSpirit = msg.channel.guild.roles.find(role => role.name === "Dark Spirit");
        const MultidimensionalSpirit = msg.channel.guild.roles.find(role => role.name === "Multidimensional Spirit");
        const Ghost = msg.channel.guild.roles.find(role => role.name === "Ghost");
        const Titan = msg.channel.guild.roles.find(role => role.name === "Titan");
        const UltraFighter = msg.channel.guild.roles.find(role => role.name === "Ultra Fighter");
        const GodOfPower = msg.channel.guild.roles.find(role => role.name === "God Of Power");
        const UniverseMonster = msg.channel.guild.roles.find(role => role.name === "Universe Monster");
        const HypeChampion = msg.channel.guild.roles.find(role => role.name === "Hype Champion");

        const lvls0: Embed = {
            title: 'Escalões do servidor',
            description: `Aqui podes verificar quanto xp é preciso para cada escalão, bem como os benifícios que cada um dá`,
            footer: {
                text: 'Parte 1/7'
            }
        }
    
        const lvls1: Embed = {
            color: 0xAC0000,
            description: `Estes são os primeiros ranks na Hype Dojo, onde vais começar a tua jornada no Dojo\n\n 100 Xp ➤ ${Begginer.mention}\n 200 Xp ➤ ${SkilledBegginer.mention}\n 500 Xp ➤ ${Warrior.mention}\n 1.000 Xp ➤ ${EliteWarrior.mention}`,
            footer: {
                text: 'Parte 2/7'
            }
        }

        const lvls2: Embed = {
            color: 0x00AC03,
            description: `Ao deixares de ser um aprendiz, dedicas-te ao estudo das Artes Marciais e ganhas algumas habilidades\n\n 2.500 Xp ➤ ${Mage.mention}\n 5.000 Xp ➤ ${AdvancedMage.mention}\n 10.000 Xp ➤ ${Witcher.mention}\n 20.000 Xp ➤ ${MysticWitcher.mention}`,
            footer: {
                text: 'Parte 3/7'
            }
        }

        const lvls3: Embed = {
            color: 0x0003AC,
            description: `O teu estudo e persistência levou-te a escalões mais altos, agora começas a dominar as Artes Marciais e a aprender as técnicas mais difíceis\n\n 35.000 Xp ➤ ${Wizard.mention}\n 60.000 Xp ➤ ${ElementalWizard.mention}\n 100.000 Xp ➤ ${MagicalMaster.mention}\n 175.000 Xp ➤ ${MagicalLegend.mention}`,
            footer: {
                text: 'Parte 4/7'
            }
        }

        const lvls4: Embed = {
            color: 0xffffff,
            description: `You indeed belong to the Power Elite, and now you are seeking for more Xp, as using the power of this dimension is not enough for you as before.\n\n 300.000 Xp ➤ ${DarkEnergyController.mention}\n 500.000 Xp ➤ ${DarkSpirit.mention}\n 700.000 Xp ➤ ${MultidimensionalSpirit.mention}`,
            footer: {
                text: 'Parte 5/7'
            }
        }

        const lvls5: Embed = {
            color: 0x00E2FF,
            description: `PÃO\n\n 1.000.000 Xp ➤ ${Ghost.mention}\n 1.500.000 Xp ➤ ${Titan.mention}\n 2.250.000 Xp ➤ ${UltraFighter.mention}`,
            footer: {
                text: 'Parte 6/7'
            }
        }

        const lvls6: Embed = {
            color: 0x7018D3,
            description: `PÃO\n\n 3.500.000 Xp ➤ ${GodOfPower.mention}\n 5.000.000 Xp ➤ ${UniverseMonster.mention}\n 10.000.000 Xp ➤ ${HypeChampion.mention}`,
            footer: {
                text: 'Parte 7/7'
            }
        }

        bot.createMessage(msg.channel.id, ({ embeds: [lvls0, lvls1, lvls2, lvls3, lvls4, lvls5, lvls6] }))

    }
}