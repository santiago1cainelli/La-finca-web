import { seleccionarPedidos, seleccionarDetallePedidos, seleccionarVistaPedidos, insertarPedidos, insertarDetallePedidos, actualizarDetalle_Pedido } from "../models/pedidos.js";
// Objetos del DOM
const listado = document.querySelector('#listado');
const alerta = document.querySelector('#alerta');
const spanUsuario = document.querySelector('#span-usuario');
const idPedidoSpan = document.querySelector('#id-pedido');
const totalSpan = document.querySelector('#total');

// Variables
let pedido_id = 0;
let pedidos = [];
let pedido = {};
let detallesPedido = [];
let detallePedido = {};
let vistaDetallesPedido = [];
let vistaDetallePedido = {};

let total = 0;

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
    pedidos = await obtenerPedidos();
    vistaDetallesPedido = await obtenerVistaDetallesPedidos();
    detallesPedido = await obtenerDetallesPedidos();
    mostrarPedidos();

});

/**
 * Controla si el usuario está logueado
 */
const controlUsuario = () => {
    if(sessionStorage.getItem('usuario')) {
        usuario = sessionStorage.getItem('usuario');
        usuario_id = sessionStorage.getItem('usuario_id');
        spanUsuario.textContent = usuario;
        logueado = true;
    } else {
        logueado = false;
    }
    if(logueado) {
       
    } else {
       
    }
};

/**
 * Obtiene los pedidos del usuario
 */
async function obtenerPedidos() {
    pedido_id = localStorage.getItem('pedido_id');
    pedidos = await seleccionarPedidos();
    console.log(pedidos);
    return pedidos; 
}

/**
 * Obtiene los detalles completos de los pedidos
 */
async function obtenerVistaDetallesPedidos() {
    pedido_id = localStorage.getItem('pedido_id');
    vistaDetallesPedido = await seleccionarVistaPedidos(pedido_id);
    console.log(vistaDetallesPedido);
    return vistaDetallesPedido; 
}

/**
 * Obtiene los detalles de los pedidos
 */
async function obtenerDetallesPedidos() {
    pedido_id = localStorage.getItem('pedido_id');
    detallesPedido = await seleccionarVistaPedidos(pedido_id);
    console.log(detallesPedido);
    return detallesPedido; 
}


/** 
 * Muestra los pedidos en el DOM
 */ 
function mostrarPedidos() {
    idPedidoSpan.textContent = pedido_id;
    console.log(vistaDetallesPedido);
    if(vistaDetallesPedido.length > 0) {
        listado.innerHTML = '';
        vistaDetallesPedido.forEach(pedido => {
            
                listado.innerHTML += `
                    <tr>
                        <td>${pedido.codigo}</td>
                        <td>${pedido.nombre}</td>
                        <td><input type="number" id="cantidad-${pedido.id}" value="${pedido.cantidad}" class="cantidad" /></td>
                        <td><span id="precio-${pedido.id}">${pedido.precio}</span> </td>
                        <td><span id="importe-${pedido.id}">${pedido.importe}</span> </td>
                    </tr>
                `;
            total += parseFloat(pedido.importe) ;    
            
        });
        console.log(total);
        totalSpan.textContent = total.toFixed(2);
    }
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
 * Función para la cantidad
 */
on(document, 'change', '.cantidad', (e) => {
    e.preventDefault();
    const elemento = e.target;
    const id = elemento.id.split('-')[1];
    const cantidad = parseInt(elemento.value);
    console.log(id);
    console.log(cantidad);
    if(cantidad < 1) {
        elemento.value = 1;
        return;
    }
    // Actualizar el importe
    const precio = parseFloat(document.querySelector(`#precio-${id}`).textContent);
    const importe = cantidad * precio;
    document.querySelector(`#importe-${id}`).textContent = importe.toFixed(2);
    // Actualizar el detallePedido
    detallePedido = detallesPedido.find(detalle => detalle.id == id);
    detallePedido.cantidad = cantidad;
    detallePedido.importe = importe;
    console.log(detallePedido);
    // Actualizar el total
    total = 0;
    detallesPedido.forEach(detalle => {
        total += parseFloat(detalle.importe);
    });
    totalSpan.textContent = total.toFixed(2);
    // Actualizar en la base de datos
    actualizarDetalle_Pedido(detallePedido, id);
});