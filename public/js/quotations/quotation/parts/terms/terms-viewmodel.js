export function createPaymentTermsViewModel(globalBanks, quotation) {
    // Render file guarantees these exist now, no fallbacks needed!
    const quotationBanks = quotation.issuer.bankAccounts;
    const paymentMethod = quotation.terms.paymentMethod;
    
    const selectedIds = new Set(quotationBanks.map(q => q.id));
    const standardTerms = ["Pronto Pagamento", "15 Dias", "30 Dias"];

    return {
        selectedAccounts: quotationBanks,
        availableAccounts: globalBanks.filter(b => !selectedIds.has(b.id)),
        
        paymentMethod: paymentMethod,
        standardTerms: standardTerms,
        isManualTerm: !standardTerms.includes(paymentMethod) 
    };
}

export function formatAccountDetails(account) {
    return `Titular: ${account.accountHolder}\nBanco: ${account.bank}\nConta: ${account.accountNumber}\nNIB: ${account.nib || 'N/A'}\nSWIFT: ${account.swift || 'N/A'}`;
}