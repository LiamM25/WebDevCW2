const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js'); 
const { login, verify } = require('../authentication/auth.js');



// Define separate routes 
router.get('/userDb', verify, adminController.showUserDbPage);

//Admin home
router.get('/adminHome', verify, adminController.showAdminHome);

//Admin inv
router.get('/adminInventory', verify, adminController.showAdminInv);

// Delete user
router.post('/deleteUser', verify, adminController.deleteUser);

// Delete inv item
router.post('/deleteInvItem', verify, adminController.deleteInvItem);

module.exports = router;