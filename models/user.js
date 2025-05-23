const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  usernameUnique: true,
  errorMessages: {
    UserExistsError: "This email is already registered",
  },
});
module.exports = mongoose.model("User", userSchema);
