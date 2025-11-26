// --- Modelo para Usuarios (Registro) (cliente/modelos/usuarios.js) ---

const RUTA_API = 'api/usuarios.php';

async function manejarRespuesta(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            mensaje: `Error ${response.status}: ${response.statusText}`
        }));
        // Usamos el mensaje de error que viene del PHP
        throw new Error(errorData.mensaje || 'Error desconocido del servidor');
    }
    return response.json();
}

/**
 * Registra un nuevo usuario en el sistema.
 * @param {object} datosUsuario Objeto con los datos del usuario
 */
export async function registrarUsuario(datosUsuario) {
    try {
        // --- CAMBIO: Enviamos JSON en lugar de FormData ---
        const response = await fetch(RUTA_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario) // Enviamos como JSON
        });
        
        const data = await manejarRespuesta(response);
        return data; // Devuelve { exito: true, mensaje: "..." }

    } catch (error) {
        console.error('Error en el modelo al registrar usuario:', error);
        throw error;
    }
}

