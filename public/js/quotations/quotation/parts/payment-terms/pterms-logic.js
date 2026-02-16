export function shouldInputTermManually(selectValue) {
    return selectValue === 'outro';
}

export function filterAccounts(allAccounts, selectedIds) {
    return {
        selected: allAccounts.filter(acc => selectedIds.includes(acc.id)),
        available: allAccounts.filter(acc => !selectedIds.includes(acc.id))
    };
}

export function addAccountId(currentIds, idToAdd) {
    if (currentIds.includes(idToAdd)) return currentIds;
    return currentIds.concat(idToAdd);
}

export function removeAccountId(currentIds, idToRemove) {
    return currentIds.filter(id => id !== idToRemove);
}