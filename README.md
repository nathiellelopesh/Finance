# Financial transaction management application

This program is a financial transaction management application that allows users to add, edit, and delete transactions, as well as view the updated balance. The main functionalities of the program are:

1 - Creating Transactions: Users can add new transactions by specifying the name, amount, and date of the transaction.

2 - Rendering Transactions: Each transaction is displayed in a list with its name, formatted amount (positive for credit and negative for debit), and date. Additionally, each transaction has buttons for editing and deleting.

3 - Editing Transactions: Users can edit the details of an existing transaction. A confirmation prompt is displayed before saving the changes.

4 - Deleting Transactions: Users can delete an existing transaction. A confirmation prompt is displayed before deleting the transaction.

5 - Data Persistence: Transactions are saved to a backend via HTTP requests (POST, PUT, DELETE) to a server at http://localhost:3000/transactions.

6 - Balance Update: The total balance is calculated and displayed based on the existing transactions.

## Initial Setup

Upon loading the page, existing transactions are fetched from the server and displayed in the user interface. The total balance is updated based on these transactions.

## User Events

- Add Transaction: Form to add a new transaction.
- Edit Transaction: Button to edit an existing transaction.
- Delete Transaction: Button to delete an existing transaction.

## Formatting

Transaction amounts are formatted according to the Brazilian standard (R$) using Intl.NumberFormat.
