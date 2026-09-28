import { getElement, formatCurrencyInput, fixCoin } from "./utils.js";
import "./investments.js";
import { setupInputListeners, hydrateInputs } from "./inputs.js";

const BUDGET_STORAGE_KEY = 'budget_state_v1';
const MAX_EXPENSES = 12;

const defaultState = {
    income: 0,
    housing: 0, energy: 0, water: 0, internet: 0,
    education: 0, healthInsurance: 0, gymMembership: 0, streaming: 0,
    transportation: 0, carInsurance: 0,
    groceries: 0, restaurant: 0, fuel: 0, parking: 0,
    vehicleMaintenance: 0, houseMaintenance: 0,
    leisure: 0, turism: 0, clothing: 0, beauty: 0,
    medicines: 0, hospital: 0,
    extraExpenses: []
};

function loadState() {
    try {
        const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
        if (raw) return { ...defaultState, ...JSON.parse(raw) };
    } catch (e) {
        // localStorage indisponível ou corrompido
    }
    return { ...defaultState };
}

export const state = loadState();

function saveState() {
    try {
        localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // sem persistência
    }
}

// --- Funções Puras para Cálculos Financeiros ---

export function calculateFixedExpenses(stateObj) {
    const { income, extraExpenses, ...fixedExpenses } = stateObj;
    return Object.values(fixedExpenses).reduce((sum, v) => sum + (Number(v) || 0), 0);
}

export function calculateExtraExpenses(extraExpenses) {
    return extraExpenses.reduce((sum, e) => sum + (Number(e.value) || 0), 0);
}

export function calculateBalance(stateObj) {
    const income = Number(stateObj.income) || 0;
    const fixedTotal = calculateFixedExpenses(stateObj);
    const extraTotal = calculateExtraExpenses(stateObj.extraExpenses || []);
    return income - fixedTotal - extraTotal;
}

function getNextExpenseId(extraExpenses) {
    if (!extraExpenses || extraExpenses.length === 0) return 0;
    return extraExpenses.reduce((maxId, item) => Math.max(maxId, item.id), -1) + 1;
}

// --- Manipulação do DOM e Atualização da Interface ---

function updateBalance() {
    const balance = calculateBalance(state);

    const balanceOutput = document.querySelector('.balance-container output');
    if (balanceOutput) {
        balanceOutput.textContent = 'R$ ' + fixCoin(balance);
        balanceOutput.classList.toggle('balance-negative', balance < 0);
        balanceOutput.classList.toggle('balance-neutral', balance === 0);
        balanceOutput.classList.toggle('balance-positive', balance > 0);
    }

    saveState();
}

function buildExpenseRow(id, name, value) {
    const block = document.createElement('div');
    block.classList.add('variable-expenses-block', 'custom-expense-item');

    const image = document.createElement('img');
    image.id = `extra-expense-image-${id}`;
    image.src = './svg/expense-icon.svg';
    image.alt = 'generic-expense-icon';
    image.classList.add('variable-expense-icon');

    const label = document.createElement('label');
    label.textContent = name;
    label.htmlFor = `extra-expense-${id}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.id = `extra-expense-${id}`;
    input.placeholder = 'R$0,00';
    if (value) input.value = 'R$ ' + fixCoin(value);

    formatCurrencyInput(input, (val) => {
        const expense = state.extraExpenses.find(e => e.id === id);
        if (expense) {
            expense.value = val;
        }
        updateBalance();
    });

    block.appendChild(image);
    block.appendChild(label);
    block.appendChild(input);
    return block;
}

function renderExpenses() {
    const customExpensesContainer = getElement('custom-expenses-container');
    const addExpenseWrapper = getElement('add-expense-wrapper');
    if (!customExpensesContainer) return;

    customExpensesContainer.innerHTML = '';

    state.extraExpenses.forEach(expense => {
        const rowBlock = buildExpenseRow(expense.id, expense.name, expense.value);
        customExpensesContainer.appendChild(rowBlock);
    });

    if (state.extraExpenses.length < MAX_EXPENSES && addExpenseWrapper) {
        customExpensesContainer.appendChild(addExpenseWrapper);
    }
}

function createExpense(name = 'Novo gasto') {
    if (state.extraExpenses.length >= MAX_EXPENSES) return;

    const id = getNextExpenseId(state.extraExpenses);
    state.extraExpenses.push({ id, name, value: 0 });

    renderExpenses();
    updateBalance();
}

function setupEvents() {
    const addBtn = getElement('add-expense');
    if (addBtn) {
        addBtn.addEventListener('click', () => createExpense());
    }
}

function init() {
    hydrateInputs(state);
    renderExpenses();
    setupEvents();
    setupInputListeners(state, updateBalance);
    updateBalance();
}

init();