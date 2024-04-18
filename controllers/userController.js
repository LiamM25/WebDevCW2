const InvDAO = require("../models/inventoryModel");
const auth = require("../authentication/auth.js");


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
    // Call clearCookies method
    auth.clearCookies(res);

    // Redirect the user
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

    // Extract the donation item
    const userId = user.userId; // user ID from req.user
    const pantryLocation = req.body.pantryLocation;
    const itemType = req.body.itemType;
    const itemName = req.body.itemName;
    const itemQuantity = req.body.itemQuantity;
    const weight = req.body.weight || ''; // Set to empty string if not provided
    const expirationDate = req.body.expirationDate || ''; 
    const harvestDate = req.body.harvestDate || ''; 
    const confirmed = req.body.confirmed || false; 

    // Call the createItem function
    InvDAO.createItem(userId, pantryLocation, itemType, itemName, itemQuantity, weight, expirationDate, harvestDate, confirmed, (err, newDonation) => {
        if (err) {
            console.error("Error creating donation:", err);
            res.status(500).send("Error creating donation");
        } else {
            console.log("New donation created:", newDonation);
            res.render("user/userDonate", { user: user, successMessage: "Donation successful. Thank you!" });
        }
    });
};