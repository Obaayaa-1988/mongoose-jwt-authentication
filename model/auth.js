const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const { Schema } =  mongoose;

const authSchema = new Schema({
    //username:{
        //type: String
    //},

    email:{
        type: String,
        required: [true, "Please enter your email"],
        lowercase: true,
        unique: true

    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        unique: true,
        minlength: [5, "Must be more than 5"]

    },

})

//hashing the password after a user put in the his/her password

authSchema.pre('save', async function(next) {
    const salty = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salty);
    next()
})






const Signer =mongoose.model("Signer", authSchema);

module.exports = Signer;
