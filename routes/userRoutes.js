const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); // Import userController module
const { login, verify } = require('../authentication/auth.js');

// Authentication Routes
router.get('/login', userController.showLogin); // Render login page
router.post('/login', login, userController.handleLogin); // Handle user login
router.get('/register', userController.showRegisterPage); // Render registration page
router.post('/register', userController.postNewUser); // Handle user registration
router.get('/logout', userController.logout); // Handle user logout

module.exports = router;