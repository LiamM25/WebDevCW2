const UserDAO = require("../models/userModel");
const InvDAO = require("../models/inventoryModel");
const auth = require("../authentication/auth.js");
const e = require("express");
const async = require('async');


// Method to render the user db page
exports.showUserDbPage = function(req, res) {
    const user = req.user;
    
    UserDAO.getAllUsers((err, users) => {
        if (err) {
            // Handle error
            console.error("Error fetching users:", err);
            res.status(500).send("Internal server error");
            return;
        }
        // Render the user database page with the list of users
        res.render("admin/userDb", { users: users, user: user });
    });
};

exports.showAdminHome = function(req, res) {
    const user = req.user;
    res.render("admin/adminHome", { user: user });
};

exports.showAdminInv = function(req, res) {
    const user = req.user;
    
    // Extract filter options from the request query
    const filterOptions = {
        pantryLocation: req.query.pantryLocation || null,
        itemType: req.query.itemType || null,
        confirmed: req.query.confirmed || null,
    };
    
    // Call the getAllInventory method with the filter options
    InvDAO.getAllInventory(filterOptions, (err, items) => {
        if (err) {
            console.error("Error fetching inventory:", err);
            // Handle error
            res.status(500).send("Error fetching inventory");
        } else {
            console.log("Successfully fetched inventory:", items);

            // Iterate through each inventory item and fetch the donator's name
            async.each(items, (item, callback) => {
                // Fetch the donator's name using getNameById method
                UserDAO.getNameById(item.userId, (nameErr, donatorName) => {
                    if (nameErr) {
                        console.error("Error fetching donator name:", nameErr);
                        // Handle error
                        item.donatorName = "Unknown"; // Set a default value
                    } else {
                        item.donatorName = donatorName; // Assign the donator's name
                    }
                    callback(); // Move to the next item
                });
            }, (asyncErr) => {
                if (asyncErr) {
                    console.error("Error fetching donator name:", asyncErr);
                }

                // Render the adminInventory page with inventory data
                res.render("admin/adminInventory", { user: user, inventory: items });
            });
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

exports.deleteInvItem = function(req, res) {
    const itemId = req.body.itemId; // Retrieve item ID from the request body

    // Call the deleteInventoryItem method from InvDAO to delete the item
    InvDAO.deleteInventoryItem(itemId, (err) => {
        if (err) {
            console.error("Error deleting inventory item:", err);
            // Handle error response
            res.status(500).send("Error deleting inventory item");
            return;
        }
        console.log("Successfully deleted inventory item:", itemId);
        // Redirect back to the admin inventory page after deletion
        res.redirect("/admin/adminInventory");
    });
};
