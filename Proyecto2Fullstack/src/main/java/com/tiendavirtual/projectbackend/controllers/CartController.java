package com.tiendavirtual.projectbackend.controllers;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.tiendavirtual.projectbackend.dto.AddCartItemRequest;
import com.tiendavirtual.projectbackend.dto.CartResponse;
import com.tiendavirtual.projectbackend.dto.UpdateCartItemRequest;
import com.tiendavirtual.projectbackend.entities.Carrito;
import com.tiendavirtual.projectbackend.entities.CarritoItem;
import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.services.CarritoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/carrito")
@Validated
public class CartController {

    @Autowired
    private CarritoService carritoService;

    private Users currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Users) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<CartResponse> obtenerCarrito() {
        Users usuario = currentUser();
        Carrito carrito = carritoService.getOrCreateActiveCart(usuario);
        double subtotal = carritoService.calcularSubtotal(carrito);
        CartResponse resp = new CartResponse();
        resp.setCarritoId(carrito.getId());
        resp.setSubtotal(subtotal);
        resp.setItems(carritoService.listarItems(carrito.getId()).stream().map(ci -> {
            CartResponse.Item it = new CartResponse.Item();
            it.id = ci.getId();
            it.productoId = ci.getProducto().getId();
            it.nombre = ci.getProducto().getNombre();
            it.cantidad = ci.getCantidad();
            it.precioUnitario = ci.getPrecioUnitario();
            it.totalLinea = ci.getPrecioUnitario() * ci.getCantidad();
            return it;
        }).collect(Collectors.toList()));
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> agregarItem(@Valid @RequestBody AddCartItemRequest req) {
        Users usuario = currentUser();
        carritoService.agregarItem(usuario, req.getProductoId(), req.getCantidad());
        return obtenerCarrito();
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartResponse> actualizarItem(@PathVariable("id") Long id,
                                                       @Valid @RequestBody UpdateCartItemRequest req) {
        Users usuario = currentUser();
        carritoService.actualizarCantidad(usuario, id, req.getCantidad());
        return obtenerCarrito();
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> eliminarItem(@PathVariable("id") Long id) {
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