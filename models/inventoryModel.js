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


    createItem(itemType, itemName, itemQuantity, weight, expirationDate, harvestDate, cb) {
        const entry = {
            pantryLocation: pantryLocation, //to indicate which pantry it will be located
            itemType: itemType,
            itemName: itemName,
            itemQuantity: itemQuantity,
            Weight: weight || '', // Default to empty string if not provided
            ExpirationDate: expirationDate || '', // Default to empty string if not provided
            HarvestDate: harvestDate || '', // Default to empty string if not provided
            confirmed: confirmed || 'No' //donations will be confirmed by pantry upon arrival
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
        
        this.db.find(filterOptions, (err, items) => {
            if (err) {
                console.error("Error fetching inventory:", err);
                cb(err, null);
            } else {
                cb(null, items);
            }
        });
    }

}

const dao = new invDAO;
dao.init();
module.exports = dao;


