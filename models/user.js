const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: true,
    validate: [isEmail, "Please enter a valid email."],
  },
  name: {
    type: String,
    required: [true, "Please enter a name."],
    unique: true,
  },
  password: {
    type: String,
    required: [
      true,
      "Please enter a password with a minimum length of 6 characters.",
    ],
    minlength: [6, "Password is shorter than the minimum allowed length (6)."],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  // console.log("Here is the user to be saved", this);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
