// URL para acceder a la API
const URL = './api/datos.php?tabla=';

// Función auxiliar para convertir el objeto a formato de formulario
const serialize = (obj) => {
    let str = [];
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
}

/**
 * Selecciona los pedidos de la BD
 */
export async function seleccionarPedidos() {
    let nuevaURL = URL;
    if(localStorage.getItem('pedido_id')) {
        const pedido_id = localStorage.getItem('pedido_id');
        nuevaURL += `pedidos&accion=seleccionar&id=${pedido_id}`;
    } else {
        nuevaURL += 'pedidos&accion=seleccionar';
    }
    let res = await fetch(nuevaURL);
    let datos = await res.json();
    if(res.status !== 200) {
        throw Error('Los datos no se encontraron');
    }
    return datos;
}

/**
 * Selecciona los detalle_pedidos de la BD
 */
export async function seleccionarDetallePedidos(idPedido) {
    let res = await fetch(`${URL}detalle_pedidos&accion=seleccionar&criterio=pedidos_id=${idPedido}`);
    let datos = await res.json();
    if(res.status !== 200) {
        throw Error('Los datos no se encontraron');
    }
    return datos;
}

/**
 * Selecciona la vista de pedidos
 */
export async function seleccionarVistaPedidos(idPedido) {
    let res = await fetch(`${URL}vta_pedidos&accion=seleccionar&criterio=pedidos_id=${idPedido}`);
    let datos = await res.json();
    if(res.status !== 200) {        
        throw Error('Los datos no se encontraron');
    }
    return datos;
}

/**
 * Inserta los datos en la BD
 * @param datos los datos a insertar
 * @return pedidoId el ID del pedido insertado
 */
export const insertarPedidos = (datos) => {
    // Convertimos el objeto 'datos' a una cadena de formulario
    const serializedData = serialize(datos);
    return fetch(`${URL}pedidos&accion=insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // 👈🏻 ¡Este es el Content-Type correcto!
        },
        body: serializedData
    })
    .then(res => {
        // Asegúrate de que la respuesta sea exitosa (200 OK)
        if (!res.ok) {
            throw new Error('La respuesta de la red no fue correcta');
        }
        return res.json();
    })
    .catch(error => {
        // Manejamos cualquier error de red o de la promesa.
        console.error('Error en la solicitud:', error);
        return null; // Devolvemos null en caso de error para que 'response' no sea undefined
    });
}

/**
 * Inserta los datos en la BD
 * @param datos los datos a insertar
 */
export const insertarDetallePedidos = (datos) => {
    const serializedData = serialize(datos);
    fetch(`${URL}detalle_pedidos&accion=insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // 👈🏻 ¡Este es el Content-Type correcto!
        },
        body: serializedData
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
 * @param id el id del pedido a modificar
 */
export const actualizarPedido = (datos, id) => {
    fetch(`${URL}pedidos&accion=actualizar&id=${id}`, {
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
 * @param id el id del detalle_pedido a modificar
 */
export const actualizarDetalle_Pedido = (datos, id) => {
    fetch(`${URL}detalle_pedidos&accion=actualizar&id=${id}`, {
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
 * Elimina un pedido en la BD
 * @param id el id del pedido a eliminar
 */
export const eliminarPedido = (id) => {
    fetch(`${URL}pedidos&accion=eliminar&id=${id}`, {})
    .then(res => res.json())
    .then(data => {
        console.log(data);
        return data;
    });
}

/**
 * Elimina un detalle_pedido en la BD
 * @param id el id del pedido a eliminar
 */
export const eliminarDetallePedido = (id) => {
    fetch(`${URL}detalle_pedidos&accion=eliminar&id=${id}`, {})
    .then(res => res.json())
    .then(data => {
        console.log(data);
        return data;
    });
}