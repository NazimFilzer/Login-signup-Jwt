const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please Enter an Email"], // [value,err] This Shows as an error
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please Enter a Valid Email"]
    },

    password: {
        type: String,
        required: [true, "Please Enter an Password"],
        minlength: [4, "Minimum Passowrd Lenght is 4"]
    }
});

//Fire a Funtion after a doc is saved in a db
userSchema.post('save', (doc, next) => { // This is a mongoose hook This triggers when a save funtion happens
    console.log("User was Created and Saved", doc);
    next(); // As this is a middleware it needs to go to next middlewar?
})

//Fire a funtion before a doc is saved in a db
// this refers to the object created
userSchema.pre("save", async function (next) {
    console.log("User is about to get saved");
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//Static method to login User
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect Password")
    }
    throw Error("Incorrect Email")

}

const User = mongoose.model("user", userSchema);

module.exports = User;