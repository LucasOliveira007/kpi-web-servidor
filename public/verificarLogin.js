window.addEventListener('load', () => {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = 'login.html';
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
});
