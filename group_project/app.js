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
app.get('/', function renderHome(req, res, next) {
    
    // 1st query gathers the projects for the dropdown
    let sql_query_1 = `SELECT projectName, projectId FROM Projects`;
    // 2nd query gathers the programmers for the scrolling checkbox list
    let sql_query_2 = `SELECT programmerId, firstName, lastName FROM Programmers`;
    // 3rd query populates the bug list
    let sql_query_3 = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
	                FROM Programmers p 
		                JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
		                JOIN Bugs b ON bp.bugId = b.bugId
		                JOIN Projects pj ON b.projectId = pj.projectId
                            ORDER BY bugId`;                       
    let context = {};

    mysql.pool.query(sql_query_3, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }

        let prevEntryBugId;           // Cache the previous entry's id to avoid duplication
        let bugProgrammers = [];      // Hold the programmers for each entry
        let bugsDbData = [];          // Put the mysql data into an array for rendering

        for (let i in rows) {
            // If this is the same entry as the last, then only add the programmer to the array
            if (prevEntryBugId == rows[i].bugId) {
                bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
            }
            // This is a new entry
            else {
                prevEntryBugId = rows[i].bugId;         // Cache the bugId
                bugProgrammers = [];                    // Add the programmer to the array
                bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);

                // Push a single entry
                bugsDbData.push({
                    bugId: rows[i].bugId,
                    bugSummary: rows[i].bugSummary,
                    bugDescription: rows[i].bugDescription,
                    projectName: rows[i].projectName,
                    programmers: bugProgrammers,
                    dateStarted: rows[i].dateStarted,
                    priority: rows[i].priority,
                    fixed: rows[i].fixed,
                    resolution: rows[i].resolution
                });
            }
        } 
        // Query for the list of programmers
        mysql.pool.query(sql_query_2,  (err, rows, fields) => {
            if (err) {
                next(err);
                return;
            }
            let programmersDbData = [];
            for (let i in rows) {
                programmersDbData.push({
                    programmerId: rows[i].programmerId,
                    firstName: rows[i].firstName,
                    lastName: rows[i].lastName
                });
            }
            // Query for the list of projects
            mysql.pool.query(sql_query_1,  (err, rows, fields) => {
                if (err) {
                    next(err);
                    return;
                }
                let projectDbData = [];
                for (let i in rows) {
                    projectDbData.push({
                        projectName: rows[i].projectName,
                        projectId: rows[i].projectId
                    });
                }
                // After the 3 calls return, then populate the context array
                context.bugs = bugsDbData;
                context.programmers = programmersDbData;
                context.projects = projectDbData;
                console.log(context);
                res.render('user-home', context);
            });
        });
    });
});

// SKELETON - NEEDS CODE
// MAIN BUG PAGE INSERT NEW BUG - Route to insert bug data
app.get("/insertBug", function submitBug(req, res, next) {
    let sql_query = ``;
    let context = {};

    mysql.pool.query(sql_query, [ ], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        context.bugs = result.insertId;
        res.send(JSON.stringify(context));
    });
});

// SKELETON - NEEDS CODE
// BUGS MAIN PAGE DELETE ROW - Route to delete a row from the bug list
app.get("/deleteBug", function(req, res, next) {

    // Delete the row with the passed in bugId
    let sql_query_1 = `DELETE FROM Bugs WHERE bugId=?`;
    let sql_query_2 = `SELECT * FROM Bugs`;

    var context = {};

    mysql.pool.query(
        sql_query_1, [req.query.bugId],
        function(err, result) {
            if (err) {
                next(err);
                return;
            }
            mysql.pool.query(sql_query_2, function(err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                context.results = JSON.stringify(rows);
                console.log(context);
                res.render('user-home', context);
            });
        }
    );
});


// EDIT BUG PAGE - Route where the edit bug page is rendered
app.get('/edit-bug', function renderAddCompany(req, res, next) {
    
    // 1st query gathers the projects for the dropdown
    let sql_query_1 = `SELECT projectName, projectId FROM Projects`;
    // 2nd query gathers the programmers for the scrolling checkbox list
    let sql_query_2 = `SELECT programmerId, firstName, lastName FROM Programmers`;
    // 3rd query populates the update bug form
    let sql_query_3 = `SELECT p.firstName, p.lastName, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
                    FROM Programmers p 
                        JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
                        JOIN Bugs b ON bp.bugId = b.bugId
                        JOIN Projects pj ON b.projectId = pj.projectId
                        WHERE bp.bugId=?
                            ORDER BY bugId`

    let context = {};

    mysql.pool.query(sql_query_3, [req.query.bugId], (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }

        let prevEntryBugId;           // Cache the previous entry's id to avoid duplication
        let bugProgrammers = [];      // Hold the programmers for each entry
        let editBugDbData = [];       // Put the mysql data into an array for rendering

        for (let i in rows) {
            // If this is the same entry as the last, then only add the programmer to the array
            if (prevEntryBugId == rows[i].bugId) {
                bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);
            }
            // This is a new entry
            else {
                prevEntryBugId = rows[i].bugId;         // Cache the bugId
                bugProgrammers = [];                    // Add the programmer to the array
                bugProgrammers.push(rows[i].firstName + ' ' + rows[i].lastName);

                // Push a single entry
                editBugDbData.push({
                    bugId: rows[i].bugId,
                    bugSummary: rows[i].bugSummary,
                    bugDescription: rows[i].bugDescription,
                    projectName: rows[i].projectName,
                    programmers: bugProgrammers,
                    dateStarted: rows[i].dateStarted,
                    priority: rows[i].priority,
                    fixed: rows[i].fixed,
                    resolution: rows[i].resolution
                });
            }
        }
        // Query for the list of programmers
        mysql.pool.query(sql_query_2,  (err, rows, fields) => {
            if (err) {
                next(err);
                return;
            }
            let programmersDbData = [];
            for (let i in rows) {
                programmersDbData.push({
                    programmerId: rows[i].programmerId,
                    firstName: rows[i].firstName,
                    lastName: rows[i].lastName
                });
            }
            // Query for the list of projects
            mysql.pool.query(sql_query_1,  (err, rows, fields) => {
                if (err) {
                    next(err);
                    return;
                }
                let projectDbData = [];
                for (let i in rows) {
                    projectDbData.push({
                        projectName: rows[i].projectName,
                        projectId: rows[i].projectId
                    });
                }
                // After the 3 calls return, then populate the context array
                context.editBug = editBugDbData[0];
                context.programmers = programmersDbData;
                context.projects = projectDbData;
                console.log(context);
                res.render('edit-bug', context);
            });
        });
    });
});


// ADD PROGRAMMER PAGE - Route where the add programmer page is rendered
app.get('/add-programmer', function renderAddProgrammer(req, res, next) {
    
    // Find all of the programmers
    let sql_query = `SELECT * FROM Programmers`;
    let context = {};

    mysql.pool.query(sql_query, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }

        // Put the mysql data into an array for rendering
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


// ADD PROGRAMMER PAGE INSERT NEW PROGRAMMER - Route to insert programmer data
app.get("/insertProgrammer", function submitProgrammer(req, res, next) {

    // Insert the form data into the Programmers table
    let sql_query = `INSERT INTO Programmers (firstName, lastName, email, dateStarted, accessLevel) 
                        VALUES (?, ?, ?, ?, ?)`;

    let context = {};

    mysql.pool.query(sql_query,
        [
            req.query.firstName,
            req.query.lastName, 
            req.query.email, 
            req.query.dateStarted, 
            req.query.accessLevel
        ], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        context.programmers = result.insertId;
        res.send(JSON.stringify(context));
    });
});


// ADD PROJECT PAGE - Route where the add project page is rendered
app.get('/add-project', function renderAddProject(req, res, next) {
    
    // Find all of the projects and their associated companies
    let sql_query_2 = `SELECT * FROM Projects AS p JOIN Companies AS c ON p.companyId = c.companyId`;
    let sql_query_1 = `SELECT companyId, companyName FROM Companies`;
    let context = {};

    mysql.pool.query(sql_query_2, (err, rows, fields) => {
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
        // Query for the list of companies
        mysql.pool.query(sql_query_1,  (err, rows, fields) => {
            if (err) {
                next(err);
                return;
            }
            let companyDbData = [];
            for (let i in rows) {
                companyDbData.push({
                    companyId: rows[i].companyId,
                    companyName: rows[i].companyName
                });
            }
            // After the 2 calls return, then populate the context array
            context.companies = companyDbData;
            context.projects = projectDbData;
            res.render('add-project', context);
        });
    });
});


// ADD PROJECT PAGE INSERT NEW PROJECT - Route to insert project data
app.get("/insertProject", function submitProject(req, res, next) {

    // Insert the form data into the Projects table
    let sql_query = `INSERT INTO Projects (projectName, companyId, dateStarted, lastUpdated, inMaintenance)
                        VALUES (?, (SELECT companyId FROM Companies WHERE companyName = ?), ?, ?, ?)`;
    let context = {};

    mysql.pool.query(sql_query, 
        [
            req.query.projectName,
            req.query.companyName,
            req.query.dateStarted,
            req.query.lastUpdated,
            req.query.inMaintenance
        ],
        (err, result) => {
        if (err) {
            next(err);
            return;
        }
        context.projects = result.insertId;
        res.send(JSON.stringify(context));
    });
});


// ADD COMPANY PAGE - Route to view all existing companies
app.get('/add-company', function renderAddCompany(req, res, next) {
    
    // Find all of the current companies
    let sql_query = `SELECT * FROM Companies`;
    let context = {};

    mysql.pool.query(sql_query, (err, rows, fields) => {
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


// ADD COMPANY PAGE INSERT NEW COMPANY - Route to insert company data
app.get("/insertCompany", function submitCompany(req, res, next) {
    let sql_query = `INSERT INTO Companies (companyName, dateJoined) VALUES (?, ?)`;
    let context = {};

    mysql.pool.query(sql_query, [req.query.companyName, req.query.dateJoined], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        context.companies = result.insertId;
        res.send(JSON.stringify(context));
    });
});


/* ERROR ROUTES -------------------------------------------------------------*/

// PAGE NOT FOUND - Route for bad path error page
app.use((req, res) => {
    res.status(404);
    res.render('404');
});
   

// INTERNAL SERVER ERROR - Route for a server-side error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


/* LISTEN ON PORT -----------------------------------------------------------*/

// Set to render on a static port set globally
app.listen(app.get('port'), () => {
    console.log(`\nExpress started at http://localhost:${app.get('port')}\nPress ctrl-C to terminate.`);
});
