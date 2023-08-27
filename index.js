const input_budget = document.querySelector('#input-budget');
const input_expense_desc = document.querySelector('#input-expense-desc');
const input_expense = document.querySelector('#input-expense')

const submitBudget = document.querySelector('#submit-budget');
const submitExpense = document.querySelector('#submit-expense');

const budget = document.querySelector('#budget');
const expenses = document.querySelector('#expenses');
const balance = document.querySelector('#balance');


const errorMessage = document.querySelector('.hide'); 

let amountTemp = 0;

var myBudget;
const object_data = {
    budget_amount: 0,
    total_expenses: 0,
    balance: 0,
    expenses: []
  };

  if (localStorage.getItem("budget")){
    budget= JSON.parse(localStorage.getItem("budget"));
    setValues();
  }else{
    localStorage.setItem("budget", JSON.stringify(object_data));
    budget = object_data;
  }

  submitBudget.addEventListener("click", addBudget, false);
  submitExpense.addEventListener("click", addExpense, false);
  input_budget.addEventListener("click", onlyDecimals, false);
  input_expense.addEventListener("click", onlyDecimals, false);

  const addBudget = ()=>{
    if (input_budget.value === ""){
        errorMessage.style.display = "block";
    }else{
        errorMessage.style.display = "none";
        calculate(false);
    }
  }

  function addExpense() {
    if (input_expense.value === "" || input_expense_desc.value === "") {
      expense_message.style.display = "block";
    } else {
      expense_message.style.display = "none";
      budget.expenses.push({
        title: input_expense_desc.value,
        value: input_expense.value
      });
      calculate(true);
    }
  }
  

  const calculate = (val)=>{
    if(!val){
        budget.budget_amount = input_budget.value;
    }
    budget.total_expenses = calculateExpenses();
    budget.balance = budget.budget_amount - budget.total_expenses;
    localStorage.setItem("budget", JSON.stringify(budget));
    setValues();
  }