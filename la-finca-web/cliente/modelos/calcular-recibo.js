/**
 * Función para calcular el total del recibo de un inmueble alquilado, incluyendo el IVA.
 * @param montoBaseAlquiler - El costo base mensual del alquiler (antes de impuestos).
 * @param aguaAlquiler - El cargo del servicio del agua.
 * @param luzAlquiler - El cargo del servicio de la luz.
 * @param expensasAlquiler - El cargo de las expensas.
 * @param impuestosAlquiler - El cargo de los impuestos
 * @param tasaIVA - El IVA
 * @param otrosAlquiler - Otros cargos del alquiler
 */
export async function calcularReciboAlquiler(montoBaseAlquiler, aguaAlquiler, luzAlquiler, expensasAlquiler, impuestosAlquiler, tasaIVA, otrosAlquiler) {
    // Variables para almacenar los montos
    let totalRecibo;

    // 1. Cálculo del IVA
    const alquilerMasIVA = montoBaseAlquiler * (1 + tasaIVA);

    // 2. Cálculo del total del recibo
    totalRecibo = alquilerMasIVA + aguaAlquiler + luzAlquiler + expensasAlquiler + impuestosAlquiler + otrosAlquiler;

    // Devuleve el total
    return totalRecibo;
}