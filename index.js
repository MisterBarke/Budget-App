


// Get references to various elements in the HTML
const inputBudget = document.querySelector("#input-budget");
const submitBudget = document.querySelector("#submit-budget");
const showBudget = document.querySelector("#budget");

const inputExpenseDesc = document.querySelector('#input-expense-desc');
const inputExpense = document.querySelector('#input-expense');
const submitExpense = document.querySelector('#submit-expense'); 
const showExpenses = document.querySelector('#expenses');

const showBalance = document.querySelector("#balance");
let budgetAmount = 0;
const expenseList = document.querySelector('.list');

const reset = document.querySelector('.reset');
const alert_box = document.querySelector('.hide');
const alert_content = document.querySelector('.text-content'); 
const alert_title = document.querySelector('.alert-content'); 


const savedBudget = localStorage.getItem('budget');

let savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalExpenses = savedExpenses.reduce((total, expense) => total + parseFloat(expense.itemPrice), 0);

if (savedBudget) {
    budgetAmount = parseFloat(savedBudget);
    showBudget.innerHTML = `${budgetAmount}F`;
}

if (savedExpenses){
    showExpenses.innerHTML = `${totalExpenses}F`;
}

if(savedBudget && savedExpenses){
    showBalance.innerHTML = `${budgetAmount - totalExpenses}F`;
}



// Load expenses from local storage when the page loads



// Add event listener to the "Reset" button
reset.addEventListener('click', (e) => {
    e.preventDefault();
    showBudget.innerHTML = '0';
    showExpenses.innerHTML = "0";
    showBalance.innerHTML = "0";
    expenseList.innerHTML = '';

    // Clear local storage
    localStorage.setItem('budget', '0');
    localStorage.setItem('  ', '[]');
    localStorage.setItem('balance', '0');
   
    savedExpenses = []

    resetChart()
   
});

// Add event listener to the "Submit Budget" button
submitBudget.addEventListener('click', (e) => {
  e.preventDefault();
    addBudget();
    addBalanceToLocalStorage();
});



// Adding event listener to the expense list for deleting items
/* expenseList.addEventListener('click', (e) => {
    const listItem = e.target.closest('.d-flex');
    if (e.target.id === 'deleteItem') {
        e.preventDefault();
        listItem.remove();
        myNewChart.data.datasets[0].data.shift();
    }
    savedExpenses.splice(listItem.dataset.index, 1);
    localStorage.setItem('expenses', JSON.stringify(savedExpenses));

    // Updating showExpenses and showBalance in the UI after deletion
    const totalExpensesAfterDeletion = savedExpenses.reduce((total, expense) => total + parseFloat(expense.itemPrice), 0);
    const balanceAfterDeletion = budgetAmount - totalExpensesAfterDeletion;
    showExpenses.innerHTML = `${totalExpensesAfterDeletion}F`;
    showBalance.innerHTML = `${balanceAfterDeletion}F`;
   
    if (balanceAfterDeletion < 0) {
        showBalance.innerHTML = '0F';
       
        updateExpenses();
        
    }
   
}); */


function updateChart() {
  myNewChart.data.labels = savedExpenses.map(expense => expense.item);
  myNewChart.data.datasets[0].data = savedExpenses.map(expense => parseFloat(expense.itemPrice));
  if(parseFloat(inputExpense.value) >= 0){
  myNewChart.data.labels.push(inputExpenseDesc.value);
  myNewChart.data.datasets[0].data.push(inputExpense.value);
  myNewChart.data.datasets[0].backgroundColor.push(colorGenerate());
  }else{
    alert("fgvfvfvd")
  }
  myNewChart.update();
  localStorage.setItem('chartData', JSON.stringify(savedExpenses)); // 
}

const ctx = document.getElementById('myChart');
function createChart(){
  
  

  const myNewChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [],
      datasets: [{
        
        data: [],
        backgroundColor: [],
        borderWidth: 2
      }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
           
          }
        },
      scales: {
        y: {
          beginAtZero: true,
          display : false,
        },
       
      }
    }
  });

  return myNewChart;
 
}

document.addEventListener('DOMContentLoaded', () => {
  myNewChart = createChart();
  // Load chart data from local storage and update the chart
  const chartLabels = savedExpenses.map(expense => expense.item);
  const chartData = savedExpenses.map(expense => parseFloat(expense.itemPrice));
  const chartColors = savedExpenses.map(() => colorGenerate());

  myNewChart.data.labels = chartLabels;
  myNewChart.data.datasets[0].data = chartData;
  myNewChart.data.datasets[0].backgroundColor = chartColors;
  myNewChart.update();
});

