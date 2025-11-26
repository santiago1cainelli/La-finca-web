// --- Modelo para Operaciones (cliente/modelos/operaciones.js) ---

const RUTA_API = 'api/operaciones.php';

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
 * Obtiene todas las operaciones registradas.
 */
export async function obtenerOperaciones() {
    try {
        const response = await fetch(RUTA_API); // Acción por defecto es 'listar'
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data.datos; // Devuelve array de operaciones
        } else {
            throw new Error(data.mensaje || 'Error al obtener los datos.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerOperaciones:', error);
        alert(`Error al cargar operaciones: ${error.message}`);
        return []; // Devuelve un array vacío
    }
}

/**
 * Obtiene los datos necesarios para el formulario (listas de personas e inmuebles).
 */
export async function obtenerDatosParaFormulario() {
    try {
        const response = await fetch(`${RUTA_API}?accion=listar_para_formulario`);
        const data = await manejarRespuesta(response);
        if (data.exito) {
            return data.datos; // Devuelve { personas: [...], inmuebles: [...] }
        } else {
            throw new Error(data.mensaje || 'Error al obtener datos del formulario.');
        }
    } catch (error) {
        console.error('Error en modelo obtenerDatosParaFormulario:', error);
        alert(`Error al cargar datos del formulario: ${error.message}`);
        return { personas: [], inmuebles: [] }; // Devuelve objeto vacío
    }
}

/**
 * Crea una nueva operación.
 * @param {object} datosOperacion Objeto con los datos de la operación
 */
export async function crearOperacion(datosOperacion) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosOperacion)
        });
        
        const data = await manejarRespuesta(response);
        return data; 
    
    } catch (error) {
        console.error('Error en modelo crearOperacion:', error);
        alert(`Error al registrar la operación: ${error.message}`);
        return { exito: false, mensaje: error.message };
    }
}