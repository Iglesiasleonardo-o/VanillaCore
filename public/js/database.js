export const company = {
    name: "Inovitek, Lda",
    address: "Rua da Mocargo, Talhão 2A, Parcela 728",
    district: "Fomento",
    city: "Matola",
    province: "Maputo Província",
    postalCode: "1113",
    country: "Moçambique",
    nuit: "400131139",
    defaults: {
        validityDays: 7,
        warrantyMonths: 12,
        vatRate: 16,
    },
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
};

export const customers = [
    { id: 1, name: 'Mozal S.A.', address: 'Beluluane Industrial Park, Maputo', city: 'Maputo', nuit: '400012345', phone: '+258 21 735 000', isEntity: true },
    { id: 2, name: 'Inovitek Lda', address: 'Matola, Fomento', city: 'Matola', nuit: '400131139', phone: '+258 84 123 4567', isEntity: true },
    { id: 3, name: 'João Manuel Silva', address: 'Av. 24 de Julho, Maputo', city: 'Maputo', nuit: '109283746', phone: '+258 82 000 0000', isEntity: false },
    { id: 4, name: 'Construções XYZ', address: 'Rua das Flores, Bairro Central', city: 'Matola', nuit: '500789123', phone: '+258 84 000 0000', isEntity: true },
    { id: 5, name: 'Cervejas de Moçambique', address: 'Av. 25 de Setembro', city: 'Maputo', nuit: '400001001', phone: '+258 21 300 100', isEntity: true },
    { id: 6, name: 'TDM - Telecomunicações de Moçambique', address: 'Rua da Sé, Maputo', city: 'Maputo', nuit: '400055667', phone: '+258 21 431 100', isEntity: true },
    { id: 7, name: 'Matola Gas Company', address: 'Bairro da Liberdade', city: 'Matola', nuit: '400998811', phone: '+258 21 720 011', isEntity: true },
    { id: 8, name: 'Edmund’s Electrical', address: 'Av. Eduardo Mondlane', city: 'Maputo', nuit: '401223344', phone: '+258 84 555 1234', isEntity: true },
    { id: 9, name: 'Electricidade de Moçambique (EDM)', address: 'Av. Agostinho Neto', city: 'Maputo', nuit: '400088990', phone: '+258 21 481 000', isEntity: true },
    { id: 10, name: 'Standard Bank Moçambique', address: 'Av. 10 de Novembro', city: 'Maputo', nuit: '400500600', phone: '+258 21 355 000', isEntity: true },
    { id: 11, name: 'Kento Engenharia', address: 'Sommerschield', city: 'Maputo', nuit: '402119933', phone: '+258 82 444 5566', isEntity: true },
    { id: 12, name: 'Anabela Chivambo', address: 'Bairro do Jardim', city: 'Maputo', nuit: '112233445', phone: '+258 85 999 0011', isEntity: false },
    { id: 13, name: 'Solar Pro Moçambique', address: 'Av. de Angola', city: 'Matola', nuit: '403112244', phone: '+258 87 222 3344', isEntity: true },
    { id: 14, name: 'Condomínio Vila Sol', address: 'Marracuene', city: 'Maputo', nuit: '405667788', phone: '+258 21 810 020', isEntity: true },
    { id: 15, name: 'Tecnel Service', address: 'Km 15, Estrada Nacional N1', city: 'Matola', nuit: '400345678', phone: '+258 21 722 000', isEntity: true },
    { id: 16, name: 'Ricardo Machava', address: 'Bairro T3', city: 'Matola', nuit: '108877665', phone: '+258 84 777 6655', isEntity: false },
    { id: 17, name: 'Mota-Engil Moçambique', address: 'Av. Vladimir Lenine', city: 'Maputo', nuit: '400112233', phone: '+258 21 411 222', isEntity: true },
    { id: 18, name: 'Petromoc', address: 'Praça dos Trabalhadores', city: 'Maputo', nuit: '400445566', phone: '+258 21 356 000', isEntity: true },
    { id: 19, name: 'Agências de Viagens Malaika', address: 'Av. Karl Marx', city: 'Maputo', nuit: '400778899', phone: '+258 82 333 4455', isEntity: true },
    { id: 20, name: 'Sérgio Mondlane', address: 'Bairro da Manga', city: 'Beira', nuit: '105544332', phone: '+258 84 111 2222', isEntity: false },
    { id: 21, name: 'Hoteis Polana S.A.', address: 'Av. Julius Nyerere', city: 'Maputo', nuit: '400011111', phone: '+258 21 241 700', isEntity: true },
    { id: 22, name: 'DHD Construções', address: 'Av. de Moçambique', city: 'Maputo', nuit: '408899001', phone: '+258 85 555 4444', isEntity: true },
    { id: 23, name: 'Maria Helena Matsinhe', address: 'Costa do Sol', city: 'Maputo', nuit: '107766554', phone: '+258 84 888 7777', isEntity: false },
    { id: 24, name: 'Intelec Holdings', address: 'Av. Kim Il Sung', city: 'Maputo', nuit: '400223355', phone: '+258 21 499 100', isEntity: true },
    { id: 25, name: 'Sociedade de Águas de Moçambique', address: 'Marracuene', city: 'Maputo', nuit: '400110022', phone: '+258 82 100 2030', isEntity: true },
    { id: 26, name: 'Vodacom Moçambique', address: 'Rua dos Desportistas', city: 'Maputo', nuit: '400440055', phone: '+258 84 000 0001', isEntity: true },
    { id: 27, name: 'Caminhos de Ferro de Moçambique', address: 'Av. 25 de Setembro', city: 'Maputo', nuit: '400000001', phone: '+258 21 301 501', isEntity: true },
    { id: 28, name: 'Escola Internacional de Maputo', address: 'Bairro Sommerschield', city: 'Maputo', nuit: '405566443', phone: '+258 21 491 550', isEntity: true },
    { id: 29, name: 'Filipe Nyusi (Particular)', address: 'Av. da Marginal', city: 'Maputo', nuit: '100000002', phone: '+258 84 999 8887', isEntity: false },
    { id: 30, name: 'Cornelder de Moçambique', address: 'Porto da Beira', city: 'Beira', nuit: '400887766', phone: '+258 23 322 735', isEntity: true },
    { id: 31, name: 'Emilio Jossias', address: 'Bairro Aeroporto', city: 'Pemba', nuit: '102233998', phone: '+258 86 444 1122', isEntity: false },
    { id: 32, name: 'Unitrans Moçambique', address: 'Avenida das Indústrias', city: 'Matola', nuit: '400332211', phone: '+258 21 721 555', isEntity: true },
    { id: 33, name: 'Auto-Industrial Lda', address: 'Av. de Angola', city: 'Maputo', nuit: '400221133', phone: '+258 21 465 123', isEntity: true },
    { id: 34, name: 'Daniela Francisco', address: 'Cidade da Matola', city: 'Matola', nuit: '104455667', phone: '+258 84 555 4433', isEntity: false },
    { id: 35, name: 'Coca-Cola Sabco', address: 'Bairro da Machava', city: 'Matola', nuit: '400009988', phone: '+258 21 750 100', isEntity: true },
    { id: 36, name: 'Zainabo Aly', address: 'Bairro Central', city: 'Quelimane', nuit: '103322114', phone: '+258 82 990 1122', isEntity: false },
    { id: 37, name: 'Sasol Moçambique', address: 'Av. do Rol', city: 'Inhambane', nuit: '400665544', phone: '+258 29 322 000', isEntity: true },
    { id: 38, name: 'Francisco Cumbe', address: 'Mafalala', city: 'Maputo', nuit: '106655448', phone: '+258 84 332 1199', isEntity: false },
    { id: 39, name: 'BIM - Banco Internacional de Moçambique', address: 'Av. Samora Machel', city: 'Maputo', nuit: '400100100', phone: '+258 21 350 000', isEntity: true },
    { id: 40, name: 'Gestão de Terminais de Moçambique', address: 'Porto de Maputo', city: 'Maputo', nuit: '400122112', phone: '+258 21 320 440', isEntity: true },
    { id: 41, name: 'Saber Informática', address: 'Av. Ahmed Sekou Touré', city: 'Maputo', nuit: '401122998', phone: '+258 21 322 555', isEntity: true },
    { id: 42, name: 'Helena Ubisse', address: 'Bairro Ferroviário', city: 'Maputo', nuit: '109988776', phone: '+258 85 440 0011', isEntity: false },
    { id: 43, name: 'Construtora do Índico', address: 'Avenida Namaacha', city: 'Matola', nuit: '400776655', phone: '+258 84 220 3344', isEntity: true },
    { id: 44, name: 'Mecula Logística', address: 'Zona Industrial de Nampula', city: 'Nampula', nuit: '400223399', phone: '+258 26 218 000', isEntity: true },
    { id: 45, ref: 'PART-45', name: 'Artur Malengue', address: 'Bairro do Alto Maé', city: 'Maputo', nuit: '104433221', phone: '+258 84 102 9384', isEntity: false },
    { id: 46, name: 'Vale Moçambique S.A.', address: 'Moatize', city: 'Tete', nuit: '400551122', phone: '+258 25 220 000', isEntity: true },
    { id: 47, name: 'Hidroelétrica de Cahora Bassa', address: 'Songo', city: 'Tete', nuit: '400000005', phone: '+258 25 282 221', isEntity: true },
    { id: 48, name: 'Cimentos de Moçambique', address: 'Av. Fernão de Magalhães', city: 'Maputo', nuit: '400000123', phone: '+258 21 415 000', isEntity: true },
    { id: 49, name: 'Sogrape Moçambique', address: 'Av. das Indústrias', city: 'Matola', nuit: '400331199', phone: '+258 21 721 001', isEntity: true },
    { id: 50, name: 'Paulo Zandamela', address: 'Bairro da Liberdade', city: 'Matola', nuit: '110022993', phone: '+258 82 551 0022', isEntity: false },
    { id: 51, name: 'SGS Moçambique', address: 'Av. da Malhangalene', city: 'Maputo', nuit: '400554433', phone: '+258 21 411 900', isEntity: true },
    { id: 52, name: 'Clínica Sommerschield', address: 'Rua de Maputo', city: 'Maputo', nuit: '400889977', phone: '+258 21 493 924', isEntity: true },
    { id: 53, name: 'Abdul Gani', address: 'Avenida Eduardo Mondlane', city: 'Xai-Xai', nuit: '102211004', phone: '+258 84 001 0022', isEntity: false },
    { id: 54, name: 'Manhiça Trading', address: 'Vila da Manhiça', city: 'Maputo', nuit: '401122338', phone: '+258 21 810 111', isEntity: true },
    { id: 55, name: 'Estaleiros navais de Pemba', address: 'Porto de Pemba', city: 'Pemba', nuit: '400991122', phone: '+258 27 221 030', isEntity: true },
    { id: 56, name: 'Patrício Langa', address: 'Bairro Magoanine', city: 'Maputo', nuit: '115544221', phone: '+258 87 111 2233', isEntity: false },
    { id: 57, name: 'BCI - Banco Comercial e de Investimento', address: 'Av. 25 de Setembro', city: 'Maputo', nuit: '400111222', phone: '+258 21 311 600', isEntity: true },
    { id: 58, name: 'Emanuel Cossa', address: 'Bairro Khongolote', city: 'Matola', nuit: '109911882', phone: '+258 84 440 3322', isEntity: false },
    { id: 59, name: 'LAM - Linhas Aéreas de Moçambique', address: 'Aeroporto de Mavalane', city: 'Maputo', nuit: '400000008', phone: '+258 21 465 131', isEntity: true },
    { id: 60, name: 'Aga Khan Moçambique', address: 'Av. Friedrich Engels', city: 'Maputo', nuit: '400990088', phone: '+258 21 490 515', isEntity: true },
    { id: 61, name: 'Joaquim Chissano (Particular)', address: 'Av. da Marginal', city: 'Maputo', nuit: '100000001', phone: '+258 82 111 0001', isEntity: false },
    { id: 62, name: 'Delta Logística', address: 'Bairro da Munhava', city: 'Beira', nuit: '400228811', phone: '+258 23 311 000', isEntity: true },
    { id: 63, name: 'Safira Construções', address: 'Av. Joaquim Chissano', city: 'Maputo', nuit: '403322110', phone: '+258 84 881 2233', isEntity: true },
    { id: 64, name: 'Lucas Mabunda', address: 'Vila de Namaacha', city: 'Maputo', nuit: '101122330', phone: '+258 85 220 1144', isEntity: false },
    { id: 65, name: 'Moçambique Telecom SA (Movitel)', address: 'Av. Vladimir Lenine', city: 'Maputo', nuit: '400998877', phone: '+258 86 100 0000', isEntity: true },
    { id: 66, name: 'Tânia Tembe', address: 'Bairro da Polana Caniço', city: 'Maputo', nuit: '118877223', phone: '+258 84 121 2121', isEntity: false },
    { id: 67, name: 'Condomínio Zen', address: 'Sommerschield II', city: 'Maputo', nuit: '405544112', phone: '+258 21 488 900', isEntity: true },
    { id: 68, name: 'Auto-Sueco Moçambique', address: 'Avenida das Indústrias', city: 'Matola', nuit: '400115599', phone: '+258 21 721 444', isEntity: true },
    { id: 69, name: 'Samuel Moiane', address: 'Cidade de Chokwé', city: 'Gaza', nuit: '102299887', phone: '+258 82 334 5566', isEntity: false },
    { id: 70, name: 'Empreitadas do Sul', address: 'Av. Samora Machel', city: 'Xai-Xai', nuit: '400881122', phone: '+258 22 221 010', isEntity: true },
    { id: 71, name: 'Célia Magaia', address: 'Bairro Inhagóia', city: 'Maputo', nuit: '106677881', phone: '+258 84 660 1199', isEntity: false },
    { id: 72, name: 'Pivotal Solutions', address: 'Rua de Bagamoyo', city: 'Maputo', nuit: '401122883', phone: '+258 85 222 1111', isEntity: true },
    { id: 73, name: 'Hotel Girassol Bahía', address: 'Av. Marginal', city: 'Pemba', nuit: '400772211', phone: '+258 27 220 600', isEntity: true },
    { id: 74, name: 'Victor Simango', address: 'Vila de Boane', city: 'Maputo', nuit: '103344550', phone: '+258 84 445 0011', isEntity: false },
    { id: 75, name: 'Escola Portuguesa de Moçambique', address: 'Av. de Angola', city: 'Maputo', nuit: '400000911', phone: '+258 21 481 300', isEntity: true },
    { id: 76, name: 'Infracon Lda', address: 'Estrada Velha', city: 'Matola', nuit: '400441122', phone: '+258 84 331 4455', isEntity: true },
    { id: 77, name: 'Suraia Issufo', address: 'Bairro da Ponta Gea', city: 'Beira', nuit: '107788992', phone: '+258 82 667 8899', isEntity: false },
    { id: 78, name: 'Fundo de Investimento para o Património do Abastecimento de Água (FIPAG)', address: 'Av. Filipe Samuel Magaia', city: 'Maputo', nuit: '400000555', phone: '+258 21 308 840', isEntity: true },
    { id: 79, name: 'Rui Gove', address: 'Bairro Triunfo', city: 'Maputo', nuit: '102211445', phone: '+258 84 221 1100', isEntity: false },
    { id: 80, name: 'Gapi SI', address: 'Av. Samora Machel', city: 'Maputo', nuit: '400111555', phone: '+258 21 304 350', isEntity: true },
    { id: 81, name: 'Supermercados VIP', address: 'Av. 24 de Julho', city: 'Maputo', nuit: '400223344', phone: '+258 84 330 2211', isEntity: true },
    { id: 82, name: 'Mário Machungo', address: 'Bairro Sommerschield', city: 'Maputo', nuit: '100000055', phone: '+258 82 444 0001', isEntity: false },
    { id: 83, name: 'Moçambique Previdente', address: 'Av. Ho Chi Minh', city: 'Maputo', nuit: '400112244', phone: '+258 21 312 345', isEntity: true },
    { id: 84, name: 'Tito Mboweni', address: 'Bairro da Malhangalene', city: 'Maputo', nuit: '108877661', phone: '+258 85 000 1122', isEntity: false },
    { id: 85, name: 'Engeco Moçambique', address: 'Av. Julius Nyerere', city: 'Maputo', nuit: '402211009', phone: '+258 84 555 6677', isEntity: true },
    { id: 86, name: 'Oficina Rápida Matola', address: 'Estrada Circular de Maputo', city: 'Matola', nuit: '400998822', phone: '+258 87 444 3322', isEntity: true },
    { id: 87, name: 'Beatriz Mandlate', address: 'Bairro de Muhala', city: 'Nampula', nuit: '103344119', phone: '+258 84 999 1111', isEntity: false },
    { id: 88, name: 'Maputo Port Development Company', address: 'Porto de Maputo', city: 'Maputo', nuit: '400001122', phone: '+258 21 340 500', isEntity: true },
    { id: 89, name: 'Francisco Mandlate', address: 'Bairro Fomento', city: 'Matola', nuit: '110099884', phone: '+258 82 110 2233', isEntity: false },
    { id: 90, name: 'Sociedade de Notícias S.A.', address: 'Rua da Rádio', city: 'Maputo', nuit: '400000010', phone: '+258 21 320 110', isEntity: true },
    { id: 91, name: 'Clínica 222', address: 'Av. 24 de Julho', city: 'Maputo', nuit: '400334455', phone: '+258 21 300 222', isEntity: true },
    { id: 92, name: 'Armando Guebuza (Particular)', address: 'Ponta do Ouro', city: 'Matutuíne', nuit: '100000003', phone: '+258 84 777 0000', isEntity: false },
    { id: 93, name: 'Toyota Moçambique', address: 'Av. de Moçambique', city: 'Maputo', nuit: '400002233', phone: '+258 21 400 300', isEntity: true },
    { id: 94, name: 'Júlio Mutisse', address: 'Bairro Patrice Lumumba', city: 'Matola', nuit: '109988112', phone: '+258 84 550 1199', isEntity: false },
    { id: 95, name: 'Companhia do Pipeline Moçambique-Zimbabwe', address: 'Beira', city: 'Beira', nuit: '400000020', phone: '+258 23 325 355', isEntity: true },
    { id: 96, name: 'Mundo Digital Lda', address: 'Av. Agostinho Neto', city: 'Maputo', nuit: '402211330', phone: '+258 82 222 1100', isEntity: true },
    { id: 97, name: 'Graça Machel (Particular)', address: 'Sommerschield', city: 'Maputo', nuit: '100000004', phone: '+258 84 222 3334', isEntity: false },
    { id: 98, name: 'Conselho Municipal da Matola', address: 'Praça do Município', city: 'Matola', nuit: '400000500', phone: '+258 21 720 100', isEntity: true },
    { id: 99, name: 'Sonia Mabote', address: 'Bairro de Zimpeto', city: 'Maputo', nuit: '114455662', phone: '+258 87 999 0000', isEntity: false },
    { id: 100, name: 'Logística de Moçambique (LOGISMOC)', address: 'Beluluane', city: 'Maputo', nuit: '400993344', phone: '+258 84 331 2244', isEntity: true }
];

