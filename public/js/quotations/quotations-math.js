export function formatCurrency(value) {
    return `${Number(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Mzn`;
}

export function calculateDaysDifference(dateString) {
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isPastDate(dateString) {
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate < today;
}

export function generateNextQuotationNumber(currentQuotes, yearSuffix = '/26') {
    const yearQuotes = currentQuotes.filter(q => q.number.endsWith(yearSuffix));
    if (yearQuotes.length === 0) return `1${yearSuffix}`;
    const maxNumber = Math.max(...yearQuotes.map(q => parseInt(q.number.split(/[-/]/)[0])));
    return `${maxNumber + 1}${yearSuffix}`;
}

export function addDaysToToday(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export function getTodayISODate() {
    return new Date().toISOString().split('T')[0];
}