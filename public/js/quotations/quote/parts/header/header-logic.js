export function calculateExpiryDate(issueIsoDate, daysToAdd) {
    const [year, month, day] = issueIsoDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + daysToAdd);
    
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
}

export function formatToDisplayDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

export function getValidityDays(selectedValue, otherValue) {
    return selectedValue === 'outro' ? (parseInt(otherValue) || 0) : (parseInt(selectedValue) || 0);
}