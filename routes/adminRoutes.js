const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js'); 
const { login, verify, } = require('../authentication/auth.js');
const {checkUserSession} = require('../controllers/adminController.js'); 



// Define separate routes 
router.get('/userDb', verify, checkUserSession,  adminController.showUserDbPage);

//Admin home
router.get('/adminHome', verify, checkUserSession, adminController.showAdminHome);

//Admin inv
router.get('/adminInventory', verify, checkUserSession, adminController.showAdminInv);

//admin user settings
router.get('/adminUserSettings', verify, checkUserSession, adminController.showAdminUserSettings);


// Delete user
router.post('/deleteUser', verify, checkUserSession, adminController.deleteUser);

// Delete inv item
router.post('/deleteInvItem', verify, checkUserSession, adminController.deleteInvItem);

// create new admin or pantry account
router.post('/adminCreateUser', verify, checkUserSession, adminController.adminCreateUser); 


module.exports = router;