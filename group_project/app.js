/**********************************************************************************
**  Description:   Node.js web server for cs340 Summer 2020 Group 34 Project. This
**                 file is the entry point for the application.
**
**                 Path of forever binary file: ./node_modules/forever/bin/forever
**********************************************************************************/

// Set up express
const express = require('express');
const app = express();

// Set up express-handlebars
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Set up body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up MySQL using dbcon.js file
const mysql = require('./db-config.js');

// Set up route to static files
app.use(express.static('public'));

// PORT NUMBER - Set static port for the appliction 
app.set('port', 50000);


/* GET ROUTES ---------------------------------------------------------------*/

// BUGS MAIN PAGE - Route where the bug list will be rendered
app.get('/', function renderHome(req, res) {
    let context = {};
    res.render('user-home', context);
});


// EDIT BUG PAGE - Route where a bug can be edited
app.get('/edit-bug', function renderAddCompany(req, res) {
    let context = {};
    res.render('edit-bug', context);
});


// ADD COMPANY PAGE - Route to view all existing companies
app.get('/add-company', function renderAddCompany(req, res) {
    let context = {};
    mysql.pool.query(`SELECT * FROM Companies`, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }

        // Put the mysql data into an array for rendering
        let companyDbData = [];
        for (let i in rows) {
            companyDbData.push({
                companyId: rows[i].companyId,
                companyName: rows[i].companyName,
                dateJoined: rows[i].dateJoined,
            });
        }
        context.companies = companyDbData;
        res.render('add-company', context);
    });
});


// ADD PROJECT PAGE - Route where a project can be added
app.get('/add-project', function renderAddProject(req, res) {
    let context = {};
    mysql.pool.query(`SELECT * FROM Projects AS p 
    JOIN Companies AS c ON p.companyId = c.companyId`, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        
        // Put the mysql data into an array for rendering 
        let projectDbData = [];
        for (let i in rows) {
            projectDbData.push({
                projectId: rows[i].projectId,
                projectName: rows[i].projectName,
                companyName: rows[i].companyName,
                dateStarted: rows[i].dateStarted,
                lastUpdated: rows[i].lastUpdated,
                inMaintenance: rows[i].inMaintenance
            });
        }
        context.projects = projectDbData;
        res.render('add-project', context);
    });
});


// ADD PROGRAMMER PAGE - Route where a programmer can be added
app.get('/add-programmer', function renderAddProgrammer(req, res) {
    let context = {};
    mysql.pool.query(`SELECT * FROM Programmers`, (err, rows, fields) => {
        let programmersDbData = [];
        for (let i in rows) {
            programmersDbData.push({
                firstName: rows[i].firstName,
                lastName: rows[i].lastName,
                email: rows[i].email,
                dateStarted: rows[i].dateStarted,
                accessLevel: rows[i].accessLevel
            });
        }
        context.programmers = programmersDbData;
        res.render('add-programmer', context);
    })
});


/* ERROR ROUTES -------------------------------------------------------------*/

// PAGE NOT FOUND - Route for bad path error page
app.use(function(req,res) {
    res.status(404);
    res.render('404');
});
   

// INTERNAL SERVER ERROR - Route for a server-side error
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


/* LISTEN ON PORT -----------------------------------------------------------*/

// PORT LISTENER - Set to render on a static port set globally
app.listen(app.get('port'), function(){
    console.log('Express started at http://localhost:' + app.get('port') + '; press ctrl-C to terminate.');
});
