// Load existing transactions from localStorage or start with empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ===============================
// Page Routing Logic
// ===============================

if (window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname === "/index.html") {
  setupIndexPage();
}

if (window.location.pathname.includes("summary.html")) {
  renderSummary();
  renderTransactionTable();
}

// ===============================
// Index Page (Add/Delete Transactions)
// ===============================

function setupIndexPage() {
  const form = document.getElementById("transaction-form");
  const list = document.getElementById("transaction-list");
  const clearAllBtn = document.getElementById("clear-all");

  function saveAndRender() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    list.innerHTML = "";

    transactions.forEach((tx, index) => {
      const li = document.createElement("li");
      li.textContent = `${tx.type}: ₹${tx.amount} - ${tx.category} (${tx.date})`;
      li.style.color = tx.type === "Income" ? "green" : "red";

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => {
        transactions.splice(index, 1);
        saveAndRender();
      };

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  form.onsubmit = (e) => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value;

    transactions.push({ amount, type, category, date, note });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    saveAndRender();
    form.reset();
  };

  clearAllBtn.onclick = () => {
    const confirmClear = confirm("Are you sure you want to delete all transactions?");
    if (confirmClear) {
      transactions = [];
      localStorage.setItem("transactions", JSON.stringify(transactions));
      saveAndRender();
    }
  };

  saveAndRender();
}

// ===============================
// Summary Page
// ===============================

function renderSummary() {
  const income = transactions
    .filter(tx => tx.type === "Income")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const expenses = transactions
    .filter(tx => tx.type === "Expense")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const balance = income - expenses;

  const incomeEl = document.getElementById("income");
  const expensesEl = document.getElementById("expenses");
  const balanceEl = document.getElementById("balance");

  if (incomeEl && expensesEl && balanceEl) {
    incomeEl.textContent = income.toFixed(2);
    expensesEl.textContent = expenses.toFixed(2);
    balanceEl.textContent = balance.toFixed(2);
  }
}

function renderTransactionTable() {
  const tableBody = document.getElementById("transaction-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  transactions.forEach((tx) => {
    const row = document.createElement("tr");

    const typeCell = document.createElement("td");
    typeCell.textContent = tx.type;
    typeCell.style.color = tx.type === "Income" ? "green" : "red";

    const amountCell = document.createElement("td");
    amountCell.textContent = `₹${parseFloat(tx.amount).toFixed(2)}`;

    const categoryCell = document.createElement("td");
    categoryCell.textContent = tx.category;

    const dateCell = document.createElement("td");
    dateCell.textContent = tx.date;

    row.appendChild(typeCell);
    row.appendChild(amountCell);
    row.appendChild(categoryCell);
    row.appendChild(dateCell);

    tableBody.appendChild(row);
  });
}
