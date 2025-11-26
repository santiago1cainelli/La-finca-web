// --- Controlador para la página de Gestión de Personas (cliente/controladores/gestion-personas.js) ---

import * as modeloPersonas from '../modelos/personas.js';

// --- Elementos del DOM ---
const listadoPersonas = document.getElementById('listado-personas');
const elementoModal = document.getElementById('modal-persona');
let modalPersona;
// Verificación robusta de que Bootstrap y el modal existen
if (typeof bootstrap !== 'undefined' && elementoModal) {
    modalPersona = new bootstrap.Modal(elementoModal);
} else if (!elementoModal) {
    console.error('El elemento del modal #modal-persona no se encontró.');
} else {
    console.error('Bootstrap no está cargado.');
}

const formularioPersona = document.getElementById('formulario-persona');
const tituloModal = document.getElementById('titulo-modal-persona');
const inputIdPersona = document.getElementById('id_persona');
const btnNuevoPersona = document.getElementById('btn-nuevo-persona');
const selectOperacion = document.getElementById('nombre');

/**
 * Carga y muestra todas las personas.
 */
async function cargarPersonas() {
    if (!listadoPersonas) return; 
    listadoPersonas.innerHTML = '<p class="text-center col-12">Cargando personas...</p>';
    
    try {
        const personas = await modeloPersonas.obtenerPersonas();
        listadoPersonas.innerHTML = ''; 

        if (!personas || personas.length === 0) {
            listadoPersonas.innerHTML = '<p class="text-center col-12">No hay  registrados.</p>';
            return;
        }

        // Este forEach fallaba porque 'personas' no era un array
        personas.forEach(persona => {
            const tarjeta = `
                    <tr>
                        <td>${persona.id}</td>
                        <td>${persona.nombre} ${persona.apellido}</td>
                        <td>${persona.dni}</td>
                        <td>${persona.correo}</td>
                        <td>${persona.telefono}</td>
                        <td>
                            <button class="btn btn-sm btn-warning btn-editar btn-accion" data-id="${persona.id}">Editar</button>
                            <button class="btn btn-sm btn-danger btn-eliminar btn-accion" data-id="${persona.id}">Eliminar</button>
                        </td>
                    </tr>
                `;
            listadoPersonas.innerHTML += tarjeta;
        });
    } catch (error) {
        // Mostramos el error de PHP (si lo hay) o el de JS
        listadoPersonas.innerHTML = `<p class="text-center col-12 text-danger">Error al cargar personas: ${error.message}</p>`;
    }
}

/**
 * Carga la lista de personas en el <select> del modal.
 */
async function cargarDatosDelFormulario() {
    if (!selectOperacion) return;
    selectOperacion.innerHTML = '<option value="">Cargando personas...</option>';

    try {
        const alquileres = await modeloPersonas.obtenerDatosParaFormulario();
        selectOperacion.innerHTML = '<option value="">Seleccione una operación de persona...</option>';
        if (alquileres && alquileres.length > 0) {
            alquileres.forEach(a => {
                selectOperacion.innerHTML += `<option value="${a.id}">ID ${a.id}: ${a.nombre} ${a.apellido}. DNI: ${a.dni}</option>`;
            });
        }
    } catch (error) {
        alert(`Error al cargar datos del formulario: ${error.message}`);
    }
}

/**
 * Maneja el evento de guardado del formulario (Crear o Actualizar).
 */
async function manejarGuardado(evento) {
    evento.preventDefault();
    if (!formularioPersona) return;

    const idPersona = inputIdPersona.value.trim();
    const datosFormulario = {
        id: idPersona || null,
        nombre: formularioPersona.nombre.value,
        apellido: formularioPersona.apellido.value,
        dni: formularioPersona.dni.value,
        correo: formularioPersona.correo.value,
        telefono: formularioPersona.telefono.value
    };

    let resultado;

    try {
        if (idPersona !== '') {
            // --- Actualizar ---
            resultado = await modeloPersonas.actualizarPersona(datosFormulario);
        } else {
            // --- Crear ---
            resultado = await modeloPersonas.crearPersona(datosFormulario);
        }

        if (resultado.exito) {
            if (modalPersona) modalPersona.hide();
            cargarPersonas(); // Recargamos la lista
        } else {
            alert(resultado.mensaje || 'Hubo un error al guardar.');
        }
    } catch (error) {
        // Captura el error "is not a function" si el modelo está mal
        alert(`Error al guardar: ${error.message}`);
    }
}

/**
 * Prepara y muestra el modal para una nueva persona.
 */
function prepararModalNuevo() {
    if (!formularioPersona || !inputIdPersona || !tituloModal || !modalPersona) return;
    
    formularioPersona.reset();
    inputIdPersona.value = '';
    tituloModal.textContent = 'Generar Nueva Persona';
    cargarDatosDelFormulario(); // Cargamos las personas
    modalPersona.show();
}

/**
 * Prepara y muestra el modal para editar un persona existente.
 * @param {string} id El ID del persona a editar.
 */
async function prepararModalEditar(id) {
    if (!formularioPersona || !inputIdPersona || !tituloModal || !modalPersona) return;
    try {
        // Obtenemos los datos frescos de la persona
        const persona = await modeloPersonas.obtenerPersonas(id);
        if (!persona) {
            alert('No se pudo encontrar a la persona para editar.');
            return;
        }

        await cargarDatosDelFormulario();

        // Llenamos el formulario con los datos de la persona
        inputIdPersona.value = persona.id;
        // Usamos .apellido, .dni, etc. que son los campos del formulario
        formularioPersona.nombre.value = persona.nombre || '';
        formularioPersona.apellido.value = persona.apellido || '';
        formularioPersona.dni.value = persona.dni || '';
        formularioPersona.correo.value = persona.correo || '';
        formularioPersona.telefono.value = persona.telefono || '';

        tituloModal.textContent = 'Editar Persona';
        modalPersona.show();
    } catch (error) {
        alert(`Error al preparar edición: ${error.message}`);
    }
}

/**
 * Solicita confirmación y elimina una persona.
 * @param {string} id El ID de la persona a eliminar.
 */
async function eliminarPersona(id) {
    if (confirm('¿Estás seguro de que deseas eliminar a una persona?')) {
        try {
            const resultado = await modeloPersonas.eliminarPersona(id);
            if (resultado.exito) {
                cargarPersonas(); // Recargamos la lista
            } else {
                alert(resultado.mensaje || 'Hubo un error al eliminar.');
            }
        } catch (error) {
            alert(`Error al eliminar: ${error.message}`);
        }
    }
}

// --- Inicialización y Asignación de Eventos ---
document.addEventListener('DOMContentLoaded', () => {
    
    if (listadoPersonas) {
        cargarPersonas();
    }

    if (btnNuevoPersona) {
        btnNuevoPersona.addEventListener('click', prepararModalNuevo);
    }

    if (formularioPersona) {
        formularioPersona.addEventListener('submit', manejarGuardado);
    }

    // Event listener unificado para la tabla de personas
    if (listadoPersonas) {
        listadoPersonas.addEventListener('click', (evento) => {
            // Buscamos el botón más cercano que tenga la clase
            const boton = evento.target.closest('button.btn-accion');
            if (!boton) return; // Si no se hizo clic en un botón, no hacemos nada

            const id = boton.dataset.id;
            if (!id) return;

            if (boton.classList.contains('btn-editar')) {
                prepararModalEditar(id);
            }
            if (boton.classList.contains('btn-eliminar')) {
                eliminarPersona(id);
            }
        });
    }
});