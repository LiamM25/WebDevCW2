const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js'); 
const { login, verify, checkCookieExpiration } = require('../authentication/auth.js');



// Define separate routes 
router.get('/userDb', verify, checkCookieExpiration, adminController.showUserDbPage);

//Admin home
router.get('/adminHome', verify, checkCookieExpiration, adminController.showAdminHome);

//Admin inv
router.get('/adminInventory', verify, checkCookieExpiration, adminController.showAdminInv);

//admin user settings
router.get('/adminUserSettings', verify, checkCookieExpiration, adminController.showAdminUserSettings);


// Delete user
router.post('/deleteUser', verify, checkCookieExpiration, adminController.deleteUser);

// Delete inv item
router.post('/deleteInvItem', verify, checkCookieExpiration, adminController.deleteInvItem);

// create new admin or pantry account
router.post('/adminCreateUser', verify, checkCookieExpiration, adminController.adminCreateUser); 


module.exports = router;