// pterms-viewgen.js

function textElement(tag, className, text) {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = text;
    return el;
}

export function createAccountListItem(account, isSelected, callback) {
    const li = document.createElement('li');
    
    li.className = isSelected
        ? 'flex justify-between items-start p-3 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-colors mb-2'
        : 'flex justify-between items-start p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors mb-2';

    // --- Coluna Esquerda: Texto ---
    const infoCol = document.createElement('div');
    infoCol.className = 'flex-1 pr-2';

    const title = document.createElement('div');
    title.className = 'font-bold text-gray-700 text-sm mb-1';
    title.textContent = `${account.bank} (${account.currency})`;

    const detailsText = `Titular: ${account.accountHolder}\nBanco: ${account.bank}\nConta: ${account.accountNumber}\nNIB: ${account.nib || 'N/A'}\nSWIFT: ${account.swift || 'N/A'}`;
    
    const details = document.createElement('div');
    details.className = 'text-xs text-gray-500 whitespace-pre-line leading-relaxed';
    details.textContent = detailsText;

    infoCol.appendChild(title);
    infoCol.appendChild(details);

    // --- Coluna Direita: Ícone ---
    const actionCol = document.createElement('div');
    actionCol.className = 'flex flex-col justify-center h-full pt-1';

    const icon = document.createElement('span');
    if (isSelected) {
        icon.className = 'text-gray-400 font-bold text-lg group-hover:text-red-500 transition-colors';
        icon.textContent = '✕'; 
    } else {
        icon.className = 'text-green-600 font-bold text-xl group-hover:scale-110 transition-transform';
        icon.textContent = '+';
    }

    actionCol.appendChild(icon);

    li.appendChild(infoCol);
    li.appendChild(actionCol);
    li.onclick = () => callback(account.id);

    return li;
}

export function createAccountPrintCard(account) {
    const container = document.createElement('div');
    container.className = 'mb-4 break-inside-avoid border-l-2 border-gray-100 pl-3';

    const title = document.createElement('p');
    title.className = 'font-bold text-gray-800 text-sm mb-1';
    title.textContent = `${account.bank} (${account.currency})`;

    const detailsText = `Titular: ${account.accountHolder}\nBanco: ${account.bank}\nConta: ${account.accountNumber}\nNIB: ${account.nib || 'N/A'}\nSWIFT: ${account.swift || 'N/A'}`;
    
    const details = document.createElement('p');
    details.className = 'text-xs text-gray-600 whitespace-pre-line leading-relaxed';
    details.textContent = detailsText;

    container.appendChild(title);
    container.appendChild(details);

    return container;
}

export function createEmptyState(text) {
    return textElement('div', 'text-gray-400 text-sm italic text-center p-4', text);
}