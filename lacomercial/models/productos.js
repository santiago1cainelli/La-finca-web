// URL para acceder a la API
const URL = './api/datos.php?tabla=productos';

/**
 * Selecciona los productos de la BD
 */
export async function seleccionarProductos() {
    let res = await fetch(`${URL}&accion=seleccionar`);
    let datos = await res.json();
    if(res.status !== 200) {
        throw Error('Los datos no se encontraron');
    }
    return datos;
}

/**
 * Inserta los datos en la BD
 * @param datos los datos a insertar
 */
export const insertarProductos = (datos) => {
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

/**
 * Modifica los datos en la BD
 * @param datos los datos a modificar
 * @param id el id del producto a modificar
 */
export const actualizarProducto = (datos, id) => {
    fetch(URL + `&accion=actualizar&id=${id}`, {
        method: 'POST',
        body: datos
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        return data;
    });
}

/**
 * Elimina un producto en la BD
 * @param id el id del producto a eliminar
 */
export const eliminarProducto = (id) => {
    fetch(URL + `&accion=eliminar&id=${id}`, {})
    .then(res => res.json())
    .then(data => {
        console.log(data);
        return data;
    });
}