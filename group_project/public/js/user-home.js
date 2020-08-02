/*************************************************************
**  Description: USER-HOME client-side JavaScript file
**************************************************************/

/* INSERT BUG VERIFY PROGRAMMER CHECKED -------------------------------------*/

// Function to verify that at least 1 programmer is checked
function checkBoxChecked() {
    const form = document.querySelector('#recordForm');
    const checkboxes = form.querySelectorAll('input[type=checkbox]');
    const checkboxLength = checkboxes.length;
    const firstCheckbox = checkboxLength > 0 ? checkboxes[0] : null;

    function init() {
        if (firstCheckbox) {
            for (let i = 0; i < checkboxLength; i++) {
                checkboxes[i].addEventListener('change', checkValidity);
            }

            checkValidity();
        }
    }

    function isChecked() {
        for (let i = 0; i < checkboxLength; i++) {
            if (checkboxes[i].checked) return true;
        }

        return false;
    }

    function checkValidity() {
        const errorMessage = !isChecked() ? 'At least one checkbox must be selected.' : '';
        firstCheckbox.setCustomValidity(errorMessage);
    }

    init();
};


/* INSERT BUG CLIENT SIDE -------------------------------------------------- */

// Function to submit the bug's form data
let recordForm = document.getElementById('recordForm');
let spinner = document.getElementById('spinner');
spinner.style.visibility = "hidden";

recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    spinner.style.visibility = "visible"; 
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
        summaryCell.className = 'mdl-data-table__cell--non-numeric'; 
        let innerCell = document.createElement('div');
        summaryCell.appendChild(innerCell);
        innerCell.className = 'user-text';
        innerCell.textContent = recordForm.elements.bugSummary.value;
        newRow.appendChild(summaryCell);

        // Bug Description element
        let descriptionCell = document.createElement('td');
        descriptionCell.className = 'mdl-data-table__cell--non-numeric'; 
        innerCell = document.createElement('div');
        descriptionCell.appendChild(innerCell);
        innerCell.className = 'user-text';
        innerCell.textContent = recordForm.elements.bugDescription.value;
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
        resolutionCell.className = 'mdl-data-table__cell--non-numeric'
        innerCell = document.createElement('div');
        resolutionCell.appendChild(innerCell);
        innerCell.textContent = recordForm.elements.bugResolution.value;
        innerCell.className = 'user-text';
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
        deleteBtn.type = "button";
        deleteBtn.text = "Delete";
        deleteBtn.className = "update-btn";
        deleteBtn.setAttribute('onclick', `deleteBug('recordTable', this, ${response.id})`);
        
        // Clear the submit form
        document.getElementById('recordForm').reset();
        setTimeout(() => { spinner.style.visibility = "hidden"; }, 1000);

    } else {
        console.log('Database return error');
    }
    });
    req.send(queryString + '?' + parameterString);
});


/* DELETE BUG CLIENT SIDE -------------------------------------------------- */

// Function call to delete a row from bug
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


/* VIEW ALL BUGS CLIENT SIDE ----------------------------------------------- */

// Function call to clear search results
let viewAllButton = document.getElementById("clear-search");
viewAllButton.setAttribute('onclick', 'viewAllBugs()');

function viewAllBugs() {
    queryString = "/viewAllBugs";
    let req = new XMLHttpRequest();

    req.open("GET", queryString, true);   
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send(queryString); 

    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            let bugsArray = JSON.parse(req.responseText).bugs;

            // clear table before building search results
            let tableBody = document.getElementById("table-body");
            tableBody.innerHTML = '';

            // if no existing bugs
            if(bugsArray.length == 0) {
                let newRow = tableBody.insertRow(-1);
                let summaryCell = document.createElement('td');
                summaryCell.textContent = "No current bugs!";
                summaryCell.style.color = "#ff0000";
                summaryCell.className = 'mdl-data-table__cell--non-numeric'; 
                newRow.appendChild(summaryCell);
                return;
            }

            // build rows for each bug if there is at least one result
            bugsArray.forEach(element => {
                createRow(tableBody, element);
            });
        } else {
            console.log("View all bugs: request error.");
        }
    });
}


/* SEARCH BUG CLIENT SIDE -------------------------------------------------- */

// Function call to search bug table for substring
let searchButton = document.getElementById("search-btn");
searchButton.onclick = searchBug;

