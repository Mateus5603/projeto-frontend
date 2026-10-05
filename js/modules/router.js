// router.js: navegação da SPA baseada no hash da URL.
// Formato das rotas: #/pagina ou #/pagina/secao (ex.: #/projetos/doacao).
// A página nunca é recarregada: só o conteúdo de <main id="app"> é trocado.

import { preferirMovimento } from './ui.js';

const NOME_SITE = 'ONG Raízes do Amanhã';

let rotas = {};
let paginaPadrao = 'inicio';
let paginaAtual = null;

export function iniciarRoteador(tabelaDeRotas, padrao = 'inicio') {
    rotas = tabelaDeRotas;
    paginaPadrao = padrao;

    window.addEventListener('hashchange', navegar);

    // Clicar de novo no link da rota atual não dispara hashchange; tratamos aqui
    document.addEventListener('click', (evento) => {
        const link = evento.target.closest('a[href^="#/"]');
        if (link && link.getAttribute('href') === location.hash) {
            evento.preventDefault();
            navegar();
        }
    });

    navegar();
}

function lerHash() {
    if (!location.hash.startsWith('#/')) return null;
    const [pagina, secao] = location.hash.slice(2).split('/');
    return { pagina: pagina || paginaPadrao, secao };
}

function navegar() {
    let destino = lerHash();

    if (!destino) {
        // Âncoras comuns (como o link "Pular para o conteúdo") não são rotas
        if (paginaAtual) return;
        destino = { pagina: paginaPadrao };
        history.replaceState(null, '', `#/${paginaPadrao}`);
    }

    const mudouDePagina = destino.pagina !== paginaAtual;
    if (mudouDePagina) {
        renderizar(destino.pagina);
        paginaAtual = destino.pagina;
    }

    fecharMenuMobile();
    rolarPara(destino.secao, mudouDePagina);
}

function renderizar(nomePagina) {
    const rota = rotas[nomePagina] ?? rotas.naoEncontrada;
    const app = document.getElementById('app');

    app.innerHTML = `<div class="pagina">${rota.template()}</div>`;

    document.title = rota.titulo ? `${rota.titulo} | ${NOME_SITE}` : NOME_SITE;
    document.getElementById('titulo-pagina').textContent = rota.cabecalho;

    // Marca no menu a página ativa (acessível para leitores de tela)
    document.querySelectorAll('[data-rota]').forEach((link) => {
        if (link.dataset.rota === nomePagina) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    // Cada página pode ter um comportamento próprio (ex.: o formulário de cadastro)
    rota.aoRenderizar?.();
}

function rolarPara(secao, mudouDePagina) {
    const alvo = secao ? document.getElementById(secao) : null;
    const comportamento = preferirMovimento() ? 'smooth' : 'auto';

    if (alvo) {
        alvo.scrollIntoView({ behavior: comportamento, block: 'start' });
    } else if (mudouDePagina) {
        window.scrollTo({ top: 0 });
    }

    // Leva o foco para o novo conteúdo, para quem navega por teclado ou leitor de tela
    if (mudouDePagina) document.getElementById('app').focus({ preventScroll: true });
}

function fecharMenuMobile() {
    const toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.checked = false;
}
