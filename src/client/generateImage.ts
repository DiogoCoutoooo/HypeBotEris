import Canvas from 'canvas'

const fs = require('fs');
Canvas.registerFont('OriginTech.ttf', { family: 'Origin Tech' })

// "https://i.ibb.co/19rc7L4/imagem.png"

const frame00 = "https://i.ibb.co/6X060gS/frame00.png"

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

const generateFrame = async (member) => {

    const { guild } = member

    let username = member.user.username
    let discrim = member.user.discriminator
    let avatarURL = member.user.displayAvatarURL({format: "png", dynamic: false, size: avSize.size})

    const canvas = Canvas.createCanvas(dim.width, dim.height)
    const ctx = canvas.getContext('2d')

    /**/

    const backimg = await Canvas.loadImage(frame00)
    ctx.drawImage(backimg, 0, 0)

    
    ctx.fillStyle = "rgba(0,0,0,0)"
    ctx.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avimg = await Canvas.loadImage(avatarURL)
    ctx.save()

    ctx.beginPath()
    ctx.arc(avSize.x + avSize.size / 2, avSize.y + avSize.size / 2, avSize.size / 2, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(avimg, avSize.x, avSize.y)
    ctx.restore()

    ctx.fillStyle = '#ffffff'
    ctx.textAlign = "center"

    ctx.font = "95px Origin Tech"
    ctx.fillText("Welcome", dim.width / 2, dim.height - dim.margin - 80)
    ctx.lineWidth = 2
    ctx.strokeText("Welcome", dim.width / 2, dim.height - dim.margin - 80)

    ctx.font = "45px Origin Tech"
    ctx.fillText(`${username}#${discrim}`, dim.width / 2, dim.height - dim.margin - 25)

    if (guild.memberCount < 9) {
        ctx.font = "75px Origin Tech"
        ctx.fillText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
        ctx.lineWidth = 1.5
        ctx.strokeText(`${guild.memberCount}`, dim.width - 35, dim.height - 20)
    }

    else if (guild.memberCount > 9 && guild.memberCount < 100) {
        ctx.font = "75px Origin Tech"
        ctx.fillText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
        ctx.lineWidth = 1.5
        ctx.strokeText(`${guild.memberCount}`, dim.width - 58, dim.height - 20)
    }

    else if (guild.memberCount > 99 && guild.memberCount < 1000) {
        ctx.font = "75px Origin Tech"
        ctx.fillText(`${guild.memberCount}`, dim.width - 81, dim.height - 20)
        ctx.lineWidth = 1.5
        ctx.strokeText(`${guild.memberCount}`, dim.width - 81, dim.height - 20)
    }

    else if (guild.memberCount > 999 && guild.memberCount < 10000) {
        ctx.font = "75px Origin Tech"
        ctx.fillText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
        ctx.lineWidth = 1.5
        ctx.strokeText(`${guild.memberCount}`, dim.width - 104, dim.height - 20)
    }

    else if (guild.memberCount > 9999 && guild.memberCount < 100000) {
        ctx.font = "75px Origin Tech"
        ctx.fillText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
        ctx.lineWidth = 1.5
        ctx.strokeText(`${guild.memberCount}`, dim.width - 127, dim.height - 20)
    }

    const buffer0 = canvas.toBuffer('image/png')
    fs.writeFileSync("../../imagem0.png", buffer0);
    return buffer0
    
    //const attachment = canvas.toDataURL('imagem0/png')
    //return attachment
}

module.exports = generateFrame