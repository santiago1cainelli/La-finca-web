// --- Controlador de Autenticación (cliente/controladores/auth.js) ---
// Este script debe incluirse en todas las páginas de gestión (inmuebles, personas, etc.)

// 1. Verificación de Rol al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const usuarioRol = sessionStorage.getItem('usuarioRol');
    const usuarioNombre = sessionStorage.getItem('usuarioNombre');

    // 2. Si tiene permisos, personalizamos la bienvenida
    const placeholderNombre = document.getElementById('usuario-nombre');
    if (placeholderNombre && usuarioNombre) {
        placeholderNombre.textContent = `Hola, ${usuarioNombre}`;
    }

    // 3. Asignamos funcionalidad al botón "Salir"
    const btnSalir = document.getElementById('btn-salir');
    if (btnSalir) {
        btnSalir.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
});
