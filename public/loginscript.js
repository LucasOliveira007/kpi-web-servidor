document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const botaoLogin = document.getElementById('botaoLogin');
    const mensagemErro = document.getElementById('mensagemErro');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const codigo = document.getElementById('codigo').value.trim();
            const senha = document.getElementById('senha').value.trim();

            // Feedback visual
            botaoLogin.disabled = true;
            botaoLogin.textContent = 'Entrando...';

            if (!codigo || !senha) {
                mensagemErro.textContent = 'Por favor, preencha todos os campos.';
                botaoLogin.disabled = false;
                botaoLogin.textContent = 'Entrar';
                return;
            }

            fetch('https://kpi-web-servidor.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, senha })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Usuário ou senha inválidos.");
                }
                return response.json();
            })
            .then(data => {
                console.log("✅ Login bem-sucedido:", data);
                localStorage.setItem('usuarioLogadoCodigo', codigo);
                localStorage.setItem('usuarioLogadoNome', data.nome);
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error("❌ Erro no login:", error);
                mensagemErro.textContent = error.message;
                botaoLogin.disabled = false;
                botaoLogin.textContent = 'Entrar';
            });
        });
    }
});

