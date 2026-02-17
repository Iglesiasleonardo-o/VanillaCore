export function processBanks(globalBanks, quotationBanks, handleSelected, handleAvailable) {
    const selectedIds = new Set(quotationBanks.map(q => q.id));

    globalBanks.forEach(account => {
        if (selectedIds.has(account.id)) {
            handleSelected(account);
        } else {
            handleAvailable(account);
        }
    });
}