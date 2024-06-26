const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController.js'); 
const { login, verify } = require('../authentication/auth.js');


router.get('/login', visitorController.showLogin); 
router.post("/login", verify, visitorController.postLogin);
router.get('/register', visitorController.showRegisterPage); 
router.post('/register', visitorController.postNewUser);
router.get('/contact', visitorController.showContactPage);

module.exports = router;
