// Modules
// ---------------------------------
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const myConnection = require('express-myconnection');
// ---------------------------------
// Import routes
// ---------------------------------
const routes = require('./routes/router.js');
// ---------------------------------
// CONST
// ---------------------------------
const app = express();

// Settings
// ----- Port
try {
	app.set('port', process.send.PORT || 3000);
} catch {
	app.set('port', 3000);
}
const port = app.get('port');
// ----- Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
// app.use(client);
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', routes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(port, () => {
	console.log(`Server on port ${port}`);
});
