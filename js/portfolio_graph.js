import { getElement } from './utils.js';

const SLICE_COLORS = ['#8d824d', '#cf97ac', '#89e595', '#6a91d8', '#d8896a', '#a78dd8'];

// Converte um ângulo em graus para a coordenada X/Y correspondente na borda do círculo
function polarToXY(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    };
}

export function renderChart(assets, total) {
    const svg = getElement('portfolio-chart');
    if (!svg) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';

    const cx = 100, cy = 100, r = 88;

    if (total <= 0) {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#807c6b');
        circle.setAttribute('stroke-width', '1');
        circle.setAttribute('stroke-dasharray', '4 4');
        svg.appendChild(circle);
        return;
    }

    let startAngle = 0;

    assets.forEach((asset, i) => {
        const value = Number(asset.value) || 0;
        if (value <= 0) return;

        const sliceAngle = (value / total) * 360;
        const endAngle = startAngle + sliceAngle;
        const largeArc = sliceAngle > 180 ? 1 : 0;

        const p1 = polarToXY(cx, cy, r, startAngle);
        const p2 = polarToXY(cx, cy, r, endAngle);

        let d;
        if (sliceAngle >= 359.999) {
            d = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
        } else {
            d = `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
        }

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', SLICE_COLORS[i % SLICE_COLORS.length]);
        path.setAttribute('stroke', '#2e2e2e');
        path.setAttribute('stroke-width', '1.5');
        svg.appendChild(path);

        startAngle = endAngle;
    });

    const hole = document.createElementNS(svgNS, 'circle');
    hole.setAttribute('cx', cx);
    hole.setAttribute('cy', cy);
    hole.setAttribute('r', 46);
    hole.setAttribute('fill', '#2e2e2e');
    svg.appendChild(hole);
}