/**********************************************************************************
**  Description:   Node.js web server for cs340 Summer 2020 Group 34 Project
**
**                 Path of forever binary file: ./node_modules/forever/bin/forever
**********************************************************************************/

// Set up express
var express = require('express');
var app = express();

// Set up express-handlebars
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Set up body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up MySQL using dbcon.js file
var mysql = require('./db-config.js');

// Set up route to static files
app.use(express.static('public'));

// Set port number
app.set('port', 50000);


/* GET ROUTES ---------------------------------------------------------------*/

// Home page route where the bug list will be rendered
app.get('/', function renderHome(req, res) {
    var context = {};
    res.render('user-home', context);
});


// Edit bug route where a bug can be edited
app.get('/edit-bug', function renderAddCompany(req, res) {
    var context = {};
    res.render('edit-bug', context);
});


// Add Company route where a company can be added
app.get('/add-company', function renderAddCompany(req, res) {
    var context = {};
    res.render('add-company', context);
});


// Add Project route where a project can be added
app.get('/add-project', function renderAddProject(req, res) {
    var context = {};
    res.render('add-project', context);
});


// Add Project route where a programmer can be added
app.get('/add-programmer', function renderAddProgrammer(req, res) {
    var context = {};
    res.render('add-programmer', context);
});


/* ERROR ROUTES -------------------------------------------------------------*/

// Route not found
app.use(function(req,res) {
    res.status(404);
    res.render('404');
});
   

// Server Error
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


/* LISTEN ON PORT -----------------------------------------------------------*/

// Listen on port set globally and display message to indicate listening
app.listen(app.get('port'), function(){
    console.log('Express started at http://localhost:' + app.get('port') + '; press ctrl-C to terminate.');
});
