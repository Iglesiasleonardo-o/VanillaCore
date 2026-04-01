export function getCartesianProduct(arrays) {
    if (!arrays || arrays.length === 0) return [[]];
    return arrays.reduce((acc, current) => {
        if (current.length === 0) return acc;
        return acc.flatMap(c => current.map(v => [...c, v]));
    }, [[]]);
}

export function formatCurrency(value) {
    return `MZN ${Number(value).toFixed(2).replace('.', ',')}`;
}

export function shouldSearch(value) {
    // Permite pesquisa vazia para resetar a grelha
    return value === '' || value.trim().length >= 2;
}