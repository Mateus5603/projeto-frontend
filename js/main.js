// main.js: ponto de entrada da SPA.
// Apenas monta a tabela de rotas e liga o roteador; cada área de
// funcionalidade vive no seu próprio módulo dentro de /modules.

import { iniciarRoteador } from './modules/router.js';
import * as templates from './modules/templates.js';
import { iniciarCadastro } from './modules/formulario.js';

const rotas = {
    inicio: {
        titulo: '',
        cabecalho: 'ONG Raízes do Amanhã',
        template: templates.inicio
    },
    projetos: {
        titulo: 'Projetos',
        cabecalho: 'Nossos projetos',
        template: templates.projetos
    },
    cadastro: {
        titulo: 'Cadastro',
        cabecalho: 'Cadastro de voluntários e doadores',
        template: templates.cadastro,
        aoRenderizar: iniciarCadastro
    },
    naoEncontrada: {
        titulo: 'Página não encontrada',
        cabecalho: 'Página não encontrada',
        template: templates.naoEncontrada
    }
};

iniciarRoteador(rotas, 'inicio');
