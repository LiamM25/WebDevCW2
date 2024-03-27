const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); 
const { login, verify } = require('../authentication/auth.js');

// Authentication Routes
router.get('/login', userController.showLogin); 
router.post("/login", userController.postLogin);
router.get('/register', userController.showRegisterPage); 
router.post('/register', userController.postNewUser); 

// Apply verify middleware to protect home and logout routes
router.get('/home', verify, userController.showHomePage);
router.get('/logout', verify, userController.logout); 

module.exports = router;

