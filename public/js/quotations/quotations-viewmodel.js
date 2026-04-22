import { formatCurrency, calculateDaysDifference, isPastDate } from "./quotations-math.js";

export function toQuoteCardViewModel(quote) {
    const vm = { ...quote };
    
    vm.formattedTotal = formatCurrency(quote.total);
    // Alteração AQUI: Novo padrão de rota para edição
    vm.editUrl = `/quotations/${quote.number}`; 
    
    switch (quote.status) {
        case 'Pendente': vm.badgeClass = 'bg-yellow-100 text-yellow-800'; break;
        case 'Aprovada': vm.badgeClass = 'bg-green-100 text-green-800'; break;
        case 'Expirada': vm.badgeClass = 'bg-red-100 text-red-800'; break;
        case 'Cancelada': vm.badgeClass = 'bg-gray-200 text-gray-700'; break;
        case 'Rascunho': vm.badgeClass = 'bg-blue-100 text-blue-800'; break;
        default: vm.badgeClass = 'bg-gray-100 text-gray-800';
    }

    vm.expiryColor = 'text-gray-600';
    vm.expiryText = `Válida até: ${quote.expiry}`;

    if (quote.status === 'Expirada') {
        vm.expiryColor = 'text-red-600 font-medium';
        vm.expiryText = `Expirada em: ${quote.expiry}`;
    } else if (quote.status === 'Pendente') {
        if (isPastDate(quote.expiry)) {
            vm.expiryColor = 'text-red-600 font-medium';
            vm.expiryText = `Expirada (Data limite: ${quote.expiry})`;
        } else {
            const diffDays = calculateDaysDifference(quote.expiry);
            if (diffDays <= 7) {
                vm.expiryColor = 'text-yellow-600 font-medium';
                vm.expiryText = `Válida até: ${quote.expiry} (Expira em ${diffDays} dias)`;
            }
        }
    } else if (['Aprovada', 'Cancelada', 'Rascunho'].includes(quote.status)) {
        vm.expiryColor = 'text-gray-500';
        vm.expiryText = `Data de Criação: ${quote.date}`;
    }

    vm.isEditable = !['Expirada', 'Cancelada', 'Aprovada'].includes(quote.status);
    vm.canBeDrafted = quote.status !== 'Rascunho';
    vm.canBeCancelled = quote.status === 'Pendente' || quote.status === 'Expirada';
    vm.isDraft = quote.status === 'Rascunho';

    return vm;
}