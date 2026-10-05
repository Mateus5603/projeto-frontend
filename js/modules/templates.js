// templates.js: funções que devolvem o HTML de cada página da SPA.
// A marcação é a mesma das páginas estáticas originais, para manter o visual do style.css.
// Usam apenas dados fixos do dados.js. Dados digitados pelo usuário NUNCA passam
// por aqui: eles são inseridos com textContent (ver formulario.js).

import * as dados from './dados.js';

const IMAGENS = '../imagens/';

// ---------- Componentes reutilizáveis ----------

// Lista de itens: <li>...</li><li>...</li>
const itensLista = (itens) => itens.map((item) => `<li>${item}</li>`).join('');

// Campo de formulário: rótulo + entrada + espaço para a mensagem de erro
function campo({ id, rotulo, tipo = 'text', placeholder = '', pattern = '',
    autocomplete = 'off', inputmode = '', obrigatorio = true }) {
    return `
        <label for="${id}">${rotulo}:${obrigatorio ? ' <span class="campo__obrigatorio" aria-hidden="true">*</span>' : ''}</label>
        <input type="${tipo}" id="${id}" name="${id}"
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${pattern ? `pattern="${pattern}"` : ''}
            ${inputmode ? `inputmode="${inputmode}"` : ''}
            autocomplete="${autocomplete}" aria-describedby="${id}-erro" ${obrigatorio ? 'required' : ''}>
        <p class="campo__erro" id="${id}-erro" aria-live="polite"></p>`;
}

// Card de atuação com imagem
const cardAtuacao = (a) => `
    <article>
        <h3>${a.titulo}</h3>
        <img src="${IMAGENS}${a.imagem}" alt="${a.alt}">
        <p>${a.descricao}</p>
    </article>`;

// Badge da campanha, calculado a partir do prazo
function badgeCampanha() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prazo = new Date(`${dados.campanha.prazo}T00:00:00`);
    const dias = Math.round((prazo - hoje) / 86400000);

    if (dias < 0) return '<span class="badge badge--erro">Encerrada</span>';
    if (dias <= 7) return `<span class="badge badge--aviso">Últimos dias: ${dias === 0 ? 'termina hoje' : `faltam ${dias}`}</span>`;
    return `<span class="badge badge--sucesso">Faltam ${dias} dias</span>`;
}

// ---------- Páginas ----------

export function inicio() {
    const c = dados.contato;
    return `
        <!-- Seção institucional: apresentação -->
        <section id="sobre">
            <h2>Quem somos</h2>
            <img src="${IMAGENS}voluntarios.jpg" alt="Voluntários e crianças em uma oficina de leitura ao ar livre">
            <p>
                Somos uma organização sem fins lucrativos que atua desde 2015 levando
                <strong>educação, cultura e cidadania</strong> a crianças e jovens da nossa cidade.
            </p>

            <h3>Missão</h3>
            <p>Garantir oportunidades de aprendizado e desenvolvimento para todos.</p>

            <h3>Visão</h3>
            <p>Uma sociedade mais justa, em que a educação chegue a cada comunidade.</p>

            <h3>Valores</h3>
            <ul>${itensLista(dados.valores)}</ul>
        </section>

        <!-- Seção institucional: atuação -->
        <section id="atuacao">
            <h2>Nossa atuação</h2>
            ${dados.atuacoes.map(cardAtuacao).join('')}
        </section>

        <!-- Dados de contato -->
        <section id="contato">
            <h2>Fale com a gente</h2>
            <p>Quer ser voluntário, doar ou conhecer nosso trabalho? Entre em contato:</p>
            <ul>
                <li><strong>Endereço:</strong> ${c.endereco}</li>
                <li><strong>Telefone:</strong> <a href="tel:${c.telefoneLink}">${c.telefone}</a></li>
                <li><strong>E-mail:</strong> <a href="mailto:${c.email}">${c.email}</a></li>
                <li><strong>Atendimento:</strong> ${c.atendimento}</li>
            </ul>
        </section>`;
}

