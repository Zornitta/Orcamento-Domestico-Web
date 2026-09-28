// Funções Utilitárias
export const getElement = (id) => document.getElementById(id);

export const fixCoin = (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatCurrencyInput(inputEl, callback) {
    if (!inputEl) return;
    
    inputEl.addEventListener('input', (e) => {
        let cursorPosition = e.target.selectionStart;
        let originalLength = e.target.value.length;

        let digits = e.target.value.replace(/\D/g, '');
        if (!digits) {
            e.target.value = '';
            if (callback) callback(0);
            return;
        }

        const numberValue = parseInt(digits, 10) / 100;
        const formattedValue = 'R$ ' + fixCoin(numberValue);
        
        e.target.value = formattedValue;

        let newLength = formattedValue.length;
        cursorPosition += (newLength - originalLength);
        inputEl.setSelectionRange(cursorPosition, cursorPosition);

        if (callback) callback(numberValue);
    });
}