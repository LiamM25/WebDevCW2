const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


// Login method to handle user login
exports.login = function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  console.log("Attempting to log in user with email:", email);

  // Retrieve user from the database based on email
  UserModel.lookup(email, (err, user) => {
    if (err) {
      console.error("Error looking up user:", err);
      return res.status(500).send("Internal server error");
    }

    if (!user) {
      // User not found
      console.log("User not found:", email);
      return res.status(401).render("user/login");
    }

    console.log("User found:", email);

    // Compare provided password with hashed password
    bcrypt.compare(password, user.password, function (err, result) {
      if (err || !result) {
        // Incorrect password
        console.error("Incorrect password for user", email);
        return res.status(403).render("user/login");
      }

      console.log("Password correct for user:", email);

      // Passwords match, generate JWT token
      const payload = { 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });

      // Set access token as a cookie
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 300000 });

      console.log("JWT token generated for user:", email);

      // Proceed to the next middleware
      next();
    });
  });
};

exports.verify = function (req, res, next) {
  const accessToken = req.cookies.jwt;

  if (!accessToken) {
    console.log("Access token not found in cookie");
    req.user = null; // Set req.user to null indicating user is not authenticated
    return next(); // Proceed to the next middleware without authentication
  }

  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload; // Set req.user to the decoded payload
    next(); // Proceed to the next middleware with authentication
  } catch (e) {
    console.error("Error verifying access token:", e.message);
    return res.status(401).send("Invalid access token");
  }
};