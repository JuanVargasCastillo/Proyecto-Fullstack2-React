package com.tiendavirtual.projectbackend.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiendavirtual.projectbackend.dto.AddCartItemRequest;
import com.tiendavirtual.projectbackend.dto.UpdateCartItemRequest;
import com.tiendavirtual.projectbackend.dto.CartResponse;
import com.tiendavirtual.projectbackend.entities.Carrito;
import com.tiendavirtual.projectbackend.entities.CarritoItem;
import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.services.CarritoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    private Users currentUser() {
        return (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private CartResponse toResponse(Carrito carrito) {
        CartResponse r = new CartResponse();
        r.setCarritoId(carrito.getId());
        r.setSubtotal(carritoService.calcularSubtotal(carrito));
        List<CarritoItem> items = carritoService.listarItems(carrito.getId());
        List<CartResponse.Item> dtoItems = items.stream().map(ci -> {
            CartResponse.Item it = new CartResponse.Item();
            it.id = ci.getId();
            it.productoId = ci.getProducto().getId();
            it.nombre = ci.getProducto().getNombre();
            it.cantidad = ci.getCantidad();
            it.precioUnitario = ci.getPrecioUnitario();
            it.totalLinea = ci.getPrecioUnitario() * ci.getCantidad();
            return it;
        }).collect(Collectors.toList());
        r.setItems(dtoItems);
        return r;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCarritoActivo() {
        Users usuario = currentUser();
        Carrito carrito = carritoService.getOrCreateActiveCart(usuario);
        return ResponseEntity.ok(toResponse(carrito));
    }

    @PostMapping("/items")
    public ResponseEntity<?> agregarItem(@Valid @RequestBody AddCartItemRequest req) {
        Users usuario = currentUser();
        try {
            carritoService.agregarItem(usuario, req.getProductoId(), req.getCantidad());
        } catch (IllegalArgumentException e) {
            String msg = String.valueOf(e.getMessage());
            if (msg.startsWith("stockInsuficiente")) {
                return ResponseEntity.badRequest().body(Map.of("error", "stockInsuficiente", "message", "No hay stock suficiente para este producto"));
            }
            throw e;
        }
        Carrito carrito = carritoService.getOrCreateActiveCart(usuario);
        return ResponseEntity.ok(toResponse(carrito));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> actualizarItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest req) {
        Users usuario = currentUser();
        try {
            if (req.getCantidad() != null && req.getCantidad() == 0) {
                carritoService.eliminarItem(usuario, id);
            } else {
                carritoService.actualizarCantidad(usuario, id, req.getCantidad());
            }
        } catch (IllegalArgumentException e) {
            String msg = String.valueOf(e.getMessage());
            if (msg.startsWith("stockInsuficiente")) {
                return ResponseEntity.badRequest().body(Map.of("error", "stockInsuficiente", "message", "No hay stock suficiente para este producto"));
            }
            throw e;
        }
        Carrito carrito = carritoService.getOrCreateActiveCart(usuario);
        return ResponseEntity.ok(toResponse(carrito));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> eliminarItem(@PathVariable Long id) {
        Users usuario = currentUser();
        carritoService.eliminarItem(usuario, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> vaciarCarrito() {
        Users usuario = currentUser();
        carritoService.vaciarCarrito(usuario);
        return ResponseEntity.noContent().build();
    }
}