const UserDAO = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userDB = new UserDAO();



// Method to render the login page
exports.showLogin = function (req, res) {
    res.render("user/login");
};

// Method to render the registration page
exports.showRegisterPage = function (req, res) {
    res.render("user/register");
};

// Method to render the home page
exports.showHomePage = function(req, res) {
    res.render("user/home");
};




// Method to handle user login
exports.postLogin = async function (req, res) {
    const { email, password } = req.body;

    try {
        // Check if any field is empty
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        // Find user by email
        const user = await userDB.lookup(email);

        // Check if user exists
        if (!user) {
            console.log("User not found");
            return res.status(401).send("Invalid email or password");
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("Incorrect password");
            return res.status(401).send("Invalid email or password");
        }

        // Passwords match, log in successful
        console.log("Login successful");
        // Redirect or send response as needed
        res.redirect("/user/home");
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).send("Internal server error");
    }
}



// Method to handle registration 
exports.postNewUser = async function (req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        // Check if any field is empty
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).send("All fields are required");
        }

        // Check if the passwords match
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        // Check if the email already exists
        const existingUser = await userDB.lookup(email);
        if (existingUser) {
            console.log("User already exists:", email);
            return res.status(400).send("User already exists");
        }

        // Create new user
        console.log("Creating new user:", email);
        await userDB.create(firstName, lastName, email, password);
        console.log("Redirecting");
        res.redirect("/user/login");
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).send("Internal server error");
    }
}

// Method to handle user logout
exports.logout = function (req, res) {
    // Clear JWT token by clearing cookie
    res.clearCookie("jwt").redirect("/");
};

