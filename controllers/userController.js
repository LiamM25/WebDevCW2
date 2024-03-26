const UserDAO = require("../models/userModel");
const jwt = require("jsonwebtoken");

const userDB = new UserDAO();
userDB.init();

// Method to render the login page
exports.showLogin = function (req, res) {
    res.render("user/login");
};

// Method to handle user login
exports.handleLogin = function (req, res) {
    const { username, password } = req.body;
    // Authenticate user
    userDB.authenticate(username, password, function (err, user) {
        if (err || !user) {
            // Handle authentication failure
            console.error("Authentication failed:", err || "Invalid username or password");
            res.status(401).send("Invalid username or password");
        } else {
            // Set JWT token
            const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 }); // expires in 1 hour
            res.redirect("/..placeholder"); // Redirect after login
        }
    });
};

// Method to render the registration page
exports.showRegisterPage = function (req, res) {
    res.render("user/register");
};

// Method to handle registration 
exports.postNewUser = function (req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Check if any field is empty
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).send("All fields are required");
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
    }

    // Check if the email already exists
    userDB.lookup(email, function (err, existingUser) {
        if (err) {
            console.error("Error looking up user:", err);
            return res.status(500).send("Internal server error");
        } 
        if (existingUser) {
            console.log("User already exists:", email);
            return res.status(400).send("User already exists");
        }

        // Hash the password
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Internal server error");
            }
            
            // Create new user
            userDB.create(email, hash, firstName, lastName);
            res.redirect("/login");
        });
    });
}

// Method to handle user logout
exports.logout = function (req, res) {
    // Clear JWT token by clearing cookie
    res.clearCookie("jwt").redirect("/");
};