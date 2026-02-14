const tags = ['div', 'span', 'form', 'button', 'a', 'p', 'b', 'h1', 'h2', 'h3', 'table', 'tr', 'td'];

const HTMLElements = {};

tags.forEach(tag => {
    HTMLElements[tag] = (attributes) => Component(tag, attributes);
});

export const { div, span, button, h1, h2, h3, table, tr, td } = HTMLElements;