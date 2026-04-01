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

const Append = function () {
    this.append(...arguments);
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
        const value = attributes[key];
        if ((key === 'style' || key === 'dataset') && typeof value === 'object') {
            Object.assign(element[key], value);
        } else {
            element[key] = value;
        }
    }

    element.Append = Append;
    return element;
}

tags.forEach(tag => {
    HTMLElements[tag] = (attributes) => Element(tag, attributes);
});

export function Icon(pathData, className) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", className);
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
}

export const {
    div, span, section, article, nav, header, footer, main, aside,
    p, b, i, strong, em, h1, h2, h3, h4, h5, h6, br, hr,
    ul, ol, li, dl, dt, dd,
    table, thead, tbody, tfoot, tr, td, th,
    form, input, button, label, select, option, textarea, fieldset, legend,
    a, img, canvas, svg, video, audio
} = HTMLElements;