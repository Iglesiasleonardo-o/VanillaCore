function textElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

export function createSearchItem(customer, onSelect) {
    const li = textElement('li', 'px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col gap-0.5 border-b border-gray-100 last:border-0');
    const name = textElement('span', 'font-medium text-sm text-gray-900', customer.name);
    const addr = textElement('span', 'text-xs text-gray-700 truncate', customer.address || 'Sem endereço');
    const info = textElement('span', 'text-xs text-blue-600 font-semibold uppercase', customer.nuit ? `NUIT: ${customer.nuit}` : 'Particular');

    li.append(name, addr, info);
    li.onclick = () => onSelect(customer);
    return li;
}

export function createEmptyState() {
    return textElement('p', 'text-gray-400', 'Nenhum cliente selecionado.');
}

export function createDetailsContent(customer) {
    const fragment = document.createDocumentFragment();
    fragment.append(textElement('h2', 'font-bold text-lg text-gray-900', customer.name));
    fragment.append(textElement('p', 'text-gray-600', customer.address || 'Sem endereço'));

    // NUIT: Mostra valor ou N/A
    const nuitValue = customer.nuit || 'N/A';
    fragment.append(textElement('p', 'mt-1 font-semibold text-gray-700', `NUIT: ${nuitValue}`));

    // Telefone: Sempre visível, mostra valor ou N/A
    const phoneValue = customer.phone || 'N/A';
    fragment.append(textElement('p', 'text-gray-600', `Tel: ${phoneValue}`));

    return fragment;
}