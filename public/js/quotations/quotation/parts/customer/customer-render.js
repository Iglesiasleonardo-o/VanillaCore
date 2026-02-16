import { createSearchItem, createEmptyState, createDetailsContent } from './customer-viewgen.js';

export function renderCustomerList(listElement, customers, onSelect) {
    listElement.textContent = '';
    if (customers && customers.length > 0) {
        listElement.classList.remove('hidden');
        customers.forEach(c => listElement.appendChild(createSearchItem(c, onSelect)));
    } else {
        listElement.classList.add('hidden');
    }
}

export function fillCustomerForm(customer, inName, inNuit, inPhone, inAddr, toggle, resName, resNuit) {
    inName.value = customer.name || '';
    inNuit.value = customer.nuit || '';
    inPhone.value = customer.phone || '';
    inAddr.value = customer.address || '';
    toggle.checked = !!customer.isEntity;

    updateNuitRequirement(toggle.checked, inNuit);
    hideElement(resName);
    hideElement(resNuit);
}

export function renderCustomerSelection(customer, container, searchInput, clearBtn) {
    container.textContent = '';
    if (customer) {
        container.appendChild(createDetailsContent(customer));
        clearBtn.classList.remove('hidden');
        searchInput.placeholder = `Selecionado: ${customer.name}`;
    } else {
        container.appendChild(createEmptyState());
        clearBtn.classList.add('hidden');
        searchInput.placeholder = "-- Clique para selecionar ou criar cliente --";
    }
}

export function updateNuitRequirement(isRequired, inputNuit) {
    $('labelNuitRequired').classList.toggle('hidden', !isRequired);
    inputNuit.required = isRequired;
}

export function setCustomerLoading(type, isLoading) {
    const loaderId = type === 'name' ? 'loadingName' : 'loadingNuit';
    $(loaderId).classList.toggle('hidden', !isLoading);
}

// Alterado para focar e selecionar tudo no início
export function showCustomerModal(modal, inputFocus) {
    modal.classList.remove('hidden');
    setTimeout(() => {
        inputFocus.focus();
        inputFocus.select();
    }, 50);
}

export function hideCustomerModal(modal) {
    modal.classList.add('hidden');
}

export function toggleInput(input) {
    input.checked = !input.checked;
}

export function hideElement(element) {
    element.classList.add('hidden');
}