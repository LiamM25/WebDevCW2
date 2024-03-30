const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController.js'); 
const { login, verify, checkCookieExpiration } = require('../authentication/auth.js');

//Pantry home
router.get('/pantryHome', verify, checkCookieExpiration, pantryController.showPantryHome);

//Pantry inv
router.get('/pantryInventory', verify, checkCookieExpiration, pantryController.showPantryInventory);

router.post('/updateConfirmed', verify, checkCookieExpiration, pantryController.updateInventoryConfirmation);


module.exports = router;