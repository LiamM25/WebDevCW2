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


exports.newDonation = function(req, res) {
    const user = req.user;

    // Extract the donation items from the request body
    const donationItems = [];
    for (let i = 1; i <= req.body.itemCount; i++) {
        const pantryLocation = req.body['pantryLocation' + i];
        const itemType = req.body['itemType' + i];
        const itemName = req.body['itemName' + i];
        const itemQuantity = req.body['itemQuantity' + i];
        const weight = req.body['weight' + i];
        const expirationDate = req.body['expirationDate' + i];
        const harvestDate = req.body['harvestDate' + i];
        const confirmed = req.body['confirmed' + i];

        // Create a new donation item object
        const donationItem = {
            userId: user.userId,
            pantryLocation: pantryLocation,
            itemType: itemType,
            itemName: itemName,
            itemQuantity: itemQuantity,
            weight: weight,
            expirationDate: expirationDate,
            harvestDate: harvestDate,
            confirmed: confirmed
        };

        donationItems.push(donationItem);
    }

    // Save each donation item to the database
    async.each(donationItems, (item, callback) => {
        InvDAO.createItem(item, (err, newDonation) => {
            if (err) {
                console.error("Error creating donation:", err);
            } else {
                console.log("New donation created:", newDonation);
            }
            callback(); // Move to the next item
        });
    }, (asyncErr) => {
        if (asyncErr) {
            console.error("Error creating donations:", asyncErr);
            res.status(500).send("Error creating donations");
        } else {
            res.render("user/userDonate", { user: user });
        }
    });
};
