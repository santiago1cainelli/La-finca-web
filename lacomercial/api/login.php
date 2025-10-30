<?php
// Requerimos la clase Modelo
require_once 'modelos.php';

$valores = $_POST;

$usuario = "'".$valores['usuario']."'";
$password = "'".$valores['password']."'";

$usuarios = new Modelo('clientes');

$usuarios->setCriterio("usuario=$usuario AND password=$password");

$datos = $usuarios->seleccionar();

echo $datos;
?>