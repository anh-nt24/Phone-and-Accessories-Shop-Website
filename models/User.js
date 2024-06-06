const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    Gmail: String,
    Password: String,
    FullName: String,
    FirstLogin: Boolean,
    UserName: String,
    Role: String,
    Status: String,
    Avatar: Buffer,
    SecretCode: String
})

const UserChar = mongoose.model('userChar', UserSchema)
module.exports = UserChar
