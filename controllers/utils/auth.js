const jwt = require("jsonwebtoken");

module.exports.handleErrors = (err) => {
  const errors = { name: "", email: "", password: "" };

  if (err.message === "Incorrect email") {
    errors.email = "The email is incorrect!";
  }

  if (err.message === "Incorrect password") {
    errors.password = "The password is incorrect!";
  }

  if (err.code === 11000) {
    errors.email = "This email is already taken!";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
module.exports.createToken = (id) => {
  return jwt.sign({ id }, "my great secret", { expiresIn: 60 * 60 * 24 * 3 });
};
