package com.tiendavirtual.projectbackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tiendavirtual.projectbackend.entities.Categoria;
import com.tiendavirtual.projectbackend.services.CategoriaServices;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/api/categorias")
public class CategoriaRestController {

    @Autowired
    private CategoriaServices categoriaServices;

    @Operation(summary = "Crear categoría", description = "Crea una nueva categoría de productos.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Categoría creada"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@jakarta.validation.Valid @RequestBody Categoria categoria) {
        Categoria nuevaCategoria = categoriaServices.crear(categoria);
        return ResponseEntity.ok(nuevaCategoria);
    }

    @Operation(summary = "Obtener categoría por ID", description = "Retorna la categoría si existe.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Categoría encontrada"),
        @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerCategoriaPorId(@PathVariable @Parameter(description = "ID de la categoría") Long id) {
        Categoria categoria = categoriaServices.obtenerId(id);
        if (categoria == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(categoria);
    }

    @Operation(summary = "Listar categorías", description = "Retorna todas las categorías.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Listado obtenido")
    })
    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        List<Categoria> categorias = categoriaServices.listarTodas();
        return ResponseEntity.ok(categorias);
    }

    @Operation(summary = "Eliminar categoría", description = "Elimina una categoría por ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Categoría eliminada"),
        @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable @Parameter(description = "ID de la categoría") Long id) {
        categoriaServices.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Actualizar categoría", description = "Actualiza el nombre de la categoría.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Categoría actualizada"),
        @ApiResponse(responseCode = "404", description = "Categoría no encontrada"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizarCategoria(@PathVariable @Parameter(description = "ID de la categoría") Long id, @RequestBody Categoria categoriaActualizada) {
        Categoria categoria = categoriaServices.actualizar(id, categoriaActualizada);
        if (categoria == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(categoria);
    }
}
