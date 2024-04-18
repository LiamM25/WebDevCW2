const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js'); 
const { login, verify, verifyAdmin, } = require('../authentication/auth.js');
const {checkUserSession} = require('../controllers/adminController.js'); 

//user db page
router.get('/userDb', verifyAdmin, checkUserSession,  adminController.showUserDbPage);

//Admin home
router.get('/adminHome', verifyAdmin, checkUserSession, adminController.showAdminHome);

//Admin inv
router.get('/adminInventory', verifyAdmin, checkUserSession, adminController.showAdminInv);

//admin user settings
router.get('/adminUserSettings', verifyAdmin, checkUserSession, adminController.showAdminUserSettings);


// Delete user
router.post('/deleteUser', verifyAdmin, checkUserSession, adminController.deleteUser);

// Delete inv item
router.post('/deleteInvItem', verifyAdmin, checkUserSession, adminController.deleteInvItem);

// create new admin or pantry account
router.post('/adminCreateUser', verifyAdmin, checkUserSession, adminController.adminCreateUser); 


module.exports = router;