import { actualizarProducto, eliminarProducto, insertarProductos, seleccionarProductos } from "../models/productos.js";
import { insertarPedidos, insertarDetallePedidos } from "../models/pedidos.js";
// Objetos del DOM
const listado = document.querySelector('#listado');
const alerta = document.querySelector('#alerta');

// Formulario
const formulario = document.querySelector('#formulario');
const formularioModal = new bootstrap.Modal(document.querySelector('#formularioModal'));
const btnNuevo = document.querySelector('#btnNuevo');

// Inputs
const inputCodigo = document.querySelector('#codigo');
const inputNombre = document.querySelector('#nombre');
const inputDescripcion = document.querySelector('#descripcion');
const inputPrecio = document.querySelector('#precio');
const inputImagen = document.querySelector('#imagen');

// Imagen del formulario
const frmImagen = document.querySelector('#frmImagen');

// Variables
let buscar = '';
let opcion = '';
let id;
let mensajeAlerta;
let productos = [];
let productosFiltrados = [];
let producto = {};
let pedido = false;
let pedido_id = 0; // ID del pedido actual
let detallePedido = {
    pedidos_id: 0,
    productos_id: 0,
    cantidad: 0
};

// Control de usuario
let usuario = '';
let usuario_id = '';
let logueado = false;


/**
 * Método que se ejecuta
 * cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    productos = await obtenerProductos();
    productosFiltrados = filtrarPorNombre('');
    mostrarProductos();
});

/**
 * Controla si el usuario está logueado
 */
const controlUsuario = () => {
    if(sessionStorage.getItem('usuario')) {
        usuario = sessionStorage.getItem('usuario');
        usuario_id = sessionStorage.getItem('usuario_id');
        logueado = true;
    } else {
        logueado = false;
    }
    if(logueado) {
        btnNuevo.style.display = 'inline';
    } else {
        btnNuevo.style.display = 'none';
    }
};

/**
 * Obtiene los productos
 */
async function obtenerProductos() {
    productos = await seleccionarProductos();
    return productos;
}

/**
 * Filtra los productos por nombre
 * @param n el nombre del producto
 * @return productos filtrados
 */
function filtrarPorNombre(n) {
    productosFiltrados = productos.filter(items => items.nombre.includes(n));
    return productosFiltrados;
}

/**
 * Muestra los productos  *
 */
function mostrarProductos() {
  listado.innerHTML = '';
    productosFiltrados.map(producto =>
      (listado.innerHTML += `
                <div class="col">
                    <div class="card" style="width: 18rem;">
                        <img src="./imagenes/productos/${producto.imagen??'nodisponible.png'}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">
                                <span name="spancodigo">${producto.codigo}</span> - <span name="spannombre">${producto.nombre}</span>
                            </h5>
                            <p class="card-text">
                                <img src="./imagenes/memory.svg">
                                <img src="./imagenes/storage.svg">
                                <img src="./imagenes/photo_camera.svg">
                                <img src="./imagenes/aod.svg"><br>                                
                            </p>
                            <div class="div-descripcion">
                                ${producto.descripcion}
                            </div>
                            <h5>$ <span name="spanprecio">${producto.precio}.-</span></h5>
                            
                        </div>
                        <div class="card-footer ${logueado?'d-flex':'d-none'}">
                            <button class="btn btn-info btnCarrito">Agregar al carrito</button>
                            <a class="btnEditar btn btn-primary">Editar</a>
                            <a class="btnBorrar btn btn-danger">Borrar</a> 
                            <input type="hidden" class="idProducto" value="${producto.id}">                            
                        </div>
                    </div>
                </div>   
    `)
  );
}

/**
 * Filtro de los productos
 */
const botonesFiltros = document.querySelectorAll('#filtros button');
botonesFiltros.forEach(boton => {
    boton.addEventListener('click', e => {
        boton.classList.add('active');
        boton.setAttribute('aria-current', 'page');

        botonesFiltros.forEach(otroBoton => {
            if(otroBoton !== boton) {
                otroBoton.classList.remove('active');
                otroBoton.removeAttribute('aria-current');
            }
        });

        buscar = boton.innerHTML;
        if(buscar == 'Todos') {
            buscar = '';
        }
        filtrarPorNombre(buscar);
        mostrarProductos();
    })
})


