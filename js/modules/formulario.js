// formulario.js: comportamento da página de cadastro.
// Junta validação (validacao.js), persistência (storage.js) e feedback (ui.js).

import { mascaras, validarCampo } from './validacao.js';
import { ler, salvar, remover } from './storage.js';
import { mostrarAlerta, limparAlerta, confirmar } from './ui.js';

const CHAVE_CADASTROS = 'cadastros';
const CHAVE_RASCUNHO = 'rascunho-cadastro';
// O CPF fica fora do rascunho de propósito: é um dado sensível
const CAMPOS_RASCUNHO = ['nome', 'email', 'nascimento', 'endereco', 'estado', 'cep', 'telefone'];

// Chamada pelo roteador sempre que a página de cadastro é renderizada.
// Como o formulário é recriado a cada visita, os listeners antigos somem junto com ele.
export function iniciarCadastro() {
    const form = document.getElementById('form-cadastro');
    const alerta = document.getElementById('cadastro-alerta');
    if (!form) return;

    restaurarRascunho(form);
    renderizarCadastros();

    // Delegação de eventos: um único listener no form atende todos os campos
    form.addEventListener('input', (evento) => {
        const campo = evento.target;
        if (mascaras[campo.name]) campo.value = mascaras[campo.name](campo.value);
        if (campo.dataset.tocado) verificarCampo(campo); // feedback em tempo real após o 1º contato
        salvarRascunho(form);
    });

    // Ao sair do campo, ele passa a ser validado
    form.addEventListener('focusout', (evento) => {
        const campo = evento.target;
        if (!campo.name || !campo.value) return; // não acusa erro em campo que só recebeu foco
        campo.dataset.tocado = 'true';
        verificarCampo(campo);
    });

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const campos = [...form.elements].filter((el) => el.name);
        const invalidos = campos.filter((campo) => {
            campo.dataset.tocado = 'true';
            return !verificarCampo(campo);
        });

        if (invalidos.length > 0) {
            const texto = invalidos.length === 1
                ? 'Corrija o campo destacado em vermelho antes de enviar.'
                : `Corrija os ${invalidos.length} campos destacados em vermelho antes de enviar.`;
            mostrarAlerta(alerta, 'aviso', 'Atenção', texto);
            invalidos[0].focus();
            return;
        }

        const dados = Object.fromEntries(new FormData(form));
        dados.nome = dados.nome.trim();
        dados.email = dados.email.trim();

        const cadastros = ler(CHAVE_CADASTROS, []);
        if (cadastros.some((c) => c.cpf === dados.cpf)) {
            mostrarAlerta(alerta, 'erro', 'Não foi possível enviar', 'Já existe um cadastro com este CPF.');
            form.elements.cpf.focus();
            return;
        }

        const confirmou = await confirmar('Confirmar cadastro',
            `Enviar o cadastro de ${dados.nome}? Você poderá excluí-lo depois na lista abaixo.`,
            'Enviar cadastro');
        if (!confirmou) return;

        cadastros.push({ ...dados, id: Date.now(), criadoEm: new Date().toISOString() });
        if (!salvar(CHAVE_CADASTROS, cadastros)) {
            mostrarAlerta(alerta, 'erro', 'Não foi possível salvar',
                'O navegador bloqueou o armazenamento local. Saia da navegação privada e tente de novo.');
            return;
        }

        remover(CHAVE_RASCUNHO);
        form.reset();
        campos.forEach(limparEstado);
        mostrarAlerta(alerta, 'sucesso', 'Cadastro enviado!',
            'Obrigado por se juntar à Raízes do Amanhã. Entraremos em contato em breve.');
        renderizarCadastros();
    });

    form.addEventListener('reset', () => limparAlerta(alerta));

    document.getElementById('btn-limpar-cadastros').addEventListener('click', async () => {
        const ok = await confirmar('Apagar todos os cadastros',
            'Todos os cadastros salvos neste navegador serão removidos. Esta ação não pode ser desfeita.',
            'Apagar todos');
        if (!ok) return;
        remover(CHAVE_CADASTROS);
        renderizarCadastros();
    });
}

// ---------- Feedback visual por campo ----------

function verificarCampo(campo) {
    const mensagem = validarCampo(campo.name, campo.value);
    const erro = document.getElementById(`${campo.id}-erro`);

    campo.classList.toggle('entrada--invalida', Boolean(mensagem));
    campo.classList.toggle('entrada--valida', !mensagem && campo.value !== '');
    campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
    if (erro) erro.textContent = mensagem;

    return !mensagem;
}

function limparEstado(campo) {
    delete campo.dataset.tocado;
    campo.classList.remove('entrada--invalida', 'entrada--valida');
    campo.removeAttribute('aria-invalid');
    const erro = document.getElementById(`${campo.id}-erro`);
    if (erro) erro.textContent = '';
}

// ---------- Rascunho (localStorage) ----------

function salvarRascunho(form) {
    const rascunho = {};
    CAMPOS_RASCUNHO.forEach((nome) => {
        rascunho[nome] = form.elements[nome].value;
    });
    salvar(CHAVE_RASCUNHO, rascunho);
}

function restaurarRascunho(form) {
    const rascunho = ler(CHAVE_RASCUNHO);
    if (!rascunho) return;
    CAMPOS_RASCUNHO.forEach((nome) => {
        if (rascunho[nome]) form.elements[nome].value = rascunho[nome];
    });
}

// ---------- Lista de cadastros (criada com createElement + textContent, contra XSS) ----------

function criar(tag, classe = '', texto = '') {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
}

function renderizarCadastros() {
    const lista = document.getElementById('lista-cadastros');
    const contador = document.getElementById('contador-cadastros');
    const btnLimpar = document.getElementById('btn-limpar-cadastros');
    const cadastros = ler(CHAVE_CADASTROS, []);

    contador.textContent = cadastros.length === 1 ? '1 cadastro' : `${cadastros.length} cadastros`;
    btnLimpar.hidden = cadastros.length === 0;
    lista.replaceChildren();

    if (cadastros.length === 0) {
        lista.append(criar('li', 'cadastros__vazio',
            'Nenhum cadastro por aqui ainda. Preencha o formulário acima para fazer o primeiro.'));
        return;
    }

    // Mais recentes primeiro
    [...cadastros].reverse().forEach((c) => {
        const item = criar('li', 'cadastros__item');

        const info = criar('div');
        const data = new Date(c.criadoEm).toLocaleDateString('pt-BR');
        info.append(
            criar('strong', '', c.nome),
            criar('span', 'cadastros__detalhe',
                `${c.email}, ${c.estado}, CPF final ${c.cpf.slice(-2)}, enviado em ${data}`)
        );

        const btnExcluir = criar('button', 'botao-secundario botao-pequeno', 'Excluir');
        btnExcluir.type = 'button';
        btnExcluir.setAttribute('aria-label', `Excluir o cadastro de ${c.nome}`);
        btnExcluir.addEventListener('click', async () => {
            const ok = await confirmar('Excluir cadastro', `Remover o cadastro de ${c.nome}?`, 'Excluir');
            if (!ok) return;
            salvar(CHAVE_CADASTROS, ler(CHAVE_CADASTROS, []).filter((x) => x.id !== c.id));
            renderizarCadastros();
        });

        item.append(info, btnExcluir);
        lista.append(item);
    });
}
