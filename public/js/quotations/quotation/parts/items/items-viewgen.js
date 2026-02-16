// items-viewgen.js

// --- Constants & Formatters ---
const TRASH_ICON_PATH = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";
const PLUS_ICON_PATH = "M12 4v16m8-8H4";

const CURRENCY_FMT = new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' });
const NUMBER_FMT = new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2 });

// --- Core Helpers ---

function textElement(tag, className, textContent) {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = textContent;
    return el;
}

function createIcon(pathData, className) {
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

// --- Loading & Empty States ---

export function createLoadingState() {
    const container = textElement('div', "flex flex-col items-center justify-center py-12 space-y-4 bg-white w-full h-full", "");
    container.append(
        textElement('div', "animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-blue-600", ""),
        textElement('span', "text-sm text-gray-500 font-medium animate-pulse", "A procurar produtos...")
    );
    return container;
}

export function createBottomLoader() {
    const container = textElement('div', "flex items-center justify-center py-4 w-full border-t border-gray-50 mt-2", "");
    container.id = 'infinite-scroll-loader';
    container.append(
        textElement('div', "animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-blue-600 mr-2", ""),
        textElement('span', "text-xs text-gray-400", "Carregando mais...")
    );
    return container;
}

export function createEmptyState(msg) {
    return textElement('div', "p-8 text-center text-gray-400 italic", msg || "Nenhum produto encontrado.");
}

export function createEmptyTableState() {
    const tr = document.createElement('tr');
    const td = textElement('td', "text-center py-12 text-gray-400 italic", "A sua cotação está vazia. Adicione produtos.");
    td.colSpan = 6;
    tr.appendChild(td);
    return tr;
}

// --- Stepper Component ---

function createStepper(initialValue, onChange, widthClass) {
    const wrapper = textElement('div', "flex items-center border border-gray-200 rounded-md shadow-sm bg-white h-8 print:border-none print:shadow-none print:h-auto print:bg-transparent print:block", "");
    const btnClass = "px-2 h-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 focus:outline-none transition-colors text-sm font-bold print:hidden";

    const btnMinus = textElement('button', btnClass + " rounded-l-md border-r border-gray-100", "−");
    const btnPlus = textElement('button', btnClass + " rounded-r-md border-l border-gray-100", "+");
    
    const input = document.createElement('input');
    input.className = widthClass + " text-center text-sm font-medium text-gray-700 border-none focus:ring-0 p-0 h-full appearance-none print:hidden";
    input.type = "number";
    input.value = initialValue;

    const printText = textElement('span', "hidden print:inline-block print:w-full print:text-center text-sm text-gray-900 font-medium", initialValue);

    btnMinus.onclick = (e) => { e.stopPropagation(); input.value = parseFloat(input.value) - 1; onChange(input.value); };
    btnPlus.onclick = (e) => { e.stopPropagation(); input.value = parseFloat(input.value) + 1; onChange(input.value); };
    input.onchange = (e) => { printText.textContent = e.target.value; onChange(e.target.value); };

    wrapper.append(btnMinus, input, printText, btnPlus);

    wrapper.setValue = (v) => { input.value = v; printText.textContent = v; };
    wrapper.getValue = () => parseFloat(input.value);

    return wrapper;
}

// --- Product Info (Subdivided) ---

function createProductInfo(product) {
    const details = textElement('div', "", "");
    details.append(
        textElement('div', 'font-medium text-gray-900 text-sm leading-tight mb-1', product.name),
        textElement('div', "flex items-center gap-2", ""), // Container para a Ref
        textElement('div', 'text-xs font-bold text-blue-600 mt-0.5', CURRENCY_FMT.format(product.price))
    );
    
    // Inserir a Ref no container correto (o segundo filho)
    details.children[1].appendChild(textElement('span', 'text-xs text-gray-500 bg-gray-100/50', product.ref || "#" + product.id));
    
    return details;
}

function createActionBtn(isExisting, onClick) {
    const btn = document.createElement('button');
    btn.className = isExisting 
        ? "mt-3 flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
        : "mt-3 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all active:scale-95";
    
    btn.appendChild(createIcon(isExisting ? TRASH_ICON_PATH : PLUS_ICON_PATH, "w-5 h-5"));
    btn.onclick = onClick;
    return btn;
}

// --- Main Components ---

export function createProductSearchItem(product, existingItem, onAdd, onRemove, onUpdateQty, onUpdateDisc, validateQty, validateDisc) {
    const container = textElement('div', "group flex flex-col sm:flex-row items-center justify-between p-3 border-b border-gray-100 transition-all hover:bg-gray-50", "");
    if (existingItem) container.classList.add('bg-blue-50/30');

    // Imagem
    const imgCont = textElement('div', "relative h-12 w-12 flex-shrink-0 mr-3", "");
    const img = document.createElement('img');
    img.className = "h-12 w-12 rounded-lg object-cover border border-gray-200 bg-white";
    img.src = product.image;
    imgCont.appendChild(img);
    if (product.badge) imgCont.appendChild(textElement('span', 'absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm', product.badge));

    // Dados e Steppers
    const qty = existingItem ? existingItem.quantity : 1;
    const disc = existingItem ? existingItem.discount : 0;
    const qtyStep = createStepper(qty, (v) => { const val = validateQty(v); qtyStep.setValue(val); if (existingItem) onUpdateQty(product.id, val); }, "w-16");
    const discStep = createStepper(disc, (v) => { const val = validateDisc(v); discStep.setValue(val); if (existingItem) onUpdateDisc(product.id, val); }, "w-10");

    // Labels
    const qLabel = textElement('div', "flex flex-col items-center gap-0.5", "");
    qLabel.append(textElement('span', 'text-[9px] text-gray-400 uppercase tracking-wide', 'Qtd'), qtyStep);

    const dLabel = textElement('div', "flex flex-col items-center gap-0.5", "");
    dLabel.append(textElement('span', 'text-[9px] text-gray-400 uppercase tracking-wide', 'Desc %'), discStep);

    const infoSide = textElement('div', "flex items-center w-full sm:w-auto mb-3 sm:mb-0", "");
    infoSide.append(imgCont, createProductInfo(product));

    const controls = textElement('div', "flex items-center gap-3 w-full sm:w-auto justify-end", "");
    const btn = createActionBtn(!!existingItem, () => existingItem ? onRemove(product.id) : onAdd(product, qtyStep.getValue(), discStep.getValue()));

    controls.append(qLabel, dLabel, btn);
    container.append(infoSide, controls);
    return container;
}

export function createQuoteRow(item, index, onUpdateQty, onUpdateDisc, onRemove, validateQty, validateDisc) {
    const tr = textElement('tr', "hover:bg-gray-50 border-b border-gray-100 group transition-colors text-sm print:border-gray-200", "");
    const mid = "px-4 py-3 align-middle print:py-1 print:px-2";

    // Steppers
    const qtyStep = createStepper(item.quantity, (v) => { const val = validateQty(v); qtyStep.setValue(val); onUpdateQty(index, val); }, "w-16");
    const discStep = createStepper(item.discount, (v) => { const val = validateDisc(v); discStep.setValue(val); onUpdateDisc(index, val); }, "w-10");

    // Preços e Totais
    const totalVal = (item.product.price * item.quantity) * (1 - (item.discount / 100));
    
    // Ação
    const totalWrap = textElement('div', "flex items-center justify-end gap-3", "");
    const btnRem = textElement('button', "flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all print:hidden", "");
    btnRem.appendChild(createIcon(TRASH_ICON_PATH, "w-4 h-4"));
    btnRem.onclick = () => onRemove(index);
    totalWrap.append(textElement('span', 'font-bold text-gray-900', NUMBER_FMT.format(totalVal)), btnRem);

    // Células
    const tdDesc = textElement('td', mid, "");
    tdDesc.append(textElement('div', 'font-medium text-gray-900', item.product.name), textElement('div', 'text-xs text-gray-500', item.product.description || ""));

    const tdQty = textElement('td', mid, ""); tdQty.appendChild(qtyStep);
    const tdDisc = textElement('td', mid, ""); tdDisc.appendChild(discStep);
    const tdTotal = textElement('td', "px-4 py-3 text-right align-middle whitespace-nowrap print:py-1 print:px-2", "");
    tdTotal.appendChild(totalWrap);

    tr.append(
        textElement('td', "px-4 py-3 text-xs text-gray-500 align-middle print:py-1 print:px-2", item.product.ref || "#" + item.product.id),
        tdDesc,
        tdQty,
        textElement('td', "px-4 py-3 text-right text-gray-600 align-middle whitespace-nowrap print:py-1 print:px-2", NUMBER_FMT.format(item.product.price)),
        tdDisc,
        tdTotal
    );

    return tr;
}