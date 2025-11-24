package com.tiendavirtual.projectbackend.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.services.UsersService;
import com.tiendavirtual.projectbackend.dto.UserUpdateRequest;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/api/users")
public class UsersRestController {

    @Autowired
    private UsersService usersService;

    @Operation(summary = "Crear usuario", description = "Crea un usuario. Encripta la contraseña si es texto plano.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario creado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Users> crearUser(@Valid @RequestBody Users user) {
        return ResponseEntity.ok(usersService.crear(user));
    }

    @Operation(summary = "Crear usuario (registro)", description = "Crea un usuario desde el formulario público. Preparado para futuros campos de contacto.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario creado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping("/admin/crear-usuario")
    public ResponseEntity<Users> crearUsuarioPublico(@Valid @RequestBody Users user) {
        return ResponseEntity.ok(usersService.crear(user));
    }

    @Operation(summary = "Obtener usuario por ID", description = "Retorna el usuario si existe.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Users> obtenerUserPorId(@PathVariable @Parameter(description = "ID del usuario") Long id) {
        return ResponseEntity.ok(usersService.obtenerId(id));
    }

    @Operation(summary = "Listar usuarios", description = "Retorna la lista de usuarios.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Listado obtenido")
    })
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<List<Users>> listarUsers() {
        return ResponseEntity.ok(usersService.listarTodos());
    }

    @Operation(summary = "Actualizar usuario", description = "Actualiza datos del usuario. Conserva el hash BCrypt si ya está encriptado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario actualizado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Users> actualizarUser(@PathVariable @Parameter(description = "ID del usuario") Long id, @Valid @RequestBody UserUpdateRequest userActualizado) {
        return ResponseEntity.ok(usersService.actualizar(id, userActualizado));
    }

    @Operation(summary = "Cambiar estado de usuario", description = "Activa o desactiva un usuario.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Estado actualizado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Users> cambiarEstado(@PathVariable @Parameter(description = "ID del usuario") Long id, @RequestParam @Parameter(description = "Estado activo/inactivo") boolean activo) {
        return ResponseEntity.ok(usersService.cambiarEstado(id, activo));
    }

    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario por ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Usuario eliminado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUser(@PathVariable @Parameter(description = "ID del usuario") Long id) {
        usersService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
