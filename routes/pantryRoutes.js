const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController.js'); 
const { login, verify } = require('../authentication/auth.js');
const {checkUserSession} = require('../controllers/pantryController.js');

//Pantry home
router.get('/pantryHome', verify, checkUserSession, pantryController.showPantryHome);

//Pantry inv
router.get('/pantryInventory', verify, checkUserSession,  pantryController.showPantryInventory);

router.post('/updateInventory', verify, checkUserSession, pantryController.updateInventory);


module.exports = router;