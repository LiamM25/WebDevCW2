const UserDAO = require("../models/userModel");
const InvDAO = require("../models/inventoryModel");
const auth = require("../authentication/auth.js");
const async = require('async'); 

exports.checkUserSession = function(req, res, next) {
    const user = req.user;
    if (user) {
        next(); 
    } else {
        console.error("User session expired or invalid");
        res.redirect('/');
    }
};


// Method to render the home page
exports.showHomePage = function(req, res) {
    const user = req.user;
    res.render("user/home", { user: user });
};

// Method to handle user logout
exports.logout = function (_req, res) {
    // Call clearCookies method from auth module to clear cookies
    auth.clearCookies(res);

    // Redirect the user to the homepage or login page
    res.redirect("/");
};

exports.renderUserDonatePage = function(req, res) {
    const user = req.user;
    res.render("user/userDonate", { user: user });
    
};

exports.renderUserContactPage = function(req, res) {
    const user = req.user;
    res.render("user/userContact", { user: user });
    
};


exports.newDonation = function(req, res, next) {
    const user = req.user;

    // Extract the donation item from the request body
    const userId = user.userId; // Extract user ID from req.user
    const pantryLocation = req.body.pantryLocation;
    const itemType = req.body.itemType;
    const itemName = req.body.itemName;
    const itemQuantity = req.body.itemQuantity;
    const weight = req.body.weight || ''; // Set to empty string if not provided
    const expirationDate = req.body.expirationDate || ''; // Set to empty string if not provided
    const harvestDate = req.body.harvestDate || ''; // Set to empty string if not provided
    const confirmed = req.body.confirmed || false; // Set confirmed to false if not provided

    // Call the createItem function from InvDAO
    InvDAO.createItem(userId, pantryLocation, itemType, itemName, itemQuantity, weight, expirationDate, harvestDate, confirmed, (err, newDonation) => {
        if (err) {
            console.error("Error creating donation:", err);
            res.status(500).send("Error creating donation");
        } else {
            console.log("New donation created:", newDonation);
            res.render("user/userDonate", { user: user });
        }
    });
};