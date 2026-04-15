// import { loadQuotationByURLEvent } from '../quotations/quotation/quotation-events.js';
import { loadCustomersByURLEvent } from "../customers/customers-render.js"
import { loadProductsByURLEvent } from "../products/product-render.js"
import { loadProfileByURL } from "../profile/profile-render.js"
import { loadQuotationByURLEvent } from "../quotations/quotation/quotation-render.js"
import { loadQuotationsListByURL } from "../quotations/quotations-render.js"

export const routes = {
    "/quotations/:quotationNumber": loadQuotationByURLEvent,
    "/quotations": loadQuotationsListByURL,
    "/products": loadProductsByURLEvent,
    "/profile": loadProfileByURL,
    "/customers": loadCustomersByURLEvent,
    "/404": () => { alert("404 - Page not found, or still being developed") },
    "/": () => $("main-wrapper").innerHTML = DefaultView()
}

function DefaultView() {
    return `
    <div class="flex items-center justify-center h-full px-6">
        <div class="text-center max-w-md">
            
            <div class="mb-4">
                <i class="w-10 h-10 mx-auto text-blue-500" data-lucide="bell-off"></i>
            </div>

            <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Nada por aqui... ainda 👀
            </h2>

            <p class="text-gray-500 text-sm leading-relaxed">
                Estou a preparar uma área de notificações para ti.  
                Por agora, podes explorar as opções no menu à esquerda.
            </p>
        </div>
    </div>
`;
}