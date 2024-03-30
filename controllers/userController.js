const UserDAO = require("../models/userModel");
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
    // Call clearCookies method from auth module to clear cookies
    auth.clearCookies(res);

    // Redirect the user to the homepage or login page
    res.redirect("/");
};

exports.renderUserDonatePage = function(req, res) {
    const user = req.user;
    res.render("user/userDonate", { user: user });
    
};


exports.newDonation = function(req, res){
    const user = req.user;
    const { pantryLocation, itemType, itemName, itemQuantity, weight, expirationDate, harvestDate, confirmed } = req.body;

    InvDAO.createItem(user.userId, pantryLocation, itemType, itemName, itemQuantity, weight, expirationDate, harvestDate, confirmed, (err, newDonation) => {
        if (err) {
            console.error("Error creating donation:", err);
            res.status(500).send("Error creating donation");
        } else {
            console.log("New donation created:", newDonation);
            res.render("user/userDonate", { user: user });
        }
    });
}
