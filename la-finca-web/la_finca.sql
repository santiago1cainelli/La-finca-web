-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-11-2025 a las 22:28:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `la_finca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inmuebles`
--

CREATE TABLE `inmuebles` (
  `id` int(11) NOT NULL,
  `tipo` enum('Local','Departamento','Casa','Terreno') NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `numero` int(11) DEFAULT NULL,
  `piso` varchar(10) DEFAULT NULL,
  `letra` varchar(10) DEFAULT NULL,
  `codigo_postal` varchar(20) NOT NULL,
  `localidad` varchar(100) NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inmuebles`
--

INSERT INTO `inmuebles` (`id`, `tipo`, `direccion`, `numero`, `piso`, `letra`, `codigo_postal`, `localidad`, `provincia`, `foto`, `observaciones`) VALUES
(2, 'Local', 'Calle Falsa', 123, '', '', '2000', 'Rosario', 'Santa Fe', '1763938247_local-en-calle-falsa.jpeg', ''),
(3, 'Departamento', 'Bv. Urquiza', 345, '', '', '2200', 'San Lorenzo', 'Santa Fe', '1763938258_departamento.jpeg', ''),
(4, 'Casa', 'Av. Siempre Viva', 742, '', '', '2200', 'San Lorenzo', 'Santa Fe', '1763938263_casa av siempre viva.jpeg', 'Sin observaciones.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_bancarios`
--

CREATE TABLE `movimientos_bancarios` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `tipo_movimiento` enum('Ingreso','Gasto') NOT NULL,
  `id_inmueble` int(11) NOT NULL,
  `id_recibo` int(11) DEFAULT NULL COMMENT 'ID del recibo si el ingreso es por alquiler',
  `concepto` varchar(255) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `banco` varchar(100) DEFAULT NULL,
  `cuenta` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos_bancarios`
--

INSERT INTO `movimientos_bancarios` (`id`, `fecha`, `tipo_movimiento`, `id_inmueble`, `id_recibo`, `concepto`, `monto`, `banco`, `cuenta`) VALUES
(1, '2025-11-05', 'Ingreso', 3, 1, 'Cobro alquiler Noviembre', 62000.00, 'Banco Municipal', NULL),
(2, '2025-11-03', 'Gasto', 4, NULL, 'Reparación plomería', -8500.00, 'Banco Municipal', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `operaciones`
--

CREATE TABLE `operaciones` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `id_inmueble` int(11) NOT NULL,
  `tipo_operacion` enum('Alquiler','Venta','Compra') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_operacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `operaciones`
--

INSERT INTO `operaciones` (`id`, `id_persona`, `id_inmueble`, `tipo_operacion`, `monto`, `fecha_operacion`) VALUES
(1, 1, 3, 'Alquiler', 50000.00, '2025-10-01'),
(4, 1, 2, 'Alquiler', 1000.00, '2025-06-06'),
(5, 2, 2, 'Venta', 999.99, '2025-02-21'),
(6, 1, 2, 'Venta', 545.00, '2025-02-22'),
(7, 2, 3, 'Alquiler', 600.20, '2024-04-04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `correo` varchar(191) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id`, `nombre`, `apellido`, `dni`, `correo`, `telefono`, `fecha_registro`, `id_usuario`) VALUES
(1, 'Carlos', 'Gomez', '30123456', 'carlos@gmail.com', '3476123966', '2025-10-25 17:17:40', 3),
(2, 'Ana', 'Lopez', '35789123', 'ana.lopez@email.com', '3419876543', '2025-10-25 17:17:40', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibos`
--

CREATE TABLE `recibos` (
  `id` int(11) NOT NULL,
  `id_operacion` int(11) NOT NULL,
  `fecha_emision` date NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `agua` decimal(10,2) DEFAULT 0.00,
  `luz` decimal(10,2) DEFAULT 0.00,
  `expensas` decimal(10,2) DEFAULT 0.00,
  `impuestos` decimal(10,2) DEFAULT 0.00,
  `iva` decimal(10,2) DEFAULT 0.00,
  `otros` decimal(10,2) DEFAULT 0.00,
  `cobrado` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = Pendiente, 1 = Cobrado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recibos`
--

INSERT INTO `recibos` (`id`, `id_operacion`, `fecha_emision`, `monto_total`, `agua`, `luz`, `expensas`, `impuestos`, `iva`, `otros`, `cobrado`) VALUES
(1, 1, '2025-11-01', 6000.00, 2000.00, 3000.00, 7000.00, 0.00, 0.00, 0.00, 0),
(3, 1, '2025-10-21', 600.00, 100.00, 100.00, 55.00, 100.00, 1.36, 0.00, 1),
(4, 7, '2025-04-04', 1000.00, 600.00, 455.00, 0.00, 0.00, 0.00, 100.00, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(191) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `rol` enum('admin','secretario','cliente') NOT NULL DEFAULT 'cliente',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `correo`, `clave`, `rol`, `fecha_registro`) VALUES
(1, 'Administrador', '', 'admin@lafinca.com', '1234', 'admin', '2025-10-28 19:52:48'),
(2, 'Secretario', '', 'secretario@lafinca.com', '4321', 'secretario', '2025-10-28 19:52:48'),
(3, 'Carlos', 'Lopez', 'carlos@gmail.com', '1234', 'cliente', '2025-10-28 19:52:48');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inmuebles`
--
ALTER TABLE `inmuebles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos_bancarios`
--
ALTER TABLE `movimientos_bancarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_inmueble` (`id_inmueble`),
  ADD KEY `id_recibo` (`id_recibo`);

--
-- Indices de la tabla `operaciones`
--
ALTER TABLE `operaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `id_inmueble` (`id_inmueble`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `recibos`
--
ALTER TABLE `recibos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_operacion` (`id_operacion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inmuebles`
--
ALTER TABLE `inmuebles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `movimientos_bancarios`
--
ALTER TABLE `movimientos_bancarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `operaciones`
--
ALTER TABLE `operaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `personas`
--
ALTER TABLE `personas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `recibos`
--
ALTER TABLE `recibos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movimientos_bancarios`
--
ALTER TABLE `movimientos_bancarios`
  ADD CONSTRAINT `movimientos_bancarios_ibfk_1` FOREIGN KEY (`id_inmueble`) REFERENCES `inmuebles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `movimientos_bancarios_ibfk_2` FOREIGN KEY (`id_recibo`) REFERENCES `recibos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `operaciones`
--
ALTER TABLE `operaciones`
  ADD CONSTRAINT `operaciones_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `operaciones_ibfk_2` FOREIGN KEY (`id_inmueble`) REFERENCES `inmuebles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `recibos`
--
ALTER TABLE `recibos`
  ADD CONSTRAINT `recibos_ibfk_1` FOREIGN KEY (`id_operacion`) REFERENCES `operaciones` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
