/*************************************************************
**  Description: ADD COMPANY - Client-side JavaScript file
**************************************************************/

let recordForm = document.getElementById('recordForm');
let spinner = document.getElementById('spinner');
spinner.style.visibility = "hidden"; 

// Function to submit the form data
recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    spinner.style.visibility = "visible"; 
    let req = new XMLHttpRequest();
    let queryString = '/companies/insertCompany';

    // String that holds the form data
    let parameterString =
    'companyName=' + recordForm.elements.companyName.value +
    '&dateJoined=' + recordForm.elements.dateJoined.value

    // Ajax request
    req.open('GET', queryString + '?' + parameterString, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.addEventListener('load', () => {
    if (req.status >= 200 && req.status < 400) {
        let response = JSON.parse(req.responseText);
        let id = response.companies;

        // Table of database records for the added companies
        let tbl = document.getElementById('recordTable');
        let newRow = tbl.insertRow(-1);

        // Company Name element
        let nameCell = document.createElement('td');
        nameCell.textContent = recordForm.elements.companyName.value;
        nameCell.className = 'mdl-data-table__cell--non-numeric'; 
        newRow.appendChild(nameCell);
       
        // Date Joined element
        let dateCell = document.createElement('td');
        dateCell.textContent = recordForm.elements.dateJoined.value;
        newRow.appendChild(dateCell);

        // Clear the submit form and stop spinner
        document.getElementById('recordForm').reset();
        setTimeout(() => { spinner.style.visibility = "hidden"; }, 1000);
        
    } else {
        console.log('Database return error');
    }
    });
    req.send(queryString + '?' + parameterString);
});