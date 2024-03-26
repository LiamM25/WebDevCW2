const UserDOA = require("../models/userModel");
const jwt = require("jsonwebtoken");



// Login method to handle user login
exports.login = function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  // Retrieve user from the database based on email
  UserDAO.lookup(email)
    .then(user => {
      if (!user) {
        // User not found
        return res.status(401).render("user/login");
      }

      // Compare provided password with hashed password
      bcrypt.compare(password, user.password, function (err, result) {
        if (err || !result) {
          // Incorrect password
          console.error("Incorrect password for user", email);
          return res.status(403).render("user/login");
        }

        // Passwords match, generate JWT token
        const payload = { email: user.email };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });

        // Set access token as a cookie
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 300000 });

        // Proceed to the next middleware
        next();
      });
    })
    .catch(err => {
      console.error("Error looking up user:", err);
      return res.status(500).send("Internal server error");
    });
};

exports.verify = function (req, res, next) {
  const accessToken = req.cookies.jwt;

  if (!accessToken) {
    console.log("Access token not found in cookie");
    return res.status(403).send("Access token not provided");
  }

  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (e) {
    console.error("Error verifying access token:", e.message);
    return res.status(401).send("Invalid access token");
  }
};