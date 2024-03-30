const UserDAO = require("../models/userModel");
const InvDAO = require("../models/inventoryModel");
const auth = require("../authentication/auth.js");
const e = require("express");
const async = require('async');


// Method to render the pantry home
exports.showPantryHome = function(req, res) {
    const user = req.user;
    res.render("pantry/pantryHome", { user: user });
};

exports.showPantryInventory = function(req, res) {
    const user = req.user;

    // Check if the user object exists and has the pantryName property
    if (user && user.pantryName) {
        const pantryName = user.pantryName; // Retrieve pantry name from the user object

        // Proceed with fetching inventory items associated with the current pantry
        InvDAO.getAllInventory({ pantryLocation: pantryName }, (err, currentPantryItems) => {
            if (err) {
                console.error("Error fetching current pantry inventory:", err);
                // Handle error
                res.status(500).send("Error fetching current pantry inventory");
            } else {
                // Preprocess inventory data to add helper properties for conditional rendering
                currentPantryItems.forEach(item => {
                    item.confirmedEqualsYes = item.confirmed === 'Yes';
                    item.confirmedEqualsNo = item.confirmed === 'No';
                });

                // Iterate through each inventory item and fetch the donator's name
                async.each(currentPantryItems, (item, callback) => {
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
        // Handle the case where user object is null or pantryName property is missing
        console.error("User session expired or invalid");
        res.redirect('/');
    }
};

// Handler for updating inventory item confirmation status
exports.updateInventoryConfirmation = function(req, res) {
    const itemId = req.body.itemId;
    const confirmed = req.body.confirmed;

    // Update the confirmation status in the inventory
    InvDAO.updateInventoryItem(itemId, { confirmed: confirmed }, (err) => {
        if (err) {
            console.error("Error updating inventory item confirmation status:", err);
            // Handle error
            res.status(500).send("Error updating inventory item confirmation status");
        } else {
            console.log("confirmation status updated");
            res.redirect('/pantry/pantryInventory');
        }
    });
};
