import { li, span, p, h2 } from "../../../../shared/viewgencore.js";

export function createSearchItem(customer, onSelect) {
    // Create the 'li', pass attributes/events, and chain the children using .Append()
    return li({
        className: 'px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col gap-0.5 border-b border-gray-100 last:border-0',
        onclick: () => onSelect(customer)
    }).Append(
        span({ className: 'font-medium text-sm text-gray-900', textContent: customer.name }),
        span({ className: 'text-xs text-gray-700 truncate', textContent: customer.address || 'Sem endereço' }),
        span({ className: 'text-xs text-blue-600 font-semibold uppercase', textContent: customer.nuit ? `NUIT: ${customer.nuit}` : 'Particular' })
    );
}

export function createEmptyState() {
    return p({
        className: 'text-gray-400',
        textContent: 'Nenhum cliente selecionado.'
    });
}

export function createDetailsContent(customer) {
    const fragment = document.createDocumentFragment();

    const nuitValue = customer.nuit || 'N/A';
    const phoneValue = customer.phone || 'N/A';

    // Since DocumentFragment isn't part of your custom tags, we use the standard .append() here
    // But we still use your clean tag builders for the elements inside it.
    fragment.append(
        h2({ className: 'font-bold text-lg text-gray-900', textContent: customer.name }),
        p({ className: 'text-gray-600', textContent: customer.address || 'Sem endereço' }),
        p({ className: 'mt-1 font-semibold text-gray-700', textContent: `NUIT: ${nuitValue}` }),
        p({ className: 'text-gray-600', textContent: `Tel: ${phoneValue}` })
    );

    return fragment;
}