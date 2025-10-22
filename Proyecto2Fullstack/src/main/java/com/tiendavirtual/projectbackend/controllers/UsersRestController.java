package com.tiendavirtual.projectbackend.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.services.UsersService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UsersRestController {

    @Autowired
    private UsersService usersService;

    @PostMapping
    public ResponseEntity<Users> crearUser(@Valid @RequestBody Users user) {
        return ResponseEntity.ok(usersService.crear(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Users> obtenerUserPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usersService.obtenerId(id));
    }

    @GetMapping
    public ResponseEntity<List<Users>> listarUsers() {
        return ResponseEntity.ok(usersService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Users> actualizarUser(@PathVariable Long id, @Valid @RequestBody Users userActualizado) {
        return ResponseEntity.ok(usersService.actualizar(id, userActualizado));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Users> cambiarEstado(@PathVariable Long id, @RequestParam boolean activo) {
        return ResponseEntity.ok(usersService.cambiarEstado(id, activo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUser(@PathVariable Long id) {
        usersService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