export function projetos() {
    const camp = dados.campanha;
    return `
        <!-- Voluntariado -->
        <section id="voluntariado">
            <h2>Seja voluntário</h2>

            <article>
                <h3>Áreas de atuação</h3>
                <ul>${itensLista(dados.areasVoluntariado)}</ul>
            </article>

            <article>
                <h3>Como se inscrever</h3>
                <ol>${itensLista(dados.passosInscricao)}</ol>
                <a href="#/cadastro" class="botao-primario">Quero me cadastrar</a>
            </article>

            <article>
                <h3>Horários disponíveis</h3>
                <table border="1">
                    <thead>
                        <tr><th>Projeto</th><th>Dia</th><th>Horário</th></tr>
                    </thead>
                    <tbody>
                        ${dados.horarios.map((h) => `
                            <tr><td>${h.projeto}</td><td>${h.dia}</td><td>${h.horario}</td></tr>`).join('')}
                    </tbody>
                </table>
            </article>
        </section>

        <!-- Doação -->
        <section id="doacao">
            <h2>Faça uma doação</h2>

            <article>
                <h3>Doações financeiras</h3>
                <p>Toda contribuição financia material escolar, alimentação e a manutenção dos projetos.</p>
                <ul>
                    <li><strong>PIX:</strong> ${dados.contato.email}</li>
                    <li><strong>Transferência:</strong> solicite os dados bancários por e-mail</li>
                </ul>
            </article>

            <article>
                <h3>Doações de materiais</h3>
                <p>Aceitamos itens <strong>novos ou em bom estado</strong>:</p>
                <ul>${itensLista(dados.materiais)}</ul>
            </article>

            <article>
                <h3>Campanha em andamento</h3>
                <h4>${camp.nome}</h4>
                <div>${badgeCampanha()}</div>
                <p>Prazo para doações até <time datetime="${camp.prazo}">${camp.prazoTexto}</time>.</p>
                <p>Meta: kits escolares para <em>${camp.meta}</em>.</p>
            </article>
        </section>

        <!-- Dúvidas e transparência -->
        <section id="duvidas">
            <h2>Dúvidas frequentes</h2>
            ${dados.duvidas.map((d) => `
                <details>
                    <summary>${d.pergunta}</summary>
                    <p>${d.resposta}</p>
                </details>`).join('')}
        </section>`;
}

export function cadastro() {
    return `
        <section id="formulario">
            <h2>Faça seu cadastro</h2>
            <p class="formulario__nota">Campos com <span class="campo__obrigatorio">*</span> são obrigatórios.
                O que você digitar fica salvo neste navegador até o envio, exceto o CPF.</p>

            <div id="cadastro-alerta" aria-live="polite"></div>

            <form id="form-cadastro" novalidate>
                <fieldset>
                    <legend>Dados pessoais</legend>
                    ${campo({ id: 'nome', rotulo: 'Nome completo', autocomplete: 'name' })}
                    ${campo({ id: 'email', rotulo: 'E-mail', tipo: 'email', placeholder: 'nome@exemplo.com', autocomplete: 'email' })}
                    ${campo({ id: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date', autocomplete: 'bday', obrigatorio: false })}
                    ${campo({ id: 'cpf', rotulo: 'CPF', placeholder: '000.000.000-00', inputmode: 'numeric',
                        pattern: '[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}' })}
                </fieldset>

                <fieldset>
                    <legend>Endereço</legend>
                    ${campo({ id: 'endereco', rotulo: 'Endereço e cidade', autocomplete: 'street-address' })}

                    <label for="estado">Estado: <span class="campo__obrigatorio" aria-hidden="true">*</span></label>
                    <select id="estado" name="estado" aria-describedby="estado-erro" required>
                        <option value="">Selecione</option>
                        ${dados.estados.map((uf) => `<option value="${uf}">${uf}</option>`).join('')}
                    </select>
                    <p class="campo__erro" id="estado-erro" aria-live="polite"></p>

                    ${campo({ id: 'cep', rotulo: 'CEP', placeholder: '00000-000', inputmode: 'numeric',
                        autocomplete: 'postal-code', pattern: '[0-9]{5}-[0-9]{3}' })}
                </fieldset>

                <fieldset>
                    <legend>Contato</legend>
                    ${campo({ id: 'telefone', rotulo: 'Telefone', tipo: 'tel', placeholder: '(12) 90000-0000',
                        autocomplete: 'tel', pattern: '\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}' })}
                </fieldset>

                <button type="submit" class="botao-primario">Enviar cadastro</button>
            </form>
        </section>

        <section id="cadastros">
            <div class="cadastros__topo">
                <h2>Cadastros salvos</h2>
                <span id="contador-cadastros" class="badge badge--categoria">0 cadastros</span>
            </div>
            <ul id="lista-cadastros" class="cadastros"></ul>
            <div class="chamada">
                <button type="button" id="btn-limpar-cadastros" class="botao-secundario" hidden>Apagar todos</button>
            </div>
        </section>`;
}

export function naoEncontrada() {
    return `
        <section>
            <h2>Esta página não existe</h2>
            <p>O endereço pode ter sido digitado errado ou a página mudou de lugar.</p>
            <div class="chamada">
                <a href="#/inicio" class="botao-primario">Ir para o início</a>
            </div>
        </section>`;
}
