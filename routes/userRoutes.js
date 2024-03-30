const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); 
const { login, verify } = require('../authentication/auth.js');


router.get('/home', verify, userController.showHomePage);
router.get('/logout', userController.logout); 
router.get('/donation', userController.logout); 
router.get('/userDonate', verify, userController.renderUserDonatePage);



router.post('newDonation', verify, userController.newDonation);


module.exports = router;

