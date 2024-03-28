const UserDAO = require("../models/userModel");
const InvDAO = require("../models/inventoryModel");
const auth = require("../authentication/auth.js");


// Method to render the user db page
exports.showUserDbPage = function(req, res) {
    
    UserDAO.getAllUsers((err, users) => {
        if (err) {
            // Handle error
            console.error("Error fetching users:", err);
            res.status(500).send("Internal server error");
            return;
        }
        // Render the user database page with the list of users
        res.render("admin/userDb", { users: users });
    });
};

exports.showAdminHome = function(req, res) {
    const user = req.user;
    res.render("admin/adminHome", { user: user });
};

exports.showAdminInv = function(req, res) {
    const user = req.user;
    
    // Extract filter options from request query
    const filterOptions = {
        pantryLocation: req.query.pantry || null,
        itemType: req.query.itemType || null,
        confirmed: req.query.confirmed || null
    };

    // Call InvDAO method to fetch inventory data with filters
    InvDAO.getAllInventory(filterOptions, (err, inventory) => {
        if (err) {
            console.error("Error fetching inventory:", err);
            // Handle error
            res.status(500).send("Error fetching inventory");
        } else {
            // Render admin inventory page with inventory data
            res.render("admin/adminInventory", { user: user, inventory: inventory });
        }
    });
};

// Method to handle logout
exports.logout = function (_req, res) {
    // Call clearCookies method from auth module to clear cookies
    auth.clearCookies(res);

    // Redirect the user to the homepage or login page
    res.redirect("/");
};

exports.deleteUser = function(req, res) {
    const userId = req.body.userId;

    // Call the deleteUser method from your userModel to delete the user
    UserDAO.deleteUser(userId, (err) => {
        if (err) {
            // Handle error
            console.error("Error deleting user:", err);
            res.status(500).send("Internal server error");
            return;
        }
        // Redirect back to the user database page after deletion
        res.redirect("/admin/userDb");
    });
};
