import mongoose from 'mongoose';
import testSchema from '../database/test-schema';
import countSchema from '../database/count-schema';
import { token, mongo_uri } from '../../config.json';
import 'dotenv/config'
import { Interaction } from 'eris';

const fs = require('fs')
const GIFEncoder = require('gifencoder');
const Canvas = require('canvas');
Canvas.registerFont('OriginTech.ttf', { family: 'Origin Tech' })
const welcomeChannelId = "927506127258804225"

const Eris = require("eris");

const prefix = '>'

const infoCommand = require('../commands/info')
const helpCommand = require('../commands/help')
const incomesCommand = require('../commands/incomes')
const levelsCommand = require('../commands/levels')
const suggestionsCommand = require('../commands/suggestions')
const userinfoCommand = require('../commands/userinfo')
const clearCommand = require('../commands/clear')
const weatherCommand = require('../commands/weather')
const ticketENCommand = require('../commands/ticketEN')
const ticketPTCommand = require('../commands/ticketPT')
const rulesCommand = require('../commands/rules')
const rolesCommand = require('../commands/roles')
const banLogAndCommand = require('../commands/ban')
const muteLogAndCommand = require('../commands/mute')
const joinVCLog = require('../logs/joinVC')
const switchVCLog = require('../logs/switchVC')
const leaveVCLog = require('../logs/leaveVC')
const deletedMessageLog = require('../logs/deletedMessage')
/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/
/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/
const slashCommandCreator = require('./slashCommandCreator')
const slashRules = require('../slash/slashRules')
const slashWeather = require('../slash/slashWeather')
const slashUserInfo = require('../slash/slashUserInfo')
const slashSuggestions = require('../slash/slashSuggestions')
/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/
/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/
const interactionCreateEvent = require('../events/interactionCreate')
const subticketPT = require('../events/subevents/subticketPT')
const subticketEN = require('../events/subevents/subticketEN')
const subroles = require('../events/subevents/subroles')
/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/
/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/
const bot = new Eris(
    token,
    {
        restTimeOffset: 0,

        intents: [
            'guilds',
            'guildMessages',
            'guildMessagesReaction',
            'guildMembers',
            'guildInvites',
            'guildVoiceStates',
            'guildBans'
        ],

        partials: [
            "message",
            "channel",
            "reaction",
            "voiceMuteMembers",
            "useApplicationCommands",
            "useSlashCommands"
        ]
    },
    {
        owner: 'Not_Hagrid'
    }
);

let Invites = new Map()
let inviter

bot.on("ready", async () => {
    const guild = bot.guilds.get('811194465993097246')
    console.log(`√ ${bot.user.username} #${bot.user.discriminator} is online!`)
    await mongoose.connect(mongo_uri || '', { keepAlive: true })
        .then(() => console.log(`√ ${bot.user.username} #${bot.user.discriminator} has successfully connected to mongodb!`))

    bot.editStatus("online", { name: 'Managing Hype Community', type: 1, url: 'https://hypecommunity.com' })

    Invites.set(guild.id, await guild.getInvites());

    slashCommandCreator.execute(bot)

    //guild.deleteCommand("947758330665926706").then(console.log("√ Deleted specific slash command!"))

    const slashCommands = await bot.getCommands()
    const slashGuildCommands = await bot.getGuildCommands('811194465993097246')
    /*
    console.log("\n\n\n\n\n")
    console.log(slashCommands, slashGuildCommands)
    console.log("\n\n\n\n\n")
    */
})

bot.on("error", (err) => {
    console.error(err)
});

bot.on("messageDelete", (msg) => {
    deletedMessageLog.execute(msg, bot)
})

bot.on("messageCreate", async (msg) => {
    if (msg.channel.id == "940688429388292096") {

        const finding = await countSchema.findOne({
            findID: 1
        })

        if (msg.content == finding.count.toString() && msg.channel.id == "940688429388292096") {

            const result = await countSchema.findOne({
                findID: 1
            })

            if (result.lastCounter == msg.member.id) {
                bot.deleteMessage("940688429388292096", msg.id, "Failed in the counting game")
            }
            else if (result.lastCounter != msg.member.id) {
                await countSchema.findOneAndUpdate(
                    {
                        findID: 1
                    },
                    {
                        $inc: {
                            count: 1
                        },
                        lastCounter: msg.member.id
                    }
                )
            }

        }
        else if (msg.content != finding.count.toString() && msg.channel.id == "940688429388292096") {
            bot.deleteMessage("940688429388292096", msg.id, "Failed in the counting game")
        }

    }
})

bot.on("messageCreate", (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === `ping`) {
        bot.createMessage(msg.channel.id, "Pong!");
    }
    else if (command === `info`) {
        infoCommand.execute(msg, bot)
    }
    else if (command === `help`) {
        helpCommand.execute(msg, bot)
    }
    else if (command === `incomes`) {
        incomesCommand.execute(msg, bot)
    }
    else if (command === `levels`) {
        levelsCommand.execute(msg, bot)
    }
    else if (command === `sugg` || command === `suggest` || command === `suggestion`) {
        suggestionsCommand.execute(msg, bot, args)
    }
    else if (command === `userinfo`) {
        userinfoCommand.execute(msg, bot)
    }
    else if (command === `clear`) {
        clearCommand.execute(msg, bot, args)
    }
    else if (command === `weather`) {
        weatherCommand.execute(msg, bot, args)
    }
    else if (command === `ticketen`) {
        ticketENCommand.execute(msg, bot)
    }
    else if (command === `ticketpt`) {
        ticketPTCommand.execute(msg, bot)
    }
    else if (command === `rules` || command === `regras`) {
        rulesCommand.execute(msg, bot)
    }
    else if (command === `roles`) {
        rolesCommand.execute(msg, bot)
    }
    else if (command === `ban`) {
        banLogAndCommand.execute(msg, bot)
    }
    else if (command === `mute`) {
        muteLogAndCommand.execute(msg, bot)
    }
});

bot.on("interactionCreate", (interaction) => {
    interactionCreateEvent.execute(interaction)
    if (!(interaction instanceof Eris.CommandInteraction)) return

    const guild = bot.guilds.get('594204660814839838')

    const slash = interaction.data.name

    if (slash === "rules") {
        slashRules.execute(interaction, bot)
    }
    else if (slash === "weather") {
        slashWeather.execute(interaction)
    }
    else if (slash === "userinfo") {
        slashUserInfo.execute(interaction, bot)
    }
    else if (slash === "suggest") {
        slashSuggestions.execute(interaction, bot)
    }
    else if (slash === "logo") {
    }
})

bot.on("interactionCreate", (interaction) => {
    if (interaction instanceof Eris.CommandInteraction) return

    subticketPT.execute(interaction, bot)
    subticketEN.execute(interaction, bot)
    subroles.execute(interaction)
})

bot.on("voiceChannelJoin", (member, newChannel) => {
    joinVCLog.execute(bot, member, newChannel)
});

bot.on("voiceChannelSwitch", (member, newChannel, oldChannel) => {
    switchVCLog.execute(bot, member, newChannel, oldChannel)
});

bot.on("voiceChannelLeave", (member, oldChannel) => {
    leaveVCLog.execute(bot, member, oldChannel)
});

