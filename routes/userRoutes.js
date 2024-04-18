const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); 
const { login, verify, verifyUser } = require('../authentication/auth.js');
const {checkUserSession} = require('../controllers/userController.js'); 


router.get('/home', verifyUser, checkUserSession, userController.showHomePage);
router.get('/logout', verifyUser, checkUserSession, userController.logout); 
router.get('/donation', verifyUser, checkUserSession, userController.logout); 
router.get('/userDonate', verifyUser, checkUserSession, userController.renderUserDonatePage);
router.get('/userContact', verifyUser, checkUserSession, userController.renderUserContactPage);


router.post('/newDonation', verifyUser, checkUserSession, userController.newDonation);


module.exports = router;

