-- ===========================================
-- CATEGORÍAS
-- ===========================================
INSERT INTO categoria (nombre) VALUES ('Hombre');
INSERT INTO categoria (nombre) VALUES ('Mujer');
INSERT INTO categoria (nombre) VALUES ('Ninos');
INSERT INTO categoria (nombre) VALUES ('Accesorios');

-- ===========================================
-- PRODUCTOS
-- ===========================================
INSERT INTO producto (nombre, descripcion, precio, activo, categoria_id, stock, imagen_url) VALUES
-- Hombre (1)
('Camisa a cuadros', 'Camisa manga larga de algodon, estilo casual, talla M', 16990.00, true, 1, 10, '/uploads/Producto-5.png'),
('Polera deportiva Nike', 'Polera gris de secado rapido, ideal para entrenamiento', 19990.00, true, 1, 12, '/uploads/Producto-6.png'),
('Cortaviento Columbia', 'Chaqueta ligera bicolor, resistente al agua', 29990.00, true, 1, 8, '/uploads/Producto-7.png'),
('Polerón azul con botones', 'Poleron abotonado con capucha, tela gruesa, talla L', 25990.00, true, 1, 6, '/uploads/Producto-10.png'),

-- Mujer (2)
('Top rojo animal print', 'Top ajustado rojo con estampado de tigre, manga larga', 17990.00, true, 2, 9, '/uploads/Producto-8.png'),
('Blusa floral negra', 'Blusa manga larga con diseño floral y escote tipo off-shoulder', 15990.00, true, 2, 10, '/uploads/Producto-9.png'),
('Blusa floral corta', 'Blusa de verano con nudo frontal y estampado de flores', 13990.00, true, 2, 14, '/uploads/Producto-11.png'),
('Jardinera denim', 'Jardinera corta de mezclilla azul, botones frontales', 21990.00, true, 2, 7, '/uploads/Producto-12.png'),
('Polera rugby bicolor', 'Polera de algodon estilo rugby en tonos celeste y negro', 16990.00, true, 2, 10, '/uploads/Producto-13.png'),
('Vestido floral retro', 'Vestido corto de verano, estampado colorido con lazos laterales', 18990.00, true, 2, 8, '/uploads/Producto-4.png'),

-- Niños (3)
('Vestido blanco infantil', 'Vestido de encaje blanco, elegante para ocasiones especiales', 15990.00, true, 3, 10, '/uploads/Producto-15.png'),
('Vestido con estampado de ciervos', 'Vestido satinado celeste con estampado infantil de ciervos', 14990.00, true, 3, 9, '/uploads/Producto-1.png'),

-- Accesorios (4)
('Aros dorados trenzados', 'Aros grandes color dorado con diseño trenzado', 7990.00, true, 4, 15, '/uploads/Producto-14.png'),
('Aros mariposa dorada', 'Aros metalicos con forma de mariposa, color oro', 6990.00, true, 4, 18, '/uploads/Producto-2.png'),
('Aros citricos', 'Aros colgantes con diseño de rodajas de limon y lima', 9990.00, true, 4, 12, '/uploads/Producto-3.png');

-- ===========================================
-- USUARIO ADMINISTRADOR POR DEFECTO
-- ===========================================
INSERT INTO users (nombre, email, password, rol, activo, fecha_creacion)
VALUES (
  'Admin Principal',
  'admin@duocuc.cl',
  '$2a$10$CE9ZiTrFb2CXgGrdFbFq0eW9DZiKv5ou7AGeMQmkoM4tJNpZDPKJa', -- Contraseña: admin123
  'SUPER_ADMIN',
  true,
  NOW()
);
