import { buildFullAddress } from "./customers-math.js";

export function toClientCardViewModel(client) {
    const isPerson = client.clientType === 'pessoa';

    return {
        id: client.id,
        name: client.clientName || 'Cliente Sem Nome',
        email: client.clientEmail || 'Sem email associado',
        phone: client.clientPhone || 'Sem telefone',
        
        icon: isPerson ? 'user' : 'building-2',
        typeText: isPerson ? 'Singular' : 'Empresa',
        badgeClass: isPerson ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700',
        
        positionLabel: isPerson ? 'Cargo' : 'NUIT',
        positionValue: isPerson ? (client.jobPosition || 'Sem cargo definido') : (client.clientNuit || 'Sem NUIT'),
        
        mailto: client.clientEmail ? `mailto:${client.clientEmail}` : '#',
        tel: client.clientPhone ? `tel:${client.clientPhone}` : '#',
        
        fullAddress: buildFullAddress(client.addressStreet, client.addressDistrict, client.addressState)
    };
}