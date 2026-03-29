export function createConditionsViewModel(quotation) {
    const terms = quotation.terms || {};
    
    return {
        warrantyMonths: terms.warrantyMonths || 12,
        additionalNotes: terms.additionalNotes || "",
        taxRateLabel: "IVA à taxa legal em vigor (16%)." // Static business rule
    };
}