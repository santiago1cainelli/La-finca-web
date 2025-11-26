<?php
// --- API para Gestión de Recibos (api/recibos.php) ---

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar la solicitud preliminar OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$pdo = null;

try {
    // 1. Incluir y establecer la conexión
    include 'conexion.php'; // $pdo se crea aquí

    $metodo = $_SERVER['REQUEST_METHOD'];
    
    // 2. Lógica de la API
    switch ($metodo) {
        // --- OBTENER (LEER) ---
        case 'GET':
            $accion = $_GET['accion'] ?? 'listar';

            if ($accion == 'listar_alquileres') {
                // Obtenemos solo las operaciones de alquiler para el formulario
                $sql = "
                    SELECT op.id, p.nombre, p.apellido, p.id_usuario, i.tipo, i.direccion
                    FROM operaciones op
                    JOIN personas p ON op.id_persona = p.id
                    JOIN inmuebles i ON op.id_inmueble = i.id
                    WHERE op.tipo_operacion = 'Alquiler'
                ";
                $stmt = $pdo->query($sql);
                $alquileres = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['exito' => true, 'datos' => $alquileres]);

            } elseif (isset($_GET['id'])) {
                // Obtener un solo recibo por ID
                $id = $_GET['id'];
                $stmt = $pdo->prepare("SELECT * FROM recibos WHERE id = ?");
                $stmt->execute([$id]);
                $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($resultado === false) {
                     throw new Exception("Recibo no encontrado.");
                }
                echo json_encode(['exito' => true, 'datos' => $resultado]);

            } else {
                // Listar todos los recibos
                $sql = "
                    SELECT 
                        r.id, r.fecha_emision, r.monto_total, r.cobrado,
                        -- CAMPOS AGREGADOS PARA EL CÁLCULO EN EL FRONTEND --
                        r.agua, r.luz, r.expensas, r.impuestos, r.iva, r.otros,
                        op.id AS id_operacion,
                        p.nombre, p.apellido, p.id_usuario,
                        i.tipo, i.direccion
                    FROM recibos r
                    JOIN operaciones op ON r.id_operacion = op.id
                    JOIN personas p ON op.id_persona = p.id
                    JOIN inmuebles i ON op.id_inmueble = i.id
                ";
                $stmt = $pdo->query($sql);
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['exito' => true, 'datos' => $resultado]);
            }
            break;

        // --- CREAR ---
        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO recibos (id_operacion, fecha_emision, monto_total, agua, luz, expensas, impuestos, iva, otros, cobrado) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $datos['id_operacion'],
                $datos['fecha_emision'],
                $datos['monto_total'],
                $datos['agua'] ?? 0,
                $datos['luz'] ?? 0,
                $datos['expensas'] ?? 0,
                $datos['impuestos'] ?? 0,
                $datos['iva'] ?? 0,
                $datos['otros'] ?? 0,
                $datos['cobrado'] ? 1 : 0 // Convertir booleano a 1 o 0
            ]);
            echo json_encode(['exito' => true, 'mensaje' => 'Recibo creado correctamente.']);
            break;

        // --- ACTUALIZAR ---
        case 'PUT':
            $datos = json_decode(file_get_contents('php://input'), true);
            $id = $datos['id'] ?? null;
            if (!$id) throw new Exception("ID de recibo no proporcionado.");
            
            $sql = "UPDATE recibos SET 
                        id_operacion = ?, fecha_emision = ?, monto_total = ?, 
                        agua = ?, luz = ?, expensas = ?, impuestos = ?, iva = ?, otros = ?, cobrado = ?
                    WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $datos['id_operacion'],
                $datos['fecha_emision'],
                $datos['monto_total'],
                $datos['agua'] ?? 0,
                $datos['luz'] ?? 0,
                $datos['expensas'] ?? 0,
                $datos['impuestos'] ?? 0,
                $datos['iva'] ?? 0,
                $datos['otros'] ?? 0,
                $datos['cobrado'] ? 1 : 0,
                $id
            ]);
            echo json_encode(['exito' => true, 'mensaje' => 'Recibo actualizado correctamente.']);
            break;

        // --- ELIMINAR ---
        case 'DELETE':
            parse_str(file_get_contents("php://input"), $datos_delete);
            $id = $datos_delete['id'] ?? null;
            if (!$id) throw new Exception("ID de recibo no proporcionado.");
            
            $sql = "DELETE FROM recibos WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            echo json_encode(['exito' => true, 'mensaje' => 'Recibo eliminado correctamente.']);
            break;

        default:
            http_response_code(405); // Método no permitido
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
    $pdo = null; // Cerrar la conexión
    exit;
}
?>