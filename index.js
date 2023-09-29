const ctx = document.getElementById("myChart");

const myNewChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 2,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      legend: {},
    },
    scales: {
      y: {
        beginAtZero: true,
        display: false,
      },
    },
  },
});
const colorGenerate = () => {
  const hexoD = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += hexoD[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Get references to various elements in the HTML
const inputBudget = document.querySelector("#input-budget");
const submitBudget = document.querySelector("#submit-budget");
const showBudget = document.querySelector("#budget");

const inputExpenseDesc = document.querySelector("#input-expense-desc");
const inputExpense = document.querySelector("#input-expense");
const submitExpense = document.querySelector("#submit-expense");
const showExpenses = document.querySelector("#expenses");

const showBalance = document.querySelector("#balance");
let budgetAmount = 0;
const expenseList = document.querySelector(".list");

const reset = document.querySelector(".reset");

const alert_content = document.querySelector(".text-content");
const alert_title = document.querySelector(".alert-content");
const history2 = document.querySelector(".history2");
const tbodyHistory = document.querySelector(".tbodyHistory");
const history = document.querySelector(".history");
const canvas = document.getElementById("myChart");

const savedBudget = localStorage.getItem("budget");

let savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
let totalExpenses = 0;

let itemcount = 1;



const addBudget = () => {
  let oldBudget = parseFloat(localStorage.getItem("budget")) || 0;
  let newBudget = parseFloat(inputBudget.value);

  budgetAmount = oldBudget + newBudget;
  showBudget.innerHTML = `${budgetAmount}F`;
  // Save budget to local storage
  localStorage.setItem("budget", budgetAmount);
  inputBudget.value = "";
  let balance = budgetAmount - totalExpenses;
  showBalance.innerHTML = `${balance}F`;
};

if (savedBudget) {
  budgetAmount = parseFloat(savedBudget);
  showBudget.innerHTML = `${budgetAmount}F`;
}

function updateExpenses() {
  // Mise à jour des dépenses totales

  myNewChart.data.labels.push(inputExpenseDesc.value);
  myNewChart.data.datasets[0].data.push(inputExpense.value);
  myNewChart.data.datasets[0].backgroundColor.push(colorGenerate());
  myNewChart.update();
}

function updateChart() {
  savedExpenses = JSON.parse(localStorage.getItem("expenses"));
  if (savedExpenses !== null) {
    myNewChart.data.labels = savedExpenses.map((expense) => expense.item);
    myNewChart.data.datasets[0].data = savedExpenses.map(
      (expense) => expense.itemPrice
    );
    myNewChart.data.datasets[0].backgroundColor =
      savedExpenses.map(colorGenerate);
  } else {
    // Si savedExpenses est null, initialiser les propriétés à des tableaux vides ou à des valeurs par défaut.
    myNewChart.data.labels = [];
    myNewChart.data.datasets[0].data = [];
    myNewChart.data.datasets[0].backgroundColor = [];
  }
  myNewChart.update();
}

const addExpense = () => {
  let item = inputExpenseDesc.value;
  let itemPrice = parseInt(inputExpense.value);

  const getExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  if (getExpenses) {
    const findItem = getExpenses.find((it) => it.item === item);
    if (findItem) {
      findItem.itemPrice += parseInt(inputExpense.value);

      localStorage.setItem("expenses", JSON.stringify(getExpenses));

      updateExp(findItem.item, parseInt(inputExpense.value));

      return;
    }
     
  }

  getExpenses.push({ item, itemPrice });
  localStorage.setItem("expenses", JSON.stringify(getExpenses));
  updateExp(item, itemPrice);
};
function updateExp(item, itemPrice) {
  totalExpenses += parseFloat(itemPrice);
  let balance = budgetAmount - totalExpenses;
  showExpenses.innerHTML = `${totalExpenses}F`;
  showBalance.innerHTML = `${balance}F`;
  inputExpenseDesc.value = "";
  inputExpense.value = "";

  if (balance < 0) {
    showBalance.innerHTML = "00";
  }
  localStorage.setItem("totalExpenses", totalExpenses);
  localStorage.setItem("balance", balance);

  attachEvents();
  editFct();
  displaySavedExpenses();
}

// Fonction pour afficher les éléments sauvegardés dans la liste
function displaySavedExpenses() {
  tbodyHistory.innerHTML = ''
  expenseList.innerHTML = "";
  const getNewExp = JSON.parse(localStorage.getItem("expenses"));
  if (getNewExp) {
    getNewExp.forEach((expense, index) => {
      const listItem = document.createElement("div");
      listItem.className = "d-flex justify-content-between";
      listItem.dataset.index = index; // Ajouter l'index comme attribut pour une référence future
      expenseList.appendChild(listItem);

      listItem.innerHTML = `
        <p>${expense.item}</p>
        <p>${expense.itemPrice}F</p>
        <div>
        <svg id='editItem' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#00fff7" class="bi bi-pencil-square mx-3" viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
      </svg>
      <svg id='deleteItem' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
      </svg>
        </div>`;
       
      tbodyHistory.innerHTML += `
        
        <tr>
        <th scope="row">${itemcount++}</th>
        <td>${expense.item}</td>
        <td colspan="2"></td>
        <td>${expense.itemPrice}F</td>
      </tr>`;
    });
    attachEvents();
    editFct();
  }
}

displaySavedExpenses();
updateChart();

const savedBalance = localStorage.getItem("balance");

if (savedBalance) {
  balance = parseFloat(savedBalance);
  showBalance.innerHTML = `${balance}F`;
  if (balance < 0) {
    balance = 0;
    showBalance.innerHTML = `${balance}F`;
    localStorage.setItem("balance", 0);
  }
}

const savedTotalExp = localStorage.getItem("totalExpenses");
if (savedTotalExp) {
  totalExpenses = parseFloat(savedTotalExp);
  showExpenses.innerHTML = `${totalExpenses}F`;
}

function deleteItem(e) {
  const listItem = e.target.closest(".d-flex");
  if (e.target.id === "deleteItem") {
    listItem.remove();
    myNewChart.data.datasets[0].data.shift();

    savedExpenses.splice(listItem.dataset.index, 1);
    localStorage.setItem("expenses", JSON.stringify(savedExpenses));
    // Updating showExpenses and showBalance in the UI after deletion
    const totalExpensesAfterDeletion = savedExpenses.reduce(
      (total, expense) => total + parseFloat(expense.itemPrice),
      0
    );
    const balanceAfterDeletion = budgetAmount - totalExpensesAfterDeletion;
    showExpenses.innerHTML = `${totalExpensesAfterDeletion}F`;
    showBalance.innerHTML = `${balanceAfterDeletion}F`;
    localStorage.setItem("totalExpenses", totalExpensesAfterDeletion);
    localStorage.setItem("balance", balanceAfterDeletion);

    if (balanceAfterDeletion < 0) {
      showBalance.innerHTML = "0F";
    }
    updateChart();
  } else {
    alert("click it well boy");
  }
}
function edit(e) {
  savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const listItem = e.target.closest(".d-flex");
  if (e.target.id === "editItem") {
    if (inputExpenseDesc.value === "" && inputExpense.value === "") {
      listItem.remove();
      myNewChart.data.datasets[0].data.shift();

      const index = listItem.dataset.index;
      console.log(index);
      inputExpenseDesc.value = savedExpenses[index].item;
      inputExpense.value = savedExpenses[index].itemPrice;

      updateChart();

      savedExpenses.splice(listItem.dataset.index, 1);
      localStorage.setItem("expenses", JSON.stringify(savedExpenses));

      // Updating showExpenses and showBalance in the UI after deletion
      const totalExpensesAfterDeletion = savedExpenses.reduce(
        (total, expense) => total + parseFloat(expense.itemPrice),
        0
      );
      const balanceAfterDeletion = budgetAmount - totalExpensesAfterDeletion;
      localStorage.setItem("totalExpenses", totalExpensesAfterDeletion);
      showExpenses.innerHTML = `${totalExpensesAfterDeletion}F`;
      showBalance.innerHTML = `${balanceAfterDeletion}F`;

      localStorage.setItem("balance", balanceAfterDeletion);

      myNewChart.update();
    } else {
      displayError("deja en mode edition");
    }
    localStorage.setItem("expenses", JSON.stringify(savedExpenses));
  } else {
    alert("click it well boy");
  }
}

// Add event listener to the "Reset" button
reset.addEventListener("click", (e) => {
  e.preventDefault();
  showBudget.innerHTML = "0";
  showExpenses.innerHTML = "0";
  showBalance.innerHTML = "0";
  expenseList.innerHTML = "";

  // Clear local storage
  localStorage.removeItem("budget");
  localStorage.removeItem("expenses");
  localStorage.removeItem("balance");
  localStorage.removeItem("totalExpenses");
});

// Add event listener to the "Submit Budget" button
submitBudget.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputBudget.value < 0) {
    displayError("pas de budget négatif");
  } else {
    addBudget();
  }
});

