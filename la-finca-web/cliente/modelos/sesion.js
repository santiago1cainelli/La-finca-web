// --- Modelo para Sesión (cliente/modelos/sesion.js) ---

const RUTA_API = 'api/sesion.php';

/**
 * Envía las credenciales al servidor y devuelve la respuesta JSON.
 * @param {Object} datosLogin { correo, clave }
 */
export async function iniciarSesion(datosLogin) {
    try {
        const response = await fetch(RUTA_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosLogin)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                mensaje: `Error ${response.status}: ${response.statusText}`
            }));
            throw new Error(errorData.mensaje || 'Error del servidor');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error en el modelo al iniciar sesión:', error);
        throw error;
    }
}