/**
 * Ejecuta el clic del botón Nuevo
 */
btnNuevo.addEventListener('click', () => {
    // Limpiamos los inputs
    inputCodigo.value = null;
    inputNombre.value = null;
    inputDescripcion.value = null;
    inputPrecio.value = null;
    inputImagen.value = null;
    // Colocamos la imagen nodisponible
    frmImagen.src = './imagenes/productos/nodisponible.png';

    // Mostramos el formulario
    formularioModal.show();

    opcion = 'insertar';
})

/**
 * Ejecuta el evento submit del formulario
 */
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Previene la acción por defecto

    const datos = new FormData(formulario); // Guarda los datos del formulario
    console.log(datos);
    switch (opcion) {
        case 'insertar':
            insertarProductos(datos);
            mensajeAlerta = '¡Datos guardados!';
            break;

        case 'actualizar':
            actualizarProducto(datos, id);
            mensajeAlerta = '¡Datos actualizados!';
            break;
    }
    insertarAlerta(mensajeAlerta, 'success');
    mostrarProductos();
})

/**
 * Define el mensaje de alerta
 * @param mensaje el mensaje a mostrar
 * @param tipo el tipo de mensaje
 */
const insertarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alerta.append(envoltorio);
}

/**
 * Función para determinar en qué elemento se realiza un evento
 * @param elemento el elemento al que se realiza el evento
 * @param evento el evento realizado
 * @param selector el selector seleccionado
 * @param manejador el método que maneja el evento
 */
const on = (elemento, evento, selector, manejador) => {
    elemento.addEventListener(evento, (e) => {
        if(e.target.closest(selector)) {
            manejador(e);
        }
    })
}

/**
 * Función para el botón Editar
 */
on(document, 'click', '.btnEditar', e => {
    const cardFooter = e.target.parentNode; // Guardamos el elemento padre del botón
    id = cardFooter.querySelector('.idProducto').value; // Obtenemos el id
    producto = productos.find(item => item.id == id); // Buscamos el producto
    
    // Asignamos los valores a los input
    inputCodigo.value = producto.codigo;
    inputNombre.value = producto.nombre;
    inputDescripcion.value = producto.descripcion;
    inputPrecio.value = producto.precio;
    frmImagen.src = `./imagenes/productos/${producto.imagen??'nodisponible.png'}`;

    formularioModal.show();
    opcion = 'actualizar';
})

/**
 * Funcion para el botón Borrar
 */
on(document, 'click', '.btnBorrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.idProducto').value;
    producto = productos.find(item => item.id == id);

    let aceptar = confirm(`¿Realmente desea eliminar a ${producto.nombre}?`);

    if ( aceptar ) {
        eliminarProducto(id);
        insertarAlerta(`${producto.nombre} borrado!!`, 'danger');
        mostrarProductos();
    }
})

/**
 * Agregar productos al carito
 */
on(document, 'click', '.btnCarrito', async e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.idProducto').value;
    producto = productos.find(item => item.id == id);
    detallePedido = {
        pedidos_id: pedido_id,
        productos_id: producto.id,
        cantidad: 1
    };

    if (localStorage.getItem('pedido_id')){
        pedido_id = localStorage.getItem('pedido_id');
        pedido = true;
    }

    if (!pedido) {
        const datosPedido = {
            clientes_id: usuario_id,
            fecha: new Date().toISOString().slice(0, 10),
        }
        console.log(datosPedido);
        
        try {
            // Usamos 'await' para esperar la respuesta del servidor
            const response = await insertarPedidos(datosPedido);
            if (response && response.success && response.pedido_id) { // 👈🏻 Verificamos si existe la propiedad
                pedido_id = response.pedido_id;
                localStorage.setItem('pedido_id', pedido_id); // Guardamos el id del pedido en localStorage 
                detallePedido.pedidos_id = pedido_id;
                insertarDetallePedidos(detallePedido);
                pedido = true;
            } else {
                // Si no se obtuvo una respuesta válida o el servidor devolvió un error
                console.error('Error del servidor:', response.message);
            }            
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
        }
    } else {
        detallePedido.pedidos_id = pedido_id; // Asignamos el id del pedido al detalle
        insertarDetallePedidos(detallePedido);        
    }
    insertarAlerta(`Producto ${producto.nombre} agregado al carrito`, 'success');
    
})