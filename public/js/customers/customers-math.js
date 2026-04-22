export function shouldSearch(value) {
    return value === '' || value.trim().length >= 2;
}

export function buildFullAddress(street, district, city) {
    const parts = [street, district, city].filter(p => p && p.trim() !== "");
    return parts.length > 0 ? parts.join(", ") : "Sem endereço";
}