// creating function to add row in table
function addRowToTable(tableBody, expenseDetails) {
    const newRow = tableBody.insertRow();
    const amountCell = newRow.insertCell(0);
    const descriptionCell = newRow.insertCell(1);
    const categoryCell = newRow.insertCell(2);
    const deleteCell = newRow.insertCell(3);
    const editCell = newRow.insertCell(4);

    amountCell.textContent = expenseDetails.amount;
    descriptionCell.textContent = expenseDetails.description;
    categoryCell.textContent = expenseDetails.category;

    // Creating a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');

    deleteButton.onclick = () => {
        console.log('Deleting user with ID:', expenseDetails._id);
        axios.delete(`https://crudcrud.com/api/65bf6aabae564cbfaaf25d1d3336d02b/expenseData/${expenseDetails._id}`)
        .then((res) =>{
            tableBody.removeChild(newRow);
            console.log('user got deleted');
        })
        .catch((err) => {
            console.log('Error while deleting the user ', err);
          });
    }
    deleteCell.appendChild(deleteButton);

    // Creating an edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('btn', 'btn-warning', 'btn-sm');
    editButton.onclick = () => {
        document.getElementById('amount-input').value = expenseDetails.amount;
        document.getElementById('description-input').value = expenseDetails.description;
        document.getElementById('category-select').value = expenseDetails.category;

        // Adding editing class to the row
        newRow.classList.add('editing');

         // Storing the ID of the expense being edited
        newRow.dataset.expenseId = expenseDetails._id;

       
    };
    
    editCell.appendChild(editButton);

   
    
}

// showing all expenses from crudcurd.com database when page is loaded
document.addEventListener('DOMContentLoaded', () =>{
    const tableBody = document.getElementById('expense-table-body');
    axios.get('https://crudcrud.com/api/65bf6aabae564cbfaaf25d1d3336d02b/expenseData')
        .then((res) => {
            for (let i = 0; i < res.data.length; i++) {
                const expenseDetails = res.data[i];
               
                addRowToTable(tableBody, expenseDetails);
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
// creating handleFormSubmit function
function handleFormSubmit(event) {
    event.preventDefault();
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target['category-select'].value;

    const expenseDetails = {
        amount: Number(amount),
        description: description,
        category: category
    }

    const tableBody = document.getElementById('expense-table-body');

    let editedExpenseIndex = -1;

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i]

        if (row.classList.contains('editing')) {
            editedExpenseIndex = i

            row.cells[0].textContent = expenseDetails.amount
            row.cells[1].textContent = expenseDetails.description
            row.cells[2].textContent = expenseDetails.category

            row.classList.remove('editing');

           
            const editedExpenseId = row.dataset.expenseId;
            // Making a PUT request for editing
            
            axios.put(`https://crudcrud.com/api/65bf6aabae564cbfaaf25d1d3336d02b/expenseData/${editedExpenseId}`,expenseDetails)
                .then((res) => {
                    console.log('Expense edited successfully');
                })
                .catch((err) => {
                    console.log('Error while editing the expense ', err);
                });
            event.target.reset();
        }
    }
        
    
    //  if not editing then add new item
    if (editedExpenseIndex === -1) {
    //    making post request for adding item into the database as well as to the screen
        axios.post('https://crudcrud.com/api/65bf6aabae564cbfaaf25d1d3336d02b/expenseData',expenseDetails)
        .then((res) =>{
            addRowToTable(tableBody, expenseDetails);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong</h4>';
            console.log(err);
        })

        // Clearing the form after adding item to table
        event.target.reset();
    }
}



