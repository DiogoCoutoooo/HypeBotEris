import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    findID: Number,
    count: Number,
    lastCounter: String
})

export default mongoose.model('lastCounter', schema, 'lastCounter')