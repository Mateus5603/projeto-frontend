// Copia a pasta de imagens para a build.
// O templates.js monta os caminhos das imagens em texto ("../imagens/..."),
// então o Vite não as encontra sozinho e elas precisam ser copiadas.
import { cpSync } from 'node:fs';

cpSync('imagens', 'dist/imagens', { recursive: true });
console.log('Imagens copiadas para dist/imagens');