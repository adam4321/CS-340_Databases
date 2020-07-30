/*************************************************************
**  Description: ADD PROJECT - Client-side JavaScript file
**************************************************************/

let recordForm = document.getElementById('recordForm');

// Function to submit the form data
recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let req = new XMLHttpRequest();
    let queryString = '/projects/insertProject';

    // String that holds the form data
    let parameterString =
    'projectName=' + recordForm.elements.projectName.value +
    '&companyName=' + recordForm.elements.projectCompany.value +
    '&dateStarted=' + recordForm.elements.startedDate.value +
    '&lastUpdated=' + recordForm.elements.updatedDate.value +
    '&inMaintenance=' + recordForm.elements.maintenance.value

    // Ajax request
    req.open('GET', queryString + '?' + parameterString, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.addEventListener('load', () => {
    if (req.status >= 200 && req.status < 400) {
        let response = JSON.parse(req.responseText);
        let id = response.projects;

        // Table of database records for the added companies
        let tbl = document.getElementById('recordTable');
        let newRow = tbl.insertRow(-1);

        // Company Name element
        let nameCell = document.createElement('td');
        nameCell.textContent = recordForm.elements.projectName.value;
        nameCell.className = 'mdl-data-table__cell--non-numeric'; 
        newRow.appendChild(nameCell);
       
        // Date Joined element
        let companyCell = document.createElement('td');
        companyCell.textContent = recordForm.elements.projectCompany.value;
        companyCell.className = 'mdl-data-table__cell--non-numeric'; 
        newRow.appendChild(companyCell);

        // Date Joined element
        let startedCell = document.createElement('td');
        startedCell.textContent = recordForm.elements.startedDate.value;
        newRow.appendChild(startedCell);

        // Date Joined element
        let updatedCell = document.createElement('td');
        updatedCell.textContent = recordForm.elements.updatedDate.value;
        newRow.appendChild(updatedCell);

        // Date Joined element
        let maintenanceCell = document.createElement('td');
        // Test for in maintenance being 0 or 1 and set to yes or no
        if (recordForm.elements.maintenance.value == 1) {
            maintenanceCell.textContent = 'Yes';
        } else {
            maintenanceCell.textContent = 'No';
        }
        newRow.appendChild(maintenanceCell);

        // Clear the submit form
        document.getElementById('recordForm').reset()
    } else {
        console.log('Database return error');
    }
    });
    req.send(queryString + '?' + parameterString);
});
