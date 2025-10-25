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
-- Todos usan categoria_id del 1 al 4
INSERT INTO producto (nombre, descripcion, precio, activo, categoria_id, stock, imagen_url) VALUES
('Polera Vintage 90s', 'Algodón, estampado clásico, talla M', 14990.00, true, 1, 12, NULL),
('Polera Band Tee', 'Polera de banda, talla L, buen estado', 12990.00, true, 1, 8, NULL),
('Pantalón Denim Clásico', 'Corte recto, talla 32', 19990.00, true, 2, 10, NULL),
('Pantalón Cargo Retro', 'Color verde oliva, talla 34', 17990.00, true, 2, 6, NULL),
('Chaqueta Retro Cuero', 'Cuero sintético, talla M', 29990.00, true, 3, 4, NULL),
('Chaqueta Jean Oversize', 'Estilo 80s, talla XL', 24990.00, true, 3, 5, NULL),
('Vestido Bohemio', 'Estampado floral, talla S', 18990.00, true, 4, 7, NULL),
('Vestido Midi Vintage', 'Color vino, talla M', 20990.00, true, 4, 3, NULL),
('Falda Plisada', 'Color beige, talla M', 15990.00, true, 4, 9, NULL),
('Falda Denim', 'Talla 38, lavado medio', 16990.00, true, 4, 6, NULL),
('Cinturón de Cuero Reutilizado', 'Hecho a mano con materiales reciclados', 9990.00, true, 4, 15, NULL),
('Gorro Vintage Invierno', 'Lana gruesa, color gris', 7990.00, true, 4, 20, NULL),
('Camisa Cuadros Clásica', 'Tela flannel, talla M', 18990.00, true, 1, 11, NULL),
('Blusa Boho Chic', 'Tela ligera con bordados, talla S', 17990.00, true, 2, 14, NULL),
('Bufanda Retro Lana', 'Color burdeos, hecha a mano', 12990.00, true, 4, 9, NULL);

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
