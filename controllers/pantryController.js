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

// Method to render the pantry home
exports.showPantryHome = function(req, res) {
    const user = req.user;
    res.render("pantry/pantryHome", { user: user });
};

// Method to render the pantry inv
exports.showPantryInventory = async function(req, res) {
    try {
        const user = req.user;

        // Check if the user object exists and has the pantryName property
        if (user && user.pantryName) {
            const pantryName = user.pantryName; // Retrieve pantry name from the user object

            // Fetch inventory items associated with the current pantry
            const currentPantryItems = await new Promise((resolve, reject) => {
                InvDAO.getAllInventory({ pantryLocation: pantryName }, (err, currentPantryItems) => {
                    if (err) {
                        console.error("Error fetching current pantry inventory:", err);
                        reject(err);
                    } else {
                        resolve(currentPantryItems);
                    }
                });
            });

            // Fetch donator names for each item
            for (const item of currentPantryItems) {
                try {
                    const donatorName = await new Promise((resolve, reject) => {
                        UserDAO.getNameById(item.userId, (err, donatorName) => {
                            if (err) {
                                console.error("Error fetching donator name:", err);
                                reject(err);
                            } else {
                                // Check if the donator name is found
                                if (donatorName) {
                                    resolve(donatorName);
                                } else {
                                    // Set a default value for the donator's name
                                    resolve("Unknown");
                                }
                            }
                        });
                    });
                    item.donatorName = donatorName;
                } catch (err) {
                    console.error("Error fetching donator name:", err);
                    item.donatorName = "Unknown";
                }
            }

            // Fetch inventory items associated with other pantries
            const otherPantryItems = await new Promise((resolve, reject) => {
                InvDAO.getAllInventory({ pantryLocation: { $ne: pantryName } }, (err, otherPantryItems) => {
                    if (err) {
                        console.error("Error fetching other pantry inventory:", err);
                        reject(err);
                    } else {
                        resolve(otherPantryItems);
                    }
                });
            });

            // Render the pantry inventory page with inventory data
            res.render("pantry/pantryInventory", { user: user, currentPantryInventory: currentPantryItems, otherPantryInventory: otherPantryItems });
        } else {
            console.error("User session expired or invalid");
            res.redirect('/');
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error fetching inventory");
    }
};


// Handler for updating inventory item fields
exports.updateInventory = function(req, res) {
    // Extract item ID
    const itemId = req.body.itemId;
    const fieldToUpdate = req.body.fieldToUpdate;
    const newValue = req.body.newValue;

    // Update fields object with the field to update and the new value
    const updateFields = { [fieldToUpdate]: newValue };

    // Call the updateInventoryItem method
    InvDAO.updateInventoryItem(itemId, updateFields, (err) => {
        if (err) {
            // Handle error
            return res.status(500).json({ error: `Failed to update ${fieldToUpdate} field.` });
        } else {
           
            res.redirect("/pantry/pantryInventory");
        }
    });
};

//method to delete pantry item
exports.deleteInventoryItem = function(req, res) {
    const itemId = req.body.itemId;

    // Call the deleteUser method 
    InvDAO.deleteInventoryItem(itemId, (err) => {
        if (err) {
            // Handle error
            console.error("Error deleting item:", err);
            res.status(500).send("Internal server error");
            return;
        }
        res.redirect("/pantry/pantryInventory");
    });
}