function resetChart() {
  myNewChart.data.labels = [];
  myNewChart.data.datasets[0].data = [];
  myNewChart.data.datasets[0].backgroundColor = [];
  myNewChart.update();
}

  const colorGenerate = ()=>{
    const hexoD = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i<6; i++){
        color +=hexoD[Math.floor(Math.random()*16)];
    }
    return color
}

const addBudget = ()=>{
  let oldBudget = parseFloat(localStorage.getItem('budget')) || 0;
  let newBudget = parseFloat(inputBudget.value);
  if (newBudget >= 0){
  budgetAmount = oldBudget + newBudget;
  showBudget.innerHTML = `${budgetAmount}F`;
  // Save budget to local storage
  localStorage.setItem('budget', budgetAmount);
  inputBudget.value = '';
  budgetSubmitAlert()
  
  }else{
    negativeNumAlert()
  }
}
const addBalanceToLocalStorage = ()=>{
  let oldBalance = parseFloat(localStorage.getItem('balance')) || 0;
  localStorage.setItem('balance', oldBalance);
  oldBalance = budgetAmount - totalExpenses;
  showBalance.innerHTML = `${oldBalance}F`;
  // Save balance to local storage
 
}


const displayExpenses = ()=>{
 
  expenseList.innerHTML = ''
  for (let index = 0; index <savedExpenses.length; index++) {
    console.log(savedExpenses[index]);
    const listItem = document.createElement('div');
    listItem.className = 'd-flex justify-content-between';
    // listItem.setAttribute('data-index', expenseList.children.length);
     expenseList.appendChild(listItem);
     listItem.innerHTML = `
        <p>${savedExpenses[index].item}</p>
        <p>${savedExpenses[index].itemPrice}F</p>
        <div>
        <svg id='editItem' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square mx-3" viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
      </svg>
      <svg id='deleteItem' onclick="deleteExpense(${savedExpenses[index].id})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
      </svg>
        </div>`
       
  }
  
}
const deleteExpense = (id)=>{
  savedExpenses = savedExpenses.filter((item) => item.id !== id);
  localStorage.setItem('expenses', JSON.stringify(savedExpenses));
  const totalExpensesAfterDeletion = savedExpenses.reduce((total, expense) => total + parseFloat(expense.itemPrice), 0);
  const balanceAfterDeletion = budgetAmount - totalExpensesAfterDeletion;
  showExpenses.innerHTML = `${totalExpensesAfterDeletion}F`;
  showBalance.innerHTML = `${balanceAfterDeletion}F`;

  updateChart(); 
  displayExpenses();


  }




displayExpenses()
const addExpense = ()=>{

  let item = inputExpenseDesc.value;
        let itemPrice = inputExpense.value; 

        savedExpenses.push({ item, itemPrice, id:Date.now()});
        localStorage.setItem('expenses', JSON.stringify(savedExpenses));
        updateChart();
       displayExpenses();
        totalExpenses += parseFloat(itemPrice);
        showExpenses.innerHTML = `${totalExpenses}F`;
        const balance = budgetAmount - totalExpenses;
        showBalance.innerHTML = `${balance}F`;
        inputExpenseDesc.value = '';
        inputExpense.value = '';
        myNewChart.update();
}


submitExpense.addEventListener('click', (e) => {
  
  if(parseFloat(inputExpense.value) >=0){
    
  updateChart();
  addExpense();
  addBalanceToLocalStorage();
 
 expenseSubmitAlert()
 
  }else{
    negativeNumAlert()
  }
});

 


const budgetSubmitAlert = ()=>{
  alert_box.setAttribute('style', 'display: block' );
alert_title.textContent = 'Ajout de Budget';
alert_content.textContent = 'budegt ajouté avec succès';
setTimeout(() => {
  alert_box.setAttribute('style', 'display: none');
  alert_title.textContent = '';
  alert_content.textContent = '';
}, 2000);
}

const expenseSubmitAlert = ()=>{
  alert_box.setAttribute('style', 'display: block' );
alert_title.textContent = 'Ajout de Dépense';
alert_content.textContent = 'Dépense ajoutée avec succès';
setTimeout(() => {
  alert_box.setAttribute('style', 'display: none');
  alert_title.textContent = '';
  alert_content.textContent = '';
}, 2000);
}

const negativeNumAlert = ()=>{
  alert_box.setAttribute('style', 'display: block' );
alert_title.textContent = 'Nombre négatif';
alert_content.textContent = 'Veuillez insérer un nombre positif';
setTimeout(() => {
  alert_box.setAttribute('style', 'display: none');
  alert_title.textContent = '';
  alert_content.textContent = '';
}, 2000);
}


