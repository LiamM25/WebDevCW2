const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const app = express();
require('dotenv').config();

const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));


app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Set Mustache as the view engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));  

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public'))); 

// Middleware to retrieve user information from JWT token
app.use((req, res, next) => {
    // Get JWT token from cookie
    const token = req.cookies.jwt;
    if (token) {
        try {
            // Verify JWT token and extract user information
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            // Attach user information to the request object for use in route handlers
            req.user = decoded;
        } catch (error) {
            // If token verification fails, user information will not be attached
            console.error('Error verifying JWT token:', error.message);
        }
    }
    next();
});


// Define routes
app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Home' });
});

// Define user-related routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});