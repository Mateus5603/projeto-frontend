// validacao.js: regras de validação e máscaras de digitação.
// Não mexe no DOM: recebe valores e devolve resultados, o que facilita testar.

// ---------- Máscaras (formatam enquanto o usuário digita) ----------

export const mascaras = {
    cpf(valor) {
        return valor.replace(/\D/g, '').slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },

    cep(valor) {
        return valor.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
    },

    telefone(valor) {
        const d = valor.replace(/\D/g, '').slice(0, 11);
        if (d.length === 0) return '';
        if (d.length <= 2) return `(${d}`;
        if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
        if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }
};

// ---------- Regras (devolvem a mensagem de erro ou '' se estiver válido) ----------

function cpfValido(cpf) {
    const d = cpf.replace(/\D/g, '');
    if (/^(\d)\1{10}$/.test(d)) return false; // 000.000.000-00, 111.111.111-11...

    const digito = (quantidade) => {
        let soma = 0;
        for (let i = 0; i < quantidade; i++) {
            soma += Number(d[i]) * (quantidade + 1 - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

const regras = {
    nome(v) {
        const t = v.trim();
        if (!t) return 'Informe seu nome completo.';
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(t)) return 'Use apenas letras no nome.';
        if (t.split(/\s+/).length < 2) return 'Digite nome e sobrenome.';
        return '';
    },

    email(v) {
        const t = v.trim();
        if (!t) return 'Informe seu e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return 'Digite um e-mail válido, como nome@exemplo.com.';
        return '';
    },

    nascimento(v) {
        if (!v) return ''; // campo opcional
        const data = new Date(`${v}T00:00:00`);
        if (Number.isNaN(data.getTime())) return 'Digite uma data válida.';
        if (data > new Date()) return 'A data de nascimento não pode estar no futuro.';
        if (data.getFullYear() < 1900) return 'Confira o ano de nascimento.';
        return '';
    },

    cpf(v) {
        if (!v) return 'Informe seu CPF.';
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v)) return 'Use o formato 000.000.000-00.';
        if (!cpfValido(v)) return 'Este CPF não é válido. Confira os números.';
        return '';
    },

    endereco(v) {
        return v.trim().length < 5 ? 'Informe o endereço e a cidade.' : '';
    },

    estado(v) {
        return v ? '' : 'Selecione o estado.';
    },

    cep(v) {
        if (!v) return 'Informe o CEP.';
        return /^\d{5}-\d{3}$/.test(v) ? '' : 'Use o formato 00000-000.';
    },

    telefone(v) {
        if (!v) return 'Informe um telefone.';
        return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v) ? '' : 'Use o formato (12) 90000-0000.';
    }
};

export function validarCampo(nome, valor) {
    const regra = regras[nome];
    return regra ? regra(valor) : '';
}
