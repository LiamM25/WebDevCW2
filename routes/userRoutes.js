const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); 
const { login, verify } = require('../authentication/auth.js');
const {checkUserSession} = require('../controllers/userController.js'); 


router.get('/home', verify, checkUserSession, userController.showHomePage);
router.get('/logout', verify, checkUserSession, userController.logout); 
router.get('/donation', verify, checkUserSession, userController.logout); 
router.get('/userDonate', verify, checkUserSession, verify, userController.renderUserDonatePage);



router.post('/newDonation', verify, checkUserSession, userController.newDonation);


module.exports = router;

