const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController.js'); 
const { login, verify, verifyPantry } = require('../authentication/auth.js');
const {checkUserSession} = require('../controllers/pantryController.js');

//Pantry home
router.get('/pantryHome', verifyPantry, checkUserSession, pantryController.showPantryHome);

//Pantry inv
router.get('/pantryInventory', verifyPantry, checkUserSession,  pantryController.showPantryInventory);

//pantry Update
router.post('/updateInventory', verifyPantry, checkUserSession, pantryController.updateInventory);

//delete item
router.post('/deleteItem', verifyPantry, checkUserSession, pantryController.deleteInventoryItem);



module.exports = router;