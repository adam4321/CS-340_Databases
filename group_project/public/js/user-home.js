/*************************************************************
**  Description: USER-HOME client-side JavaScript file
**************************************************************/

// INSERT BUG CLIENT SIDE - Function to submit the bugs form data
let recordForm = document.getElementById('recordForm');

recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let req = new XMLHttpRequest();
    let queryString = '/insertBug';

    // Iterate over the checked programmers to create http query sub-string
    let programmerStr = '';
    for (let i = 0; i < recordForm.elements.length; i++) {
        try {
            if (recordForm.elements.programmerId[i].checked) {
                programmerStr += `&programmer=${recordForm.elements.programmerId[i].value}`;
            }
        } catch {
            continue;
        }
    }

    // Gather the selected programmer's names for rendering to the new cell
    let programmerList = [];
    let programmerCount = 0;
    for (let i = 0; i < recordForm.elements.length; i++) {
        try {
            if (recordForm.elements.programmerId[i].checked) {
                programmerCount++;
                programmerList.push(recordForm.elements.programmerId[i].nextElementSibling.innerHTML);
            }
        } catch {
            continue;
        }
    }

    // Fill the project, if it has a value
    let projectStr = '';
    if (recordForm.elements.bugProject.value) {
        projectStr += `&bugProject=${recordForm.elements.bugProject.value}`
    }

    // String that holds the form data
    let parameterString =
    'bugSummary=' + recordForm.elements.bugSummary.value +
    '&bugDescription=' + recordForm.elements.bugDescription.value +
    projectStr                                                   +
    programmerStr                                               +
    '&bugStartDate=' + recordForm.elements.bugStartDate.value +
    '&bugPriority=' + recordForm.elements.bugPriority.value +
    '&bugFixed=' + recordForm.elements.bugFixed.value +
    '&bugResolution=' + recordForm.elements.bugResolution.value

    // Ajax request
    req.open('GET', queryString + '?' + parameterString, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.addEventListener('load', () => {
    if (req.status >= 200 && req.status < 400) {
        let response = JSON.parse(req.responseText);

        // Table of database records for the added companies
        let tbl = document.getElementById('recordTable');
        let newRow = tbl.insertRow(-1);

        // Bug Summary element
        let summaryCell = document.createElement('td');
        summaryCell.textContent = recordForm.elements.bugSummary.value;
        summaryCell.className = 'mdl-data-table__cell--non-numeric'; 
        newRow.appendChild(summaryCell);

        // Bug Description element
        let descriptionCell = document.createElement('td');
        descriptionCell.textContent = recordForm.elements.bugDescription.value;
        descriptionCell.className = 'mdl-data-table__cell--non-numeric'; 
        newRow.appendChild(descriptionCell);

        // Project element
        let projectCell = document.createElement('td');
        let dropdown = document.getElementById("bug-project-field");
        projectCell.className = 'mdl-data-table__cell--non-numeric'; 
        projectCell.textContent = dropdown.options[dropdown.selectedIndex].text;
        newRow.appendChild(projectCell);

        // Programmers element
        let programmerCell = document.createElement('td');
        programmerCell.className = 'mdl-data-table__cell--non-numeric';
        newRow.appendChild(programmerCell);
        let progList = document.createElement('ul');
        let progElem = document.createElement('li')
        programmerCell.appendChild(progList);
        progList.appendChild(progElem);

        for (let i = 0; i < programmerCount; i++) {
            progElem.textContent = programmerList[i];
            progElem = document.createElement('li');
            progList.appendChild(progElem);
        }
        
        // Date started element
        let dateCell = document.createElement('td');
        dateCell.textContent = recordForm.elements.bugStartDate.value;
        newRow.appendChild(dateCell);

        // Priority element
        let priorityCell = document.createElement('td');
        priorityCell.textContent = recordForm.elements.bugPriority.value;
        newRow.appendChild(priorityCell);

        // Fixed element
        let fixedCell = document.createElement('td');
        if (recordForm.elements.bugFixed.value == 0) {
            fixedCell.textContent = "No"
        } else {
            fixedCell.textContent = "Yes";
        }
        newRow.appendChild(fixedCell);

        // Resolution element
        let resolutionCell = document.createElement('td');
        resolutionCell.textContent = recordForm.elements.bugResolution.value;
        resolutionCell.className = 'mdl-data-table__cell--non-numeric'
        newRow.appendChild(resolutionCell);

        // Update button element
        let updateCell = document.createElement('td');
        newRow.appendChild(updateCell);
        let updateBtn = document.createElement('a');
        updateCell.appendChild(updateBtn);
        updateBtn.text = "Update"
        updateBtn.className = "update-btn";
        updateBtn.href = `/edit-bug?bugId=${response.id}`;
        

        // Delete button element
        let deleteCell = document.createElement('td');
        newRow.appendChild(deleteCell);
        let deleteBtn = document.createElement('a');
        deleteCell.appendChild(deleteBtn);
        deleteBtn.text = "Delete"
        deleteBtn.className = "update-btn";
        deleteBtn.href = ``;
        

        // Clear the submit form
        document.getElementById('recordForm').reset()
    } else {
        console.log('Database return error');
    }
    });
    req.send(queryString + '?' + parameterString);
});


// DELETE BUG CLIENT SIDE - Function call to delete a row from bug
function deleteBug(tbl, curRow, bugId) {
    let table = document.getElementById(tbl);
    let rowCount = table.rows.length;
    let req = new XMLHttpRequest();
    let queryString = "/deleteBug";

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


// SEARCH BUG CLIENT SIDE - Function call to search bug table for substring
let searchButton = document.getElementById("search-btn");
searchButton.onclick = searchBug;

function searchBug() {
    let searchString = document.getElementById("search-input").value;
    let queryString = "/searchBug";
    let req = new XMLHttpRequest();
    console.log(searchString);

    req.open("GET", queryString + "?searchString=" + searchString, true);   
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
        } else {
        console.log("Search request error");
        }
    });

    req.send(queryString + "?searchString=" + searchString); 
};
