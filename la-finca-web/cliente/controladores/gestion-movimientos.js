// --- Controlador para la página de Gestión de Movimientos (cliente/controladores/gestion-movimientos.js) ---

import * as modeloMovimientos from '../modelos/movimientos.js';

// --- Elementos del DOM ---
const listadoMovimientos = document.getElementById('listado-movimientos');
const elementoModal = document.getElementById('modal-movimiento');
let modalMovimiento;
if (typeof bootstrap !== 'undefined' && elementoModal) {
    modalMovimiento = new bootstrap.Modal(elementoModal);
} else {
    console.error('El modal #modal-movimiento o Bootstrap no están disponibles.');
}

const formularioMovimiento = document.getElementById('formulario-movimiento');
const tituloModal = document.getElementById('titulo-modal-movimiento');
const inputIdMovimiento = document.getElementById('id_movimiento');
const btnNuevoMovimiento = document.getElementById('btn-nuevo-movimiento');
const selectInmueble = document.getElementById('id_inmueble');
const selectRecibo = document.getElementById('id_recibo');
const inputMonto = document.getElementById('monto');
const selectTipo = document.getElementById('tipo_movimiento');

/**
 * Carga y muestra todos los movimientos en la tabla.
 */
async function cargarMovimientos() {
    if (!listadoMovimientos) return;
    listadoMovimientos.innerHTML = '<tr><td colspan="7" class="text-center">Cargando movimientos...</td></tr>';

    try {
        const movimientos = await modeloMovimientos.obtenerMovimientos();
        listadoMovimientos.innerHTML = ''; 

        if (!movimientos || movimientos.length === 0) {
            listadoMovimientos.innerHTML = '<tr><td colspan="7" class="text-center">No hay movimientos registrados.</td></tr>';
            return;
        }

        movimientos.forEach(mov => {
            const monto = parseFloat(mov.monto);
            const claseMonto = monto >= 0 ? 'text-success' : 'text-danger';
            const tipo = mov.tipo_movimiento === 'Ingreso' 
                ? `<span class="badge bg-success">${mov.tipo_movimiento}</span>` 
                : `<span class="badge bg-danger">${mov.tipo_movimiento}</span>`;

            const fila = `
                <tr>
                    <td>${mov.id}</td>
                    <td>${mov.fecha}</td>
                    <td>${tipo}</td>
                    <td>${mov.concepto}</td>
                    <td>${mov.tipo} en ${mov.direccion}</td>
                    <td class="fw-bold ${claseMonto}">$ ${monto.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-editar btn-accion" data-id="${mov.id}">Editar</button>
                        <button class="btn btn-sm btn-danger btn-eliminar btn-accion" data-id="${mov.id}">Eliminar</button>
                    </td>
                </tr>
            `;
            listadoMovimientos.innerHTML += fila;
        });
    } catch (error) {
        listadoMovimientos.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar movimientos: ${error.message}</td></tr>`;
    }
}

/**
 * Carga la lista de inmuebles y recibos en los <select> del modal.
 */
async function cargarDatosDelFormulario() {
    if (!selectInmueble || !selectRecibo) return;
    selectInmueble.innerHTML = '<option value="">Cargando...</option>';
    selectRecibo.innerHTML = '<option value="">Cargando...</option>';

    try {
        const datos = await modeloMovimientos.obtenerDatosParaFormulario();
        
        // Cargar Inmuebles
        selectInmueble.innerHTML = '<option value="">Seleccione un inmueble...</option>';
        if (datos.inmuebles && datos.inmuebles.length > 0) {
            datos.inmuebles.forEach(i => {
                selectInmueble.innerHTML += `<option value="${i.id}">${i.tipo} en ${i.direccion}</option>`;
            });
        }
        
        // Cargar Recibos (pendientes de cobro)
        selectRecibo.innerHTML = '<option value="">Seleccione un recibo (opcional)...</option>';
        if (datos.recibos && datos.recibos.length > 0) {
            datos.recibos.forEach(r => {
                selectRecibo.innerHTML += `<option value="${r.id}">ID ${r.id} - $${r.monto_total} (${r.fecha_emision})</option>`;
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
    if (!formularioMovimiento || !inputMonto) return;

    const idMovimiento = inputIdMovimiento.value.trim();
    
    // Validar que el monto sea negativo para gastos
    const monto = parseFloat(inputMonto.value);
    const tipo = selectTipo.value;
    if (tipo === 'Gasto' && monto > 0) {
        alert('Error: El monto para un "Gasto" debe ser un número negativo (ej: -8500).');
        return;
    }
    if (tipo === 'Ingreso' && monto < 0) {
        alert('Error: El monto para un "Ingreso" debe ser un número positivo.');
        return;
    }

    const datosMovimiento = {
        id: idMovimiento || null,
        fecha: formularioMovimiento.fecha.value,
        tipo_movimiento: tipo,
        id_inmueble: formularioMovimiento.id_inmueble.value,
        id_recibo: formularioMovimiento.id_recibo.value || null,
        concepto: formularioMovimiento.concepto.value,
        monto: monto,
        banco: formularioMovimiento.banco.value,
        cuenta: formularioMovimiento.cuenta.value
    };

    let resultado;
    try {
        if (idMovimiento !== '') {
            resultado = await modeloMovimientos.actualizarMovimiento(datosMovimiento);
        } else {
            resultado = await modeloMovimientos.crearMovimiento(datosMovimiento);
        }

        if (resultado.exito) {
            if (modalMovimiento) modalMovimiento.hide();
            cargarMovimientos();
        } else {
            alert(resultado.mensaje || 'Hubo un error al guardar.');
        }
    } catch (error) {
        alert(`Error al guardar: ${error.message}`);
    }
}

/**
 * Prepara y muestra el modal para un nuevo movimiento.
 */
function prepararModalNuevo() {
    if (!formularioMovimiento || !inputIdMovimiento || !tituloModal || !modalMovimiento) return;
    
    formularioMovimiento.reset();
    inputIdMovimiento.value = '';
    tituloModal.textContent = 'Registrar Nuevo Movimiento';
    cargarDatosDelFormulario();
    modalMovimiento.show();
}

/**
 * Prepara y muestra el modal para editar un movimiento existente.
 */
async function prepararModalEditar(id) {
    if (!formularioMovimiento || !inputIdMovimiento || !tituloModal || !modalMovimiento) return;
    try {
        const movimiento = await modeloMovimientos.obtenerMovimientos(id);
        if (!movimiento) {
            alert('No se pudo encontrar el movimiento para editar.');
            return;
        }
        
        await cargarDatosDelFormulario(); 
        
        inputIdMovimiento.value = movimiento.id;
        formularioMovimiento.fecha.value = movimiento.fecha;
        formularioMovimiento.tipo_movimiento.value = movimiento.tipo_movimiento;
        formularioMovimiento.id_inmueble.value = movimiento.id_inmueble;
        formularioMovimiento.id_recibo.value = movimiento.id_recibo || '';
        formularioMovimiento.concepto.value = movimiento.concepto;
        formularioMovimiento.monto.value = movimiento.monto;
        formularioMovimiento.banco.value = movimiento.banco || '';
        formularioMovimiento.cuenta.value = movimiento.cuenta || '';

        tituloModal.textContent = 'Editar Movimiento';
        modalMovimiento.show();
    } catch (error) {
        alert(`Error al preparar edición: ${error.message}`);
    }
}

/**
 * Solicita confirmación y elimina un movimiento.
 */
async function eliminarMovimiento(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
        try {
            const resultado = await modeloMovimientos.eliminarMovimiento(id);
            if (resultado.exito) {
                cargarMovimientos();
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
    
    if (listadoMovimientos) {
        cargarMovimientos();
    }

    if (btnNuevoMovimiento) {
        btnNuevoMovimiento.addEventListener('click', prepararModalNuevo);
    }

    if (formularioMovimiento) {
        formularioMovimiento.addEventListener('submit', manejarGuardado);
    }

    if (listadoMovimientos) {
        listadoMovimientos.addEventListener('click', (evento) => {
            const boton = evento.target.closest('button.btn-accion');
            if (!boton) return;
            
            const id = boton.dataset.id;
            if (!id) return;

            if (boton.classList.contains('btn-editar')) {
                prepararModalEditar(id);
            }
            if (boton.classList.contains('btn-eliminar')) {
                eliminarMovimiento(id);
            }
        });
    }
});
