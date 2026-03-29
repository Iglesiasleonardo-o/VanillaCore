export function createCustomerViewModel(quotation) {
    const customer = quotation.customer;
    const hasName = !!customer.name;

    return {
        // App-level data
        quotationNumber: quotation.number || "0000",
        hasName: hasName,

        // Modal Draft Inputs
        name: customer.name || "",
        nuit: customer.nuit || "",
        phone: customer.phone || "",
        address: customer.address || "",
        isEntity: !!customer.isEntity,

        // A4 Card Formatted Display Strings
        searchPlaceholder: hasName
            ? `Selecionado: ${customer.name}`
            : "-- Clique para selecionar ou criar cliente --",

        addressLabel: customer.address ? `Endereço: ${customer.address}` : "Endereço: N/A",
        nuitLabel: customer.nuit ? `NUIT: ${customer.nuit}` : "NUIT: N/A",
        phoneLabel: customer.phone ? `Tel: ${customer.phone}` : "Tel: N/A"
    };
}