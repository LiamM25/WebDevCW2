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
exports.showPantryInventory = function(req, res) {
    const user = req.user;

    // Check if the user object exists and has the pantryName property
    if (user && user.pantryName) {
        const pantryName = user.pantryName; // Retrieve pantry name from the user object

        // fetch inventory items associated with the current pantry
        InvDAO.getAllInventory({ pantryLocation: pantryName }, (err, currentPantryItems) => {
            if (err) {
                console.error("Error fetching current pantry inventory:", err);
                // Handle error
                res.status(500).send("Error fetching current pantry inventory");
            } else {
                    currentPantryItems.forEach(item => {
                    item.confirmedEqualsYes = item.confirmed === 'Yes';
                    item.confirmedEqualsNo = item.confirmed === 'No';
                });

                // Iterate through each inventory item and fetch the donator's name
                async.each(currentPantryItems, (item, callback) => {
                    // Fetch the donator's name
                    UserDAO.getNameById(item.userId, (nameErr, donatorName) => {
                        if (nameErr) {
                            console.error("Error fetching donator name:", nameErr);
                            // Handle error
                            item.donatorName = "Unknown";
                        } else {
                            item.donatorName = donatorName; 
                        }
                        callback();
                    });
                }, (asyncErr) => {
                    if (asyncErr) {
                        console.error("Error fetching donator name:", asyncErr);
                    }

                    // Fetch inventory items associated with other pantries
                    InvDAO.getAllInventory({ pantryLocation: { $ne: pantryName } }, (err, otherPantryItems) => {
                        if (err) {
                            console.error("Error fetching other pantry inventory:", err);
                            // Handle error
                            res.status(500).send("Error fetching other pantry inventory");
                        } else {
                            // Render the pantry inventory page with inventory data
                            res.render("pantry/pantryInventory", { user: user, currentPantryInventory: currentPantryItems, otherPantryInventory: otherPantryItems });
                        }
                    });
                });
            }
        });
    } else {
        
        console.error("User session expired or invalid");
        res.redirect('/');
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
