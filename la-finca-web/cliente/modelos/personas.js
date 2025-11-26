// --- Modelo para Personas (cliente/modelos/personas.js) ---

const RUTA_API = 'api/personas.php';

async function manejarRespuesta(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            mensaje: `Error ${response.status}: ${response.statusText}`
        }));
        throw new Error(errorData.mensaje || 'Error desconocido del servidor');
    }
    return response.json();
}

export async function obtenerPersonas(id = null) {
    try {
        const url = id ? `${RUTA_API}?id=${id}` : RUTA_API;
        const response = await fetch(url);
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data.datos; // Devuelve array o un objeto persona
        } else {
            throw new Error(data.mensaje || 'Error al obtener los datos.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerPersonas:', error);
        throw error;
    }
}

/**
 * Obtiene los datos necesarios para el formulario (lista de personas).
 */
export async function obtenerDatosParaFormulario() {
    try {
        const response = await fetch(`${RUTA_API}?accion=listar_personas`);
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data.datos; // Devuelve array de personas
        } else {
            throw new Error(data.mensaje || 'Error al obtener datos del formulario.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerDatosParaFormulario:', error);
        throw error;
    }
}

export async function crearPersona(datosPersona) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPersona)
        });
        const data = await manejarRespuesta(response);
        return data; 
    } catch (error) {
        console.error('Error en modelo crearPersona:', error);
        throw error;
    }
}

export async function actualizarPersona(datosPersona) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPersona)
        });
        const data = await manejarRespuesta(response);
        return data; 
    } catch (error) {
        console.error('Error en modelo actualizarPersona:', error);
        throw error;
    }
}

export async function eliminarPersona(id) {
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
        console.error('Error en modelo eliminarPersona:', error);
        throw error;
    }
}