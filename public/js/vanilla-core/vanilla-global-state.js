// No need for this project, but it can be used to store global state if needed in the future.
export let globalState = {
    user: { name: "Guest", role: "admin" },
    settings: { theme: "dark" },
    cache: {},
    company: {
        name: "Inovitek, Lda",
        address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento",
        city: "Matola",
        province: "Maputo Província",
        zip_code: "1102",
        country: "Moçambique",
        nuit: "401956298",
        logo_url: "https://storage.cdn.com/logos/inovitek.png",
        bankAccounts: [
            {
                id: 1,
                bank: "Millenium BIM",
                currency: "MZN",
                accountHolder: "INOVITEK LDA",
                accountNumber: "1243184787",
                nib: "000300000012431847870",
                swift: "BIMOMZMXXXX"
            },
            {
                id: 2,
                bank: "Nedbank Moçambique, S.A",
                currency: "MZN",
                accountHolder: "INOVITEK LDA",
                accountNumber: "00041179005",
                nib: "004300000004117900567",
                swift: "UNICMZMХ"
            }
        ]
    }
};

export function setGlobalDataState(state) {
    globalState = state;
}