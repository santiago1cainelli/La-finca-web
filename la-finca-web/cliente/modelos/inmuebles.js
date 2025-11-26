// --- Modelo para Inmuebles (cliente/modelos/inmuebles.js) ---

const RUTA_API = 'api/inmuebles.php';

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
 * Obtiene todos los inmuebles o uno por ID.
 * @param {number | null} id (Opcional) ID del inmueble a buscar
 */
export async function obtenerInmuebles(id = null) {
    try {
        const url = id ? `${RUTA_API}?id=${id}` : RUTA_API;
        const response = await fetch(url);
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data.datos; // Devuelve array de inmuebles o un objeto inmueble
        } else {
            throw new Error(data.mensaje || 'Error al obtener los datos.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerInmuebles:', error);
        // Lanzamos el error para que el controlador lo muestre
        throw error;
    }
}

/**
 * Crea un nuevo inmueble enviando los datos del formulario.
 * @param {FormData} datosFormulario Datos del formulario (incluye la foto)
 */
export async function crearInmueble(datosFormulario) {
    try {
        datosFormulario.append('accion', 'crear');
        const response = await fetch(RUTA_API, {
            method: 'POST',
            body: datosFormulario
        });
        const data = await manejarRespuesta(response);
        return data; 
    } catch (error) {
        console.error('Error en modelo crearInmueble:', error);
        throw error;
    }
}

/**
 * Actualiza un inmueble existente.
 * @param {FormData} datosFormulario Datos del formulario (incluye ID y foto)
 */
export async function actualizarInmueble(datosFormulario) {
    try {
        datosFormulario.append('accion', 'actualizar'); 
        const response = await fetch(RUTA_API, {
            method: 'POST',
            body: datosFormulario
        });
        const data = await manejarRespuesta(response);
        return data;
    } catch (error) {
        console.error('Error en modelo actualizarInmueble:', error);
        throw error;
    }
}

/**
 * Elimina un inmueble por su ID.
 * @param {number} id ID del inmueble a eliminar
 */
export async function eliminarInmueble(id) {
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
        console.error('Error en modelo eliminarInmueble:', error);
        throw error;
    }
}