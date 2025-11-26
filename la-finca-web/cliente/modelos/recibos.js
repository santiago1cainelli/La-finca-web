// --- Modelo para Recibos (cliente/modelos/recibos.js) ---

const RUTA_API = 'api/recibos.php';

/**
 * Función genérica para manejar las respuestas de fetch
 */
async function manejarRespuesta(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            mensaje: `Error ${response.status}: ${response.statusText}`
        }));
        // Lanzamos el mensaje de error que viene del PHP
        throw new Error(errorData.mensaje || 'Error desconocido del servidor');
    }
    return response.json();
}

/**
 * Obtiene todos los recibos o uno por ID.
 * @param {number | null} id (Opcional) ID del recibo a buscar
 */
export async function obtenerRecibos(id = null) {
    try {
        const url = id ? `${RUTA_API}?id=${id}` : RUTA_API;
        const response = await fetch(url);
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data.datos; // Devuelve array de recibos o un objeto recibo
        } else {
            throw new Error(data.mensaje || 'Error al obtener los datos.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerRecibos:', error);
        throw error; // Propagamos el error al controlador
    }
}

/**
 * Obtiene los datos necesarios para el formulario (lista de alquileres).
 */
export async function obtenerDatosParaFormulario() {
    try {
        const response = await fetch(`${RUTA_API}?accion=listar_alquileres`);
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data.datos; // Devuelve array de alquileres
        } else {
            throw new Error(data.mensaje || 'Error al obtener datos del formulario.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerDatosParaFormulario:', error);
        throw error;
    }
}

/**
 * Crea un nuevo recibo.
 * @param {object} datosRecibo Objeto con los datos del recibo
 */
export async function crearRecibo(datosRecibo) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosRecibo)
        });
        const data = await manejarRespuesta(response);
        return data; // { exito: true, mensaje: "..." }
    } catch (error) {
        console.error('Error en modelo crearRecibo:', error);
        throw error;
    }
}

/**
 * Actualiza un recibo existente.
 * @param {object} datosRecibo Objeto con los datos (incluido el ID)
 */
export async function actualizarRecibo(datosRecibo) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosRecibo)
        });
        const data = await manejarRespuesta(response);
        return data; // { exito: true, mensaje: "..." }
    } catch (error) {
        console.error('Error en modelo actualizarRecibo:', error);
        throw error;
    }
}

/**
 * Elimina un recibo por su ID.
 * @param {number} id ID del recibo a eliminar
 */
export async function eliminarRecibo(id) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${encodeURIComponent(id)}`
        });
        const data = await manejarRespuesta(response);
        return data; // { exito: true, mensaje: "..." }
    } catch (error) {
        console.error('Error en modelo eliminarRecibo:', error);
        throw error;
    }
}

