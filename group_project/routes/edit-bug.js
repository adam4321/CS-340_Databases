/*************************************************************
**  Description: EDIT BUG PAGE - server side node.js routes
**
**  Contains:    /edit-bug/
**               /edit-bug/updateBug
**************************************************************/

const express = require('express');
const router = express.Router();


// EDIT BUG PAGE - Route where the edit bug page is rendered
function renderEditBug(req, res, next) {
    // 1st query gathers the projects for the dropdown
    let sql_query_1 = `SELECT projectName, projectId FROM Projects`;

    // 2nd query gathers the programmers for the scrolling checkbox list
    let sql_query_2 = `SELECT programmerId, firstName, lastName FROM Programmers`;

    // 3rd query populates the update bug form
    let sql_query_3 = `SELECT p.programmerId, b.bugId, pj.projectName, b.bugSummary, b.bugDescription, b.dateStarted, b.resolution, b.priority, b.fixed 
                    FROM Programmers p 
                        JOIN Bugs_Programmers bp ON p.programmerId = bp.programmerId
                        JOIN Bugs b ON bp.bugId = b.bugId
                        LEFT OUTER JOIN Projects pj ON b.projectId = pj.projectId
                        WHERE bp.bugId=?
                            ORDER BY bugId`

    const mysql = req.app.get('mysql');
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
                bugProgrammers.push(rows[i].programmerId);
            }
            // This is a new entry
            else {
                prevEntryBugId = rows[i].bugId;         // Cache the bugId
                bugProgrammers = [];                    // Add the programmer to the array
                bugProgrammers.push(rows[i].programmerId);

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
                    lastName: rows[i].lastName,
                    checked: false
                });
                // If the programmer's Id is set in the bug then checked becomes true
                for (let j in editBugDbData[0].programmers) {
                    if (editBugDbData[0].programmers[j] == rows[i].programmerId) {
                        programmersDbData[i].checked = true;
                    }
                }
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
                res.render('edit-bug', context);
            });
        });
    });
}


// SUBMIT BUG EDIT - Function to submit a bug update
function submitBugEdit(req, res, next) {
    const mysql = req.app.get('mysql');
    let context = {};



}


/* EDIT BUG PAGE ROUTES ---------------------------------------------------- */

router.get('/', renderEditBug);
router.get('/updateBug', submitBugEdit);

module.exports = router;