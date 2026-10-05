// dados.js: conteúdo do site separado da marcação.
// Os templates percorrem estes dados para gerar o HTML de cada página.

export const valores = ['Transparência', 'Solidariedade', 'Respeito à diversidade'];

export const atuacoes = [
    {
        titulo: 'Reforço escolar',
        imagem: 'reforco.jpg',
        alt: 'Estudante recebendo apoio de uma monitora em sala de aula',
        descricao: 'Acompanhamento pedagógico para estudantes do ensino fundamental.'
    },
    {
        titulo: 'Horta comunitária',
        imagem: 'horta.jpg',
        alt: 'Moradores cuidando de uma horta comunitária',
        descricao: 'Educação ambiental com a participação das famílias.'
    }
];

export const contato = {
    endereco: 'Rua das Acácias, 123, Centro, São José dos Campos, SP',
    telefone: '(12) 0000-0000',
    telefoneLink: '+551200000000',
    email: 'contato@raizesdoamanha.org.br',
    atendimento: 'segunda a sexta, das 9h às 17h'
};

export const areasVoluntariado = ['Reforço escolar', 'Oficinas de leitura', 'Horta comunitária'];

export const passosInscricao = [
    'Preencha o cadastro com seus dados',
    'Participe da conversa de boas-vindas',
    'Escolha seus dias e horários',
    'Comece a atuar com o acompanhamento da equipe'
];

export const horarios = [
    { projeto: 'Reforço escolar', dia: 'Segunda e quarta', horario: '14h às 17h' },
    { projeto: 'Oficina de leitura', dia: 'Sábado', horario: '9h às 12h' }
];

export const materiais = ['Livros e cadernos', 'Material de papelaria', 'Sementes e ferramentas de jardinagem'];

export const campanha = {
    nome: 'Volta às aulas solidária',
    prazo: '2026-11-30',
    prazoTexto: '30 de novembro de 2026',
    meta: '100 crianças'
};

export const duvidas = [
    {
        pergunta: 'Preciso ter experiência para ser voluntário?',
        resposta: 'Não. Oferecemos orientação inicial para todas as áreas.'
    },
    {
        pergunta: 'Como a ONG presta contas das doações?',
        resposta: 'Publicamos um relatório semestral com a destinação dos recursos.'
    }
];

export const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];
