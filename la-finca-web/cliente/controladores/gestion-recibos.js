// --- Controlador para la página de Gestión de Recibos (cliente/controladores/gestion-recibos.js) ---

import * as modeloRecibos from '../modelos/recibos.js';
import { calcularReciboAlquiler } from '../modelos/calcular-recibo.js';


// --- Elementos del DOM ---
const listadoRecibos = document.getElementById('listado-recibos');
const elementoModal = document.getElementById('modal-recibo');
let modalRecibo;
// Verificación robusta de que Bootstrap y el modal existen
if (typeof bootstrap !== 'undefined' && elementoModal) {
    modalRecibo = new bootstrap.Modal(elementoModal);
} else {
    console.error('El modal #modal-recibo o Bootstrap no están disponibles.');
}

const formularioRecibo = document.getElementById('formulario-recibo');
const tituloModal = document.getElementById('titulo-modal-recibo');
const inputIdRecibo = document.getElementById('id_recibo');
const btnNuevoRecibo = document.getElementById('btn-nuevo-recibo');
const selectOperacion = document.getElementById('id_operacion');

/**
 * Carga y muestra todos los recibos en la tabla.
 */
async function cargarRecibos() {
    if (!listadoRecibos) return;
    listadoRecibos.innerHTML = '<tr><td colspan="7" class="text-center">Cargando recibos...</td></tr>';

    try {
        const recibos = await modeloRecibos.obtenerRecibos();
        listadoRecibos.innerHTML = ''; 

        if (!recibos || recibos.length === 0) {
            listadoRecibos.innerHTML = '<tr><td colspan="7" class="text-center">No hay recibos registrados.</td></tr>';
            return;
        }

        for (const recibo of recibos) {
            // Preparar datos y calcular el monto total usando calcularReciboAlquiler
            // Aseguramos que los valores sean números y usamos 0 si son nulos/indefinidos.
            const montoBaseAlquiler = parseFloat(recibo.monto_total || 0);
            const aguaAlquiler = parseFloat(recibo.agua || 0);
            const luzAlquiler = parseFloat(recibo.luz || 0);
            const expensasAlquiler = parseFloat(recibo.expensas || 0);
            const impuestosAlquiler = parseFloat(recibo.impuestos || 0);
            const tasaIVA = parseFloat(recibo.iva || 0); 
            const otrosAlquiler = parseFloat(recibo.otros || 0);

            let resultadoCalculo = 0;
            try {
                    // Llamamos a la función del archivo calcular-recibo.js
                    resultadoCalculo = await calcularReciboAlquiler(
                    montoBaseAlquiler, 
                    aguaAlquiler, 
                    luzAlquiler, 
                    expensasAlquiler, 
                    impuestosAlquiler, 
                    tasaIVA, 
                    otrosAlquiler
                );
            } catch (calcError) {
                console.error(`Error al calcular recibo ID ${recibo.id}:`, calcError);
            }
            
            const montoTotalMostrar = parseFloat(resultadoCalculo).toFixed(2);

            const usuarioRol = sessionStorage.getItem('usuarioRol');
                if (usuarioRol === 'admin' || usuarioRol === 'secretario'){
                    const estado = recibo.cobrado == 1 
                        ? '<span class="badge bg-success">Cobrado</span>' 
                        : '<span class="badge bg-warning text-dark">Pendiente</span>';
                    
                    const fila = `
                        <tr>
                            <td>${recibo.id}</td>
                            <td>${recibo.fecha_emision}</td>
                            <td>${recibo.nombre} ${recibo.apellido}</td>
                            <td>${recibo.tipo} en ${recibo.direccion}</td>
                            <td>$ ${montoTotalMostrar}</td> <td>${estado}</td>
                            <td>
                                <button class="btn btn-sm btn-warning btn-editar btn-accion" data-id="${recibo.id}">Editar</button>
                                <button class="btn btn-sm btn-danger btn-eliminar btn-accion" data-id="${recibo.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                    listadoRecibos.innerHTML += fila;
                } else {
                    const usuarioID = sessionStorage.getItem('usuarioID');
                    if (usuarioID == recibo.id_usuario){
                        const estado = recibo.cobrado == 1 
                            ? '<span class="badge bg-success">Pagado</span>' 
                            : '<span class="badge bg-warning text-dark">Pendiente</span>'; 
                        
                        const fila = `
                            <tr>
                                <td>${recibo.id}</td>
                                <td>${recibo.fecha_emision}</td>
                                <td>${recibo.nombre} ${recibo.apellido}</td>
                                <td>${recibo.tipo} en ${recibo.direccion}</td>
                                <td>$ ${montoTotalMostrar}</td> <td>${estado}</td>
                            </tr>
                        `;
                        listadoRecibos.innerHTML += fila;
                    }
                }
        }
    } catch (error) {
        listadoRecibos.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar recibos: ${error.message}</td></tr>`;
    }
}

/**
 * Carga la lista de alquileres en el <select> del modal.
 */
async function cargarDatosDelFormulario() {
    if (!selectOperacion) return;
    selectOperacion.innerHTML = '<option value="">Cargando alquileres...</option>';

    try {
        const alquileres = await modeloRecibos.obtenerDatosParaFormulario();
        selectOperacion.innerHTML = '<option value="">Seleccione una operación de alquiler...</option>';
        if (alquileres && alquileres.length > 0) {
            alquileres.forEach(a => {
                selectOperacion.innerHTML += `<option value="${a.id}">ID ${a.id}: ${a.nombre} ${a.apellido} (${a.tipo} en ${a.direccion})</option>`;
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
    if (!formularioRecibo) return;

    const idRecibo = inputIdRecibo.value.trim();
    
    // Recolectamos los datos del formulario como un objeto
    const datosRecibo = {
        id: idRecibo || null,
        id_operacion: formularioRecibo.id_operacion.value,
        fecha_emision: formularioRecibo.fecha_emision.value,
        monto_total: formularioRecibo.monto_total.value,
        agua: formularioRecibo.agua.value,
        luz: formularioRecibo.luz.value,
        expensas: formularioRecibo.expensas.value,
        impuestos: formularioRecibo.impuestos.value,
        iva: formularioRecibo.iva.value,
        otros: formularioRecibo.otros.value,
        cobrado: formularioRecibo.cobrado.checked // true o false
    };

    let resultado;
    try {
        if (idRecibo !== '') {
            resultado = await modeloRecibos.actualizarRecibo(datosRecibo);
        } else {
            resultado = await modeloRecibos.crearRecibo(datosRecibo);
        }

        if (resultado.exito) {
            if (modalRecibo) modalRecibo.hide();
            cargarRecibos(); // Recargamos la lista
        } else {
            // Esto es un resguardo, pero el 'catch' debería manejar los errores
            alert(resultado.mensaje || 'Hubo un error al guardar.');
        }
    } catch (error) {
        alert(`Error al guardar: ${error.message}`);
    }
}

/**
 * Prepara y muestra el modal para un nuevo recibo.
 */
function prepararModalNuevo() {
    if (!formularioRecibo || !inputIdRecibo || !tituloModal || !modalRecibo) return;
    
    formularioRecibo.reset();
    inputIdRecibo.value = '';
    tituloModal.textContent = 'Generar Nuevo Recibo';
    cargarDatosDelFormulario(); // Cargamos los alquileres
    modalRecibo.show();
}

/**
 * Prepara y muestra el modal para editar un recibo existente.
 * @param {string} id El ID del recibo a editar.
 */
async function prepararModalEditar(id) {
    if (!formularioRecibo || !inputIdRecibo || !tituloModal || !modalRecibo) return;
    try {
        // Obtenemos los datos frescos del recibo
        const recibo = await modeloRecibos.obtenerRecibos(id);
        if (!recibo) {
            alert('No se pudo encontrar el recibo para editar.');
            return;
        }
        
        // Cargamos los alquileres en el select (necesario para el <select>)
        await cargarDatosDelFormulario(); 
        
        // Llenamos el formulario con los datos
        inputIdRecibo.value = recibo.id;
        formularioRecibo.id_operacion.value = recibo.id_operacion;
        formularioRecibo.fecha_emision.value = recibo.fecha_emision;
        formularioRecibo.monto_total.value = recibo.monto_total;
        formularioRecibo.agua.value = recibo.agua;
        formularioRecibo.luz.value = recibo.luz;
        formularioRecibo.expensas.value = recibo.expensas;
        formularioRecibo.impuestos.value = recibo.impuestos;
        formularioRecibo.iva.value = recibo.iva;
        formularioRecibo.otros.value = recibo.otros;
        formularioRecibo.cobrado.checked = recibo.cobrado == 1; // Convertir 1/0 a true/false

        tituloModal.textContent = 'Editar Recibo';
        modalRecibo.show();
    } catch (error) {
        alert(`Error al preparar edición: ${error.message}`);
    }
}

/**
 * Solicita confirmación y elimina un recibo.
 * @param {string} id El ID del recibo a eliminar.
 */
async function eliminarRecibo(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este recibo?')) {
        try {
            const resultado = await modeloRecibos.eliminarRecibo(id);
            if (resultado.exito) {
                cargarRecibos(); // Recargamos la lista
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
    
    if (listadoRecibos) {
        cargarRecibos();
    }

    // El botón de nuevo recibo ya tiene atributos data-bs-toggle, 
    // pero le añadimos un listener para cargar los datos del form
    if (btnNuevoRecibo) {
        btnNuevoRecibo.addEventListener('click', prepararModalNuevo);
    }

    if (formularioRecibo) {
        formularioRecibo.addEventListener('submit', manejarGuardado);
    }

    // Event listener unificado para la tabla de recibos
    if (listadoRecibos) {
        listadoRecibos.addEventListener('click', (evento) => {
            const boton = evento.target.closest('button.btn-accion');
            if (!boton) return; // No se hizo clic en un botón de acción
            
            const id = boton.dataset.id;
            if (!id) return; // El botón no tiene data-id

            if (boton.classList.contains('btn-editar')) {
                prepararModalEditar(id);
            }
            if (boton.classList.contains('btn-eliminar')) {
                eliminarRecibo(id);
            }
        });
    }
});