bot.on('inviteCreate', async (invite) => {
    const guild = bot.guilds.get('594204660814839838')
    Invites.set(guild.id, await guild.getInvites());
})

bot.on('inviteDelete', async (invite) => {
    const guild = bot.guilds.get('594204660814839838')
    let invites = Invites.get(guild.id);
    let delInvCode = invite.code;
    bot.delInvite = invites.find(invite => invite.code == delInvCode)
    invites.push(invite);
    Invites.set(guild.id, invites);
})

bot.on('guildMemberAdd', async (guild, member) => {

    const newInvites = await guild.getInvites();
    const cachedInvites = Invites.get(guild.id);

    let usedInvite
    if (cachedInvites.length > newInvites.length) {
        usedInvite = bot.delInvite
    } else {
        usedInvite = newInvites.find(inv => cachedInvites.find(invite => invite.code == inv.code).uses < inv.uses);
    }
    const inviter = usedInvite.inviter
    console.log(usedInvite)
    Invites.set(guild.id, newInvites);

    let username = member.user.username
    let discrim = member.user.discriminator

    /**//**//**//**//**//**//**//**//**/

    /**//**//**//**//**//**//**//**//**/



    const frame00 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/00.png"
    const frame01 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/01.png"
    const frame02 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/02.png"
    const frame03 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/03.png"
    const frame04 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/04.png"
    const frame05 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/05.png"
    const frame06 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/06.png"
    const frame07 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/07.png"
    const frame08 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/08.png"
    const frame09 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/09.png"
    const frame10 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/10.png"
    const frame11 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/11.png"
    const frame12 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/12.png"
    const frame13 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/13.png"
    const frame14 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/14.png"
    const frame15 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/15.png"
    const frame16 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/16.png"
    const frame17 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/17.png"
    const frame18 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/18.png"
    const frame19 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/19.png"
    const frame20 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/20.png"
    const frame21 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/21.png"
    const frame22 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/22.png"
    const frame23 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/23.png"
    const frame24 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/24.png"
    const frame25 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/25.png"
    const frame26 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/26.png"
    const frame27 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/27.png"
    const frame28 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/28.png"
    const frame29 = "C:/Users/pcout/NOVO-BOT/HypeBotEris/Neve/29.png"

    const dim = {
        height: 500,
        width: 1024,
        margin: 50
    }

    const avSize = {
        size: 256,
        x: 385,
        y: 35
    }

    let avatarURL = member.user.dynamicAvatarURL("png", 4096)

    const encoder = new GIFEncoder(1024, 500);

    encoder.createReadStream().pipe(fs.createWriteStream('myanimated.gif'));

    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(80)
    encoder.setQuality(20)

    const canvas0 = Canvas.createCanvas(dim.width, dim.height)
    const ctx0 = canvas0.getContext('2d')
    const canvas1 = Canvas.createCanvas(dim.width, dim.height)
    const ctx1 = canvas1.getContext('2d')
    const canvas2 = Canvas.createCanvas(dim.width, dim.height)
    const ctx2 = canvas2.getContext('2d')
    const canvas3 = Canvas.createCanvas(dim.width, dim.height)
    const ctx3 = canvas3.getContext('2d')
    const canvas4 = Canvas.createCanvas(dim.width, dim.height)
    const ctx4 = canvas4.getContext('2d')
    const canvas5 = Canvas.createCanvas(dim.width, dim.height)
    const ctx5 = canvas5.getContext('2d')
    const canvas6 = Canvas.createCanvas(dim.width, dim.height)
    const ctx6 = canvas6.getContext('2d')
    const canvas7 = Canvas.createCanvas(dim.width, dim.height)
    const ctx7 = canvas7.getContext('2d')
    const canvas8 = Canvas.createCanvas(dim.width, dim.height)
    const ctx8 = canvas8.getContext('2d')
    const canvas9 = Canvas.createCanvas(dim.width, dim.height)
    const ctx9 = canvas9.getContext('2d')
    const canvas10 = Canvas.createCanvas(dim.width, dim.height)
    const ctx10 = canvas10.getContext('2d')
    const canvas11 = Canvas.createCanvas(dim.width, dim.height)
    const ctx11 = canvas11.getContext('2d')
    const canvas12 = Canvas.createCanvas(dim.width, dim.height)
    const ctx12 = canvas12.getContext('2d')
    const canvas13 = Canvas.createCanvas(dim.width, dim.height)
    const ctx13 = canvas13.getContext('2d')
    const canvas14 = Canvas.createCanvas(dim.width, dim.height)
    const ctx14 = canvas14.getContext('2d')
    const canvas15 = Canvas.createCanvas(dim.width, dim.height)
    const ctx15 = canvas15.getContext('2d')
    const canvas16 = Canvas.createCanvas(dim.width, dim.height)
    const ctx16 = canvas16.getContext('2d')
    const canvas17 = Canvas.createCanvas(dim.width, dim.height)
    const ctx17 = canvas17.getContext('2d')
    const canvas18 = Canvas.createCanvas(dim.width, dim.height)
    const ctx18 = canvas18.getContext('2d')
    const canvas19 = Canvas.createCanvas(dim.width, dim.height)
    const ctx19 = canvas19.getContext('2d')
    const canvas20 = Canvas.createCanvas(dim.width, dim.height)
    const ctx20 = canvas20.getContext('2d')
    const canvas21 = Canvas.createCanvas(dim.width, dim.height)
    const ctx21 = canvas21.getContext('2d')
    const canvas22 = Canvas.createCanvas(dim.width, dim.height)
    const ctx22 = canvas22.getContext('2d')
    const canvas23 = Canvas.createCanvas(dim.width, dim.height)
    const ctx23 = canvas23.getContext('2d')
    const canvas24 = Canvas.createCanvas(dim.width, dim.height)
    const ctx24 = canvas24.getContext('2d')
    const canvas25 = Canvas.createCanvas(dim.width, dim.height)
    const ctx25 = canvas25.getContext('2d')
    const canvas26 = Canvas.createCanvas(dim.width, dim.height)
    const ctx26 = canvas26.getContext('2d')
    const canvas27 = Canvas.createCanvas(dim.width, dim.height)
    const ctx27 = canvas27.getContext('2d')
    const canvas28 = Canvas.createCanvas(dim.width, dim.height)
    const ctx28 = canvas28.getContext('2d')
    const canvas29 = Canvas.createCanvas(dim.width, dim.height)
    const ctx29 = canvas29.getContext('2d')

    /**//**//**//**//**//**//**//**//**/


    const backimg0 = await Canvas.loadImage(frame00)
    ctx0.drawImage(backimg0, 0, 0)


    ctx0.fillStyle = "rgba(0,0,0,0)"
    ctx0.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg0 = await Canvas.loadImage(avatarURL)
    ctx0.save()

    ctx0.beginPath()
    ctx0.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx0.closePath()
    ctx0.clip()

    ctx0.drawImage(avimg0, avSize.x, avSize.y)
    ctx0.restore()

    ctx0.fillStyle = '#ffffff'
    ctx0.textAlign = "center"

    ctx0.font = "95px Origin Tech"
    ctx0.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx0.lineWidth = 2
    ctx0.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx0.font = "45px Origin Tech"
    ctx0.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx0.font = "75px Origin Tech"
        ctx0.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx0.lineWidth = 1.5
        ctx0.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx0.font = "75px Origin Tech"
        ctx0.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx0.lineWidth = 1.5
        ctx0.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx0.font = "75px Origin Tech"
        ctx0.fillText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
        ctx0.lineWidth = 1.5
        ctx0.strokeText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx0.font = "75px Origin Tech"
        ctx0.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx0.lineWidth = 1.5
        ctx0.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx0.font = "75px Origin Tech"
        ctx0.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx0.lineWidth = 1.5
        ctx0.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx0)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg1 = await Canvas.loadImage(frame01)
    ctx1.drawImage(backimg1, 0, 0)


    ctx1.fillStyle = "rgba(0,0,0,0)"
    ctx1.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg1 = await Canvas.loadImage(avatarURL)
    ctx1.save()

    ctx1.beginPath()
    ctx1.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx1.closePath()
    ctx1.clip()

    ctx1.drawImage(avimg1, avSize.x, avSize.y)
    ctx1.restore()

    ctx1.fillStyle = '#ffffff'
    ctx1.textAlign = "center"

    ctx1.font = "95px Origin Tech"
    ctx1.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx1.lineWidth = 2
    ctx1.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx1.font = "45px Origin Tech"
    ctx1.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx1.font = "75px Origin Tech"
        ctx1.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx1.lineWidth = 1.5
        ctx1.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx1.font = "75px Origin Tech"
        ctx1.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx1.lineWidth = 1.5
        ctx1.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx1.font = "75px Origin Tech"
        ctx1.fillText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
        ctx1.lineWidth = 1.5
        ctx1.strokeText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx1.font = "75px Origin Tech"
        ctx1.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx1.lineWidth = 1.5
        ctx1.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx1.font = "75px Origin Tech"
        ctx1.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx1.lineWidth = 1.5
        ctx1.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx1)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg2 = await Canvas.loadImage(frame02)
    ctx2.drawImage(backimg2, 0, 0)


    ctx2.fillStyle = "rgba(0,0,0,0)"
    ctx2.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg2 = await Canvas.loadImage(avatarURL)
    ctx2.save()

    ctx2.beginPath()
    ctx2.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx2.closePath()
    ctx2.clip()

    ctx2.drawImage(avimg2, avSize.x, avSize.y)
    ctx2.restore()

    ctx2.fillStyle = '#ffffff'
    ctx2.textAlign = "center"

    ctx2.font = "95px Origin Tech"
    ctx2.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx2.lineWidth = 2
    ctx2.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx2.font = "45px Origin Tech"
    ctx2.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx2.font = "75px Origin Tech"
        ctx2.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx2.lineWidth = 1.5
        ctx2.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx2.font = "75px Origin Tech"
        ctx2.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx2.lineWidth = 1.5
        ctx2.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx2.font = "75px Origin Tech"
        ctx2.fillText(`${guild.memberCount}`, dim.width - 21, dim.height - 20)
        ctx2.lineWidth = 1.5
        ctx2.strokeText(`${guild.memberCount}`, dim.width - 21, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx2.font = "75px Origin Tech"
        ctx2.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx2.lineWidth = 1.5
        ctx2.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx2.font = "75px Origin Tech"
        ctx2.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx2.lineWidth = 1.5
        ctx2.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx2)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg3 = await Canvas.loadImage(frame03)
    ctx3.drawImage(backimg3, 0, 0)


    ctx3.fillStyle = "rgba(0,0,0,0)"
    ctx3.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg3 = await Canvas.loadImage(avatarURL)
    ctx3.save()

    ctx3.beginPath()
    ctx3.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx3.closePath()
    ctx3.clip()

    ctx3.drawImage(avimg3, avSize.x, avSize.y)
    ctx3.restore()

    ctx3.fillStyle = '#ffffff'
    ctx3.textAlign = "center"

    ctx3.font = "95px Origin Tech"
    ctx3.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx3.lineWidth = 2
    ctx3.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx3.font = "45px Origin Tech"
    ctx3.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx3.font = "75px Origin Tech"
        ctx3.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx3.lineWidth = 1.5
        ctx3.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx3.font = "75px Origin Tech"
        ctx3.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx3.lineWidth = 1.5
        ctx3.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx3.font = "75px Origin Tech"
        ctx3.fillText(`${guild.memberCount}`, dim.width - 31, dim.height - 20)
        ctx3.lineWidth = 1.5
        ctx3.strokeText(`${guild.memberCount}`, dim.width - 31, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx3.font = "75px Origin Tech"
        ctx3.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx3.lineWidth = 1.5
        ctx3.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx3.font = "75px Origin Tech"
        ctx3.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx3.lineWidth = 1.5
        ctx3.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx3)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg4 = await Canvas.loadImage(frame04)
    ctx4.drawImage(backimg4, 0, 0)


    ctx4.fillStyle = "rgba(0,0,0,0)"
    ctx4.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg4 = await Canvas.loadImage(avatarURL)
    ctx4.save()

    ctx4.beginPath()
    ctx4.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx4.closePath()
    ctx4.clip()

    ctx4.drawImage(avimg4, avSize.x, avSize.y)
    ctx4.restore()

    ctx4.fillStyle = '#ffffff'
    ctx4.textAlign = "center"

    ctx4.font = "95px Origin Tech"
    ctx4.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx4.lineWidth = 2
    ctx4.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx4.font = "45px Origin Tech"
    ctx4.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx4.font = "75px Origin Tech"
        ctx4.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx4.lineWidth = 1.5
        ctx4.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx4.font = "75px Origin Tech"
        ctx4.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx4.lineWidth = 1.5
        ctx4.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx4.font = "75px Origin Tech"
        ctx4.fillText(`${guild.memberCount}`, dim.width - 41, dim.height - 20)
        ctx4.lineWidth = 1.5
        ctx4.strokeText(`${guild.memberCount}`, dim.width - 41, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx4.font = "75px Origin Tech"
        ctx4.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx4.lineWidth = 1.5
        ctx4.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx4.font = "75px Origin Tech"
        ctx4.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx4.lineWidth = 1.5
        ctx4.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx4)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg5 = await Canvas.loadImage(frame05)
    ctx5.drawImage(backimg5, 0, 0)


    ctx5.fillStyle = "rgba(0,0,0,0)"
    ctx5.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg5 = await Canvas.loadImage(avatarURL)
    ctx5.save()

    ctx5.beginPath()
    ctx5.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx5.closePath()
    ctx5.clip()

    ctx5.drawImage(avimg5, avSize.x, avSize.y)
    ctx5.restore()

    ctx5.fillStyle = '#ffffff'
    ctx5.textAlign = "center"

    ctx5.font = "95px Origin Tech"
    ctx5.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx5.lineWidth = 2
    ctx5.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx5.font = "45px Origin Tech"
    ctx5.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx5.font = "75px Origin Tech"
        ctx5.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx5.lineWidth = 1.5
        ctx5.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx5.font = "75px Origin Tech"
        ctx5.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx5.lineWidth = 1.5
        ctx5.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx5.font = "75px Origin Tech"
        ctx5.fillText(`${guild.memberCount}`, dim.width - 51, dim.height - 20)
        ctx5.lineWidth = 1.5
        ctx5.strokeText(`${guild.memberCount}`, dim.width - 51, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx5.font = "75px Origin Tech"
        ctx5.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx5.lineWidth = 1.5
        ctx5.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx5.font = "75px Origin Tech"
        ctx5.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx5.lineWidth = 1.5
        ctx5.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx5)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg6 = await Canvas.loadImage(frame06)
    ctx6.drawImage(backimg6, 0, 0)


    ctx6.fillStyle = "rgba(0,0,0,0)"
    ctx6.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg6 = await Canvas.loadImage(avatarURL)
    ctx6.save()

    ctx6.beginPath()
    ctx6.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx6.closePath()
    ctx6.clip()

    ctx6.drawImage(avimg6, avSize.x, avSize.y)
    ctx6.restore()

    ctx6.fillStyle = '#ffffff'
    ctx6.textAlign = "center"

    ctx6.font = "95px Origin Tech"
    ctx6.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx6.lineWidth = 2
    ctx6.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx6.font = "45px Origin Tech"
    ctx6.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx6.font = "75px Origin Tech"
        ctx6.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx6.lineWidth = 1.5
        ctx6.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx6.font = "75px Origin Tech"
        ctx6.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx6.lineWidth = 1.5
        ctx6.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx6.font = "75px Origin Tech"
        ctx6.fillText(`${guild.memberCount}`, dim.width - 61, dim.height - 20)
        ctx6.lineWidth = 1.5
        ctx6.strokeText(`${guild.memberCount}`, dim.width - 61, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx6.font = "75px Origin Tech"
        ctx6.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx6.lineWidth = 1.5
        ctx6.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx6.font = "75px Origin Tech"
        ctx6.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx6.lineWidth = 1.5
        ctx6.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx6)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg7 = await Canvas.loadImage(frame07)
    ctx7.drawImage(backimg7, 0, 0)


    ctx7.fillStyle = "rgba(0,0,0,0)"
    ctx7.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg7 = await Canvas.loadImage(avatarURL)
    ctx7.save()

    ctx7.beginPath()
    ctx7.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx7.closePath()
    ctx7.clip()

    ctx7.drawImage(avimg7, avSize.x, avSize.y)
    ctx7.restore()

    ctx7.fillStyle = '#ffffff'
    ctx7.textAlign = "center"

    ctx7.font = "95px Origin Tech"
    ctx7.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx7.lineWidth = 2
    ctx7.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx7.font = "45px Origin Tech"
    ctx7.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx7.font = "75px Origin Tech"
        ctx7.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx7.lineWidth = 1.5
        ctx7.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx7.font = "75px Origin Tech"
        ctx7.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx7.lineWidth = 1.5
        ctx7.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx7.font = "75px Origin Tech"
        ctx7.fillText(`${guild.memberCount}`, dim.width - 71, dim.height - 20)
        ctx7.lineWidth = 1.5
        ctx7.strokeText(`${guild.memberCount}`, dim.width - 71, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx7.font = "75px Origin Tech"
        ctx7.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx7.lineWidth = 1.5
        ctx7.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx7.font = "75px Origin Tech"
        ctx7.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx7.lineWidth = 1.5
        ctx7.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx7)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg8 = await Canvas.loadImage(frame08)
    ctx8.drawImage(backimg8, 0, 0)


    ctx8.fillStyle = "rgba(0,0,0,0)"
    ctx8.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg8 = await Canvas.loadImage(avatarURL)
    ctx8.save()

    ctx8.beginPath()
    ctx8.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx8.closePath()
    ctx8.clip()

    ctx8.drawImage(avimg8, avSize.x, avSize.y)
    ctx8.restore()

    ctx8.fillStyle = '#ffffff'
    ctx8.textAlign = "center"

    ctx8.font = "95px Origin Tech"
    ctx8.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx8.lineWidth = 2
    ctx8.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx8.font = "45px Origin Tech"
    ctx8.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx8.font = "75px Origin Tech"
        ctx8.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx8.lineWidth = 1.5
        ctx8.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx8.font = "75px Origin Tech"
        ctx8.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx8.lineWidth = 1.5
        ctx8.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx8.font = "75px Origin Tech"
        ctx8.fillText(`${guild.memberCount}`, dim.width - 81, dim.height - 20)
        ctx8.lineWidth = 1.5
        ctx8.strokeText(`${guild.memberCount}`, dim.width - 81, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx8.font = "75px Origin Tech"
        ctx8.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx8.lineWidth = 1.5
        ctx8.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx8.font = "75px Origin Tech"
        ctx8.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx8.lineWidth = 1.5
        ctx8.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx8)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg9 = await Canvas.loadImage(frame09)
    ctx9.drawImage(backimg9, 0, 0)


    ctx9.fillStyle = "rgba(0,0,0,0)"
    ctx9.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg9 = await Canvas.loadImage(avatarURL)
    ctx9.save()

    ctx9.beginPath()
    ctx9.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx9.closePath()
    ctx9.clip()

    ctx9.drawImage(avimg9, avSize.x, avSize.y)
    ctx9.restore()

    ctx9.fillStyle = '#ffffff'
    ctx9.textAlign = "center"

    ctx9.font = "95px Origin Tech"
    ctx9.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx9.lineWidth = 2
    ctx9.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx9.font = "45px Origin Tech"
    ctx9.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx9.font = "75px Origin Tech"
        ctx9.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx9.lineWidth = 1.5
        ctx9.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx9.font = "75px Origin Tech"
        ctx9.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx9.lineWidth = 1.5
        ctx9.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx9.font = "75px Origin Tech"
        ctx9.fillText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
        ctx9.lineWidth = 1.5
        ctx9.strokeText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx9.font = "75px Origin Tech"
        ctx9.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx9.lineWidth = 1.5
        ctx9.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx9.font = "75px Origin Tech"
        ctx9.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx9.lineWidth = 1.5
        ctx9.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx9)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg10 = await Canvas.loadImage(frame10)
    ctx10.drawImage(backimg10, 0, 0)


    ctx10.fillStyle = "rgba(0,0,0,0)"
    ctx10.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg10 = await Canvas.loadImage(avatarURL)
    ctx10.save()

    ctx10.beginPath()
    ctx10.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx10.closePath()
    ctx10.clip()

    ctx10.drawImage(avimg10, avSize.x, avSize.y)
    ctx10.restore()

    ctx10.fillStyle = '#ffffff'
    ctx10.textAlign = "center"

    ctx10.font = "95px Origin Tech"
    ctx10.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx10.lineWidth = 2
    ctx10.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx10.font = "45px Origin Tech"
    ctx10.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx10.font = "75px Origin Tech"
        ctx10.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx10.lineWidth = 1.5
        ctx10.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx10.font = "75px Origin Tech"
        ctx10.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx10.lineWidth = 1.5
        ctx10.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx10.font = "75px Origin Tech"
        ctx10.fillText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
        ctx10.lineWidth = 1.5
        ctx10.strokeText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx10.font = "75px Origin Tech"
        ctx10.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx10.lineWidth = 1.5
        ctx10.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx10.font = "75px Origin Tech"
        ctx10.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx10.lineWidth = 1.5
        ctx10.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx10)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg11 = await Canvas.loadImage(frame11)
    ctx11.drawImage(backimg11, 0, 0)


    ctx11.fillStyle = "rgba(0,0,0,0)"
    ctx11.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg11 = await Canvas.loadImage(avatarURL)
    ctx11.save()

    ctx11.beginPath()
    ctx11.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx11.closePath()
    ctx11.clip()

    ctx11.drawImage(avimg11, avSize.x, avSize.y)
    ctx11.restore()

    ctx11.fillStyle = '#ffffff'
    ctx11.textAlign = "center"

    ctx11.font = "95px Origin Tech"
    ctx11.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx11.lineWidth = 2
    ctx11.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx11.font = "45px Origin Tech"
    ctx11.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx11.font = "75px Origin Tech"
        ctx11.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx11.lineWidth = 1.5
        ctx11.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx11.font = "75px Origin Tech"
        ctx11.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx11.lineWidth = 1.5
        ctx11.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx11.font = "75px Origin Tech"
        ctx11.fillText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
        ctx11.lineWidth = 1.5
        ctx11.strokeText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx11.font = "75px Origin Tech"
        ctx11.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx11.lineWidth = 1.5
        ctx11.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx11.font = "75px Origin Tech"
        ctx11.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx11.lineWidth = 1.5
        ctx11.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx11)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg12 = await Canvas.loadImage(frame12)
    ctx12.drawImage(backimg12, 0, 0)


    ctx12.fillStyle = "rgba(0,0,0,0)"
    ctx12.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg12 = await Canvas.loadImage(avatarURL)
    ctx12.save()

    ctx12.beginPath()
    ctx12.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx12.closePath()
    ctx12.clip()

    ctx12.drawImage(avimg12, avSize.x, avSize.y)
    ctx12.restore()

    ctx12.fillStyle = '#ffffff'
    ctx12.textAlign = "center"

    ctx12.font = "95px Origin Tech"
    ctx12.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx12.lineWidth = 2
    ctx12.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx12.font = "45px Origin Tech"
    ctx12.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx12.font = "75px Origin Tech"
        ctx12.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx12.lineWidth = 1.5
        ctx12.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx12.font = "75px Origin Tech"
        ctx12.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx12.lineWidth = 1.5
        ctx12.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx12.font = "75px Origin Tech"
        ctx12.fillText(`${guild.memberCount}`, dim.width - 21, dim.height - 20)
        ctx12.lineWidth = 1.5
        ctx12.strokeText(`${guild.memberCount}`, dim.width - 21, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx12.font = "75px Origin Tech"
        ctx12.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx12.lineWidth = 1.5
        ctx12.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx12.font = "75px Origin Tech"
        ctx12.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx12.lineWidth = 1.5
        ctx12.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx12)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg13 = await Canvas.loadImage(frame13)
    ctx13.drawImage(backimg13, 0, 0)


    ctx13.fillStyle = "rgba(0,0,0,0)"
    ctx13.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg13 = await Canvas.loadImage(avatarURL)
    ctx13.save()

    ctx13.beginPath()
    ctx13.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx13.closePath()
    ctx13.clip()

    ctx13.drawImage(avimg13, avSize.x, avSize.y)
    ctx13.restore()

    ctx13.fillStyle = '#ffffff'
    ctx13.textAlign = "center"

    ctx13.font = "95px Origin Tech"
    ctx13.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx13.lineWidth = 2
    ctx13.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx13.font = "45px Origin Tech"
    ctx13.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx13.font = "75px Origin Tech"
        ctx13.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx13.lineWidth = 1.5
        ctx13.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx13.font = "75px Origin Tech"
        ctx13.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx13.lineWidth = 1.5
        ctx13.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx13.font = "75px Origin Tech"
        ctx13.fillText(`${guild.memberCount}`, dim.width - 31, dim.height - 20)
        ctx13.lineWidth = 1.5
        ctx13.strokeText(`${guild.memberCount}`, dim.width - 31, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx13.font = "75px Origin Tech"
        ctx13.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx13.lineWidth = 1.5
        ctx13.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx13.font = "75px Origin Tech"
        ctx13.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx13.lineWidth = 1.5
        ctx13.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx13)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg14 = await Canvas.loadImage(frame14)
    ctx14.drawImage(backimg14, 0, 0)


    ctx14.fillStyle = "rgba(0,0,0,0)"
    ctx14.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg14 = await Canvas.loadImage(avatarURL)
    ctx14.save()

    ctx14.beginPath()
    ctx14.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx14.closePath()
    ctx14.clip()

    ctx14.drawImage(avimg14, avSize.x, avSize.y)
    ctx14.restore()

    ctx14.fillStyle = '#ffffff'
    ctx14.textAlign = "center"

    ctx14.font = "95px Origin Tech"
    ctx14.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx14.lineWidth = 2
    ctx14.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx14.font = "45px Origin Tech"
    ctx14.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx14.font = "75px Origin Tech"
        ctx14.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx14.lineWidth = 1.5
        ctx14.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx14.font = "75px Origin Tech"
        ctx14.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx14.lineWidth = 1.5
        ctx14.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx14.font = "75px Origin Tech"
        ctx14.fillText(`${guild.memberCount}`, dim.width - 41, dim.height - 20)
        ctx14.lineWidth = 1.5
        ctx14.strokeText(`${guild.memberCount}`, dim.width - 41, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx14.font = "75px Origin Tech"
        ctx14.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx14.lineWidth = 1.5
        ctx14.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx14.font = "75px Origin Tech"
        ctx14.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx14.lineWidth = 1.5
        ctx14.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx14)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg15 = await Canvas.loadImage(frame15)
    ctx15.drawImage(backimg15, 0, 0)


    ctx15.fillStyle = "rgba(0,0,0,0)"
    ctx15.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg15 = await Canvas.loadImage(avatarURL)
    ctx15.save()

    ctx15.beginPath()
    ctx15.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx15.closePath()
    ctx15.clip()

    ctx15.drawImage(avimg15, avSize.x, avSize.y)
    ctx15.restore()

    ctx15.fillStyle = '#ffffff'
    ctx15.textAlign = "center"

    ctx15.font = "95px Origin Tech"
    ctx15.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx15.lineWidth = 2
    ctx15.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx15.font = "45px Origin Tech"
    ctx15.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx15.font = "75px Origin Tech"
        ctx15.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx15.lineWidth = 1.5
        ctx15.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx15.font = "75px Origin Tech"
        ctx15.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx15.lineWidth = 1.5
        ctx15.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx15.font = "75px Origin Tech"
        ctx15.fillText(`${guild.memberCount}`, dim.width - 51, dim.height - 20)
        ctx15.lineWidth = 1.5
        ctx15.strokeText(`${guild.memberCount}`, dim.width - 51, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx15.font = "75px Origin Tech"
        ctx15.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx15.lineWidth = 1.5
        ctx15.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx15.font = "75px Origin Tech"
        ctx15.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx15.lineWidth = 1.5
        ctx15.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx15)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg16 = await Canvas.loadImage(frame16)
    ctx16.drawImage(backimg16, 0, 0)


    ctx16.fillStyle = "rgba(0,0,0,0)"
    ctx16.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg16 = await Canvas.loadImage(avatarURL)
    ctx16.save()

    ctx16.beginPath()
    ctx16.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx16.closePath()
    ctx16.clip()

    ctx16.drawImage(avimg16, avSize.x, avSize.y)
    ctx16.restore()

    ctx16.fillStyle = '#ffffff'
    ctx16.textAlign = "center"

    ctx16.font = "95px Origin Tech"
    ctx16.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx16.lineWidth = 2
    ctx16.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx16.font = "45px Origin Tech"
    ctx16.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx16.font = "75px Origin Tech"
        ctx16.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx16.lineWidth = 1.5
        ctx16.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx16.font = "75px Origin Tech"
        ctx16.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx16.lineWidth = 1.5
        ctx16.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx16.font = "75px Origin Tech"
        ctx16.fillText(`${guild.memberCount}`, dim.width - 61, dim.height - 20)
        ctx16.lineWidth = 1.5
        ctx16.strokeText(`${guild.memberCount}`, dim.width - 61, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx16.font = "75px Origin Tech"
        ctx16.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx16.lineWidth = 1.5
        ctx16.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx16.font = "75px Origin Tech"
        ctx16.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx16.lineWidth = 1.5
        ctx16.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx16)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg17 = await Canvas.loadImage(frame17)
    ctx17.drawImage(backimg17, 0, 0)


    ctx17.fillStyle = "rgba(0,0,0,0)"
    ctx17.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg17 = await Canvas.loadImage(avatarURL)
    ctx17.save()

    ctx17.beginPath()
    ctx17.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx17.closePath()
    ctx17.clip()

    ctx17.drawImage(avimg17, avSize.x, avSize.y)
    ctx17.restore()

    ctx17.fillStyle = '#ffffff'
    ctx17.textAlign = "center"

    ctx17.font = "95px Origin Tech"
    ctx17.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx17.lineWidth = 2
    ctx17.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx17.font = "45px Origin Tech"
    ctx17.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx17.font = "75px Origin Tech"
        ctx17.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx17.lineWidth = 1.5
        ctx17.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx17.font = "75px Origin Tech"
        ctx17.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx17.lineWidth = 1.5
        ctx17.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx17.font = "75px Origin Tech"
        ctx17.fillText(`${guild.memberCount}`, dim.width - 71, dim.height - 20)
        ctx17.lineWidth = 1.5
        ctx17.strokeText(`${guild.memberCount}`, dim.width - 71, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx17.font = "75px Origin Tech"
        ctx17.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx17.lineWidth = 1.5
        ctx17.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx17.font = "75px Origin Tech"
        ctx17.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx17.lineWidth = 1.5
        ctx17.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx17)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg18 = await Canvas.loadImage(frame18)
    ctx18.drawImage(backimg18, 0, 0)


    ctx18.fillStyle = "rgba(0,0,0,0)"
    ctx18.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg18 = await Canvas.loadImage(avatarURL)
    ctx18.save()

    ctx18.beginPath()
    ctx18.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx18.closePath()
    ctx18.clip()

    ctx18.drawImage(avimg18, avSize.x, avSize.y)
    ctx18.restore()

    ctx18.fillStyle = '#ffffff'
    ctx18.textAlign = "center"

    ctx18.font = "95px Origin Tech"
    ctx18.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx18.lineWidth = 2
    ctx18.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx18.font = "45px Origin Tech"
    ctx18.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx18.font = "75px Origin Tech"
        ctx18.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx18.lineWidth = 1.5
        ctx18.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx18.font = "75px Origin Tech"
        ctx18.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx18.lineWidth = 1.5
        ctx18.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx18.font = "75px Origin Tech"
        ctx18.fillText(`${guild.memberCount}`, dim.width - 81, dim.height - 20)
        ctx18.lineWidth = 1.5
        ctx18.strokeText(`${guild.memberCount}`, dim.width - 81, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx18.font = "75px Origin Tech"
        ctx18.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx18.lineWidth = 1.5
        ctx18.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx18.font = "75px Origin Tech"
        ctx18.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx18.lineWidth = 1.5
        ctx18.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx18)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg19 = await Canvas.loadImage(frame19)
    ctx19.drawImage(backimg19, 0, 0)


    ctx19.fillStyle = "rgba(0,0,0,0)"
    ctx19.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg19 = await Canvas.loadImage(avatarURL)
    ctx19.save()

    ctx19.beginPath()
    ctx19.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx19.closePath()
    ctx19.clip()

    ctx19.drawImage(avimg19, avSize.x, avSize.y)
    ctx19.restore()

    ctx19.fillStyle = '#ffffff'
    ctx19.textAlign = "center"

    ctx19.font = "95px Origin Tech"
    ctx19.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx19.lineWidth = 2
    ctx19.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx19.font = "45px Origin Tech"
    ctx19.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx19.font = "75px Origin Tech"
        ctx19.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx19.lineWidth = 1.5
        ctx19.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx19.font = "75px Origin Tech"
        ctx19.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx19.lineWidth = 1.5
        ctx19.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx19.font = "75px Origin Tech"
        ctx19.fillText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
        ctx19.lineWidth = 1.5
        ctx19.strokeText(`${guild.memberCount}`, dim.width - 11, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx19.font = "75px Origin Tech"
        ctx19.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx19.lineWidth = 1.5
        ctx19.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx19.font = "75px Origin Tech"
        ctx19.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx19.lineWidth = 1.5
        ctx19.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx19)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg20 = await Canvas.loadImage(frame20)
    ctx20.drawImage(backimg20, 0, 0)


    ctx20.fillStyle = "rgba(0,0,0,0)"
    ctx20.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg20 = await Canvas.loadImage(avatarURL)
    ctx20.save()

    ctx20.beginPath()
    ctx20.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx20.closePath()
    ctx20.clip()

    ctx20.drawImage(avimg20, avSize.x, avSize.y)
    ctx20.restore()

    ctx20.fillStyle = '#ffffff'
    ctx20.textAlign = "center"

    ctx20.font = "95px Origin Tech"
    ctx20.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx20.lineWidth = 2
    ctx20.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx20.font = "45px Origin Tech"
    ctx20.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx20.font = "75px Origin Tech"
        ctx20.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx20.lineWidth = 1.5
        ctx20.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx20.font = "75px Origin Tech"
        ctx20.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx20.lineWidth = 1.5
        ctx20.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx20.font = "75px Origin Tech"
        ctx20.fillText(`${guild.memberCount}`, dim.width - 22, dim.height - 20)
        ctx20.lineWidth = 1.5
        ctx20.strokeText(`${guild.memberCount}`, dim.width - 22, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx20.font = "75px Origin Tech"
        ctx20.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx20.lineWidth = 1.5
        ctx20.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx20.font = "75px Origin Tech"
        ctx20.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx20.lineWidth = 1.5
        ctx20.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx20)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg21 = await Canvas.loadImage(frame21)
    ctx21.drawImage(backimg21, 0, 0)


    ctx21.fillStyle = "rgba(0,0,0,0)"
    ctx21.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg21 = await Canvas.loadImage(avatarURL)
    ctx21.save()

    ctx21.beginPath()
    ctx21.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx21.closePath()
    ctx21.clip()

    ctx21.drawImage(avimg21, avSize.x, avSize.y)
    ctx21.restore()

    ctx21.fillStyle = '#ffffff'
    ctx21.textAlign = "center"

    ctx21.font = "95px Origin Tech"
    ctx21.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx21.lineWidth = 2
    ctx21.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx21.font = "45px Origin Tech"
    ctx21.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx21.font = "75px Origin Tech"
        ctx21.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx21.lineWidth = 1.5
        ctx21.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx21.font = "75px Origin Tech"
        ctx21.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx21.lineWidth = 1.5
        ctx21.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx21.font = "75px Origin Tech"
        ctx21.fillText(`${guild.memberCount}`, dim.width - 22, dim.height - 20)
        ctx21.lineWidth = 1.5
        ctx21.strokeText(`${guild.memberCount}`, dim.width - 22, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx21.font = "75px Origin Tech"
        ctx21.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx21.lineWidth = 1.5
        ctx21.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx21.font = "75px Origin Tech"
        ctx21.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx21.lineWidth = 1.5
        ctx21.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx21)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg22 = await Canvas.loadImage(frame22)
    ctx22.drawImage(backimg22, 0, 0)


    ctx22.fillStyle = "rgba(0,0,0,0)"
    ctx22.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg22 = await Canvas.loadImage(avatarURL)
    ctx22.save()

    ctx22.beginPath()
    ctx22.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx22.closePath()
    ctx22.clip()

    ctx22.drawImage(avimg22, avSize.x, avSize.y)
    ctx22.restore()

    ctx22.fillStyle = '#ffffff'
    ctx22.textAlign = "center"

    ctx22.font = "95px Origin Tech"
    ctx22.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx22.lineWidth = 2
    ctx22.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx22.font = "45px Origin Tech"
    ctx22.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx22.font = "75px Origin Tech"
        ctx22.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx22.lineWidth = 1.5
        ctx22.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx22.font = "75px Origin Tech"
        ctx22.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx22.lineWidth = 1.5
        ctx22.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx22.font = "75px Origin Tech"
        ctx22.fillText(`${guild.memberCount}`, dim.width - 22, dim.height - 20)
        ctx22.lineWidth = 1.5
        ctx22.strokeText(`${guild.memberCount}`, dim.width - 22, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx22.font = "75px Origin Tech"
        ctx22.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx22.lineWidth = 1.5
        ctx22.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx22.font = "75px Origin Tech"
        ctx22.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx22.lineWidth = 1.5
        ctx22.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx22)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg23 = await Canvas.loadImage(frame23)
    ctx23.drawImage(backimg23, 0, 0)


    ctx23.fillStyle = "rgba(0,0,0,0)"
    ctx23.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg23 = await Canvas.loadImage(avatarURL)
    ctx23.save()

    ctx23.beginPath()
    ctx23.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx23.closePath()
    ctx23.clip()

    ctx23.drawImage(avimg23, avSize.x, avSize.y)
    ctx23.restore()

    ctx23.fillStyle = '#ffffff'
    ctx23.textAlign = "center"

    ctx23.font = "95px Origin Tech"
    ctx23.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx23.lineWidth = 2
    ctx23.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx23.font = "45px Origin Tech"
    ctx23.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx23.font = "75px Origin Tech"
        ctx23.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx23.lineWidth = 1.5
        ctx23.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx23.font = "75px Origin Tech"
        ctx23.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx23.lineWidth = 1.5
        ctx23.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx23.font = "75px Origin Tech"
        ctx23.fillText(`${guild.memberCount}`, dim.width - 32, dim.height - 20)
        ctx23.lineWidth = 1.5
        ctx23.strokeText(`${guild.memberCount}`, dim.width - 32, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx23.font = "75px Origin Tech"
        ctx23.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx23.lineWidth = 1.5
        ctx23.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx23.font = "75px Origin Tech"
        ctx23.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx23.lineWidth = 1.5
        ctx23.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx23)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg24 = await Canvas.loadImage(frame24)
    ctx24.drawImage(backimg24, 0, 0)


    ctx24.fillStyle = "rgba(0,0,0,0)"
    ctx24.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg24 = await Canvas.loadImage(avatarURL)
    ctx24.save()

    ctx24.beginPath()
    ctx24.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx24.closePath()
    ctx24.clip()

    ctx24.drawImage(avimg24, avSize.x, avSize.y)
    ctx24.restore()

    ctx24.fillStyle = '#ffffff'
    ctx24.textAlign = "center"

    ctx24.font = "95px Origin Tech"
    ctx24.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx24.lineWidth = 2
    ctx24.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx24.font = "45px Origin Tech"
    ctx24.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx24.font = "75px Origin Tech"
        ctx24.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx24.lineWidth = 1.5
        ctx24.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx24.font = "75px Origin Tech"
        ctx24.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx24.lineWidth = 1.5
        ctx24.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx24.font = "75px Origin Tech"
        ctx24.fillText(`${guild.memberCount}`, dim.width - 42, dim.height - 20)
        ctx24.lineWidth = 1.5
        ctx24.strokeText(`${guild.memberCount}`, dim.width - 42, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx24.font = "75px Origin Tech"
        ctx24.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx24.lineWidth = 1.5
        ctx24.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx24.font = "75px Origin Tech"
        ctx24.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx24.lineWidth = 1.5
        ctx24.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx24)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg25 = await Canvas.loadImage(frame25)
    ctx25.drawImage(backimg25, 0, 0)


    ctx25.fillStyle = "rgba(0,0,0,0)"
    ctx25.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg25 = await Canvas.loadImage(avatarURL)
    ctx25.save()

    ctx25.beginPath()
    ctx25.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx25.closePath()
    ctx25.clip()

    ctx25.drawImage(avimg25, avSize.x, avSize.y)
    ctx25.restore()

    ctx25.fillStyle = '#ffffff'
    ctx25.textAlign = "center"

    ctx25.font = "95px Origin Tech"
    ctx25.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx25.lineWidth = 2
    ctx25.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx25.font = "45px Origin Tech"
    ctx25.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx25.font = "75px Origin Tech"
        ctx25.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx25.lineWidth = 1.5
        ctx25.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx25.font = "75px Origin Tech"
        ctx25.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx25.lineWidth = 1.5
        ctx25.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx25.font = "75px Origin Tech"
        ctx25.fillText(`${guild.memberCount}`, dim.width - 52, dim.height - 20)
        ctx25.lineWidth = 1.5
        ctx25.strokeText(`${guild.memberCount}`, dim.width - 52, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx25.font = "75px Origin Tech"
        ctx25.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx25.lineWidth = 1.5
        ctx25.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx25.font = "75px Origin Tech"
        ctx25.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx25.lineWidth = 1.5
        ctx25.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx25)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg26 = await Canvas.loadImage(frame26)
    ctx26.drawImage(backimg26, 0, 0)


    ctx26.fillStyle = "rgba(0,0,0,0)"
    ctx26.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg26 = await Canvas.loadImage(avatarURL)
    ctx26.save()

    ctx26.beginPath()
    ctx26.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx26.closePath()
    ctx26.clip()

    ctx26.drawImage(avimg26, avSize.x, avSize.y)
    ctx26.restore()

    ctx26.fillStyle = '#ffffff'
    ctx26.textAlign = "center"

    ctx26.font = "95px Origin Tech"
    ctx26.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx26.lineWidth = 2
    ctx26.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx26.font = "45px Origin Tech"
    ctx26.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx26.font = "75px Origin Tech"
        ctx26.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx26.lineWidth = 1.5
        ctx26.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx26.font = "75px Origin Tech"
        ctx26.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx26.lineWidth = 1.5
        ctx26.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx26.font = "75px Origin Tech"
        ctx26.fillText(`${guild.memberCount}`, dim.width - 62, dim.height - 20)
        ctx26.lineWidth = 1.5
        ctx26.strokeText(`${guild.memberCount}`, dim.width - 62, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx26.font = "75px Origin Tech"
        ctx26.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx26.lineWidth = 1.5
        ctx26.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx26.font = "75px Origin Tech"
        ctx26.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx26.lineWidth = 1.5
        ctx26.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx26)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg27 = await Canvas.loadImage(frame27)
    ctx27.drawImage(backimg27, 0, 0)


    ctx27.fillStyle = "rgba(0,0,0,0)"
    ctx27.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg27 = await Canvas.loadImage(avatarURL)
    ctx27.save()

    ctx27.beginPath()
    ctx27.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx27.closePath()
    ctx27.clip()

    ctx27.drawImage(avimg27, avSize.x, avSize.y)
    ctx27.restore()

    ctx27.fillStyle = '#ffffff'
    ctx27.textAlign = "center"

    ctx27.font = "95px Origin Tech"
    ctx27.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx27.lineWidth = 2
    ctx27.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx27.font = "45px Origin Tech"
    ctx27.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx27.font = "75px Origin Tech"
        ctx27.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx27.lineWidth = 1.5
        ctx27.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx27.font = "75px Origin Tech"
        ctx27.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx27.lineWidth = 1.5
        ctx27.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx27.font = "75px Origin Tech"
        ctx27.fillText(`${guild.memberCount}`, dim.width - 72, dim.height - 20)
        ctx27.lineWidth = 1.5
        ctx27.strokeText(`${guild.memberCount}`, dim.width - 72, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx27.font = "75px Origin Tech"
        ctx27.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx27.lineWidth = 1.5
        ctx27.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx27.font = "75px Origin Tech"
        ctx27.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx27.lineWidth = 1.5
        ctx27.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx27)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg28 = await Canvas.loadImage(frame28)
    ctx28.drawImage(backimg28, 0, 0)


    ctx28.fillStyle = "rgba(0,0,0,0)"
    ctx28.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg28 = await Canvas.loadImage(avatarURL)
    ctx28.save()

    ctx28.beginPath()
    ctx28.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx28.closePath()
    ctx28.clip()

    ctx28.drawImage(avimg28, avSize.x, avSize.y)
    ctx28.restore()

    ctx28.fillStyle = '#ffffff'
    ctx28.textAlign = "center"

    ctx28.font = "95px Origin Tech"
    ctx28.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx28.lineWidth = 2
    ctx28.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx28.font = "45px Origin Tech"
    ctx28.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx28.font = "75px Origin Tech"
        ctx28.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx28.lineWidth = 1.5
        ctx28.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx28.font = "75px Origin Tech"
        ctx28.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx28.lineWidth = 1.5
        ctx28.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx28.font = "75px Origin Tech"
        ctx28.fillText(`${guild.memberCount}`, dim.width - 82, dim.height - 20)
        ctx28.lineWidth = 1.5
        ctx28.strokeText(`${guild.memberCount}`, dim.width - 82, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx28.font = "75px Origin Tech"
        ctx28.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx28.lineWidth = 1.5
        ctx28.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx28.font = "75px Origin Tech"
        ctx28.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx28.lineWidth = 1.5
        ctx28.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx28)


    /**//**//**//**//**//**//**//**//**/
    /**//**//**//**//**//**//**//**//**/


    const backimg29 = await Canvas.loadImage(frame29)
    ctx29.drawImage(backimg29, 0, 0)


    ctx29.fillStyle = "rgba(0,0,0,0)"
    ctx29.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg29 = await Canvas.loadImage(avatarURL)
    ctx29.save()

    ctx29.beginPath()
    ctx29.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx29.closePath()
    ctx29.clip()

    ctx29.drawImage(avimg29, avSize.x, avSize.y)
    ctx29.restore()

    ctx29.fillStyle = '#ffffff'
    ctx29.textAlign = "center"

    ctx29.font = "95px Origin Tech"
    ctx29.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx29.lineWidth = 2
    ctx29.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx29.font = "45px Origin Tech"
    ctx29.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx29.font = "75px Origin Tech"
        ctx29.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx29.lineWidth = 1.5
        ctx29.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx29.font = "75px Origin Tech"
        ctx29.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx29.lineWidth = 1.5
        ctx29.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx29.font = "75px Origin Tech"
        ctx29.fillText(`${guild.memberCount}`, dim.width - 22, dim.height - 20)
        ctx29.lineWidth = 1.5
        ctx29.strokeText(`${guild.memberCount}`, dim.width - 22, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx29.font = "75px Origin Tech"
        ctx29.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx29.lineWidth = 1.5
        ctx29.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx29.font = "75px Origin Tech"
        ctx29.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx29.lineWidth = 1.5
        ctx29.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    encoder.addFrame(ctx29)


    /**//**//**//**//**//**//**//**//**/

    encoder.finish()

    const result = await testSchema.findOne({
        memberId: member.id
    })

    console.log(result)

    if (result == null) {
        console.log('user not found')
        await new testSchema({
            memberName: username,
            memberTag: `#${discrim}`,
            memberId: member.id,
            invNumber: 0,
            coins: 0,
            xp: 0,
            level: 0,
            levelupXp: 50,
            lastmessage: 1,
            lastmessage24: 1,
            realxp: 0
        }).save()

        const resultado1 = await testSchema.findOneAndUpdate(
            {
                memberId: inviter.id
            },
            {
                $inc: {
                    invNumber: 1
                }
            }
        )

        console.log(inviter.id)

        bot.createMessage(welcomeChannelId, ('Olá, sê bem-vindo!'))
    }

    else {
        console.log('user found')
        bot.createMessage(welcomeChannelId, ('Olá, sê bem-vindo denovo, já n é a primeira vez que aqui entras...'))
    }

    const resultado2 = await testSchema.findOne(
        {
            memberId: inviter.id
        }
    )

    console.log(member)

    const idade = await new Date(member.user.createdTimestamp).toLocaleDateString()

    bot.createMessage(welcomeChannelId, ({
        content: `>>> <:twinkle:936021682173394985>**[EN]** Hey <:star:936021714884780082><@${member.id}>!<:star:936021714884780082>  Welcome to the **__Hype Services/Community__**<:programar:928380576497561712>. Always remember to follow the <#927506007201042454> and have Fun! <a:purple:927541234648625193>\n<:twinkle:936021682173394985>**[PT]** Olá <:star:936021714884780082><@${member.id}>!<:star:936021714884780082>  Bem-vindo à **__Hype Services/Community__**<:programar:928380576497561712>. Não te esqueças de seguir as <#927506007201042454> e Diverte-te! <a:purple:927541234648625193>\n<:twinkle:936021682173394985>**Account Information**:  Creation Date(${idade})   ID(${member.id})\nThis person was invited by ${inviter}, that now has ${resultado2.invNumber} invites`,
        files: ['../../myanimated.gif']
    }))
})

bot.connect();