import { getElement, fixCoin, formatCurrencyInput } from './utils.js';
import { AssetTypes, Asset } from './classes.js';
import { renderChart } from './portfolio_graph.js';

const SLICE_COLORS = ['#8d824d', '#cf97ac', '#89e595', '#6a91d8', '#d8896a', '#a78dd8'];
const STORAGE_KEY = 'investments_portfolio_v1';

const defaultAssets = [
    new Asset('Tesouro Direto Selic', 0 , AssetTypes.FIXED_INCOME),
    new Asset('BBDC4', 0, AssetTypes.NATIONAL_SHARES),
    new Asset('Bitcoin', 0, AssetTypes.CRYPTOCURRENCIES),
    new Asset('Casa', 0, AssetTypes.REAL_ESTATE)
];

function loadAssets() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsedData = JSON.parse(raw);
            return parsedData.map(item => {
                return new Asset(item.name, item.value, item.type);
            });
        }
    } catch (e) {
        // localStorage indisponível
    }
    return defaultAssets.map(a => new Asset(a.name, a.value, a.type));
}

function saveAssets(assets) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    } catch (e) {
        // sem persistência
    }
}

let assets = loadAssets();

function getTotal() {
    return assets.reduce((sum, a) => sum + (Number(a.value) || 0), 0);
}

function renderLegend() {
    const legend = getElement('portfolio-legend');
    if (!legend) return;

    legend.innerHTML = '';
    const total = getTotal();

    assets.forEach((asset, i) => {
        const row = document.createElement('div');
        row.className = 'portfolio-row';

        const swatch = document.createElement('span');
        swatch.className = 'portfolio-swatch';
        swatch.style.backgroundColor = SLICE_COLORS[i % SLICE_COLORS.length];

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'portfolio-name';
        nameInput.value = asset.name;
        nameInput.setAttribute('aria-label', 'Nome do ativo');
        nameInput.addEventListener('input', (e) => {
            assets[i].name = e.target.value;
            saveAssets(assets);
        });

        const pct = document.createElement('span');
        pct.className = 'portfolio-pct';
        const p = total > 0 ? ((Number(asset.value) || 0) / total) * 100 : 0;
        pct.textContent = total > 0 ? p.toFixed(1) + '%' : '—';

        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.inputMode = 'numeric';
        valueInput.className = 'portfolio-value';
        valueInput.placeholder = 'R$0,00';
        valueInput.value = asset.value ? 'R$ ' + fixCoin(Number(asset.value)) : '';
        valueInput.setAttribute('aria-label', 'Valor investido');
        
        formatCurrencyInput(valueInput, (numberValue) => {
            assets[i].value = numberValue;
            saveAssets(assets);
            renderAll();
        });

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'portfolio-remove';
        remove.textContent = '×';
        remove.setAttribute('aria-label', 'Remover ' + asset.name);
        remove.addEventListener('click', () => {
            assets.splice(i, 1);
            saveAssets(assets);
            renderAll();
        });

        row.appendChild(swatch);
        row.appendChild(nameInput);
        row.appendChild(pct);
        row.appendChild(valueInput);
        row.appendChild(remove);
        legend.appendChild(row);
    });
}

function renderTotal() {
    const totalEl = getElement('portfolio-total');
    if (!totalEl) return;
    totalEl.textContent = 'R$ ' + fixCoin(getTotal());
}

function renderAll() {
    const total = getTotal();
    renderChart(assets, total);
    renderLegend();
    renderTotal();
}

function setupAddButton() {
    const addBtn = getElement('add-asset');
    if (!addBtn) return;
    addBtn.addEventListener('click', () => {
        let novoAtivo = new Asset('Novo ativo', 0, AssetTypes.FIXED_INCOME);
        assets.push(novoAtivo);
        saveAssets(assets);
        renderAll();
    });
}

setupAddButton();
renderAll();