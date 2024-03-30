const UserDAO = require("../models/userModel");
const InvDAO = require("../models/inventoryModel");
const auth = require("../authentication/auth.js");


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
    if (user) {
    res.render("user/userDonate", { user: user });
}else {
    // Handle the case where user object is null or pantryName property is missing
    console.error("User session expired or invalid");
    res.redirect('/');
}
};


exports.newDonation = function(req, res){
    const user = req.user;

    if (user) {
    const { userId, pantryLocation, itemType, itemName, itemQuantity, weight, expirationDate, harvestDate, confirmed } = req.body;

    InvDAO.createItem(userId, pantryLocation, itemType, itemName, itemQuantity, weight, expirationDate, harvestDate, confirmed, (err, newDonation) => {
        if (err) {
            console.error("Error creating donation:", err);
            // Handle error
            res.status(500).send("Error creating donation");
        } else {
            console.log("New donation created:", newDonation);
            // Redirect to a success page or render a success message
            res.status(200).send("Donation created successfully");
        }
    });
    }else {
        // Handle the case where user object is null or pantryName property is missing
        console.error("User session expired or invalid");
        res.redirect('/');
    }

}