const display = document.getElementById('display');
const numberBtns = document.querySelectorAll('.number-btn');
const operatorBtns = document.querySelectorAll('.operator-btn');
const clearBtn = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equalsBtn = document.getElementById('equals');
const percentBtn = document.getElementById('percent');

let displayValue = '';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;

// Update display
function updateDisplay() {
    display.value = displayValue || '0';
}

// Number button click handler
numberBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        
        if (value === '.') {
            if (displayValue.includes('.')) return;
            if (displayValue === '') displayValue = '0';
        }

        if (shouldResetDisplay) {
            displayValue = value;
            shouldResetDisplay = false;
        } else {
            displayValue += value;
        }
        
        updateDisplay();
    });
});

// Operator button click handler
operatorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (displayValue === '') return;
        
        if (previousValue !== '' && operation && !shouldResetDisplay) {
            calculate();
        }
        
        previousValue = displayValue;
        operation = btn.getId ? btn.id : btn.getAttribute('id');
        displayValue = '';
        shouldResetDisplay = true;
        updateDisplay();
    });
});

// Map operator IDs to symbols
function getOperatorSymbol(id) {
    const symbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×',
        'divide': '÷'
    };
    return symbols[id] || id;
}

// Calculate operation
function calculate() {
    if (previousValue === '' || displayValue === '' || !operation) return;

    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(displayValue);

    switch (operation) {
        case 'add':
            result = prev + current;
            break;
        case 'subtract':
            result = prev - current;
            break;
        case 'multiply':
            result = prev * current;
            break;
        case 'divide':
            result = current !== 0 ? prev / current : 'Error';
            break;
        default:
            return;
    }

    displayValue = String(result);
    previousValue = '';
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Equals button
equalsBtn.addEventListener('click', () => {
    if (operation && previousValue && displayValue) {
        calculate();
    }
});

// Clear button (AC)
clearBtn.addEventListener('click', () => {
    displayValue = '';
    previousValue = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
});

// Delete button (DEL)
deleteBtn.addEventListener('click', () => {
    displayValue = displayValue.toString().slice(0, -1);
    updateDisplay();
});

// Percent button
percentBtn.addEventListener('click', () => {
    if (displayValue === '') return;
    
    const value = parseFloat(displayValue);
    displayValue = String(value / 100);
    updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        const btn = Array.from(numberBtns).find(b => b.getAttribute('data-value') === e.key);
        if (btn) btn.click();
    } else if (e.key === '.') {
        const btn = Array.from(numberBtns).find(b => b.getAttribute('data-value') === '.');
        if (btn) btn.click();
    } else if (e.key === '+') {
        document.getElementById('add').click();
    } else if (e.key === '-') {
        document.getElementById('subtract').click();
    } else if (e.key === '*') {
        document.getElementById('multiply').click();
    } else if (e.key === '/') {
        e.preventDefault();
        document.getElementById('divide').click();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        equalsBtn.click();
    } else if (e.key === 'Escape') {
        clearBtn.click();
    } else if (e.key === 'Backspace') {
        deleteBtn.click();
    }
});

// Initialize display
updateDisplay();
