<?php
// --- Archivo de Conexión a la Base de Datos (api/conexion.php) ---

// Parámetros de conexión a la base de datos 'la_finca'
$dsn = 'mysql:host=localhost;dbname=la_finca;charset=utf8mb4';
$usuario = 'root';
$clave = ''; // <-- ¡REVISAR! Esta es la causa más probable del error.
            // Asegúrate de que esta sea la clave correcta para tu 'root' en MySQL.
            // En XAMPP por defecto es vacía ('').

// Opciones de PDO para un mejor manejo de errores
$opciones = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lanza excepciones en lugar de errores fatales
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Devuelve los resultados como arrays asociativos
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// Creamos la instancia de PDO.
// No usamos try-catch aquí para que el error sea capturado
// por el script que incluye este archivo.
$pdo = new PDO($dsn, $usuario, $clave, $opciones);
?>

