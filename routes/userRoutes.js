const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); 
const { login, verify } = require('../authentication/auth.js');

// Authentication Routes
router.get('/login', userController.showLogin); 
router.post("/login", userController.postLogin);
router.get('/register', userController.showRegisterPage); 
router.post('/register', userController.postNewUser); 

// Define separate routes for different user roles
//User home
router.get('/home', verify, userController.showHomePage);

//Pantry home
router.get('/pantryHome', verify, userController.showPantryHome); 


router.get('/logout', userController.logout); 



module.exports = router;

