-- Categorías iniciales
INSERT INTO categoria (nombre) VALUES ('Electrónica');
INSERT INTO categoria (nombre) VALUES ('Hogar');
INSERT INTO categoria (nombre) VALUES ('Ropa');
INSERT INTO categoria (nombre) VALUES ('Deportes');
INSERT INTO categoria (nombre) VALUES ('Libros');

-- Productos iniciales (15)
-- Suponiendo IDs de categorías del 1 al 5 según inserción
INSERT INTO producto (nombre, descripcion, precio, activo, categoria_id, stock, imagen_url) VALUES
('Smartphone X1', 'Pantalla 6.5" OLED, 128GB', 1299.99, true, 1, 10, NULL),
('Auriculares Bluetooth', 'Cancelación de ruido, batería 20h', 299.90, true, 1, 25, NULL),
('Cafetera Automática', 'Depósito 1.5L, 15 bares', 499.00, true, 2, 8, NULL),
('Licuadora Pro', 'Vaso de vidrio 1.8L, 1200W', 349.90, true, 2, 12, NULL),
('Camiseta Deportiva', 'Tela transpirable, talla M', 79.99, true, 3, 30, NULL),
('Chaqueta Impermeable', 'Resistente al agua, talla L', 199.50, true, 3, 5, NULL),
('Balón de Fútbol', 'Tamaño 5, cosido a mano', 129.00, true, 4, 20, NULL),
('Mancuernas 10kg', 'Juego de 2, recubrimiento caucho', 249.99, true, 4, 7, NULL),
('Libro: Java Básico', 'Introducción a Java y OOP', 59.90, true, 5, 50, NULL),
('Libro: Spring Boot', 'Guía práctica para microservicios', 89.00, true, 5, 18, NULL),
('Monitor 27"', 'QHD, 144Hz, IPS', 999.00, true, 1, 6, NULL),
('Teclado Mecánico', 'Switches rojos, retroiluminado', 249.00, true, 1, 15, NULL),
('Aspiradora', 'Robótica, WiFi', 899.00, true, 2, 4, NULL),
('Pantalón Jeans', 'Corte recto, talla 32', 139.00, true, 3, 22, NULL),
('Bicicleta Urbana', 'Aluminio, 7 velocidades', 1699.00, true, 4, 3, NULL);

-- Usuario administrador por defecto
--INSERT INTO users (nombre, email, password, rol, activo, fecha_creacion)
--VALUES ('Admin', 'admin@tienda.com', '$2a$10$jbqVYJPXUt8Kl4FyZlu4Te.xEdI135AYpHQB59oCXf4d1B/9ZXD3u', 'SUPER_ADMIN', true, NOW());