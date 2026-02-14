const tags = [
    // Layout & Sectioning
    'div', 'span', 'section', 'article', 'nav', 'header', 'footer', 'main', 'aside',
    // Text Content
    'p', 'b', 'i', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr',
    // Lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
    // Forms & Inputs
    'form', 'input', 'button', 'label', 'select', 'option', 'textarea', 'fieldset', 'legend',
    // Media & Links
    'a', 'img', 'canvas', 'svg', 'video', 'audio'
];

const HTMLElements = {};

const Append = function (...args) {
    this.append(...args);
    return this;
};

export function Element(tagName, attributes = {}) {
    const element = Object.assign(document.createElement(tagName), attributes);
    element.Append = Append; // Still readable, but no duplication
    return element;
}

export function RichElement(tagName, attributes = {}) {
    const element = document.createElement(tagName);

    for (const key in attributes) {
        if ((key === 'style' || key === 'dataset') && typeof attributes[key] === 'object') {
            Object.assign(element[key], attributes[key]);
        } else {
            element[key] = attributes[key];
        }
    }

    element.Append = Append;
    return element;
}

tags.forEach(tag => {
    HTMLElements[tag] = (attributes) => Element(tag, attributes);
});

export const {
    div, span, section, article, nav, header, footer, main, aside,
    p, b, i, strong, em, h1, h2, h3, h4, h5, h6, br, hr,
    ul, ol, li, dl, dt, dd,
    table, thead, tbody, tfoot, tr, td, th,
    form, input, button, label, select, option, textarea, fieldset, legend,
    a, img, canvas, svg, video, audio
} = HTMLElements;