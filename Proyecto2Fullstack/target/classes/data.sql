-- Categorías de ropa reutilizada
INSERT INTO categoria (nombre) VALUES ('Poleras');
INSERT INTO categoria (nombre) VALUES ('Pantalones');
INSERT INTO categoria (nombre) VALUES ('Chaquetas');
INSERT INTO categoria (nombre) VALUES ('Vestidos');
INSERT INTO categoria (nombre) VALUES ('Faldas');

-- Productos reales (sin imágenes)
-- Suponiendo IDs de categorías del 1 al 5 según inserción
INSERT INTO producto (nombre, descripcion, precio, activo, categoria_id, stock, imagen_url) VALUES
('Polera Vintage 90s', 'Algodón, estampado clásico, talla M', 14990.00, true, 1, 12, NULL),
('Polera Band Tee', 'Polera de banda, talla L, buen estado', 12990.00, true, 1, 8, NULL),
('Pantalón Denim Clásico', 'Corte recto, talla 32', 19990.00, true, 2, 10, NULL),
('Pantalón Cargo Retro', 'Color verde oliva, talla 34', 17990.00, true, 2, 6, NULL),
('Chaqueta Retro Cuero', 'Cuero sintético, talla M', 29990.00, true, 3, 4, NULL),
('Chaqueta Jean Oversize', 'Estilo 80s, talla XL', 24990.00, true, 3, 5, NULL),
('Vestido Bohemio', 'Estampado floral, talla S', 18990.00, true, 4, 7, NULL),
('Vestido Midi Vintage', 'Color vino, talla M', 20990.00, true, 4, 3, NULL),
('Falda Plisada', 'Color beige, talla M', 15990.00, true, 5, 9, NULL),
('Falda Denim', 'Talla 38, lavado medio', 16990.00, true, 5, 6, NULL),
('Polera Básica Reutilizada', '100% algodón, talla S', 9990.00, true, 1, 15, NULL),
('Pantalón Recto Vintage', 'Talla 30, azul oscuro', 18990.00, true, 2, 8, NULL),
('Chaqueta Bomber', 'Tela ligera, talla L', 22990.00, true, 3, 5, NULL),
('Vestido Slip', 'Satinado, talla M', 21990.00, true, 4, 4, NULL),
('Falda A Línea', 'Color negro, talla S', 14990.00, true, 5, 10, NULL);

-- Usuario administrador por defecto
INSERT INTO users (nombre, email, password, rol, activo, fecha_creacion)
VALUES ('Admin', 'admin@tienda.com', '$2a$10$jbqVYJPXUt8Kl4FyZlu4Te.xEdI135AYpHQB59oCXf4d1B/9ZXD3u', 'SUPER_ADMIN', true, NOW());