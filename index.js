const inputBudget = document.querySelector("#input-budget");
const submitBudget = document.querySelector("#submit-budget");
const showBudget = document.querySelector("#budget");

const inputExpenseDesc = document.querySelector('#input-expense-desc');
const inputExpense = document.querySelector('#input-expense');
const submitExpense = document.querySelector('#submit-expense'); 
const showExpenses = document.querySelector('#expenses');

submitBudget.addEventListener('click', (e)=>{
    e.preventDefault();
    function addBudget(){
    if(showBudget.innerHTML === '0F'){
        showBudget.innerHTML =`${inputBudget.value}F`
    }else{
        showBudget.innerHTML
    }
    inputBudget.value = ''   
    }
    addBudget()
})

submitExpense.addEventListener('click', e=>{
    e.preventDefault();
    function addExpense () {
        let newExpensesVal = parseFloat(inputExpense.value);
        let oldExpensesVal = parseFloat(showExpenses.innerHTML);
        newExpensesVal = newExpensesVal + oldExpensesVal;
        showExpenses.innerHTML = `${newExpensesVal}F`; 
        inputExpense.value = ''
    }
    addExpense();
})