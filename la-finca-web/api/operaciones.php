<?php
// --- API para Gestión de Operaciones (api/operaciones.php) ---

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$pdo = null;

try {
    include 'conexion.php';
    $metodo = $_SERVER['REQUEST_METHOD'];
    
    switch ($metodo) {
        case 'GET':
            $accion = $_GET['accion'] ?? 'listar'; 
            if ($accion == 'listar_para_formulario') {
                $stmt_personas = $pdo->query("SELECT id, nombre, apellido, dni, id_usuario FROM personas");
                $personas = $stmt_personas->fetchAll();
                $stmt_inmuebles = $pdo->query("SELECT id, tipo, direccion FROM inmuebles");
                $inmuebles = $stmt_inmuebles->fetchAll();
                echo json_encode([
                    'exito' => true, 
                    'datos' => [
                        'personas' => $personas,
                        'inmuebles' => $inmuebles
                    ]
                ]);
            } else {
                $sql = "
                    SELECT 
                        op.id,
                        op.tipo_operacion,
                        op.monto,
                        op.fecha_operacion,
                        p.nombre AS persona_nombre,
                        p.apellido AS persona_apellido,
                        p.id_usuario AS persona_id_usuario,
                        i.tipo AS inmueble_tipo,
                        i.direccion AS inmueble_direccion
                    FROM operaciones op
                    JOIN personas p ON op.id_persona = p.id
                    JOIN inmuebles i ON op.id_inmueble = i.id
                ";
                $stmt = $pdo->query($sql);
                $resultado = $stmt->fetchAll();
                echo json_encode(['exito' => true, 'datos' => $resultado]);
            }
            break;

        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO operaciones (id_persona, id_inmueble, tipo_operacion, monto, fecha_operacion) 
                    VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $datos['id_persona'],
                $datos['id_inmueble'],
                $datos['tipo_operacion'],
                $datos['monto'],
                $datos['fecha_operacion']
            ]);
            echo json_encode(['exito' => true, 'mensaje' => 'Operación registrada correctamente.']);
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

