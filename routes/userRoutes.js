const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); 
const { login, verify } = require('../authentication/auth.js');

// Authentication Routes
router.get('/login', userController.showLogin); 
router.post("/login", userController.postLogin);
router.get('/register', userController.showRegisterPage); 
router.post('/register', userController.postNewUser); 


router.get('/home', verify, userController.showHomePage);
router.get('/logout', userController.logout); 


// Define separate routes for different user roles
router.get('/admin/adminHome', verify, userController.showAdminDash); 

module.exports = router;

