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

// ============================================
// Validação do contato por telefone
// ============================================

const formTelefone = document.getElementById("formTelefone");
const campoTelefone = document.getElementById("telefone");
const campoData = document.getElementById("data");
const assuntoSelect = document.getElementById("assuntoSelect");
const feedbackTelefone = document.getElementById("feedbackTelefone");

// Mostrar mensagens de erro ou sucesso
function mostrarFeedbackTelefone(texto, tipo) {
    feedbackTelefone.textContent = texto;
    feedbackTelefone.className = tipo;
}

// Formatar telefone automaticamente enquanto digita
function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
        return numeros.length > 0 ? "(" + numeros : "";
    }

    const ddd = numeros.slice(0, 2);
    const numero = numeros.slice(2);

    // Celular: (11) 99999-9999
    if (numeros.length > 10) {
        if (numero.length <= 5) {
            return "(" + ddd + ") " + numero;
        }

        return "(" + ddd + ") " +
            numero.slice(0, 5) + "-" + numero.slice(5);
    }

    // Telefone fixo: (11) 3333-4444
    if (numero.length <= 4) {
        return "(" + ddd + ") " + numero;
    }

    return "(" + ddd + ") " +
        numero.slice(0, 4) + "-" + numero.slice(4);
}

// Validação em tempo real do telefone
campoTelefone.addEventListener("input", function () {

    this.value = formatarTelefone(this.value);

    const numeros = this.value.replace(/\D/g, "");

    if (numeros.length === 0) {
        mostrarFeedbackTelefone("", "");
    } else if (numeros.length < 10) {
        mostrarFeedbackTelefone(
            "Digite um telefone completo com DDD.",
            "erro"
        );
    } else {
        mostrarFeedbackTelefone(
            "✅ Telefone válido!",
            "sucesso"
        );
    }
});

// Validação no envio do formulário
formTelefone.addEventListener("submit", function (e) {

    e.preventDefault();

    const assunto = assuntoSelect.value;
    const telefone = campoTelefone.value.replace(/\D/g, "");
    const data = campoData.value;

    // Verifica o assunto
    if (assunto === "") {
        mostrarFeedbackTelefone(
            "❌ Selecione um assunto.",
            "erro"
        );
        return;
    }

    // Verifica o telefone
    if (!/^\d{10,11}$/.test(telefone)) {
        mostrarFeedbackTelefone(
            "❌ Digite um telefone válido com DDD.",
            "erro"
        );
        return;
    }

    // Verifica se a data foi preenchida
    if (data === "") {
        mostrarFeedbackTelefone(
            "❌ Selecione uma data para contato.",
            "erro"
        );
        return;
    }

    // Verifica se a data não está no passado
    const dataSelecionada = new Date(data + "T00:00:00");

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataSelecionada < hoje) {
        mostrarFeedbackTelefone(
            "❌ Escolha uma data igual ou posterior a hoje.",
            "erro"
        );
        return;
    }

    // Todos os campos passaram pela validação
    mostrarFeedbackTelefone(
        "✅ Dados validados com sucesso! Solicitação pronta para envio.",
        "sucesso"
    );

    formTelefone.reset();
});
