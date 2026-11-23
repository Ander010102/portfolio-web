// ============================================
// Portfólio – Anderson Carneiro dos Santos
// ============================================

// ---------- Modo escuro ----------
// O CSS troca as cores quando <html> tem data-tema="escuro".
// A escolha fica salva no navegador; na primeira visita, segue o tema do sistema.
const CHAVE_TEMA = "tema";
const raiz = document.documentElement;
const botaoTema = document.getElementById("botao-tema");

function aplicarTema(escuro) {
    if (escuro) {
        raiz.setAttribute("data-tema", "escuro");
    } else {
        raiz.removeAttribute("data-tema");
    }
    botaoTema.setAttribute("aria-pressed", String(escuro));
}

function modoEscuro() {
    const escuro = raiz.getAttribute("data-tema") !== "escuro";
    aplicarTema(escuro);
    try {
        localStorage.setItem(CHAVE_TEMA, escuro ? "escuro" : "claro");
    } catch (erro) {
        // armazenamento indisponível: o tema só vale nesta visita
    }
}

(function iniciarTema() {
    let salvo = null;
    try {
        salvo = localStorage.getItem(CHAVE_TEMA);
    } catch (erro) {
        salvo = null;
    }
    const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    aplicarTema(salvo ? salvo === "escuro" : sistemaEscuro);
})();

botaoTema.addEventListener("click", modoEscuro);

// ---------- Destacar seção "Quem sou eu" ----------
document.getElementById("botao-destaque").addEventListener("click", function () {
    document.getElementById("eu").classList.toggle("em-destaque");
});

// ---------- Contador de cliques ----------
let clique = 0;


// ---------- Menu suspenso ----------
const botaoMenu = document.getElementById("menu-toggle");
const menu = document.getElementById("menu-mobile");

function alternarMenu(abrir) {
    const aberto = menu.classList.toggle("aberto", abrir);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
}

// Abre/fecha ao clicar no botão
botaoMenu.addEventListener("click", function () {
    alternarMenu();
});

// Fecha ao clicar em qualquer link do menu
menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        alternarMenu(false);
    });
});

// Fecha ao clicar fora do menu
document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !botaoMenu.contains(e.target)) {
        alternarMenu(false);
    }
});

// Fecha com a tecla Esc
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        alternarMenu(false);
    }
});

// ---------- Formulário de contato ----------
const formContato = document.getElementById("formContato");
const campoNome = document.getElementById("nomeContato");
const feedback = document.getElementById("feedback");

function mostrarFeedback(texto, tipo) {
    feedback.textContent = texto;  // textContent: o navegador trata como texto puro (protege contra XSS)
    feedback.className = tipo;     // "erro" ou "sucesso"
}

// Validação em tempo real
campoNome.addEventListener("input", function () {
    if (this.value.trim().length < 3) {
        mostrarFeedback("Digite pelo menos 3 caracteres.", "erro");
    } else {
        mostrarFeedback("✅ Nome válido!", "sucesso");
    }
});

// Validação no envio
formContato.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = campoNome.value.trim();
    const email = document.getElementById("emailContato").value.trim();
    const mensagem = document.getElementById("mensagemContato").value.trim();

    if (nome.length < 3) {
        mostrarFeedback("❌ Nome deve ter pelo menos 3 caracteres.", "erro");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarFeedback("❌ E-mail inválido. Digite um e-mail válido.", "erro");
        return;
    }

    if (mensagem.length < 10) {
        mostrarFeedback("❌ Mensagem deve ter pelo menos 10 caracteres.", "erro");
        return;
    }

    // Mostra o nome digitado na tela: é isso que permite testar o XSS
    mostrarFeedback("✅ Obrigado, " + nome + "! Mensagem enviada com sucesso.", "sucesso");
    formContato.reset();
});