submitExpense.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputExpenseDesc.value === "" ||
    inputExpense.value === "" ||
    inputExpense.value < 0
  ) {
    displayError("Inputs can't be empty or negative!!");
  } else {
    updateExpenses();
    addExpense();
    updateChart();
    displayError("Expense Added");
  }
});
const alert_box = document.querySelector(".alert");
const alertMessage = alert_box.querySelector(".alert-message");

function displayError(message) {
  alert_box.style.display = "block";
  alertMessage.textContent = message;
  setTimeout(function () {
    alert_box.style.display = "none";
  }, 3000);
}

history.addEventListener("click", (e) => {
  console.log("dfg");
  history2.setAttribute("style", "display: block");
  e.stopPropagation();
  
displaySavedExpenses()
});
function attachEvents() {
  const deleteItemIcon = document.querySelectorAll("#deleteItem");
  deleteItemIcon.forEach((deleteIt) => {
    deleteIt.addEventListener("click", (e) => {
      console.log("fgfhg");
      deleteItem(e);
      updateChart();
    });
  });
}
attachEvents();

function editFct() {
  const editItemIcon = document.querySelectorAll("#editItem");
  editItemIcon.forEach((editIt) => {
    editIt.addEventListener("click", (e) => {
      console.log("edited");
      edit(e);
      updateChart();
    });
  });
}

editFct();

document.addEventListener("click", (e) => {
  // Vérifiez si le clic s'est produit en dehors de history2
  if (!history2.contains(e.target)) {
    // Clique en dehors de history2, masquez history2
    history2.style.display = "none";
  }
});
