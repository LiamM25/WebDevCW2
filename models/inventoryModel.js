const InvDatastore = require("nedb");

class invDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new InvDatastore({ filename: dbFilePath, autoload: true });
        } else {
            this.db = new InvDatastore();
        }
    }

    init() {
        
        this.db.insert({
            pantryLocation: 'Parkhead School House',
            itemType: 'Fruit/Veg',
            itemName: 'Carrots',
            itemQuantity: '30',
            Weight: '3kg',
            ExpirationDate: '02-04-2024',
            HarvestDate: '28-03-2024',
            confirmed: 'Yes',
        });

        this.db.insert({
            pantryLocation: 'Ruchazie Pantry',
            itemType: 'Canned Goods',
            itemName: 'Soup',
            itemQuantity: '20',
            Weight: '8kg',
            ExpirationDate: '05-05-2025',
            HarvestDate: '',
            confirmed: 'No',
        });

        console.log("Inventory database initialised.");
        return this;
    }

    createItem(userId, pantryLocation, itemType, itemName, itemQuantity, weight, expirationDate, harvestDate, confirmed, cb) {
        const entry = {
            userId: userId, 
            pantryLocation: pantryLocation,
            itemType: itemType,
            itemName: itemName,
            itemQuantity: itemQuantity,
            Weight: weight || '', 
            ExpirationDate: expirationDate || '', 
            HarvestDate: harvestDate || '', 
            confirmed: confirmed || 'No' //donations will be confirmed upon arrival by the pantry
        };
    
        this.db.insert(entry, function(err, newDoc) {
            if (err) {
                console.error("Error creating inventory item:", err);
                cb(err);
            } else {
                console.log("New inventory item created:", newDoc);
                cb(null, newDoc);
            }
        });
    }

    getAllInventory(filterOptions, cb) {
        console.log("Fetching inventory items with filter options:", filterOptions);
        
        // query based on filter options
        const query = {};
        if (filterOptions.pantryLocation) {
            query.pantryLocation = filterOptions.pantryLocation;
        }
        if (filterOptions.itemType) {
            query.itemType = filterOptions.itemType;
        }
        if (filterOptions.confirmed) {
            query.confirmed = filterOptions.confirmed;
        }
    
        // Execute the query
        this.db.find(query, (err, items) => {
            if (err) {
                console.error("Error fetching inventory:", err);
                cb(err, null);
            } else {
                console.log("Successfully fetched inventory:", items);
                cb(null, items);
            }
        });
    }

    deleteInventoryItem(itemId, cb) {
        this.db.remove({ _id: itemId }, {}, (err, numRemoved) => {
            if (err) {
                return cb(err);
            } else {
                console.log(`Deleted ${numRemoved} item(s)`);
                return cb(null);
            }
        });
    }

    deleteUser(userId, cb) {
        this.db.remove({ _id: userId }, {}, (err, numRemoved) => {
            if (err) {
                return cb(err);
            } else {
                console.log(`Deleted ${numRemoved} user(s)`);
                return cb(null);
            }
        });
    }

    updateInventoryItem(itemId, updateFields, cb) {
        this.db.update({ _id: itemId }, { $set: updateFields }, {}, (err, numUpdated) => {
            if (err) {
                console.error("Error updating inventory item:", err);
                cb(err);
            } else {
                console.log(`Updated ${numUpdated} item(s)`);
                cb(null);
            }
        });
    }

    checkExpiration(cb) {
        // Get today's date
        const today = new Date();
    
        // Query for items with expiration dates before today's date
        this.db.find({}, (err, allItems) => {
            if (err) {
                console.error("Error fetching all items:", err);
                cb(err, null);
            } else {
                const expiredItems = allItems.filter(item => {
                    // Convert expiration date to Date object
                    const expirationDate = new Date(item.ExpirationDate);
                    // Compare expiration date with today's date
                    return expirationDate < today;
                });
                console.log("Successfully fetched expired items:", expiredItems);
                cb(null, expiredItems);
            }
        });
    }

}

const dao = new invDAO;
dao.init();
module.exports = dao;


