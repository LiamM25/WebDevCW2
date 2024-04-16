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

exports.showAdminUserSettings = function(req, res) {
    const user = req.user;
    res.render("admin/adminUserSettings", { user: user });
};

exports.showAdminHome = function(req, res) {
    const user = req.user;
    res.render("admin/adminHome", { user: user });
};

exports.showAdminInv = async function(req, res) {
    try {
        const user = req.user;
        
        // Extract filter options from the request query
        const filterOptions = {
            pantryLocation: req.query.pantryLocation || null,
            itemType: req.query.itemType || null,
            confirmed: req.query.confirmed || null,
        };
        
        // Call the getAllInventory method with the filter options
        const items = await new Promise((resolve, reject) => {
            InvDAO.getAllInventory(filterOptions, (err, items) => {
                if (err) {
                    console.error("Error fetching inventory:", err);
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });

        // Fetch donator names for each item
        for (const item of items) {
            try {
                const donatorName = await new Promise((resolve, reject) => {
                    UserDAO.getNameById(item.userId, (err, donatorName) => {
                        if (err) {
                            console.error("Error fetching donator name:", err);
                            reject(err);
                        } else {
                            resolve(donatorName);
                        }
                    });
                });
                item.donatorName = donatorName;
            } catch (err) {
                console.error("Error fetching donator name:", err);
                item.donatorName = "Unknown";
            }
        }

        // Render the adminInventory page with inventory data
        res.render("admin/adminInventory", { user: user, inventory: items });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error fetching inventory");
    }
};


// Method to handle admin user creation
exports.adminCreateUser = function(req, res) {
    // Extract user data 
    const { firstName, lastName, email, password, role, pantryName } = req.body;

    // Check if any required fields are missing
    if (!firstName || !lastName || !email || !password || !role) {
        res.status(401).send("Missing required fields");
        return;
    }

    // Check if the user already exists
    UserDAO.lookup(email, function (err, user) {
        if (user) {
            res.status(401).send("User already exists: " + email);
            return;
        }

        // Create the admin user
        UserDAO.adminCreate(firstName, lastName, email, password, role, pantryName, function (err) {
            if (err) {
                res.status(500).send("Error creating user: " + err.message);
                return;
            }
            console.log("Admin user created:", email);
            res.redirect("/admin/adminUserSettings");
        });
    });
};

// Method to handle logout
exports.logout = function (_req, res) {
    // Call clearCookies
    auth.clearCookies(res);

    // Redirect the user to the index
    res.redirect("/");
};

exports.deleteUser = function(req, res) {
    const userId = req.body.userId;

    // Call the deleteUser method 
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
    const itemId = req.body.itemId; // Retrieve item ID 

    // Call the deleteInventoryItem method 
    InvDAO.deleteInventoryItem(itemId, (err) => {
        if (err) {
            console.error("Error deleting inventory item:", err);
            // Handle error response
            res.status(500).send("Error deleting inventory item");
            return;
        }
        console.log("Successfully deleted inventory item:", itemId);
        // Redirect back to the admin inventory
        res.redirect("/admin/adminInventory");
    });
};
