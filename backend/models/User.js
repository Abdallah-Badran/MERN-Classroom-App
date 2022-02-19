import mongoose from 'mongoose'
import crypto from 'crypto'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required']  // error : error.errors.fieldname.message 
    },
    email: {
        type: String,
        trim: true,
        unique: true, // error : error.code, error.keyValue
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], // error : error.errors.fieldname.message 
        required: [true, 'Email is required']  // error : error.errors.fieldname.message 
    },
    hashed_password: {
        type: String,
        required: [true, "Password is required"] // error : error.errors.fieldname.message 
    },
    salt: String,
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    educator: {
        type: Boolean,
        default: false
    }
})

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

UserSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (/*this.isNew &&*/ !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

const model = mongoose.model('User', UserSchema)

export default model