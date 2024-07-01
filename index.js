let transactions = [];

function createTransactionContainer(id) {
    const container = document.createElement('div');
    container.classList.add('transaction');
    container.id = `transaction-${id}`;
    return container;
}
  
function createTransactionTitle(name) {
    const title = document.createElement('span');
    title.classList.add('transaction-title');
    title.textContent = name;
    return title;
}

function createTransactionDay(day) {
  const date = document.createElement('span');
  date.classList.add('transaction-date');
  date.textContent = day;
  return date;
}

function createTransactionAmount(amount) {
    const span = document.createElement('span');
    span.classList.add('transaction-amount');
    
    const formater = Intl.NumberFormat('pt-BR', {
      compactDisplay: 'long',
      currency: 'BRL',
      style: 'currency',
    });

    const formatedAmount = formater.format(amount);
    
    span.textContent = formatedAmount;
    
    span.classList.add(amount > 0 ? 'credit' : 'debit');

    return span;
}

function renderTransaction(transaction) {
    const container = createTransactionContainer(transaction.id);
    const title = createTransactionTitle(transaction.name);
    const amount = createTransactionAmount(transaction.amount);
    const day = createTransactionDay(transaction.date);

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("edit-btn");
    btnEdit.textContent = "EDIT";
    btnEdit.addEventListener("click", () => editTransactionItem(transaction.id, transaction.amount));

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("delete-btn");
    btnDelete.textContent = "DELETE";
    btnDelete.addEventListener("click", () => deleteTransactionItem(transaction.id))
  
    document.querySelector('#transactions').append(container);
    container.append(title, amount, day, btnEdit, btnDelete);
}

function editTransactionItem(id, amount) {
  const container = document.getElementById(`transaction-${id}`);
  const titleElem = container.querySelector('.transaction-title');
  const amountElem = container.querySelector('.transaction-amount');
  const dateElem = container.querySelector(".transaction-date");

  const originalTitle = titleElem.textContent;
  const originalAmount = amount.toString();
  const originalDate = dateElem.textContent;

  const newTitle = document.createElement("input");
  const newValue = document.createElement("input");
  const newDate = document.createElement("input");

  newTitle.type = "text";
  newValue.type = "text";
  newDate.type = "date";

  newTitle.value = originalTitle;
  newValue.value = originalAmount;
  newDate.value = originalDate;

  const btnSave = document.createElement("button");
  const btnCancel = document.createElement("button");

  btnSave.textContent = "SAVE";
  btnCancel.textContent = "CANCEL";

  btnSave.addEventListener("click", () => saveEditedTransaction(id, newTitle.value, newValue.value, newDate.value));

  btnCancel.addEventListener("click", () => {
    const formater = Intl.NumberFormat('pt-BR', {
      compactDisplay: 'long',
      currency: 'BRL',
      style: 'currency',
    });

    titleElem.textContent = originalTitle;
    amountElem.textContent = formater.format(originalAmount);
    dateElem.textContent = originalDate;

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("edit-btn");
    btnEdit.textContent = "EDIT";
    btnEdit.addEventListener("click", () => editTransactionItem(id, amount));

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("delete-btn");
    btnDelete.textContent = "DELETE";
    btnDelete.addEventListener("click", () => deleteTransactionItem(id));

    container.innerHTML = '';
    container.append(titleElem, amountElem, dateElem, btnEdit, btnDelete);
  });

  container.innerHTML = '';
  container.append(newTitle, newValue, newDate, btnSave, btnCancel);
}

async function saveEditedTransaction(id, name, amount, date) {
  const confirmation = confirm("Are you sure you want to edit this transaction?");

  if(confirmation) {
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, amount: parseFloat(amount), date }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const updatedTransaction = await response.json();
      const transactionIndex = transactions.findIndex(transaction => transaction.id === id);
      transactions[transactionIndex] = updatedTransaction;

      const container = document.getElementById(`transaction-${id}`);
      container.innerHTML = '';
      renderTransaction(updatedTransaction);
      updateBalance();
    }
  }
}

async function deleteTransactionItem(id) {
  const confirmation = confirm("Are you sure you want to delete this transaction?");

  if(confirmation) {
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok){
      transactions = transactions.filter(transaction => transaction.id !== id);
      document.getElementById(`transaction-${id}`).remove();
      updateBalance();
    }
  }
}

//save new transaction on backend

async function saveTransaction(ev) {
  ev.preventDefault()

  const name = document.querySelector('#name').value;
  const amount = parseFloat(document.querySelector('#amount').value);
  const date = document.querySelector("#date").value;

  const currentDate = new Date();
  const inputDate = new Date(date);

  if (inputDate > currentDate) {
    alert("Data Inválida");
    return; // Sai da função se a data for inválida
  }

  const response = await fetch('http://localhost:3000/transactions', {
    method: 'POST',
    body: JSON.stringify({ name, amount, date }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const transaction = await response.json();
  transactions.push(transaction);
  renderTransaction(transaction);

  ev.target.reset(); //limpa os campos
  updateBalance();
}

async function fetchTransactions() {
    return await fetch('http://localhost:3000/transactions').then(res => res.json())
}

//calculate the balance of the account (saldo)

function updateBalance() {
    const balanceSpan = document.querySelector('#balance')
    const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    const formater = Intl.NumberFormat('pt-BR', {
      compactDisplay: 'long',
      currency: 'BRL',
      style: 'currency'
    })
    balanceSpan.textContent = formater.format(balance)
}

async function setup() {
    const results = await fetchTransactions()
    transactions.push(...results)
    transactions.forEach(renderTransaction) //Para cada item de transactions usa a função renderizar
    updateBalance()
}
  
document.addEventListener('DOMContentLoaded', setup);
document.querySelector('form').addEventListener('submit', saveTransaction);

//criar função q organiza transacoes por data