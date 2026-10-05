// storage.js: única parte do código que conversa com o localStorage.
// O prefixo evita conflito com chaves de outros sites/projetos na mesma origem.

const PREFIXO = 'raizes:';

export function ler(chave, valorPadrao = null) {
    try {
        const valor = localStorage.getItem(PREFIXO + chave);
        return valor === null ? valorPadrao : JSON.parse(valor);
    } catch {
        // JSON corrompido ou armazenamento bloqueado pelo navegador
        return valorPadrao;
    }
}

export function salvar(chave, valor) {
    try {
        localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
        return true;
    } catch {
        // Cota cheia ou navegação privada com armazenamento desativado
        return false;
    }
}

export function remover(chave) {
    try {
        localStorage.removeItem(PREFIXO + chave);
    } catch {
        // Nada a fazer: se não dá para acessar, também não há o que remover
    }
}
