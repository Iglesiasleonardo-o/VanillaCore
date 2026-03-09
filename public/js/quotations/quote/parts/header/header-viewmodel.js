import { calculateExpiryDate } from "./logic/header-math.js";

/**
 * Transforms raw quotation data into a display-ready ViewModel
 */
export function createHeaderViewModel(quotation) {
    const { metadata } = quotation;
    const expiryDays = metadata.expiryDays || 0;

    return {
        issueDate: quotation.issueDate,
        expiryLabel: "Válida até: " + calculateExpiryDate(quotation.issueDate, expiryDays),
        seller: metadata.seller || "Anónimo",
        standardDays: ["7", "15", "30", "120"],
        expiryDays: expiryDays
    };
}