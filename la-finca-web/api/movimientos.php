<?php
// --- API para Gestión de Movimientos (api/movimientos.php) ---

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$pdo = null;

try {
    include 'conexion.php'; // $pdo se crea aquí

    $metodo = $_SERVER['REQUEST_METHOD'];
    
    switch ($metodo) {
        // --- OBTENER (LEER) ---
        case 'GET':
            $accion = $_GET['accion'] ?? 'listar';

            if ($accion == 'listar_formularios') {
                // Obtenemos datos para los <select> del modal
                $stmt_inmuebles = $pdo->query("SELECT id, tipo, direccion FROM inmuebles");
                $inmuebles = $stmt_inmuebles->fetchAll(PDO::FETCH_ASSOC);
                
                $stmt_recibos = $pdo->query("SELECT id, fecha_emision, monto_total FROM recibos WHERE cobrado = 0");
                $recibos = $stmt_recibos->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode(['exito' => true, 'inmuebles' => $inmuebles, 'recibos' => $recibos]);

            } elseif (isset($_GET['id'])) {
                // Obtener un solo movimiento
                $id = $_GET['id'];
                $stmt = $pdo->prepare("SELECT * FROM movimientos_bancarios WHERE id = ?");
                $stmt->execute([$id]);
                $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($resultado === false) throw new Exception("Movimiento no encontrado.");
                echo json_encode(['exito' => true, 'datos' => $resultado]);

            } else {
                // Listar todos los movimientos
                $sql = "
                    SELECT 
                        m.id, m.fecha, m.tipo_movimiento, m.concepto, m.monto,
                        i.tipo, i.direccion
                    FROM movimientos_bancarios m
                    JOIN inmuebles i ON m.id_inmueble = i.id
                ";
                $stmt = $pdo->query($sql);
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['exito' => true, 'datos' => $resultado]);
            }
            break;

        // --- CREAR ---
        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO movimientos_bancarios (fecha, tipo_movimiento, id_inmueble, id_recibo, concepto, monto, banco, cuenta) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $datos['fecha'],
                $datos['tipo_movimiento'],
                $datos['id_inmueble'],
                empty($datos['id_recibo']) ? null : $datos['id_recibo'], // Manejar ID recibo opcional
                $datos['concepto'],
                $datos['monto'],
                $datos['banco'] ?? null,
                $datos['cuenta'] ?? null
            ]);
            echo json_encode(['exito' => true, 'mensaje' => 'Movimiento creado correctamente.']);
            break;

        // --- ACTUALIZAR ---
        case 'PUT':
            $datos = json_decode(file_get_contents('php://input'), true);
            $id = $datos['id'] ?? null;
            if (!$id) throw new Exception("ID de movimiento no proporcionado.");
            
            $sql = "UPDATE movimientos_bancarios SET 
                        fecha = ?, tipo_movimiento = ?, id_inmueble = ?, id_recibo = ?, 
                        concepto = ?, monto = ?, banco = ?, cuenta = ?
                    WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $datos['fecha'],
                $datos['tipo_movimiento'],
                $datos['id_inmueble'],
                empty($datos['id_recibo']) ? null : $datos['id_recibo'],
                $datos['concepto'],
                $datos['monto'],
                $datos['banco'] ?? null,
                $datos['cuenta'] ?? null,
                $id
            ]);
            echo json_encode(['exito' => true, 'mensaje' => 'Movimiento actualizado correctamente.']);
            break;

        // --- ELIMINAR ---
        case 'DELETE':
            parse_str(file_get_contents("php://input"), $datos_delete);
            $id = $datos_delete['id'] ?? null;
            if (!$id) throw new Exception("ID de movimiento no proporcionado.");
            
            $sql = "DELETE FROM movimientos_bancarios WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            echo json_encode(['exito' => true, 'mensaje' => 'Movimiento eliminado correctamente.']);
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
