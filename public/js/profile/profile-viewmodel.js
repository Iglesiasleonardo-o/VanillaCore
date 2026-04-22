export function createProfileViewModel(profile) {
    return {
        // Informações da Empresa
        companyName: profile.companyName || "",
        companyNuit: profile.companyNuit || "",
        companyEmail: profile.companyEmail || "",
        companyPhone: profile.companyPhone || "",
        companyFax: profile.companyFax || "",
        
        // Endereço Fiscal
        companyCountry: profile.companyCountry || "Moçambique",
        companyProvince: profile.companyProvince || "",
        companyDistrict: profile.companyDistrict || "",
        companyPostalCode: profile.companyPostalCode || "",
        companyStreet: profile.companyStreet || "",

        // Moeda e Impostos
        currencySymbol: profile.currencySymbol || "MZN",
        taxRate: profile.taxRate || 16,
        pricesIncludeTax: profile.pricesIncludeTax !== false // Por defeito true
    };
}