const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {
  const { email, password } = req.body;

  userModel.lookup(email, function (err, user) {
    if (err) {
      console.error("Error looking up user:", err);
      return res.status(500).send("Internal server error");
    }

    if (!user) {
      console.log("User", email, "not found");
      return res.status(401).render("user/register");
    }

    // Compare provided password with stored password hash
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Internal server error");
      }

      if (result) {
        // Passwords match, generate access token
        const payload = { email: email };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });

        // Set access token as a cookie
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 300000 });

        // Proceed to the next middleware
        next();
      } else {
        // Passwords don't match
        console.log("Incorrect password for user", email);
        return res.status(403).render("user/login");
      }
    });
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