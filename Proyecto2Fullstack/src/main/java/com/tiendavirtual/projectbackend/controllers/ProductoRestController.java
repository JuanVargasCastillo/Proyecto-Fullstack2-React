package com.tiendavirtual.projectbackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.tiendavirtual.projectbackend.dto.StockUpdateRequest;
import com.tiendavirtual.projectbackend.entities.Producto;
import com.tiendavirtual.projectbackend.repositories.ProductoRepositories;
import com.tiendavirtual.projectbackend.services.ProductoServices;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/api/productos")
public class ProductoRestController {

    @Autowired
    private ProductoServices productoServices;

    @Autowired
    private ProductoRepositories productoRepositories;

    @Value("${app.uploads.dir:${user.dir}/uploads}")
    private String uploadsDir;

    @Operation(summary = "Crear producto", description = "Crea un nuevo producto de inventario.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto creado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody Producto producto) {
        Producto nuevoProducto = productoServices.crear(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    @Operation(summary = "Obtener producto por ID", description = "Retorna el producto si existe.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto encontrado"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable @Parameter(description = "ID del producto") Long id) {
        Producto producto = productoServices.obtenerId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    @Operation(summary = "Listar productos", description = "Lista productos con filtros opcionales por nombre y categoría.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Listado obtenido")
    })
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos(
            @RequestParam(required = false) @Parameter(description = "Filtro por nombre") String nombre,
            @RequestParam(required = false) @Parameter(description = "Filtro por categoría") Long categoriaId) {
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

    @Operation(summary = "Listar productos por categoría", description = "Retorna productos pertenecientes a la categoría indicada.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Listado por categoría obtenido")
    })
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> listarPorCategoria(@PathVariable @Parameter(description = "ID de la categoría") Long categoriaId) {
        List<Producto> productos = productoServices.listarPorCategoria(categoriaId);
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Listar productos con stock bajo", description = "Retorna productos con stock menor al umbral indicado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Listado de stock bajo obtenido")
    })
    @GetMapping("/low-stock")
    public ResponseEntity<List<Producto>> listarStockBajo(@RequestParam(name = "threshold", defaultValue = "5") @Parameter(description = "Umbral de stock") int threshold) {
        List<Producto> productos = productoServices.listarStockBajo(threshold);
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Eliminar producto", description = "Elimina un producto por ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Producto eliminado"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable @Parameter(description = "ID del producto") Long id) {
        productoServices.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Actualizar producto", description = "Actualiza los datos del producto.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto actualizado"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable @Parameter(description = "ID del producto") Long id, @Valid @RequestBody Producto productoActualizado) {
        Producto producto = productoServices.actualizar(id, productoActualizado);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    @Operation(summary = "Desactivar producto", description = "Marca el producto como inactivo.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto desactivado"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Producto> desactivar(@PathVariable @Parameter(description = "ID del producto") Long id) {
        Producto producto = productoServices.desactivar(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    @Operation(summary = "Actualizar stock", description = "Actualiza la cantidad disponible (stock) del producto.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Stock actualizado"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Producto> actualizarStock(@PathVariable @Parameter(description = "ID del producto") Long id, @Valid @RequestBody StockUpdateRequest body) {
        Producto producto = productoServices.actualizarStock(id, body.getStock());
        return ResponseEntity.ok(producto);
    }

    @Operation(summary = "Subir imagen de producto", description = "Sube y asigna una imagen al producto.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Imagen subida y producto actualizado"),
        @ApiResponse(responseCode = "400", description = "Archivo inválido o faltante"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @PostMapping("/{id}/image")
    public ResponseEntity<Producto> subirImagen(@PathVariable @Parameter(description = "ID del producto") Long id, @RequestParam("file") MultipartFile file) throws IOException {
        Producto producto = productoServices.obtenerId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        // Crear directorio uploads absoluto si no existe
        Path uploadPath = Paths.get(uploadsDir).toAbsolutePath();
        Files.createDirectories(uploadPath);

        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }

        // Eliminar cualquier imagen previa del producto (cualquier extensión)
        String prefix = "producto-" + id + ".";
        try {
            Files.list(uploadPath)
                .filter(p -> p.getFileName().toString().startsWith(prefix))
                .forEach(p -> {
                    try { Files.deleteIfExists(p); } catch (IOException ignored) {}
                });
        } catch (IOException e) {
            // Si hay error listando, continuamos para intentar escribir la nueva imagen
        }

        // Nombre estable basado en el ID del producto y la extensión original
        String filename = "producto-" + id + (ext != null ? ext : "");
        Path dest = uploadPath.resolve(filename);
        file.transferTo(dest.toFile());

        producto.setImagenUrl("/uploads/" + filename);
        Producto actualizado = productoServices.actualizar(producto.getId(), producto);
        return ResponseEntity.ok(actualizado);
    }
}