// Nota: Adicionei o campo 'unit' conforme solicitado (un, m, cm, mm, kg, g)
export const products = [
    // --- NETWORKING: CUDY ---
    { id: 1, ref: 'CUDY-GS105D', name: 'Cudy 5 Port Gigabit Desktop Switch | GS105D', price: 15.90, unit: 'un', img: 'https://placehold.co/100x100?text=GS105D' },
    { id: 2, ref: 'CUDY-GS108D', name: 'Cudy 8 Port Gigabit Desktop Switch | GS108D', price: 22.50, unit: 'un', img: 'https://placehold.co/100x100?text=GS108D' },
    { id: 3, ref: 'CUDY-GS105P', name: 'Cudy 5 Port Gigabit 4 PoE 31W Switch | GS105P', price: 45.00, unit: 'un', img: 'https://placehold.co/100x100?text=GS105P' },
    { id: 4, ref: 'CUDY-GS1005PTS1', name: 'Cudy 5 Port Gigabit 4 PoE 120W 1SFP Switch | GS1005PTS1', price: 79.00, unit: 'un', img: 'https://placehold.co/100x100?text=GS1005PTS1' },
    { id: 5, ref: 'CUDY-GS1010P', name: 'Cudy 10 Port Gigabit 8 PoE 100W PoE Switch | GS1010P', price: 89.00, unit: 'un', img: 'https://placehold.co/100x100?text=GS1010P' },
    { id: 6, ref: 'CUDY-GS1016', name: 'Cudy 16 Port Gigabit Rack-Mount Switch | GS1016', price: 110.00, unit: 'un', img: 'https://placehold.co/100x100?text=GS1016' },
    { id: 7, ref: 'CUDY-GS1010PS2', name: 'Cudy 8 Port Gigabit PoE 110W 2SFP 2GE Switch | GS1010PS2', price: 95.00, unit: 'un', img: 'https://placehold.co/100x100?text=GS1010PS2' },
    { id: 8, ref: 'CUDY-GS1024', name: 'Cudy 24 Port Gigabit Rack-Mount Switch | GS1024', price: 165.00, unit: 'un', img: 'https://placehold.co/100x100?text=GS1024' },
    { id: 9, ref: 'CUDY-GS1018PS2', name: 'Cudy 16 Port Gigabit PoE 180W 2GE 2SFP | GS1018PS2', price: 198.00, unit: 'un', img: 'https://placehold.co/100x100?text=GS1018PS2' },
    { id: 10, ref: 'CUDY-GS1026PS2', name: 'Cudy 24 Port Gigabit PoE 280W 2GE 2SFP | GS1026PS2', price: 265.00, unit: 'un', img: 'https://placehold.co/100x100?text=GS1026PS2' },
    { id: 11, ref: 'CUDY-AP1300-OUT', name: 'Cudy AP1300 Outdoor | Dual Band WiFi 5 1200Mbps', price: 115.00, unit: 'un', img: 'https://placehold.co/100x100?text=AP1300' },
    { id: 12, ref: 'CUDY-M1300-1', name: 'Cudy AC1200 Gigabit Mesh Router | M1300 (1-Pack)', price: 48.00, unit: 'un', img: 'https://placehold.co/100x100?text=M1300' },
    { id: 13, ref: 'CUDY-R700', name: 'Cudy 5 Port Gigabit Multi-WAN VPN Router | R700', price: 65.00, unit: 'un', img: 'https://placehold.co/100x100?text=R700' },

    // --- NETWORKING: UBIQUITI ---
    { id: 14, ref: 'USW-FLEX-MINI', name: 'Ubiquiti UniFi Flex Mini 5 Port Gigabit 1PoE Input', price: 35.00, unit: 'un', img: 'https://placehold.co/100x100?text=USW-Flex-Mini' },
    { id: 15, ref: 'USW-FLEX-2.5G-5', name: 'Ubiquiti UniFi Flex Mini 2.5Gbps 5 Port Switch', price: 55.00, unit: 'un', img: 'https://placehold.co/100x100?text=Flex-2.5G' },
    { id: 16, ref: 'USW-LITE-8-POE', name: 'Ubiquiti UniFi Switch Lite 8 Port Gigabit 4PoE 52W', price: 125.00, unit: 'un', img: 'https://placehold.co/100x100?text=Lite-8-PoE' },
    { id: 17, ref: 'USW-LITE-16-POE', name: 'Ubiquiti UniFi Switch Lite 16 Port Gigabit 8PoE 45W', price: 215.00, unit: 'un', img: 'https://placehold.co/100x100?text=Lite-16-PoE' },
    { id: 18, ref: 'USW-24', name: 'Ubiquiti UniFi Switch 24 Port Gigabit 2SFP | USW-24', price: 255.00, unit: 'un', img: 'https://placehold.co/100x100?text=USW-24' },
    { id: 19, ref: 'USW-16-POE', name: 'Ubiquiti UniFi Switch 16 Port Gigabit 8PoE 42W 2SFP', price: 320.00, unit: 'un', img: 'https://placehold.co/100x100?text=USW-16-PoE' },
    { id: 20, ref: 'USW-24-POE', name: 'Ubiquiti UniFi Switch 24 Port Gigabit 16PoE 95W 2SFP', price: 435.00, unit: 'un', img: 'https://placehold.co/100x100?text=USW-24-PoE' },
    { id: 21, ref: 'USW-48', name: 'Ubiquiti UniFi Switch 48 Port Gigabit 4SFP | USW-48', price: 480.00, unit: 'un', img: 'https://placehold.co/100x100?text=USW-48' },
    { id: 22, ref: 'USW-48-POE', name: 'Ubiquiti UniFi Switch 48 Port Gigabit 32PoE 195W 4SFP', price: 620.00, unit: 'un', img: 'https://placehold.co/100x100?text=USW-48-PoE' },
    { id: 23, ref: 'USW-PRO-24-POE', name: 'Ubiquiti UniFi Switch Pro 24 Port 16PoE+ 8PoE++ 400W', price: 780.00, unit: 'un', img: 'https://placehold.co/100x100?text=Pro-24-PoE' },
    { id: 24, ref: 'USW-PRO-48-POE', name: 'Ubiquiti UniFi Switch Pro 48 Port 40PoE+ 8PoE++ 600W', price: 1150.00, unit: 'un', img: 'https://placehold.co/100x100?text=Pro-48-PoE' },
    { id: 25, ref: 'UAP-AC-M', name: 'Ubiquiti UniFi AC Mesh Outdoor Dual Band AP', price: 99.00, unit: 'un', img: 'https://placehold.co/100x100?text=AC-Mesh' },
    { id: 26, ref: 'U7-LITE', name: 'Ubiquiti UniFi WiFi 7 Lite Dual Band AP', price: 185.00, unit: 'un', img: 'https://placehold.co/100x100?text=U7-Lite' },
    { id: 27, ref: 'U6-PLUS', name: 'Ubiquiti UniFi6 Plus Dual Band WiFi 6 AP', price: 115.00, unit: 'un', img: 'https://placehold.co/100x100?text=U6-Plus' },
    { id: 28, ref: 'U7-OUTDOOR', name: 'Ubiquiti UniFi WiFi 7 Outdoor Dual Band AP', price: 350.00, unit: 'un', img: 'https://placehold.co/100x100?text=U7-Outdoor' },

    // --- NETWORKING: SCOOP & MIKROTIK ---
    { id: 29, ref: 'SCP-6FE4P', name: 'Scoop 6 Port FE 4 PoE 60W', price: 35.00, unit: 'un', img: 'https://placehold.co/100x100?text=Scoop-6FE' },
    { id: 30, ref: 'SCP-10GE8P', name: 'Scoop 10 Port GE 8 PoE 96W', price: 85.00, unit: 'un', img: 'https://placehold.co/100x100?text=Scoop-10GE' },
    { id: 31, ref: 'SCP-24GE24P', name: 'Scoop 24 Port GE PoE 250W 2SFP', price: 245.00, unit: 'un', img: 'https://placehold.co/100x100?text=Scoop-24GE' },
    { id: 32, ref: 'MT-RB-CAPL', name: 'MikroTik cAP Lite 300Mbps WiFi 4 Ceiling AP', price: 28.00, unit: 'un', img: 'https://placehold.co/100x100?text=cAP-Lite' },
    { id: 33, ref: 'MT-HAP-LITE', name: 'MikroTik hAP Lite 4 Port 300Mbps WiFi Router', price: 25.00, unit: 'un', img: 'https://placehold.co/100x100?text=hAP-Lite' },
    { id: 34, ref: 'MT-HAP-AX-LITE', name: 'MikroTik hAP ax lite 4 Port Gigabit WiFi 6', price: 45.00, unit: 'un', img: 'https://placehold.co/100x100?text=hAP-ax-lite' },
    { id: 35, ref: 'MT-LHG-5-AX', name: 'MikroTik LHG 5 ax 24.5dBi PtP CPE', price: 125.00, unit: 'un', img: 'https://placehold.co/100x100?text=LHG-5-ax' },

    // --- CABOS (Venda a Metro) ---
    { id: 36, ref: 'CAT6-UTP-M', name: 'Cabo de Par Trançado Cat6 UTP Interior (Corte)', price: 0.85, unit: 'm', img: 'https://placehold.co/100x100?text=Cat6-UTP' },
    { id: 37, ref: 'CAT6-FTP-OUT-M', name: 'Cabo Cat6 Outdoor FTP Blindado UV (Corte)', price: 1.45, unit: 'm', img: 'https://placehold.co/100x100?text=Cat6-Outdoor' },
    { id: 38, ref: 'CAT5E-OUT-M', name: 'Cabo Cat5e Outdoor FTP CCA (Corte)', price: 0.95, unit: 'm', img: 'https://placehold.co/100x100?text=Cat5e-Outdoor' },
    { id: 39, ref: 'SOL-6-RED-M', name: 'Cabo Solar H1Z2Z2-K 6.0mm Red (Corte)', price: 1.15, unit: 'm', img: 'https://placehold.co/100x100?text=Solar-6mm-Red' },
    { id: 40, ref: 'SOL-6-BLK-M', name: 'Cabo Solar H1Z2Z2-K 6.0mm Black (Corte)', price: 1.15, unit: 'm', img: 'https://placehold.co/100x100?text=Solar-6mm-Black' },
    { id: 41, ref: 'PERM-25-BK-M', name: 'Cabo Permopower 25mm Black (Corte)', price: 8.50, unit: 'm', img: 'https://placehold.co/100x100?text=Permo-25mm' },

    // --- CALHAS LEGRAND (DLP) ---
    { id: 42, ref: 'LEG-010411', name: 'Legrand Calha DLP 20x10mm Branca (S/ Adesivo)', price: 1.80, unit: 'm', img: 'https://placehold.co/100x100?text=Legrand-20x10' },
    { id: 43, ref: 'LEG-010462', name: 'Legrand Calha DLP 32x16mm Branca (C/ Adesivo)', price: 3.20, unit: 'm', img: 'https://placehold.co/100x100?text=Legrand-32x16' },
    { id: 44, ref: 'LEG-010424', name: 'Legrand Calha DLP 40x20mm Branca', price: 4.50, unit: 'm', img: 'https://placehold.co/100x100?text=Legrand-40x20' },
    { id: 45, ref: 'LEG-010427', name: 'Legrand Calha DLP 60x20mm Branca', price: 6.80, unit: 'm', img: 'https://placehold.co/100x100?text=Legrand-60x20' },
    { id: 46, ref: 'LEG-010428', name: 'Legrand Calha DLP 75x20mm Branca', price: 8.10, unit: 'm', img: 'https://placehold.co/100x100?text=Legrand-75x20' },
    { id: 47, ref: 'LEG-011115', name: 'Legrand Calha de Chão 50x12mm Cinza', price: 12.50, unit: 'm', img: 'https://placehold.co/100x100?text=Calha-Chão' },
    { id: 48, ref: 'LEG-DLP-100-50', name: 'Legrand Calha DLP Monobloco 100x50mm', price: 18.90, unit: 'm', img: 'https://placehold.co/100x100?text=DLP-100x50' },

    // --- CALHAS EFAPEL (SÉRIE 10) ---
    { id: 49, ref: 'EFA-10010IBR', name: 'Efapel Calha Série 10 12x7mm Branca', price: 0.95, unit: 'm', img: 'https://placehold.co/100x100?text=Efapel-12x7' },
    { id: 50, ref: 'EFA-10020IBR', name: 'Efapel Calha Série 10 16x10mm Branca', price: 1.20, unit: 'm', img: 'https://placehold.co/100x100?text=Efapel-16x10' },
    { id: 51, ref: 'EFA-10030IBR', name: 'Efapel Calha Série 10 25x10mm Branca', price: 1.95, unit: 'm', img: 'https://placehold.co/100x100?text=Efapel-25x10' },
    { id: 52, ref: 'EFA-10040IBR', name: 'Efapel Calha Série 10 30x10mm Branca', price: 2.30, unit: 'm', img: 'https://placehold.co/100x100?text=Efapel-30x10' },
    { id: 53, ref: 'EFA-10050IBR', name: 'Efapel Calha Série 10 40x16mm Branca', price: 3.10, unit: 'm', img: 'https://placehold.co/100x100?text=Efapel-40x16' },
    { id: 54, ref: 'EFA-10060IBR', name: 'Efapel Calha Série 10 60x16mm Branca', price: 4.50, unit: 'm', img: 'https://placehold.co/100x100?text=Efapel-60x16' },
    { id: 55, ref: 'EFA-10080IBR', name: 'Efapel Calha Série 10 75x20mm Branca', price: 5.90, unit: 'm', img: 'https://placehold.co/100x100?text=Efapel-75x20' },
    { id: 56, ref: 'EFA-10110IBR', name: 'Efapel Calha Série 10 100x50mm Branca', price: 14.20, unit: 'm', img: 'https://placehold.co/100x100?text=Efapel-100x50' },

    // --- ENERGIA SOLAR ---
    { id: 57, ref: 'SUN-10KW-1P', name: 'Sunsynk 10kW 1P Hybrid PV Inverter 48V WiFi Dongle', price: 2850.00, unit: 'un', img: 'https://placehold.co/100x100?text=Sunsynk-10kW' },
    { id: 58, ref: 'EEN-LFP-5.32', name: 'Eenovance Battery LFP Wall Mount 5.32kWh 51.2V', price: 1450.00, unit: 'un', img: 'https://placehold.co/100x100?text=Eenovance-Bat' },
    { id: 59, ref: 'AIKO-510W-BK', name: 'Aiko Neostar 2S60 510W Mono-Glass Black Frame', price: 135.00, unit: 'un', img: 'https://placehold.co/100x100?text=Aiko-510W' },
    { id: 60, ref: 'KDS-6P-IBR', name: 'KD Solar 6 Panel IBR Portrait Mounting Kit', price: 185.00, unit: 'un', img: 'https://placehold.co/100x100?text=KD-Solar-6' },
    { id: 61, ref: 'AC-COMB-10KW', name: 'AC Combiner Box for 10kW 1 Phase', price: 145.00, unit: 'un', img: 'https://placehold.co/100x100?text=AC-Combiner' },
    { id: 62, ref: 'DC-COMB-2S', name: 'DC Combiner 2 String', price: 89.00, unit: 'un', img: 'https://placehold.co/100x100?text=DC-Combiner' },
    { id: 63, ref: 'EARTH-M16-1.5', name: 'Earth Spike M16 x 1.5m', price: 18.50, unit: 'un', img: 'https://placehold.co/100x100?text=Earth-Spike' },

    // --- ILUMINAÇÃO (ARTIGOS DE LUZ) ---
    { id: 64, ref: 'LED-PAN-60X60-NW', name: 'Painel LED 60x60 40W 4000K Branco Neutro', price: 28.50, unit: 'un', img: 'https://placehold.co/100x100?text=Painel-LED' },
    { id: 65, ref: 'LED-PROJ-50W-BK', name: 'Projetor LED Exterior 50W IP65 Preto 6000K', price: 19.90, unit: 'un', img: 'https://placehold.co/100x100?text=Projetor-50W' },
    { id: 66, ref: 'LED-SPOT-7W-RD', name: 'Foco LED Encastrar Redondo 7W 3000K', price: 4.50, unit: 'un', img: 'https://placehold.co/100x100?text=Spot-7W' },
    { id: 67, ref: 'LED-STRIP-24V-NW', name: 'Fita LED 24V 14.4W/m IP20 Neutra', price: 5.50, unit: 'm', img: 'https://placehold.co/100x100?text=Fita-LED' },
    { id: 68, ref: 'LED-DRV-60W', name: 'Driver LED 12V DC 60W IP67', price: 22.00, unit: 'un', img: 'https://placehold.co/100x100?text=LED-Driver' },
    { id: 69, ref: 'ARQ-EXT-UPDN', name: 'Aplique de Parede Exterior Up & Down GU10 Anthracite', price: 14.90, unit: 'un', img: 'https://placehold.co/100x100?text=Aplique-Ext' },

    // --- CONTINUAÇÃO NETWORKING / SEGURANÇA (HIKVISION) ---
    { id: 70, ref: 'HIK-1027G2H', name: 'Hikvision DS-2CD1027G2H-LIUF 2MP Bullet IP', price: 58.00, unit: 'un', img: 'https://placehold.co/100x100?text=Hik-2MP' },
    { id: 71, ref: 'HIK-1083G2', name: 'Hikvision DS-2CD1083G2-LIUF 8MP 4K Bullet IP', price: 115.00, unit: 'un', img: 'https://placehold.co/100x100?text=Hik-8MP' },
    { id: 72, ref: 'SD-SAND-256G', name: 'SanDisk MicroSD High Endurance 256GB', price: 32.00, unit: 'un', img: 'https://placehold.co/100x100?text=SD-256GB' },

    // --- ACESSÓRIOS E FONTES ---
    { id: 73, ref: 'PSU-52V-65W', name: 'Scoop 52VDC 65W PSU Without IEC Cable', price: 24.00, unit: 'un', img: 'https://placehold.co/100x100?text=PSU-52V' },
    { id: 74, ref: 'POE-48V-60W', name: 'Ubiquiti Gigabit PoE Adapter 48V 60W | U-PoE++', price: 38.00, unit: 'un', img: 'https://placehold.co/100x100?text=U-PoE' },
    { id: 75, ref: 'SSD-BIW-1TB', name: 'Biwin M350 PCIe 4.0 M.2 SSD 1TB 5200MB/s', price: 85.00, unit: 'un', img: 'https://placehold.co/100x100?text=Biwin-1TB' },

    // ... Continuação até 150 itens (Acessórios de Calha, Conectores, Suportes, etc)
    { id: 76, ref: 'LEG-010682', name: 'Topo para Calha Legrand DLP 40x20mm', price: 1.10, unit: 'un', img: 'https://placehold.co/100x100?text=Topo-40x20' },
    { id: 77, ref: 'LEG-010692', name: 'Ângulo Interno Legrand DLP 40x20mm', price: 1.85, unit: 'un', img: 'https://placehold.co/100x100?text=Ang-Int' },
    { id: 78, ref: 'EFA-10910ABR', name: 'Curva Plana Efapel Série 10 25x10mm', price: 1.40, unit: 'un', img: 'https://placehold.co/100x100?text=Curva-25x10' },
    { id: 79, ref: 'RJ45-CAT6-PASS', name: 'Conector RJ45 Cat6 Pass-Through (Saco 100un)', price: 15.00, unit: 'un', img: 'https://placehold.co/100x100?text=RJ45-Pass' },
    { id: 80, ref: 'FIBER-PP-24', name: 'Linkbasic 24 Port Fibre Sliding Patch Panel Blank', price: 45.00, unit: 'un', img: 'https://placehold.co/100x100?text=Fiber-PP' },

    // Itens de Iluminação Adicionais (Variantes)
    { id: 81, ref: 'BULB-E27-12W', name: 'Lâmpada LED E27 A60 12W 4000K', price: 2.50, unit: 'un', img: 'https://placehold.co/100x100?text=LED-E27' },
    { id: 82, ref: 'LED-T8-1200', name: 'Tubular LED T8 1200mm 18W G13 High Lumen', price: 6.80, unit: 'un', img: 'https://placehold.co/100x100?text=T8-1200' },
    { id: 83, ref: 'EMERG-LED-3H', name: 'Bloco Autónomo Emergência LED 3 Horas IP42', price: 12.90, unit: 'un', img: 'https://placehold.co/100x100?text=Emergência' },

    // --- ACESSÓRIOS DE REDE E RACK ---
    { id: 84, ref: 'LINK-PP-24CAT6', name: 'Patch Panel 24 Portas Cat6 UTP 1U Rack 19"', price: 45.00, unit: 'un', img: 'https://placehold.co/100x100?text=Patch+Panel' },
    { id: 85, ref: 'LINK-ORG-1U', name: 'Organizador de Cabos 1U com Argolas Rack 19"', price: 12.50, unit: 'un', img: 'https://placehold.co/100x100?text=Organizador' },
    { id: 86, ref: 'LINK-TRAY-1U', name: 'Prateleira Fixa 1U para Rack 19" Profundidade 250mm', price: 18.00, unit: 'un', img: 'https://placehold.co/100x100?text=Prateleira' },
    { id: 87, ref: 'RJ45-CAT5-PLUG', name: 'Ficha RJ45 Cat5e UTP (Saco 100un)', price: 8.50, unit: 'un', img: 'https://placehold.co/100x100?text=RJ45+Cat5' },
    { id: 88, ref: 'CAP-RJ45-BL', name: 'Capa Protectora RJ45 Azul (Saco 100un)', price: 6.00, unit: 'un', img: 'https://placehold.co/100x100?text=Capa+RJ45' },

    // --- PROTEÇÃO ELÉTRICA E SOLAR (DISJUNTORES/FUSÍVEIS) ---
    { id: 89, ref: 'SPD-DC-600V', name: 'Descarregador de Sobretensões DC 600V 2P (Solar)', price: 42.00, unit: 'un', img: 'https://placehold.co/100x100?text=SPD+DC' },
    { id: 90, ref: 'SPD-AC-2P', name: 'Descarregador de Sobretensões AC 2P Classe II', price: 38.00, unit: 'un', img: 'https://placehold.co/100x100?text=SPD+AC' },
    { id: 91, ref: 'DJ-DC-16A', name: 'Disjuntor Magnetotérmico DC 16A 2P 500V', price: 15.50, unit: 'un', img: 'https://placehold.co/100x100?text=DJ+DC+16A' },
    { id: 92, ref: 'DJ-DC-32A', name: 'Disjuntor Magnetotérmico DC 32A 2P 500V', price: 15.50, unit: 'un', img: 'https://placehold.co/100x100?text=DJ+DC+32A' },
    { id: 93, ref: 'FUS-PV-15A', name: 'Fusível Cilíndrico PV 10x38 15A 1000V DC', price: 2.50, unit: 'un', img: 'https://placehold.co/100x100?text=Fusivel+PV' },
    { id: 94, ref: 'H-FUS-PV', name: 'Porta Fusíveis Cilíndrico 10x38 1P 1000V DC', price: 4.80, unit: 'un', img: 'https://placehold.co/100x100?text=Porta+Fusivel' },

    // --- CALHAS EFAPEL SÉRIE 10 (ACESSÓRIOS) ---
    { id: 95, ref: 'EFA-10910RBR', name: 'Ângulo Externo Efapel Série 10 25x10mm', price: 1.25, unit: 'un', img: 'https://placehold.co/100x100?text=Ang+Ext' },
    { id: 96, ref: 'EFA-10910ABR', name: 'Ângulo Interno Efapel Série 10 25x10mm', price: 1.25, unit: 'un', img: 'https://placehold.co/100x100?text=Ang+Int' },
    { id: 97, ref: 'EFA-10910TBR', name: 'Topo de Calha Efapel Série 10 25x10mm', price: 0.85, unit: 'un', img: 'https://placehold.co/100x100?text=Topo' },
    { id: 98, ref: 'EFA-10920RBR', name: 'Ângulo Externo Efapel Série 10 40x16mm', price: 1.60, unit: 'un', img: 'https://placehold.co/100x100?text=Ang+Ext' },
    { id: 99, ref: 'EFA-10920ABR', name: 'Ângulo Interno Efapel Série 10 40x16mm', price: 1.60, unit: 'un', img: 'https://placehold.co/100x100?text=Ang+Int' },
    { id: 100, ref: 'EFA-10920TBR', name: 'Topo de Calha Efapel Série 10 40x16mm', price: 1.10, unit: 'un', img: 'https://placehold.co/100x100?text=Topo' },

    // --- CALHAS LEGRAND DLP (MAIS TAMANHOS E ACESSÓRIOS) ---
    { id: 101, ref: 'LEG-010421', name: 'Legrand Calha DLP 32x10mm Branca', price: 2.10, unit: 'm', img: 'https://placehold.co/100x100?text=Legrand+32x10' },
    { id: 102, ref: 'LEG-010429', name: 'Legrand Calha DLP 50x20mm Branca', price: 5.50, unit: 'm', img: 'https://placehold.co/100x100?text=Legrand+50x20' },
    { id: 103, ref: 'LEG-010784', name: 'Ângulo Variável Legrand DLP 100x50mm', price: 8.90, unit: 'un', img: 'https://placehold.co/100x100?text=Ang+Var' },
    { id: 104, ref: 'LEG-010601', name: 'Separador Interno Calha DLP (Corte)', price: 1.50, unit: 'm', img: 'https://placehold.co/100x100?text=Separador' },

    // --- ILUMINAÇÃO TÉCNICA ---
    { id: 105, ref: 'LED-FLOOD-100W', name: 'Projetor LED Exterior 100W IP65 6000K', price: 38.00, unit: 'un', img: 'https://placehold.co/100x100?text=Projetor+100W' },
    { id: 106, ref: 'LED-SENS-PIR', name: 'Sensor de Movimento PIR 360º Encastrar', price: 12.00, unit: 'un', img: 'https://placehold.co/100x100?text=Sensor+PIR' },
    { id: 107, ref: 'LED-ST-IP65-5M', name: 'Fita LED 24V 5 Metros IP65 4000K (Rolo)', price: 35.00, unit: 'un', img: 'https://placehold.co/100x100?text=Fita+LED+Rolo' },
    { id: 108, ref: 'LED-PROF-ALU', name: 'Perfil Alumínio para Fita LED 2 Metros c/ Difusor', price: 14.00, unit: 'un', img: 'https://placehold.co/100x100?text=Perfil+Alu' },
    { id: 109, ref: 'LED-STRIP-M-RGB', name: 'Fita LED RGB 24V (Venda a Metro)', price: 7.50, unit: 'm', img: 'https://placehold.co/100x100?text=Fita+RGB' },

    // --- SOLAR / BATERIAS / ESTRUTURA ---
    { id: 110, ref: 'SOL-BRACKET-L', name: 'Suporte L Alumínio para Telhado Zinco', price: 3.50, unit: 'un', img: 'https://placehold.co/100x100?text=Suporte+L' },
    { id: 111, ref: 'SOL-RAIL-4.2', name: 'Calha de Montagem Alumínio 4.2m para Painéis', price: 45.00, unit: 'un', img: 'https://placehold.co/100x100?text=Rail+4.2m' },
    { id: 112, ref: 'SOL-MID-CLAMP', name: 'Grampo Intermédio 35mm para Painel Solar', price: 1.20, unit: 'un', img: 'https://placehold.co/100x100?text=Mid+Clamp' },
    { id: 113, ref: 'SOL-END-CLAMP', name: 'Grampo Final 35mm para Painel Solar', price: 1.20, unit: 'un', img: 'https://placehold.co/100x100?text=End+Clamp' },
    { id: 114, ref: 'BAT-CABLE-35-BK', name: 'Cabo Bateria Flexível 35mm Preto (Corte)', price: 11.50, unit: 'm', img: 'https://placehold.co/100x100?text=Cabo+35mm' },
    { id: 115, ref: 'BAT-LUG-35-10', name: 'Terminal de Olhal 35mm x M10 (Unidade)', price: 1.80, unit: 'un', img: 'https://placehold.co/100x100?text=Terminal' },

    // --- MATERIAL ELÉTRICO DIVERSO ---
    { id: 116, ref: 'EFA-45132SBR', name: 'Tomada Schuko Efapel Logus 90 Branca', price: 4.50, unit: 'un', img: 'https://placehold.co/100x100?text=Tomada' },
    { id: 117, ref: 'EFA-45011SBR', name: 'Interruptor Simples Efapel Logus 90 Branco', price: 3.80, unit: 'un', img: 'https://placehold.co/100x100?text=Interruptor' },
    { id: 118, ref: 'EFA-45910SBR', name: 'Espelho Simples Efapel Logus 90 Branco', price: 1.10, unit: 'un', img: 'https://placehold.co/100x100?text=Espelho' },
    { id: 119, ref: 'BX-INT-80X80', name: 'Caixa de Aparelhagem Universal 80x80mm', price: 0.45, unit: 'un', img: 'https://placehold.co/100x100?text=Caixa+Ap' },
    { id: 120, ref: 'BX-JUN-100', name: 'Caixa de Derivação 100x100mm de Embutir', price: 1.20, unit: 'un', img: 'https://placehold.co/100x100?text=Caixa+Deriv' },

    // --- FERRAMENTAS E CONSUMÍVEIS ---
    { id: 121, ref: 'TOOL-CRIMP-RJ45', name: 'Alicate Cravar RJ45/RJ11 Profissional', price: 22.00, unit: 'un', img: 'https://placehold.co/100x100?text=Alicate+RJ45' },
    { id: 122, ref: 'TOOL-STRIP-UNI', name: 'Descarregador de Cabos Coaxial/UTP Universal', price: 9.50, unit: 'un', img: 'https://placehold.co/100x100?text=Descarregador' },
    { id: 123, ref: 'TAPE-ISO-BK', name: 'Fita Isoladora 19mm x 20m Preta', price: 1.50, unit: 'un', img: 'https://placehold.co/100x100?text=Fita+Isoladora' },
    { id: 124, ref: 'TIE-200-BK', name: 'Abraçadeiras Nylon 200x4.8mm Pretas (Pack 100)', price: 3.50, unit: 'un', img: 'https://placehold.co/100x100?text=Abraçadeiras' },
    { id: 125, ref: 'SCREW-6-30', name: 'Bucha 6mm com Parafuso (Pack 50un)', price: 4.80, unit: 'un', img: 'https://placehold.co/100x100?text=Bucha+Paraf' },

    // --- MAIS NETWORKING (CUDY / UBIQUITI VARIAÇÕES) ---
    { id: 126, ref: 'CUDY-WR1300', name: 'Cudy AC1300 Dual Band WiFi Router | WR1300', price: 39.00, unit: 'un', img: 'https://placehold.co/100x100?text=WR1300' },
    { id: 127, ref: 'CUDY-RE1200', name: 'Cudy AC1200 WiFi Mesh Range Extender | RE1200', price: 29.00, unit: 'un', img: 'https://placehold.co/100x100?text=RE1200' },
    { id: 128, ref: 'UBI-U-POE-AF', name: 'Ubiquiti PoE Injector 48V 15W Gigabit | U-POE-AF', price: 18.00, unit: 'un', img: 'https://placehold.co/100x100?text=U-POE-AF' },
    { id: 129, ref: 'UBI-GNET-SFP', name: 'Ubiquiti UF-RJ45-1G SFP to RJ45 Module', price: 25.00, unit: 'un', img: 'https://placehold.co/100x100?text=SFP+Module' },
    { id: 130, ref: 'MT-HEX-LITE', name: 'MikroTik hEX lite 5 Port Ethernet Router', price: 42.00, unit: 'un', img: 'https://placehold.co/100x100?text=hEX+lite' },

    // --- MAIS CABOS (MÉTRICA) ---
    { id: 131, ref: 'CAB-COAX-RG6-M', name: 'Cabo Coaxial RG6 Triple Shield (Corte)', price: 0.65, unit: 'm', img: 'https://placehold.co/100x100?text=RG6' },
    { id: 132, ref: 'CAB-FIRE-2.5-M', name: 'Cabo de Incêndio 2x2.5mm Blindado (Corte)', price: 1.10, unit: 'm', img: 'https://placehold.co/100x100?text=Incendio' },
    { id: 133, ref: 'CAB-VGV-3G1.5-M', name: 'Cabo Elétrico VGV 3G1.5mm2 (Corte)', price: 1.25, unit: 'm', img: 'https://placehold.co/100x100?text=VGV+1.5' },
    { id: 134, ref: 'CAB-VGV-3G2.5-M', name: 'Cabo Elétrico VGV 3G2.5mm2 (Corte)', price: 1.95, unit: 'm', img: 'https://placehold.co/100x100?text=VGV+2.5' },

    // --- COMPLEMENTOS ILUMINAÇÃO ---
    { id: 135, ref: 'LED-GU10-7W-NW', name: 'Lâmpada LED GU10 7W 4000K', price: 2.20, unit: 'un', img: 'https://placehold.co/100x100?text=GU10' },
    { id: 136, ref: 'LED-E14-C37', name: 'Lâmpada LED E14 Vela 5W 3000K', price: 1.90, unit: 'un', img: 'https://placehold.co/100x100?text=E14' },
    { id: 137, ref: 'LED-DIMMER-AC', name: 'Dimmer LED AC 230V p/ Encastrar', price: 24.50, unit: 'un', img: 'https://placehold.co/100x100?text=Dimmer' },
    { id: 138, ref: 'LED-BELL-150W', name: 'Campânula LED Industrial 150W IP65 5000K', price: 85.00, unit: 'un', img: 'https://placehold.co/100x100?text=Campânula' },

    // --- SEGURANÇA ADICIONAL ---
    { id: 139, ref: 'HIK-D-BOX-W', name: 'Caixa de Conexão Branca para Câmaras Hikvision', price: 12.00, unit: 'un', img: 'https://placehold.co/100x100?text=Junction+Box' },
    { id: 140, ref: 'HIK-NVR-4CH', name: 'Hikvision NVR 4 Canais 4K PoE | DS-7604NI-K1/4P', price: 145.00, unit: 'un', img: 'https://placehold.co/100x100?text=NVR+4CH' },
    { id: 141, ref: 'HDD-WD-PUR-2TB', name: 'Disco Rígido WD Purple 2TB Especial Vigilância', price: 75.00, unit: 'un', img: 'https://placehold.co/100x100?text=WD+Purple' },

    // --- CALHAS E TUBOS ---
    { id: 142, ref: 'TUB-VD-20', name: 'Tubo VD 20mm Rígido Cinza (Venda 3m)', price: 1.10, unit: 'm', img: 'https://placehold.co/100x100?text=Tubo+VD' },
    { id: 143, ref: 'TUB-FLEX-20', name: 'Tubo Anelado Flexível 20mm (Corte)', price: 0.55, unit: 'm', img: 'https://placehold.co/100x100?text=Anelado' },
    { id: 144, ref: 'LEG-010686', name: 'Topo para Calha Legrand DLP 75x20mm', price: 1.45, unit: 'un', img: 'https://placehold.co/100x100?text=Topo+75x20' },

    // --- FINALIZANDO (VARIADOS) ---
    { id: 145, ref: 'MC4-Y-BRANCH', name: 'Conector Solar Y Branch MC4 (Par M/FF + F/MM)', price: 9.50, unit: 'un', img: 'https://placehold.co/100x100?text=Y+Branch' },
    { id: 146, ref: 'SOL-TOOL-KIT', name: 'Kit de Ferramentas Solar (Alicate MC4 + Cravar)', price: 55.00, unit: 'un', img: 'https://placehold.co/100x100?text=Solar+Kit' },
    { id: 147, ref: 'UBI-ETH-SP-G2', name: 'Ubiquiti Ethernet Surge Protector Gen2', price: 15.00, unit: 'un', img: 'https://placehold.co/100x100?text=Surge+Prot' },
    { id: 148, ref: 'CUDY-GS102P', name: 'Cudy 2 Port Gigabit PoE Extender IP65', price: 32.00, unit: 'un', img: 'https://placehold.co/100x100?text=PoE+Ext' },
    { id: 149, ref: 'EFA-10980RBR', name: 'Ângulo Externo Efapel Série 10 100x50mm', price: 5.40, unit: 'un', img: 'https://placehold.co/100x100?text=Ang+Ext+100' },

    { id: 150, ref: 'MC4-PAIR-PRO', name: 'Par de Conectores MC4 Pro Solar IP68', price: 3.50, unit: 'un', img: 'https://placehold.co/100x100?text=MC4-Pair' }
];

