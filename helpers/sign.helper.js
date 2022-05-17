const jwt = require("jsonwebtoken");

// error handling function

module.exports.handleErrors = (err) => {
  let errors = { email: "", password: "" };


  if (err.code === 11000) {
    errors.email = "Email already exist please Login";
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach((prop) => {
      if (prop.path === "email") {
        errors.email = prop.message;
      }

      if (prop.path === "password") {
        errors.password = prop.message;
      }
    });
  }
  return errors;
  // console.log('-----',errors)
};

const JWT_SECRET = 'HGFGHFGHFGHGJHJHFHGHJJKGJ'

//function for generating token after a user has successfully been authenticated
module.exports.generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: 3 * 24 * 60 * 60 * 1000,
    });
  };
  