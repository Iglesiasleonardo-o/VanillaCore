import { div, input, label, span } from "../../vanilla-core/viewgencore.js";

export function PrimaryStringInput(id, labelText, placeholder, required) {
    const labelComp = label({
        htmlFor: id,
        className: "block text-sm font-medium text-gray-700",
    });

    if (required)
        labelComp.Append(
            span({ textContent: labelText }),
            span({ className: "text-red-500", textContent: " *" })
        );
    else labelComp.Append(span({ textContent: labelText }));

    return div({ className: "flex flex-col" }).Append(
        labelComp,
        input({
            id,
            type: "text",
            required,
            className:
                "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            placeholder: placeholder ?? labelText,
        })
    );
}
