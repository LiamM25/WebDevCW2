const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');

const app = express();

// Set Mustache as the view engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views')); 

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public'))); 

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