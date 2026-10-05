// ui.js: componentes de interface reutilizáveis (alertas e modal de confirmação),
// usando as mesmas classes do guia de componentes (componentes.html).

const ICONES = { sucesso: '✔', aviso: '⚠', erro: '✖' };

export function mostrarAlerta(container, tipo, titulo, texto) {
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta--${tipo}`;
    alerta.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');

    const strong = document.createElement('strong');
    strong.className = 'alerta__titulo';
    strong.textContent = `${ICONES[tipo]} ${titulo}`;

    const p = document.createElement('p');
    p.className = 'alerta__texto';
    p.textContent = texto;

    alerta.append(strong, p);
    container.replaceChildren(alerta);
    alerta.scrollIntoView({ block: 'nearest', behavior: preferirMovimento() ? 'smooth' : 'auto' });
}

export function limparAlerta(container) {
    container.replaceChildren();
}

// Abre o modal e devolve uma Promise: true se confirmou, false se cancelou.
export function confirmar(titulo, texto, rotuloConfirmar = 'Confirmar') {
    const modal = document.getElementById('modal');
    const btnConfirmar = modal.querySelector('[data-modal="confirmar"]');
    const btnCancelar = modal.querySelector('[data-modal="cancelar"]');
    const focoAnterior = document.activeElement;

    modal.querySelector('#modal-titulo').textContent = titulo;
    modal.querySelector('#modal-texto').textContent = texto;
    btnConfirmar.textContent = rotuloConfirmar;
    modal.classList.add('modal--aberto');
    btnConfirmar.focus();

    return new Promise((resolve) => {
        function fechar(resultado) {
            modal.classList.remove('modal--aberto');
            // Boa prática: remover os listeners para não acumular a cada abertura
            modal.removeEventListener('click', aoClicar);
            document.removeEventListener('keydown', aoTeclar);
            focoAnterior?.focus?.();
            resolve(resultado);
        }

        function aoClicar(evento) {
            if (evento.target === modal) return fechar(false); // clique no fundo escuro
            const acao = evento.target.closest('[data-modal]')?.dataset.modal;
            if (acao) fechar(acao === 'confirmar');
        }

        function aoTeclar(evento) {
            if (evento.key === 'Escape') fechar(false);
            // Mantém o foco do teclado dentro do modal
            if (evento.key === 'Tab') {
                evento.preventDefault();
                (document.activeElement === btnConfirmar ? btnCancelar : btnConfirmar).focus();
            }
        }

        modal.addEventListener('click', aoClicar);
        document.addEventListener('keydown', aoTeclar);
    });
}

export function preferirMovimento() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
