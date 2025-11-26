<?php
// --- API para Gestión de Usuarios (Registro) (api/usuarios.php) ---

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$pdo = null;

try {
    include 'conexion.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // --- CAMBIO: Leemos JSON en lugar de $_POST ---
        $datos = json_decode(file_get_contents('php://input'), true);
        
        $nombre = $datos['nombre'] ?? '';
        $apellido = $datos['apellido'] ?? '';
        $correo = $datos['correo'] ?? '';
        $clave = $datos['clave'] ?? ''; // Guardar en texto plano

        if (empty($nombre) || empty($apellido) || empty($correo) || empty($clave)) {
            throw new Exception("Todos los campos son requeridos.");
        }

        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE correo = ?");
        $stmt->execute([$correo]);
        if ($stmt->fetch()) {
            throw new Exception("El correo electrónico ya está registrado.");
        }

        $sql = "INSERT INTO usuarios (nombre, apellido, correo, clave) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nombre, $apellido, $correo, $clave]);
        
        echo json_encode(['exito' => true, 'mensaje' => 'Usuario registrado exitosamente.']);

    } else {
        http_response_code(405);
        echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Error de base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(400); // Bad Request
    echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]); // Mensaje de error directo
} finally {
    $pdo = null;
    exit;
}
?>

