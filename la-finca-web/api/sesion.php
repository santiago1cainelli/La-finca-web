<?php
// --- API para Sesión de Usuario (api/sesion.php) ---

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$pdo = null;

try {
    include 'conexion.php'; // $pdo se crea aquí

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido.");
    }

    $datos = json_decode(file_get_contents('php://input'), true);
    if (!$datos || !isset($datos['correo']) || !isset($datos['clave'])) {
        http_response_code(400); // Bad Request
        throw new Exception("Datos incompletos.");
    }

    $correo = $datos['correo'];
    $clave = $datos['clave'];

    // Comparamos en texto plano, como se solicitó
    $stmt = $pdo->prepare("SELECT id, nombre, apellido, correo, rol FROM usuarios WHERE correo = ? AND clave = ?");
    $stmt->execute([$correo, $clave]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        // Inicio de sesión exitoso
        echo json_encode([
            'exito' => true, 
            'mensaje' => 'Inicio de sesión exitoso.',
            'rol' => $usuario['rol'],      // <-- NUEVO: Enviamos el rol
            'nombre' => $usuario['nombre'], // <-- NUEVO: Enviamos el nombre
            'id' => $usuario['id'] // <-- NUEVO: Enviamos el nombre
        ]);
    } else {
        // Credenciales incorrectas
        http_response_code(401); // Unauthorized
        echo json_encode(['exito' => false, 'mensaje' => 'Correo o contraseña incorrectos.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Error de base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    // Captura otros errores (400, 405, etc.)
    if (http_response_code() == 200) { // Si no se estableció un código de error http
        http_response_code(500);
    }
    echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
} finally {
    $pdo = null;
    exit;
}
?>

