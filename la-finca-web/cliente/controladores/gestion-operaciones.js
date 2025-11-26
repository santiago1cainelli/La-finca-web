// --- Controlador para la página de Gestión de Operaciones (cliente/controladores/gestion-operaciones.js) ---

import * as modeloOperaciones from '../modelos/operaciones.js';

const listadoOperaciones = document.getElementById('listado-operaciones');
const elementoModal = document.getElementById('modal-operacion');
let modalOperacion;
if (elementoModal) {
    modalOperacion = new bootstrap.Modal(elementoModal);
}
const formularioOperacion = document.getElementById('formulario-operacion');
const btnNuevaOperacion = document.getElementById('btn-nueva-operacion');
const selectPersona = document.getElementById('id_persona');
const selectInmueble = document.getElementById('id_inmueble');

async function cargarOperaciones() {
    if (!listadoOperaciones) return;
    listadoOperaciones.innerHTML = '<tr><td colspan="6" class="text-center">Cargando operaciones...</td></tr>';

    try {
        const operaciones = await modeloOperaciones.obtenerOperaciones();
        listadoOperaciones.innerHTML = ''; 

        if (!operaciones || operaciones.length === 0) {
            listadoOperaciones.innerHTML = '<tr><td colspan="6" class="text-center">No hay operaciones registradas.</td></tr>';
            return;
        }

        operaciones.forEach(op => {
            const usuarioRol = sessionStorage.getItem('usuarioRol');
            const usuarioID = sessionStorage.getItem('usuarioID');
            if (usuarioRol === 'admin' || usuarioRol === 'secretario' || (usuarioID == op.persona_id_usuario)){
                const fila = `
                    <tr>
                        <td>${op.id}</td>
                        <td><span class="badge bg-secondary">${op.tipo_operacion}</span></td>
                        <td>${op.persona_nombre} ${op.persona_apellido}</td>
                        <td>${op.inmueble_tipo} en ${op.inmueble_direccion}</td>
                        <td>$ ${parseFloat(op.monto).toFixed(2)}</td>
                        <td>${op.fecha_operacion}</td>
                    </tr>
                `;
                listadoOperaciones.innerHTML += fila;
            }
        });
    } catch (error) {
        listadoOperaciones.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al cargar operaciones: ${error.message}</td></tr>`;
    }
}

async function cargarDatosDelFormulario() {
    if (!selectPersona || !selectInmueble) return;
    
    selectPersona.innerHTML = '<option value="">Cargando personas...</option>';
    selectInmueble.innerHTML = '<option value="">Cargando inmuebles...</option>';

    try {
        const datos = await modeloOperaciones.obtenerDatosParaFormulario();

        selectPersona.innerHTML = '<option value="">Seleccione una persona...</option>';
        if (datos.personas && datos.personas.length > 0) {
            datos.personas.forEach(p => {
                selectPersona.innerHTML += `<option value="${p.id}">${p.nombre} ${p.apellido} (DNI: ${p.dni})</option>`;
            });
        }

        selectInmueble.innerHTML = '<option value="">Seleccione un inmueble...</option>';
        if (datos.inmuebles && datos.inmuebles.length > 0) {
            datos.inmuebles.forEach(i => {
                selectInmueble.innerHTML += `<option value="${i.id}">${i.tipo} en ${i.direccion}</option>`;
            });
        }
    } catch (error) {
        alert(`Error al cargar datos para el formulario: ${error.message}`);
    }
}

async function manejarGuardado(evento) {
    evento.preventDefault();
    if (!formularioOperacion) return;

    const datosOperacion = {
        id_persona: formularioOperacion.id_persona.value,
        id_inmueble: formularioOperacion.id_inmueble.value,
        tipo_operacion: formularioOperacion.tipo_operacion.value,
        monto: formularioOperacion.monto.value,
        fecha_operacion: formularioOperacion.fecha_operacion.value,
    };

    // Validación simple
    if (!datosOperacion.id_persona || !datosOperacion.id_inmueble || !datosOperacion.tipo_operacion || !datosOperacion.monto || !datosOperacion.fecha_operacion) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const resultado = await modeloOperaciones.crearOperacion(datosOperacion);
        if (resultado.exito) {
            if (modalOperacion) modalOperacion.hide();
            cargarOperaciones(); 
        } else {
            alert(resultado.mensaje || 'Hubo un error al guardar.');
        }
    } catch (error) {
        alert(`Error al guardar: ${error.message}`);
    }
}

function prepararModalNuevo() {
    if (!formularioOperacion || !modalOperacion) return;
    formularioOperacion.reset();
    cargarDatosDelFormulario();
    modalOperacion.show();
}

document.addEventListener('DOMContentLoaded', () => {
    if (listadoOperaciones) {
        cargarOperaciones();
    }
    if (btnNuevaOperacion) {
        btnNuevaOperacion.addEventListener('click', prepararModalNuevo);
    }
    if (formularioOperacion) {
        formularioOperacion.addEventListener('submit', manejarGuardado);
    }
});