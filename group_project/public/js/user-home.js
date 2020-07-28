/*************************************************************
**  Description: USER-HOME client-side JavaScript file
**************************************************************/

// Function call to delete a row from bug
function deleteBug(tbl, curRow, bugId) {
    let table = document.getElementById(tbl);
    let rowCount = table.rows.length;
    let req = new XMLHttpRequest();
    let queryString = "/delete";

    req.open("GET", queryString + "?bugId=" + bugId, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
        } else {
        console.log("Delete request error");
        }
    });

    req.send(queryString + "?bugId=" + bugId);

    for (let i = 0; i < rowCount; i++) {
        let row = table.rows[i];

        if (row == curRow.parentNode.parentNode) {
            table.deleteRow(i);
        }
    }
}


// Function to submit the form data
let recordForm = document.getElementById('recordForm');

