import { prepareCustomerData, shouldSearch, searchCustomers } from './customer-logic.js';
import {
    showCustomerModal, hideCustomerModal, updateNuitRequirement,
    setCustomerLoading, renderCustomerList, fillCustomerForm,
    renderCustomerSelection, toggleInput, hideElement
} from './customer-render.js';

let currentCustomer = null;

export function initCustomerEvents() {
    setupModalBehavior();
    setupSearchAndToggle();
    setupFormActions();

    // UX Global
    $('customerForm').querySelectorAll('input, textarea').forEach(el => el.onfocus = () => el.select());
}

function setupModalBehavior() {
    const modal = $('customerSelectionModal');
    const panel = modal.querySelector('.modal-panel');
    const inName = $('inputCustomerName');

    $('customerSearch').onclick = () => showCustomerModal(modal, inName);
    $('closeCustomerModalButton').onclick = () => hideCustomerModal(modal);
    $('btnCancelCustomer').onclick = () => hideCustomerModal(modal);

    modal.onclick = () => hideCustomerModal(modal);
    panel.onclick = (e) => e.stopPropagation();
}

function setupSearchAndToggle() {
    const inName = $('inputCustomerName'), inNuit = $('inputCustomerNuit');
    const resName = $('resultsName'), resNuit = $('resultsNuit');
    const toggle = $('toggleIsEntity');

    const fields = [inName, inNuit, $('inputCustomerPhone'), $('inputCustomerAddress'), toggle, resName, resNuit];

    const doSearch = (input, type, resEl, otherResEl) => {
        hideElement(otherResEl);
        if (!shouldSearch(input.value)) return hideElement(resEl);

        setCustomerLoading(type, true);
        searchCustomers(input.value, type, (results) => {
            setCustomerLoading(type, false);
            renderCustomerList(resEl, results, (data) => fillCustomerForm(data, ...fields));
        });
    };

    inName.oninput = () => doSearch(inName, 'name', resName, resNuit);
    inNuit.oninput = () => doSearch(inNuit, 'nuit', resNuit, resName);

    $('containerToggleEntity').onclick = (e) => {
        if (e.target !== toggle) { toggleInput(toggle); updateNuitRequirement(toggle.checked, inNuit); }
    };
    toggle.onchange = () => updateNuitRequirement(toggle.checked, inNuit);
}

function setupFormActions() {
    const form = $('customerForm');
    const searchBtn = $('customerSearch'), clearBtn = $('clearCustomerButton');
    const container = $('customerDetails');

    form.onsubmit = (e) => {
        e.preventDefault();
        const customer = prepareCustomerData(
            $('inputCustomerName').value, $('inputCustomerNuit').value,
            $('inputCustomerPhone').value, $('inputCustomerAddress').value,
            $('toggleIsEntity').checked
        );
        renderCustomerSelection(customer, container, searchBtn, clearBtn);
        hideCustomerModal($('customerSelectionModal'));
        currentCustomer = customer;
    };

    clearBtn.onclick = (e) => {
        e.stopPropagation();
        renderCustomerSelection(null, container, searchBtn, clearBtn);
        currentCustomer = null;
    };
}

export const getSelectedCustomer = () => currentCustomer;