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
      return res.status(401).render("visitor/login");
    }

    console.log("User found:", email);

    // Compare provided password with hashed password
    bcrypt.compare(password, user.password, function (err, result) {
      if (err || !result) {
        // Incorrect password
        console.error("Incorrect password for user", email);
        return res.status(403).render("visitor/login");
      }

      console.log("Password correct for user:", email);

      // generate JWT token
      const payload = { 
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        pantryName: user.pantryName
        
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });

      // Set access token as a cookie
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 300000 });

      console.log("JWT token generated for user:", email);

      // Add user role to the req object
      req.userRole = user.role;
      
      // Proceed to the next middleware
      next();
    });
  });
};

exports.verifyUser = function (req, res, next) {
  verifyWithRole(req, res, next, 'user');
};

exports.verifyPantry = function (req, res, next) {
  verifyWithRole(req, res, next, 'pantry');
};

exports.verifyAdmin = function (req, res, next) {
  verifyWithRole(req, res, next, 'admin');
};

function verifyWithRole(req, res, next, role) {
  const accessToken = req.cookies.jwt;

  if (!accessToken) {
    console.log("Access token not found in cookie");
    req.user = null; 
    return next(); 
  }

  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload; 

    // Check if the user's role matches the specified role
    if (req.user.role === role) {
      console.log(`Verification complete for ${role}`);
      next();
    } else {
      console.log(`Unauthorised access for ${req.user.role}`);
      
      setTimeout(() => {
        res.redirect('/'); 
    }, 5000);
      
    }
  } catch (e) {
    console.error("Error verifying access token:", e.message);
    return res.status(401).send("Invalid access token");
  }
}



exports.verify = function (req, res, next) {
  const accessToken = req.cookies.jwt;

  if (!accessToken) {
    console.log("Access token not found in cookie");
    req.user = null; 
    return next(); 
  }

  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload; 
    console.log("Verification complete");
    next(); 
  } catch (e) {
    console.error("Error verifying access token:", e.message);
    return res.status(401).send("Invalid access token");
  }
};

exports.checkCookieExpiration = function(req, res, next) {
  const accessToken = req.cookies.jwt;
  if (accessToken) {
      try {
          const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
          next();
      } catch (err) {
          if (err instanceof jwt.TokenExpiredError) {
              res.clearCookie('jwt');
              console.log("timed out redirecting");
              return res.redirect('/');
          } else {
              console.error("Error verifying access token:", err.message);
              return res.status(401).send("Invalid access token");
          }
      }
  } else {
      next();
  }
};

exports.clearCookies = function (res) {
  console.log("Clearing cookies");
  res.clearCookie("jwt").status(200);
};