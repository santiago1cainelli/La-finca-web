// --- Controlador para Registro (cliente/controladores/registro.js) ---

import * as modeloUsuarios from '../modelos/usuarios.js';
const formulario = document.getElementById('formulario-registro');

async function manejarSubmitRegistro(evento) {
    evento.preventDefault();
    if (!formulario) return;

    // --- CAMBIO: Creamos un objeto en lugar de FormData ---
    const datosUsuario = {
        nombre: formulario.nombre.value,
        apellido: formulario.apellido.value,
        correo: formulario.correo.value,
        clave: formulario.clave.value
    };

    try {
        const respuesta = await modeloUsuarios.registrarUsuario(datosUsuario);
        if (respuesta.exito) {
            alert(respuesta.mensaje);
            window.location.href = 'index.html';
        } else {
            // Esto no debería ejecutarse si el modelo lanza error, pero es un resguardo
            alert(respuesta.mensaje || 'Error desconocido al registrar.');
        }
    } catch (error) {
        // El 'alert' ahora mostrará el mensaje de error específico del backend
        alert(`Error al registrarse: ${error.message}`);
    }
}

if (formulario) {
    formulario.addEventListener('submit', manejarSubmitRegistro);
}

