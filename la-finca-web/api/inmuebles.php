<?php
// --- API para Gestión de Inmuebles (api/inmuebles.php) ---

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$pdo = null;

try {
    include 'conexion.php';
    $metodo = $_SERVER['REQUEST_METHOD'];
    $ruta_imagenes_servidor = '../imagenes/inmuebles/'; 

    switch ($metodo) {
        case 'GET':
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $stmt = $pdo->prepare("SELECT id, tipo, direccion, numero, piso, letra, codigo_postal, localidad, provincia, foto, observaciones FROM inmuebles WHERE id = ?");
                $stmt->execute([$id]);
                $resultado = $stmt->fetch();
                if ($resultado === false) {
                     throw new Exception("Inmueble no encontrado.");
                }
            } else {
                $stmt = $pdo->query("SELECT id, tipo, direccion, numero, piso, letra, codigo_postal, localidad, provincia, foto, observaciones FROM inmuebles");
                $resultado = $stmt->fetchAll();
            }
            echo json_encode(['exito' => true, 'datos' => $resultado]);
            break;

        case 'POST':
            $accion = $_POST['accion'] ?? 'crear';
            $tipo = $_POST['tipo'];
            $direccion = $_POST['direccion'];
            $numero = $_POST['numero'] ?? null;
            $piso = $_POST['piso'] ?? null;
            $letra = $_POST['letra'] ?? null;
            $codigo_postal = $_POST['codigo_postal'];
            $localidad = $_POST['localidad'];
            $provincia = $_POST['provincia'];
            $observaciones = $_POST['observaciones'] ?? null;
            $foto_nombre = $_POST['foto_actual'] ?? null; 

            if (isset($_FILES['foto']) && $_FILES['foto']['error'] == UPLOAD_ERR_OK) {
                $foto_nombre = time() . '_' . basename($_FILES['foto']['name']);
                $ruta_destino = $ruta_imagenes_servidor . $foto_nombre;
                if (!move_uploaded_file($_FILES['foto']['tmp_name'], $ruta_destino)) {
                    throw new Exception("Error al mover el archivo de imagen.");
                }
            }

            if ($accion == 'actualizar') {
                $id = $_POST['id_inmueble'];
                if (empty($id)) throw new Exception("ID de inmueble no proporcionado para actualizar.");
                $sql = "UPDATE inmuebles SET tipo = ?, direccion = ?, numero = ?, piso = ?, letra = ?, codigo_postal = ?, localidad = ?, provincia = ?, foto = ?, observaciones = ? WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$tipo, $direccion, $numero, $piso, $letra, $codigo_postal, $localidad, $provincia, $foto_nombre, $observaciones, $id]);
                echo json_encode(['exito' => true, 'mensaje' => 'Inmueble actualizado correctamente.']);
            } else {
                $sql = "INSERT INTO inmuebles (tipo, direccion, numero, piso, letra, codigo_postal, localidad, provincia, foto, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$tipo, $direccion, $numero, $piso, $letra, $codigo_postal, $localidad, $provincia, $foto_nombre, $observaciones]);
                echo json_encode(['exito' => true, 'mensaje' => 'Inmueble creado correctamente.']);
            }
            break;

        case 'DELETE':
            parse_str(file_get_contents("php://input"), $datos);
            $id = $datos['id'] ?? null;
            if (!$id) throw new Exception("ID de inmueble no proporcionado.");
            
            $stmt = $pdo->prepare("SELECT foto FROM inmuebles WHERE id = ?");
            $stmt->execute([$id]);
            $foto_a_borrar = $stmt->fetchColumn();
            if ($foto_a_borrar && file_exists($ruta_imagenes_servidor . $foto_a_borrar)) {
                unlink($ruta_imagenes_servidor . $foto_a_borrar);
            }

            $sql = "DELETE FROM inmuebles WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            echo json_encode(['exito' => true, 'mensaje' => 'Inmueble eliminado correctamente.']);
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

