const UserDAO = require("../models/userModel");
const auth = require("../authentication/auth.js");


// Method to render the login page
exports.showLogin = function (_req, res) {
    res.render("user/login");
};

// Method to render the registration page
exports.showRegisterPage = function (_req, res) {
    res.render("user/register");
};

// Method to render the home page
exports.showHomePage = function(req, res) {
    const user = req.user;
    res.render("user/home", { user: user });
};


// Method to render the pantry home
exports.showPantryHome = function(req, res) {
    const user = req.user;
    res.render("pantry/pantryHome", { user: user });
};



// Method to handle user login
exports.postLogin = function (req, res) {
    // Call the login method from auth.js to handle user login
    auth.login(req, res, function (err) {
        if (err) {
            // Handle login error
            console.error("Error logging in:", err);
            return res.status(500).send("Internal server error");
        }
        

        // Redirect to the appropriate route based on user's role
        const userRole = req.userRole; // Access user's role from req object
        console.log("User Role:", userRole);
        if (userRole === 'user') {
            res.redirect("/user/home");
        } else if (userRole === 'pantry') {
            res.redirect("/pantry/pantryHome");
        } else if (userRole === 'admin') {
            res.redirect("/admin/adminHome");
        } else {
            // Handle unknown role
            res.status(403).send("Unknown role");
        }
    });
};


// Method to handle registration 
exports.postNewUser = function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const role = 'user';

    if (!firstName || !lastName || !email || !password) {
        res.status(401).send("Missing required fields");
        return;
    }
    UserDAO.lookup(email, function (_err, u) {
        if (u) {
            res.status(401).send("User exists: " + email);
            return;
        }
        UserDAO.create(firstName, lastName, email, password, role, function (err) {
            if (err) {
                res.status(500).send("Error creating user: " + err.message);
                return;
            }
            console.log("Registered user:", email);
            res.redirect("/user/login");
        });
    });
};

// Method to handle user logout
exports.logout = function (_req, res) {
    // Call clearCookies method from auth module to clear cookies
    auth.clearCookies(res);

    // Redirect the user to the homepage or login page
    res.redirect("/");
};

