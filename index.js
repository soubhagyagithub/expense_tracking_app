function handleFormSubmit(event){
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

    for (let i = 0; i < tableBody.rows.length; i++){
        const row = tableBody.rows[i]

        if (row.classList.contains('editing')){
        editedExpenseIndex = i

        row.cells[0].textContent = expenseDetails.amount
        row.cells[1].textContent = expenseDetails.description
        row.cells[2].textContent = expenseDetails.category

        row.classList.remove('editing');

        const editedExpenseKey = row.getAttribute('data-expense-key');
        localStorage.setItem(editedExpenseKey, JSON.stringify(expenseDetails));
        }
    }

    if (editedExpenseIndex === -1){
        const newRow = tableBody.insertRow();
        const amountCell = newRow.insertCell(0);
        const descriptionCell = newRow.insertCell(1);
        const categoryCell = newRow.insertCell(2);
        const deleteCell = newRow.insertCell(3);
        const editCell = newRow.insertCell(4);

        amountCell.textContent = expenseDetails.amount;
        descriptionCell.textContent = expenseDetails.description;
        categoryCell.textContent = expenseDetails.category;

        // creating delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger','btn-sm')

        deleteButton.onclick = () =>{
            const expenseKey = newRow.getAttribute('data-expense-key')
            localStorage.removeItem(expenseKey);
            tableBody.removeChild(newRow)
        }
        deleteCell.appendChild(deleteButton);

        // creating edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn','btn-warning','btn-sm');
        editButton.onclick = () => {
            document.getElementById('amount-input').value = expenseDetails.amount;
            document.getElementById('description-input').value = expenseDetails.description;
            document.getElementById('category-select').value = expenseDetails.category;

             // Adding editing class to the row
            newRow.classList.add('editing');
        }
        editCell.appendChild(editButton)

        // Saving the new expense to local storage and assign a unique key
        const newExpenseKey = `${category}-${Date.now()}`;
        newRow.setAttribute('data-expense-key', newExpenseKey);
        localStorage.setItem(newExpenseKey, JSON.stringify(expenseDetails));
    }

    // Clearing the form
    event.target.reset();
}

    


