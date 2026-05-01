/**
 * @typedef {Object} InputProps
 * @property {string} [label] - Label text. If omitted, no label is rendered.
 * @property {boolean} [required=false] - Shows a red * next to the label and marks input as required.
 * @property {Object} [labelProps] - Extra props passed to the label element.
 * @property {string} [type="text"]
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [placeholder]
 * @property {string} [value]
 * @property {string} [className]
 * @property {function} [oninput]
 * @property {function} [onchange]
 */

import { div, input, label, span } from "../../vanilla-core/viewgencore.js";

/**
 * A reusable input component. All props except `label`, `required`, and `labelProps`
 * are passed directly to the underlying input element.
 *
 * @param {InputProps} props
 * @returns {RichElement}
 *
 * @example
 * // Bare input, no label
 * Input({ type: "text", name: "search" })
 *
 * @example
 * // With label, no asterisk
 * Input({ label: "Nome", id: "name", name: "name" })
 *
 * @example
 * // With label + required asterisk
 * Input({ label: "Referência (SKU)", required: true, id: "reference", name: "reference" })
 */
export function Input(props = {}) {
    const {
        label: labelText,
        required = false,
        labelProps = {},
        ...inputProps
    } = props;

    const inputEl = input({
        type: "text",
        required,
        className:
            "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
        ...inputProps,
    });

    const container = div({ className: "flex flex-col" });

    if (labelText) {
        const labelEl = label({
            htmlFor: inputProps.id ?? labelText,
            className: "block text-sm font-medium text-gray-700",
            ...labelProps,
        }).Append(
            span({ textContent: labelText }),
            ...(required
                ? [span({ className: "text-red-500", textContent: " *" })]
                : [])
        );

        container.Append(labelEl, inputEl);
    } else {
        container.Append(inputEl);
    }

    return container;
}
