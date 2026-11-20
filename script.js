

document.body.style.opacity = '1';

const form = document.getElementById('loginForm');
const tentativasMsg = document.getElementById('tentativasMsg');
const loginBox = document.getElementById('formulario');

const campoUsuario = document.getElementById('ilogin');
const campoSenha = document.getElementById('isenha');
const botaoEntrar = form.querySelector('input[type="submit"]');

const MAX_TENTATIVAS = 3;
const TEMPO_BLOQUEIO = 15000;
const CHAVE_BLOQUEIO = 'loginBloqueio';

let tentativas = 0;
let bloqueado = false;
let intervalo = null;

function alterarEstado(disponivel) {
    campoUsuario.disabled = !disponivel;
    campoSenha.disabled = !disponivel;
    botaoEntrar.disabled = !disponivel;

    loginBox.classList.toggle('bloqueado', !disponivel);
}

function liberarLogin() {
    clearInterval(intervalo);
    localStorage.removeItem(CHAVE_BLOQUEIO);

    tentativas = 0;
    bloqueado = false;

    alterarEstado(true);
    tentativasMsg.textContent = '';
}

function iniciarBloqueio() {
    const termino = Number(localStorage.getItem(CHAVE_BLOQUEIO));

    if (!termino || !Number.isFinite(termino) || termino <= Date.now()) {
        liberarLogin();
        return;
    }

    bloqueado = true;
    alterarEstado(false);

    clearInterval(intervalo);

    function atualizarContagem() {
        const restante = termino - Date.now();

        if (restante <= 0) {
            liberarLogin();
            return;
        }

        const segundos = Math.ceil(restante / 1000);

        tentativasMsg.textContent =
            `Acesso bloqueado. Tente novamente em ${segundos} segundos.`;
    }

    atualizarContagem();
    intervalo = setInterval(atualizarContagem, 250);
}

function tentativaIncorreta() {
    tentativas++;

    if (tentativas >= MAX_TENTATIVAS) {
        const termino = Date.now() + TEMPO_BLOQUEIO;

        localStorage.setItem(CHAVE_BLOQUEIO, termino.toString());

        iniciarBloqueio();
    } else {
        tentativasMsg.textContent =
            `Usuário ou senha incorreto! Tentativa ${tentativas} de ${MAX_TENTATIVAS}.`;
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (bloqueado) return;

    const user = campoUsuario.value.trim().toLowerCase();
    const pass = campoSenha.value.trim();

    if (user === 'recepção' && pass === '04042027') {
        localStorage.setItem('auth', 'true');
        window.location.href = 'gathering.html';
    } else {
        tentativaIncorreta();
    }
});

iniciarBloqueio();
