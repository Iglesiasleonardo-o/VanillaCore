import { createPaymentTermsViewModel, formatAccountDetails } from './terms-viewmodel.js';
import {
    PaymentTermsModal, PaymentTermsWidget,
    SelectedAccountItem, AvailableAccountItem, AccountPrintCard, EmptyPaymentMessage
} from './terms-viewgen.js';

export function setupPaymentTermsModule(globalBanks, quotation) {
    // 1. STRICT DEFAULTS: Ensure the source of truth is bulletproof before doing anything
    if (!quotation.issuer) quotation.issuer = {};
    if (!quotation.issuer.bankAccounts) quotation.issuer.bankAccounts = [];
    if (!quotation.terms) quotation.terms = {};
    quotation.terms.paymentMethod ||= "Pronto Pagamento"; // <-- Syncs data with UI instantly

    // 2. ViewModel does the heavy array filtering
    const vm = createPaymentTermsViewModel(globalBanks, quotation);

    const widgetEvents = setupWidgetEvents(quotation);
    const modalEvents = setupModalEvents(quotation);

    const widget = PaymentTermsWidget(vm, widgetEvents);
    const modal = PaymentTermsModal(modalEvents);

    // 3. Pass the VM directly to initialization so we don't recalculate!
    setTimeout(() => {
        initializeLists(vm, modalEvents);
    }, 0);

    return { widget, modal };
}

// ==========================================
// 1. INITIALIZATION 
// ==========================================
function initializeLists(vm, modalEvents) {
    const selectedList = $("selectedMethodsList");
    const availableList = $("availableMethodsList");
    const a4Container = $("paymentMethodsPrint");

    if (!selectedList || !availableList || !a4Container) return;

    a4Container.appendChild(EmptyPaymentMessage());

    // Loop directly over the pre-sorted ViewModel arrays!
    vm.selectedAccounts.forEach(account => {
        const details = formatAccountDetails(account);
        selectedList.appendChild(SelectedAccountItem(account, details, modalEvents.onRemoveAccount));
        a4Container.appendChild(AccountPrintCard(account, details));
    });

    vm.availableAccounts.forEach(account => {
        const details = formatAccountDetails(account);
        availableList.appendChild(AvailableAccountItem(account, details, modalEvents.onAddAccount));
    });

    toggleEmptyMessage(vm.selectedAccounts.length);
}

function toggleEmptyMessage(count) {
    const noPaymentMsg = $("noPaymentMethod");
    if (!noPaymentMsg) return;

    if (count > 0) {
        noPaymentMsg.classList.add("hidden");
    } else {
        noPaymentMsg.classList.remove("hidden");
    }
}

// ==========================================
// 2. EVENTS (Highly targeted DOM updates)
// ==========================================
function setupWidgetEvents(quotation) {
    return {
        onOpenModal: () => $("paymentMethodModal").classList.remove("hidden"),

        onTermSelectChange: (e) => {
            const selectValue = e.target.value;
            const otherInput = $("paymentTermsOther");
            const printSpan = $("paymentTermsPrintValue");

            if (selectValue === "outro") {
                otherInput.classList.remove("hidden");
                otherInput.focus();
                quotation.terms.paymentMethod = otherInput.value;
                printSpan.textContent = otherInput.value;
            } else {
                otherInput.classList.add("hidden");
                otherInput.value = "";
                quotation.terms.paymentMethod = selectValue;
                printSpan.textContent = selectValue;
            }
        },

        onTermOtherInput: (e) => {
            const value = e.target.value;
            quotation.terms.paymentMethod = value;
            $("paymentTermsPrintValue").textContent = value;
        }
    };
}

function setupModalEvents(quotation) {
    const events = {
        onAddAccount: (account, clickedElement) => {
            if (!quotation.issuer.bankAccounts.find(a => a.id === account.id)) {
                quotation.issuer.bankAccounts.push(account);
            }

            clickedElement.remove();

            const details = formatAccountDetails(account);
            $("selectedMethodsList").appendChild(SelectedAccountItem(account, details, events.onRemoveAccount));
            $("paymentMethodsPrint").appendChild(AccountPrintCard(account, details));

            toggleEmptyMessage(quotation.issuer.bankAccounts.length);
        },

        onRemoveAccount: (account, clickedElement) => {
            quotation.issuer.bankAccounts = quotation.issuer.bankAccounts.filter(a => a.id !== account.id);

            clickedElement.remove();
            const a4Card = $(`print-bank-${account.id}`);
            if (a4Card) a4Card.remove();

            const details = formatAccountDetails(account);
            $("availableMethodsList").appendChild(AvailableAccountItem(account, details, events.onAddAccount));

            toggleEmptyMessage(quotation.issuer.bankAccounts.length);
        },

        onCloseModal: (e) => {
            if (!e || e.target === e.currentTarget || e.currentTarget.tagName === "BUTTON") {
                $("paymentMethodModal").classList.add("hidden");
            }
        }
    };
    return events;
}