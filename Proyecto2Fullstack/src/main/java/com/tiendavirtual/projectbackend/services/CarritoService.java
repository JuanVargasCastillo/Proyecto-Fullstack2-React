package com.tiendavirtual.projectbackend.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tiendavirtual.projectbackend.entities.Carrito;
import com.tiendavirtual.projectbackend.entities.CarritoItem;
import com.tiendavirtual.projectbackend.entities.Producto;
import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.repositories.CarritoItemRepository;
import com.tiendavirtual.projectbackend.repositories.CarritoRepository;
import com.tiendavirtual.projectbackend.repositories.ProductoRepository;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public Carrito getOrCreateActiveCart(Users usuario) {
        Optional<Carrito> opt = carritoRepository.findByUsuarioAndActivoTrue(usuario);
        return opt.orElseGet(() -> {
            Carrito c = new Carrito();
            c.setUsuario(usuario);
            c.setActivo(true);
            c.setCreadoEn(Instant.now());
            return carritoRepository.save(c);
        });
    }

    @Transactional(readOnly = true)
    public List<CarritoItem> listarItems(Long carritoId) {
        return carritoItemRepository.findByCarritoId(carritoId);
    }

    @Transactional
    public CarritoItem agregarItem(Users usuario, Long productoId, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        Carrito carrito = getOrCreateActiveCart(usuario);
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        if (producto.getStock() == null || producto.getStock() <= 0) {
            throw new IllegalArgumentException("stockInsuficiente: No hay stock suficiente para este producto");
        }

        Optional<CarritoItem> optItem = carritoItemRepository.findByCarritoIdAndProductoId(carrito.getId(), productoId);
        CarritoItem item;
        if (optItem.isPresent()) {
            item = optItem.get();
            int nuevaCantidad = item.getCantidad() + cantidad;
            if (nuevaCantidad > producto.getStock()) {
                throw new IllegalArgumentException("stockInsuficiente: No hay stock suficiente para este producto");
            }
            item.setCantidad(nuevaCantidad);
        } else {
            item = new CarritoItem();
            item.setCarrito(carrito);
            item.setProducto(producto);
            if (cantidad > producto.getStock()) {
                throw new IllegalArgumentException("stockInsuficiente: No hay stock suficiente para este producto");
            }
            item.setCantidad(cantidad);
            item.setPrecioUnitario(producto.getPrecio().doubleValue());
        }
        carrito.setActualizadoEn(Instant.now());
        return carritoItemRepository.save(item);
    }

    @Transactional
    public CarritoItem actualizarCantidad(Users usuario, Long itemId, int cantidad) {
        if (cantidad < 0) {
            throw new IllegalArgumentException("La cantidad no puede ser negativa");
        }
        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item no encontrado"));
        // Validar pertenencia del item al carrito activo del usuario
        Carrito carrito = getOrCreateActiveCart(usuario);
        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new SecurityException("El item no pertenece al carrito del usuario");
        }
        if (cantidad == 0) {
            carritoItemRepository.delete(item);
            return null;
        }
        Producto producto = item.getProducto();
        if (cantidad > producto.getStock()) {
            throw new IllegalArgumentException("stockInsuficiente: No hay stock suficiente para este producto");
        }
        item.setCantidad(cantidad);
        carrito.setActualizadoEn(Instant.now());
        return carritoItemRepository.save(item);
    }

    @Transactional
    public void eliminarItem(Users usuario, Long itemId) {
        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item no encontrado"));
        Carrito carrito = getOrCreateActiveCart(usuario);
        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new SecurityException("El item no pertenece al carrito del usuario");
        }
        carritoItemRepository.delete(item);
        carrito.setActualizadoEn(Instant.now());
        carritoRepository.save(carrito);
    }

    @Transactional
    public void vaciarCarrito(Users usuario) {
        Carrito carrito = getOrCreateActiveCart(usuario);
        List<CarritoItem> items = carritoItemRepository.findByCarritoId(carrito.getId());
        carritoItemRepository.deleteAll(items);
        carrito.setActualizadoEn(Instant.now());
        carritoRepository.save(carrito);
    }

    @Transactional(readOnly = true)
    public double calcularSubtotal(Carrito carrito) {
        return carritoItemRepository.findByCarritoId(carrito.getId())
                .stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();
    }
}