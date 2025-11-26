// --- Controlador para la página de Login (cliente/controladores/login.js) ---

import { iniciarSesion } from '../modelos/sesion.js';

document.addEventListener('DOMContentLoaded', () => {
    const formularioLogin = document.getElementById('formulario-login');

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', manejadorSubmitLogin);
    }
});

/**
 * Maneja el envío del formulario de inicio de sesión.
 */
async function manejadorSubmitLogin(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    const formulario = evento.target;
    const correo = formulario.correo.value.trim();
    const clave = formulario.clave.value.trim();

    if (!correo || !clave) {
        alert('Por favor, ingresa tu correo y contraseña.');
        return;
    }

    try {
        // Pasamos los datos al modelo (se envían como objeto)
        const datosLogin = { correo, clave };
        const resultado = await iniciarSesion(datosLogin);

        if (resultado.exito) {
            // Guardamos datos del usuario en sessionStorage
            sessionStorage.setItem('usuarioRol', resultado.rol);
            sessionStorage.setItem('usuarioNombre', resultado.nombre);
            sessionStorage.setItem('usuarioID', resultado.id);

            alert(`Bienvenido, ${resultado.nombre} (${resultado.rol})`);

            const usuarioRol = sessionStorage.getItem('usuarioRol');
            // Comprobar si el usario es admin o secretario
            if (usuarioRol === 'admin' || usuarioRol === 'secretario'){
                // Redirigir a la página principal de gestión
                window.location.href = 'inmuebles.html';
            } else {
                // Redirigir a la página de tus recibos
                window.location.href = 'operaciones-cliente.html';
            }
        } else {
            alert(resultado.mensaje || 'Error al iniciar sesión.');
        }

    } catch (error) {
        console.error('Error en el controlador de login:', error);
        alert('No se pudo conectar con el servidor.');
    }
}