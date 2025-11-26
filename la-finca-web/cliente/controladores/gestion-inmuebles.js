// --- Controlador para la página de Gestión de Inmuebles (cliente/controladores/gestion-inmuebles.js) ---

import * as modeloInmuebles from '../modelos/inmuebles.js';

// --- Elementos del DOM ---
const listadoInmuebles = document.getElementById('listado-inmuebles');
const elementoModal = document.getElementById('modal-inmueble');
let modalInmueble;
// Verificación robusta de que Bootstrap y el modal existen
if (typeof bootstrap !== 'undefined' && elementoModal) {
    modalInmueble = new bootstrap.Modal(elementoModal);
} else if (!elementoModal) {
    console.error('El elemento del modal #modal-inmueble no se encontró.');
} else {
    console.error('Bootstrap no está cargado.');
}

const formularioInmueble = document.getElementById('formulario-inmueble');
const tituloModal = document.getElementById('titulo-modal-inmueble');
const inputIdInmueble = document.getElementById('id_inmueble');
const inputFotoActual = document.getElementById('foto_actual');
const btnNuevoInmueble = document.getElementById('btn-nuevo-inmueble');

/**
 * Carga y muestra todos los inmuebles en tarjetas.
 */
async function cargarInmuebles() {
    if (!listadoInmuebles) return; 
    listadoInmuebles.innerHTML = '<p class="text-center col-12">Cargando inmuebles...</p>';
    
    try {
        const inmuebles = await modeloInmuebles.obtenerInmuebles();
        listadoInmuebles.innerHTML = ''; 

        if (!inmuebles || inmuebles.length === 0) {
            listadoInmuebles.innerHTML = '<p class="text-center col-12">No hay inmuebles registrados.</p>';
            return;
        }

        // Este forEach fallaba porque 'inmuebles' no era un array
        inmuebles.forEach(inmueble => {
            const usuarioRol = sessionStorage.getItem('usuarioRol');
            const nombreImagen = (inmueble.foto && inmueble.foto.trim() !== '') ? inmueble.foto : null;
            const rutaImagen = nombreImagen ? `imagenes/inmuebles/${nombreImagen}` : 'ruta/invalida.jpg'; 
            const observaciones = (inmueble.observaciones && inmueble.observaciones.trim() !== '') ? inmueble.observaciones : 'Sin observaciones.';

            const tarjeta = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${rutaImagen}" class="card-img-top" alt="Foto de ${inmueble.tipo}" 
                            onerror="this.onerror=null; this.src='https://placehold.co/600x400/eeeeee/aaaaaa?text=Sin+Imagen';">
                        <div class="card-body">
                            <h5 class="card-title">${inmueble.tipo} en ${inmueble.direccion}</h5>
                            <p class="card-text">CP: ${inmueble.codigo_postal} | Localidad: ${inmueble.localidad}</p>
                            <p class="card-text text-muted">${observaciones}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-around">
                            <button class="btn btn-warning btn-editar btn-accion" data-id="${inmueble.id}">Editar</button>
                            <button class="btn btn-danger btn-eliminar btn-accion" data-id="${inmueble.id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            listadoInmuebles.innerHTML += tarjeta;
        });
    } catch (error) {
        // Mostramos el error de PHP (si lo hay) o el de JS
        listadoInmuebles.innerHTML = `<p class="text-center col-12 text-danger">Error al cargar inmuebles: ${error.message}</p>`;
    }
}

/**
 * Maneja el evento de guardado del formulario (Crear o Actualizar).
 */
async function manejarGuardado(evento) {
    evento.preventDefault();
    if (!formularioInmueble) return;

    const datosFormulario = new FormData(formularioInmueble);
    const idInmueble = inputIdInmueble.value.trim();
    let resultado;

    try {
        if (idInmueble !== '') {
            // --- Actualizar ---
            resultado = await modeloInmuebles.actualizarInmueble(datosFormulario);
        } else {
            // --- Crear ---
            // Esta era la función que daba error
            resultado = await modeloInmuebles.crearInmueble(datosFormulario);
        }

        if (resultado.exito) {
            if (modalInmueble) modalInmueble.hide();
            cargarInmuebles(); // Recargamos la lista
        } else {
            alert(resultado.mensaje || 'Hubo un error al guardar.');
        }
    } catch (error) {
        // Captura el error "is not a function" si el modelo está mal
        alert(`Error al guardar: ${error.message}`);
    }
}

/**
 * Prepara y muestra el modal para un nuevo inmueble.
 */
function prepararModalNuevo() {
    if (!formularioInmueble || !inputIdInmueble || !tituloModal || !modalInmueble) return;
    
    formularioInmueble.reset();
    inputIdInmueble.value = '';
    if (inputFotoActual) inputFotoActual.value = '';
    tituloModal.textContent = 'Añadir Nuevo Inmueble';
    modalInmueble.show();
}

/**
 * Prepara y muestra el modal para editar un inmueble existente.
 * @param {string} id El ID del inmueble a editar.
 */
async function prepararModalEditar(id) {
    if (!formularioInmueble || !inputIdInmueble || !tituloModal || !modalInmueble) return;
    try {
        // Obtenemos los datos frescos del inmueble
        const inmueble = await modeloInmuebles.obtenerInmuebles(id);
        if (!inmueble) {
            alert('No se pudo encontrar el inmueble para editar.');
            return;
        }
        
        // Llenamos el formulario con los datos del inmueble
        inputIdInmueble.value = inmueble.id;
        // Usamos .tipo, .direccion, etc. que son los campos del formulario
        formularioInmueble.tipo.value = inmueble.tipo || '';
        formularioInmueble.direccion.value = inmueble.direccion || '';
        formularioInmueble.numero.value = inmueble.numero || '';
        formularioInmueble.piso.value = inmueble.piso || '';
        formularioInmueble.letra.value = inmueble.letra || '';
        formularioInmueble.codigo_postal.value = inmueble.codigo_postal || '';
        formularioInmueble.localidad.value = inmueble.localidad || '';
        formularioInmueble.provincia.value = inmueble.provincia || '';
        formularioInmueble.observaciones.value = inmueble.observaciones || '';
        if (inputFotoActual) inputFotoActual.value = inmueble.foto || '';

        tituloModal.textContent = 'Editar Inmueble';
        modalInmueble.show();
    } catch (error) {
        alert(`Error al preparar edición: ${error.message}`);
    }
}

/**
 * Solicita confirmación y elimina un inmueble.
 * @param {string} id El ID del inmueble a eliminar.
 */
async function eliminarInmueble(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este inmueble?')) {
        try {
            const resultado = await modeloInmuebles.eliminarInmueble(id);
            if (resultado.exito) {
                cargarInmuebles(); // Recargamos la lista
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
    
    if (listadoInmuebles) {
        cargarInmuebles();
    }

    if (btnNuevoInmueble) {
        btnNuevoInmueble.addEventListener('click', prepararModalNuevo);
    }

    if (formularioInmueble) {
        formularioInmueble.addEventListener('submit', manejarGuardado);
    }

    // Event listener unificado para la tabla
    if (listadoInmuebles) {
        listadoInmuebles.addEventListener('click', (evento) => {
            // Buscamos el botón más cercano que tenga la clase
            const boton = evento.target.closest('button.btn-accion');
            if (!boton) return; // Si no se hizo clic en un botón, no hacemos nada

            const id = boton.dataset.id;
            if (id) {
                if (boton.classList.contains('btn-editar')) {
                    prepararModalEditar(id);
                }
                if (boton.classList.contains('btn-eliminar')) {
                    eliminarInmueble(id);
                }
            }
        });
    }
});