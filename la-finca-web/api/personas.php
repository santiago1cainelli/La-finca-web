<?php
// --- API para Gestión de Personas (api/personas.php) ---

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$pdo = null;

try {
    include 'conexion.php';
    $metodo = $_SERVER['REQUEST_METHOD'];
    $datos = json_decode(file_get_contents('php://input'), true);

    switch ($metodo) {
        case 'GET':
             if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $stmt = $pdo->prepare("SELECT id, nombre, apellido, dni, correo, telefono FROM personas WHERE id = ?");
                $stmt->execute([$id]);
                $resultado = $stmt->fetch();
                if ($resultado === false) {
                     throw new Exception("Persona no encontrada.");
                }
            } else {
                $stmt = $pdo->query("SELECT id, nombre, apellido, dni, correo, telefono FROM personas");
                $resultado = $stmt->fetchAll();
            }
            echo json_encode(['exito' => true, 'datos' => $resultado]);
            break;

        case 'POST':
            $sql = "INSERT INTO personas (nombre, apellido, dni, correo, telefono) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $datos['nombre'],
                $datos['apellido'],
                $datos['dni'],
                $datos['correo'] ?? null,
                $datos['telefono'] ?? null
            ]);
            echo json_encode(['exito' => true, 'mensaje' => 'Persona creada correctamente.']);
            break;

        case 'PUT':
            $sql = "UPDATE personas SET nombre = ?, apellido = ?, dni = ?, correo = ?, telefono = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $datos['nombre'],
                $datos['apellido'],
                $datos['dni'],
                $datos['correo'] ?? null,
                $datos['telefono'] ?? null,
                $datos['id']
            ]);
            echo json_encode(['exito' => true, 'mensaje' => 'Persona actualizada correctamente.']);
            break;

        case 'DELETE':
            parse_str(file_get_contents("php://input"), $datos_delete);
            $id = $datos_delete['id'] ?? null;
            if (!$id) throw new Exception("ID de persona no proporcionado.");
            $sql = "DELETE FROM personas WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            echo json_encode(['exito' => true, 'mensaje' => 'Persona eliminada correctamente.']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.']);
            break;
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Error de base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
} finally {
    $pdo = null;
    exit;
}
?>