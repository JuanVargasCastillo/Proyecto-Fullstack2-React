package com.tiendavirtual.projectbackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.tiendavirtual.projectbackend.dto.StockUpdateRequest;
import com.tiendavirtual.projectbackend.entities.Producto;
import com.tiendavirtual.projectbackend.repositories.ProductoRepositories;
import com.tiendavirtual.projectbackend.services.ProductoServices;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/productos")
public class ProductoRestController {

    @Autowired
    private ProductoServices productoServices;

    @Autowired
    private ProductoRepositories productoRepositories;

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody Producto producto) {
        Producto nuevoProducto = productoServices.crear(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Producto producto = productoServices.obtenerId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long categoriaId) {
        List<Producto> productos;
        if (nombre != null && categoriaId != null) {
            productos = productoRepositories.findByNombreContainingIgnoreCaseAndCategoriaId(nombre, categoriaId);
        } else if (nombre != null) {
            productos = productoRepositories.findByNombreContainingIgnoreCase(nombre);
        } else if (categoriaId != null) {
            productos = productoRepositories.findByCategoriaId(categoriaId);
        } else {
            productos = productoServices.listarTodas();
        }
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> listarPorCategoria(@PathVariable Long categoriaId) {
        List<Producto> productos = productoServices.listarPorCategoria(categoriaId);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Producto>> listarStockBajo(@RequestParam(name = "threshold", defaultValue = "5") int threshold) {
        List<Producto> productos = productoServices.listarStockBajo(threshold);
        return ResponseEntity.ok(productos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoServices.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @Valid @RequestBody Producto productoActualizado) {
        Producto producto = productoServices.actualizar(id, productoActualizado);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Producto> desactivar(@PathVariable Long id) {
        Producto producto = productoServices.desactivar(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Producto> actualizarStock(@PathVariable Long id, @Valid @RequestBody StockUpdateRequest body) {
        Producto producto = productoServices.actualizarStock(id, body.getStock());
        return ResponseEntity.ok(producto);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<Producto> subirImagen(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        Producto producto = productoServices.obtenerId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        // Crear directorio uploads si no existe
        File uploadsDir = new File("uploads");
        if (!uploadsDir.exists()) {
            uploadsDir.mkdirs();
        }
        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String filename = UUID.randomUUID().toString() + ext;
        File dest = new File(uploadsDir, filename);
        file.transferTo(dest);
        producto.setImagenUrl("/uploads/" + filename);
        Producto actualizado = productoServices.actualizar(producto.getId(), producto);
        return ResponseEntity.ok(actualizado);
    }
}
