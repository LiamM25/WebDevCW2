const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); // Import userController module
const { login, verify } = require('../authentication/auth.js');

// Authentication Routes
router.get('/login', userController.showLogin); 

router.post("/login", userController.postLogin);

router.get('/register', userController.showRegisterPage); 
router.post('/register', userController.postNewUser); 

router.get('/home', userController.showHomePage);

router.get('/logout', userController.logout); 




module.exports = router;