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
            pantryLocation: 'Pantry1',
            itemType: 'Fruit/Veg',
            itemName: 'Carrots',
            itemQuantity: '30',
            Weight: '3kg',
            ExpirationDate: '02-04-2024',
            HarvestDate: '28-03-2024',
            confirmed: 'Yes',
        });

        this.db.insert({
            pantryLocation: 'Pantry2',
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
        
        // query object based on filter options
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
    
        // Execute the query with the constructed filter
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

}

const dao = new invDAO;
dao.init();
module.exports = dao;


