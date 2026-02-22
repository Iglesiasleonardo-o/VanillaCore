export const quotations = [
    {
        number: "1-26",
        status: "finalized",
        issueDate: "2026-02-17",
        expiryDate: "2026-03-19",
        metadata: { seller: "Cristiana Razaque", expiryDays: 30 },
        issuer: {
            name: "Inovitek, Lda",
            address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento",
            city: "Matola",
            province: "Maputo Província",
            zipCode: "1102",
            country: "Moçambique",
            nuit: "401956298",
            logoUrl: "https://storage.cdn.com/logos/inovitek.png",
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
        },
        customer: { id: 1, name: "Mozal S.A.", address: "Beluluane Industrial Park", city: "Maputo", nuit: "400012345" },
        items: [{ ref: "CUDY-GS105D", name: "Cudy 5 Port Gigabit Switch", quantity: 5, unitPrice: 15.90, taxRate: 16, totalLine: 92.22 }],
        totals: { subtotal: 79.50, taxTotal: 12.72, grandTotal: 92.22, currency: "MZN" },
        terms: { warrantyMonths: 15, paymentMethod: "Pronto Pagamento", additionalNotes: "Entrega em Beluluane." }
    },
    {
        number: "2-26",
        status: "finalized",
        issueDate: "2026-02-17",
        expiryDate: "2026-03-19",
        metadata: { seller: "Cristiana Razaque", expiryDays: 30 },
        issuer: {
            name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png",
            bankAccounts: []
        },
        customer: { id: 2, name: "Cornelder de Moçambique", address: "Porto da Beira", city: "Beira", nuit: "400098765" },
        items: [{ ref: "UBNT-U6-LITE", name: "Ubiquiti UniFi 6 Lite", quantity: 2, unitPrice: 110.00, taxRate: 16, totalLine: 255.20 }],
        totals: { subtotal: 220.00, taxTotal: 35.20, grandTotal: 255.20, currency: "MZN" },
        terms: { warrantyMonths: 12, paymentMethod: "Transferência Bancária", additionalNotes: "Custo de transporte não incluso." }
    },
    {
        number: "3-26",
        status: "finalized",
        issueDate: "2026-02-18",
        expiryDate: "2026-03-05",
        metadata: { seller: "Gerson Nhancale", expiryDays: 15 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        customer: { id: 3, name: "Cervejas de Moçambique", address: "Estrada Velha", city: "Matola", nuit: "400112233" },
        items: [{ ref: "SOL-PAN-450W", name: "Painel Solar 450W Monocristalino", quantity: 10, unitPrice: 145.00, taxRate: 16, totalLine: 1682.00 }],
        totals: { subtotal: 1450.00, taxTotal: 232.00, grandTotal: 1682.00, currency: "MZN" },
        terms: { warrantyMonths: 24, paymentMethod: "Pronto Pagamento", additionalNotes: "" }
    },
    {
        number: "4-26",
        status: "finalized",
        issueDate: "2026-02-18",
        expiryDate: "2026-03-20",
        metadata: { seller: "Cristiana Razaque", expiryDays: 30 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        customer: { id: 4, name: "Standard Bank", address: "Praça 25 de Junho", city: "Maputo", nuit: "400554433" },
        items: [{ ref: "HIK-IP-CAM-4MP", name: "Hikvision IP Camera 4MP", quantity: 4, unitPrice: 85.00, taxRate: 16, totalLine: 394.40 }],
        totals: { subtotal: 340.00, taxTotal: 54.40, grandTotal: 394.40, currency: "MZN" },
        terms: { warrantyMonths: 15, paymentMethod: "Transferência Bancária", additionalNotes: "Instalação incluída." }
    },
    {
        number: "5-26",
        status: "finalized",
        issueDate: "2026-02-19",
        expiryDate: "2026-03-21",
        metadata: { seller: "Zé", expiryDays: 30 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        customer: { id: 5, name: "Vodacom Moçambique", address: "Rua da Mesquita", city: "Maputo", nuit: "400998877" },
        items: [{ ref: "SLINK-GEN3", name: "Starlink Standard Kit Gen 3", quantity: 1, unitPrice: 450.00, taxRate: 16, totalLine: 522.00 }],
        totals: { subtotal: 450.00, taxTotal: 72.00, grandTotal: 522.00, currency: "MZN" },
        terms: { warrantyMonths: 12, paymentMethod: "Pronto Pagamento", additionalNotes: "Equipamento disponível em stock." }
    },
    {
        number: "6-26",
        status: "finalized",
        issueDate: "2026-02-19",
        expiryDate: "2026-02-26",
        metadata: { seller: "Cristiana Razaque", expiryDays: 7 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        customer: { id: 6, name: "Porto de Maputo", address: "Cais do Porto", city: "Maputo", nuit: "400443322" },
        items: [{ ref: "Cisco-C1000", name: "Cisco Catalyst 1000 24 Port", quantity: 1, unitPrice: 850.00, taxRate: 16, totalLine: 986.00 }],
        totals: { subtotal: 850.00, taxTotal: 136.00, grandTotal: 986.00, currency: "MZN" },
        terms: { warrantyMonths: 36, paymentMethod: "Pronto Pagamento", additionalNotes: "" }
    },
    {
        number: "7-26",
        status: "finalized",
        issueDate: "2026-02-20",
        expiryDate: "2026-03-22",
        metadata: { seller: "Gerson Nhancale", expiryDays: 30 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        customer: { id: 7, name: "Montepuez Ruby Mining", address: "Cabo Delgado", city: "Montepuez", nuit: "400778899" },
        items: [{ ref: "BATT-LITH-100AH", name: "Bateria de Lítio 100Ah 48V", quantity: 2, unitPrice: 1200.00, taxRate: 16, totalLine: 2784.00 }],
        totals: { subtotal: 2400.00, taxTotal: 384.00, grandTotal: 2784.00, currency: "MZN" },
        terms: { warrantyMonths: 60, paymentMethod: "Transferência Bancária", additionalNotes: "Garantia estendida do fabricante." }
    },
    {
        number: "8-26",
        status: "finalized",
        issueDate: "2026-02-20",
        expiryDate: "2026-03-22",
        metadata: { seller: "Cristiana Razaque", expiryDays: 30 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        customer: { id: 8, name: "Moza Banco", address: "Av. Julius Nyerere", city: "Maputo", nuit: "400223344" },
        items: [{ ref: "CAB-CAT6-305M", name: "Cabo de Rede CAT6 UTP 305m", quantity: 3, unitPrice: 120.00, taxRate: 16, totalLine: 417.60 }],
        totals: { subtotal: 360.00, taxTotal: 57.60, grandTotal: 417.60, currency: "MZN" },
        terms: { warrantyMonths: 6, paymentMethod: "Pronto Pagamento", additionalNotes: "" }
    },
    {
        number: "9-26",
        status: "finalized",
        issueDate: "2026-02-21",
        expiryDate: "2026-03-03",
        metadata: { seller: "Zé", expiryDays: 10 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        customer: { id: 9, name: "Hotel Polana", address: "Av. Julius Nyerere", city: "Maputo", nuit: "400665544" },
        items: [{ ref: "UBNT-DREAM-SE", name: "UniFi Dream Machine Special Edition", quantity: 1, unitPrice: 650.00, taxRate: 16, totalLine: 754.00 }],
        totals: { subtotal: 650.00, taxTotal: 104.00, grandTotal: 754.00, currency: "MZN" },
        terms: { warrantyMonths: 15, paymentMethod: "Pronto Pagamento", additionalNotes: "" }
    },
    {
        number: "10-26",
        status: "finalized",
        issueDate: "2026-02-21",
        expiryDate: "2026-03-23",
        metadata: { seller: "Cristiana Razaque", expiryDays: 30 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        customer: { id: 10, name: "Sasol Moçambique", address: "Av. da Marginal", city: "Maputo", nuit: "400119988" },
        items: [{ ref: "UPS-2KVA-ONLINE", name: "UPS Online 2KVA Rack Mount", quantity: 2, unitPrice: 380.00, taxRate: 16, totalLine: 881.60 }],
        totals: { subtotal: 760.00, taxTotal: 121.60, grandTotal: 881.60, currency: "MZN" },
        terms: { warrantyMonths: 12, paymentMethod: "Transferência Bancária", additionalNotes: "" }
    },
    {
        number: "11-26",
        issueDate: "2026-02-22",
        expiryDate: "2026-03-24",
        metadata: { seller: "Cristiana Razaque", expiryDays: 30 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        items: [{ ref: "CUDY-GS105D", name: "Cudy 5 Port Gigabit Switch", quantity: 1, unitPrice: 15.90, taxRate: 16, totalLine: 18.44 }],
        totals: { subtotal: 15.90, taxTotal: 2.54, grandTotal: 18.44, currency: "MZN" },
        terms: { warrantyMonths: 15, paymentMethod: "Pronto Pagamento", additionalNotes: "" }
    },
    {
        number: "12-26",
        status: "draft",
        issueDate: "2026-02-22",
        expiryDate: "2026-03-24",
        metadata: { seller: "Cristiana Razaque", expiryDays: 30 },
        issuer: { name: "Inovitek, Lda", address: "Rua da Mocargo, Talhão 2A, Parcela 728, Fomento", city: "Matola", province: "Maputo Província", zipCode: "1102", country: "Moçambique", nuit: "401956298", logoUrl: "https://storage.cdn.com/logos/inovitek.png" },
        items: [{ ref: "HIK-IP-CAM-4MP", name: "Hikvision IP Camera 4MP", quantity: 2, unitPrice: 85.00, taxRate: 16, totalLine: 197.20 }],
        totals: { subtotal: 170.00, taxTotal: 27.20, grandTotal: 197.20, currency: "MZN" },
        terms: { warrantyMonths: 15, paymentMethod: "Pronto Pagamento", additionalNotes: "" }
    }
];