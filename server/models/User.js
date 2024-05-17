const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
            next()
        } catch (error) {
            next(error)
        }
    } else {
        next()
    }
})

// Method to compare given password with the hashed password
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