// Unidades permitidas para referência
export const validUnits = ["un", "m", "cm", "mm", "kg", "g"];
// database.js

export async function fetchProducts(query = '', offset = 0) {
    // Simular latência
    await new Promise(r => setTimeout(r, 150));

    let results = [...products];

    // 1. Ordenação A-Z (Sempre primeiro)
    results.sort((a, b) => a.name.localeCompare(b.name));

    // 2. Filtro Regex (Starts With / Prefixo)
    if (query) {
        // Escapa caracteres especiais para não quebrar o Regex
        const cleanQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^${cleanQuery}`, 'i'); // ^ = começa com, i = case insensitive

        results = results.filter(p =>
            regex.test(p.name) || regex.test(p.ref)
        );
    }

    // 3. Paginação (Fixo 50)
    const LIMIT = 50;
    return results.slice(offset, offset + LIMIT);
}

/**
 * Simula backend: Filtra por Prefixo (^), aceita tipo de busca, Retorna Top 10.
 */
export async function fetchCustomers(query, type) {
    await new Promise(r => setTimeout(r, 100));

    let results = [...customers];

    if (query) {
        const cleanQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^${cleanQuery}`, 'i');

        results = results.filter(c => {
            if (type === 'name') return regex.test(c.name);
            if (type === 'nuit') return c.nuit && regex.test(c.nuit);
            return regex.test(c.name) || (c.nuit && regex.test(c.nuit));
        });
    }

    // Retorna apenas os 10 primeiros para performance
    return results.slice(0, 10);
}