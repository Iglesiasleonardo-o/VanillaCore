import { quotations } from "../../../database.js";

export function fetchQuotation(quotationId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const quotation = quotations.find(q => q.number === quotationId);

            if (quotation) {
                resolve({ status: 200, data: quotation });
            } else {
                // Aqui simulamos o erro 404 para o dado não encontrado
                reject({ status: 404, message: `Cotação ${quotationId} não existe.` });
            }
        }, 400);
    });
}