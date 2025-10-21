package com.vivitasol.projectbackend.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vivitasol.projectbackend.entities.Users;
import com.vivitasol.projectbackend.services.UsersService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UsersRestController {

    @Autowired
    private UsersService usersService;

    @PostMapping
    public ResponseEntity<Users> crearUser(@RequestBody Users user) {
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
    public ResponseEntity<Users> actualizarUser(@PathVariable Long id, @RequestBody Users userActualizado) {
        return ResponseEntity.ok(usersService.actualizar(id, userActualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUser(@PathVariable Long id) {
        usersService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
