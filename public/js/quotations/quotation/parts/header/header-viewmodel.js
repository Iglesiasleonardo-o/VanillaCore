import { calculateExpiryDate, formatToDisplayDate } from "./header-math.js";

/**
 * Transforms raw quotation data into a display-ready ViewModel
 */
export function createHeaderViewModel(quotation) {
    const { metadata } = quotation;
    const expiryDays = metadata.expiryDays || 0;

    const issueDate = quotation.issueDate || new Date().toISOString().split('T')[0];

    return {
        issueDate: formatToDisplayDate(issueDate),
        expiryDay: calculateExpiryDate(issueDate, expiryDays),
        expiryLabel: calculateExpiryDate(quotation.issueDate, expiryDays),
        seller: metadata.seller || "Anónimo",
        standardDays: ["7", "15", "30", "120"],
        expiryDays: expiryDays
    };
}