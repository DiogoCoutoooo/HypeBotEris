import mongoose from 'mongoose'

const reqString = {
    type: String,
    required: true
}

const reqNumber = {
    type: Number,
    required: true
}

const schema = new mongoose.Schema({
    memberName: reqString,
    memberTag: reqString,
    memberId: reqString,
    invNumber: reqNumber,
    coins: reqNumber,
    xp: reqNumber,
    level: reqNumber,
    levelupXp: reqNumber,
    lastmessage: reqNumber,
    lastmessage24: reqNumber,
    realxp: reqNumber
})

export default mongoose.model('testing', schema, 'testing')