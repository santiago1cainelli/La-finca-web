// URL para acceder a la API
const URL = './api/datos.php?tabla=clientes';

export async function seleccionarUsuario() {
    let res = await fetch(`${URL}&accion=seleccionar`);
    let datos = await res.json();
    if(res.status !== 200) {
        throw Error('Los datos no se encontraron');
    }
    return datos;
}

/**
 * Inserta el usuario en la BD
 * @param datos los datos a insertar
 */
export const insertarUsuario = (datos) => {
    fetch(`${URL}&accion=insertar`, {
        method: 'POST',
        body: datos
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        return data;
    });
}