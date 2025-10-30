import { seleccionarUsuario, insertarUsuario} from "../models/registrar.js";
// Objetos del DOM
const listado = document.querySelector('#listado');
const alerta = document.querySelector('#alerta');

// Formulario
const formulario = document.querySelector('#formulario');
const btnNuevo = document.querySelector('#btnNuevo');

// Inputs
const inputNombre = document.querySelector('#nombre');
const inputApellido = document.querySelector('#apellido');
const inputDireccion = document.querySelector('#direccion');
const inputCuit = document.querySelector('#cuit');
const inputIva = document.querySelector('#iva');
const inputEmail = document.querySelector('#email');
const inputTelefono = document.querySelector('#telefono');
const inputUsuario = document.querySelector('#usuario');
const inputPassword = document.querySelector('#password');

/**
 * Ejecuta el evento submit del formulario
 */

let usuario = FormData(inputUsuario);
let password = FormData(inputPassword);
let email = FormData(inputEmail);

if (usuario == ""){
    mensajeAlerta = 'El campo de usuario es obligatorio.';
} else if (password == ""){
    mensajeAlerta = 'El campo de contraseña es obligatorio.';
} else if (email == ""){
    mensajeAlerta = 'El campo de email es obligatorio.';
} else {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); // Previene la acción por defecto

        const datos = new FormData(formulario); // Guarda los datos del formulario
        insertarUsuario(datos);

        window.location.href="./index.html";
    })
}