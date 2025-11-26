// --- Modelo para Movimientos (cliente/modelos/movimientos.js) ---

const RUTA_API = 'api/movimientos.php';

/**
 * Función genérica para manejar las respuestas de fetch
 */
async function manejarRespuesta(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            mensaje: `Error ${response.status}: ${response.statusText}`
        }));
        throw new Error(errorData.mensaje || 'Error desconocido del servidor');
    }
    return response.json();
}

/**
 * Obtiene todos los movimientos o uno por ID.
 */
export async function obtenerMovimientos(id = null) {
    try {
        const url = id ? `${RUTA_API}?id=${id}` : RUTA_API;
        const response = await fetch(url);
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data.datos; 
        } else {
            throw new Error(data.mensaje || 'Error al obtener los datos.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerMovimientos:', error);
        throw error;
    }
}

/**
 * Obtiene los datos para los <select> del formulario (inmuebles y recibos).
 */
export async function obtenerDatosParaFormulario() {
    try {
        const response = await fetch(`${RUTA_API}?accion=listar_formularios`);
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data; // Devuelve { exito: true, inmuebles: [...], recibos: [...] }
        } else {
            throw new Error(data.mensaje || 'Error al obtener datos del formulario.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerDatosParaFormulario:', error);
        throw error;
    }
}

/**
 * Crea un nuevo movimiento.
 */
export async function crearMovimiento(datosMovimiento) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosMovimiento)
        });
        const data = await manejarRespuesta(response);
        return data;
    } catch (error) {
        console.error('Error en modelo crearMovimiento:', error);
        throw error;
    }
}

/**
 * Actualiza un movimiento existente.
 */
export async function actualizarMovimiento(datosMovimiento) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosMovimiento)
        });
        const data = await manejarRespuesta(response);
        return data;
    } catch (error) {
        console.error('Error en modelo actualizarMovimiento:', error);
        throw error;
    }
}

/**
 * Elimina un movimiento por su ID.
 */
export async function eliminarMovimiento(id) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${encodeURIComponent(id)}`
        });
        const data = await manejarRespuesta(response);
        return data;
    } catch (error) {
        console.error('Error en modelo eliminarMovimiento:', error);
        throw error;
    }
}
