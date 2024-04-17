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

// Fetch current pantry items
async function fetchCurrentPantryItems(user) {
    const pantryName = user.pantryName;
    return new Promise((resolve, reject) => {
        InvDAO.getAllInventory({ pantryLocation: pantryName }, (err, items) => {
            if (err) {
                console.error("Error fetching current pantry inventory:", err);
                reject(err);
            } else {
                resolve(items);
            }
        });
    });
}



// Fetch donator names for current pantry items
async function fetchDonatorNames(items) {
    for (const item of items) {
        try {
            const donatorName = await new Promise((resolve, reject) => {
                UserDAO.getNameById(item.userId, (err, name) => {
                    if (err) {
                        console.error("Error fetching donator name:", err);
                        reject(err);
                    } else {
                        resolve(name || "Unknown");
                    }
                });
            });
            item.donatorName = donatorName;
        } catch (err) {
            console.error("Error fetching donator name:", err);
            item.donatorName = "Unknown";
        }
    }
}

// Fetch other pantry items
async function fetchOtherPantryItems(pantryName) {
    return new Promise((resolve, reject) => {
        InvDAO.getAllInventory({ pantryLocation: { $ne: pantryName } }, (err, items) => {
            if (err) {
                console.error("Error fetching other pantry inventory:", err);
                reject(err);
            } else {
                resolve(items);
            }
        });
    });
}

// Method to fetch expired items
async function fetchExpiredItems() {
    return new Promise((resolve, reject) => {
        // Get today's date
        const today = new Date();
        
        // Query for items with expiration dates before today's date
        InvDAO.checkExpiration((err, expiredItems) => {
            if (err) {
                console.error("Error fetching expired items:", err);
                reject(err);
            } else {
                resolve(expiredItems);
            }
        });
    });
}


// Method to render the pantry inventory
exports.showPantryInventory = async function(req, res) {
    try {
        const user = req.user;

        // Check if the user object exists and has the pantryName property
        if (user && user.pantryName) {
            // Fetch current pantry items
            const currentPantryItems = await fetchCurrentPantryItems(user);

            // Fetch expired items
            const expiredItems = await fetchExpiredItems();

            // Fetch donator names for current pantry items
            await fetchDonatorNames(currentPantryItems);

            // Fetch other pantry items
            const otherPantryItems = await fetchOtherPantryItems(user.pantryName);

            // Render the pantry inventory page with inventory data
            res.render("pantry/pantryInventory", { 
                user, 
                currentPantryInventory: currentPantryItems, 
                otherPantryInventory: otherPantryItems,
                expiredItems: expiredItems
            });
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