function searchBug() {
    let searchString = document.getElementById("search-input").value;
    let queryString = "/searchBug";
    let req = new XMLHttpRequest();

    req.open("GET", queryString + "?searchString=" + searchString, true);   
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send(queryString + "?searchString=" + searchString); 

    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            let bugsArray = JSON.parse(req.responseText).bugs;

            // clear table before building search results
            let tableBody = document.getElementById("table-body");
            tableBody.innerHTML = '';

            // if no results are found
            if(bugsArray.length == 0) {
                let newRow = tableBody.insertRow(-1);
                let summaryCell = document.createElement('td');
                summaryCell.textContent = "No results found!";
                summaryCell.style.color = "#ff0000";
                summaryCell.className = 'mdl-data-table__cell--non-numeric'; 
                newRow.appendChild(summaryCell);
                return;
            }

            // build rows for each bug if there is at least one result
            bugsArray.forEach(element => {
                createRow(tableBody, element);
            });

            // Clear the searchbar
            document.getElementById('search-form').reset()
        } else {
            console.log("Search request error.");
        }
    });
};


// Function to create new bug row after searching
function createRow(tableBody, bugData) {
    let newRow = tableBody.insertRow(-1);

    // Bug Summary element
    let summaryCell = document.createElement('td');
    summaryCell.className = 'mdl-data-table__cell--non-numeric';
    let innerCell = document.createElement('div');
    summaryCell.appendChild(innerCell);
    innerCell.textContent = bugData.bugSummary;
    innerCell.className = 'user-text';
    newRow.appendChild(summaryCell);

    // Bug Description element
    let descriptionCell = document.createElement('td');
    descriptionCell.className = 'mdl-data-table__cell--non-numeric';
    innerCell = document.createElement('div');
    descriptionCell.appendChild(innerCell);
    innerCell.textContent = bugData.bugDescription;
    innerCell.className = 'user-text';
    newRow.appendChild(descriptionCell);

    // Project element
    let projectCell = document.createElement('td');
    projectCell.className = 'mdl-data-table__cell--non-numeric'; 
    projectCell.textContent = bugData.projectName;
    if(projectCell.textContent == "") {
        projectCell.textContent = "NULL";
    }
    newRow.appendChild(projectCell);

    // Programmers element
    let programmerCell = document.createElement('td');
    programmerCell.className = 'mdl-data-table__cell--non-numeric';
    let cellString = '';
    for (i = 0; i < bugData.programmers.length; i++) {
        cellString += bugData.programmers[i] + '<br>';
    }
    programmerCell.innerHTML = cellString;
    newRow.appendChild(programmerCell);

    // Date started element
    let dateCell = document.createElement('td');
    dateCell.textContent = bugData.dateStarted;
    newRow.appendChild(dateCell);

    // Priority element
    let priorityCell = document.createElement('td');
    priorityCell.textContent = bugData.priority;
    newRow.appendChild(priorityCell);

    // Fixed element
    let fixedCell = document.createElement('td');
    if (bugData.fixed == 0) {
        fixedCell.textContent = "No"
    } else {
        fixedCell.textContent = "Yes";
    }
    newRow.appendChild(fixedCell);

    // Resolution element
    let resolutionCell = document.createElement('td');
    resolutionCell.className = 'mdl-data-table__cell--non-numeric';
    innerCell = document.createElement('div');
    resolutionCell.appendChild(innerCell);
    innerCell.textContent = bugData.resolution;
    innerCell.className = 'user-text';
    newRow.appendChild(resolutionCell);

    // Update button element
    let updateCell = document.createElement('td');
    newRow.appendChild(updateCell);
    let updateBtn = document.createElement('a');
    updateCell.appendChild(updateBtn);
    updateBtn.text = "Update";
    updateBtn.className = "update-btn";
    updateBtn.href = `/edit-bug?bugId=${bugData.bugId}`;

    // Delete button element
    let deleteCell = document.createElement('td');
    newRow.appendChild(deleteCell);
    let deleteBtn = document.createElement('a');
    deleteCell.appendChild(deleteBtn);
    deleteBtn.type = "button";
    deleteBtn.text = "Delete";
    deleteBtn.className = "update-btn";
    deleteBtn.setAttribute('onclick', `deleteBug('recordTable', this, ${bugData.bugId})`);
}

// Change behavior of pressing 'Enter' on search bar. 
let searchInput = document.getElementById("search-input");

searchInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('search-btn').click();
    }
});
