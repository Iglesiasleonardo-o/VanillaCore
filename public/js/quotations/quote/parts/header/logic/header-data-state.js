import { LiveState } from "../../../../../vanilla-core/vanilla-livestate.js";

let headerState;

export function createHeaderState(quotation) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    headerState = LiveState({
        // Fallback to today if quotation.issueDate is missing or old
        issueDate: quotation.issueDate || today,
        expiryDate: quotation.expiryDate || "",
        expiryDays: quotation.metadata?.expiryDays || 7,
        seller: quotation.metadata?.seller || "Anónimo"
    });
    return headerState;
}

export function getHeaderData() {
    return {
        issueDate: headerState.issueDate,
        expiryDate: headerState.expiryDate,
        metadata: {
            seller: headerState.seller,
            expiryDays: headerState.expiryDays
        }
    };
}