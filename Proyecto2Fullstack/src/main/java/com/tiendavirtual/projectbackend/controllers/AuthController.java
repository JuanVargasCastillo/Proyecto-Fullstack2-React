package com.tiendavirtual.projectbackend.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.tiendavirtual.projectbackend.dto.LoginRequest;
import com.tiendavirtual.projectbackend.dto.LoginResponseDTO;
import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.repositories.UsersRepository;
import com.tiendavirtual.projectbackend.security.JwtTokenProvider;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Operation(summary = "Login", description = "Valida credenciales contra la base de datos y retorna información del usuario autenticado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Autenticación exitosa"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas"),
        @ApiResponse(responseCode = "403", description = "Usuario inactivo")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<Users> optUser = usersRepository.findByEmail(request.getEmail());
        if (optUser.isEmpty()) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Credenciales incorrectas"));
        }
        Users user = optUser.get();
        if (!user.getActivo()) {
            return ResponseEntity.status(403).body(java.util.Map.of("error", "Usuario inactivo"));
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Credenciales incorrectas"));
        }
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRol());
        // Retornar SOLO el JWT sin prefijo "Bearer " para evitar encabezados duplicados
        String bearerToken = token;
        LoginResponseDTO response = new LoginResponseDTO(
            user.getId(),
            user.getNombre(),
            user.getEmail(),
            user.getRol(),
            user.getActivo(),
            bearerToken
        );
        return ResponseEntity.ok(response);
    }
}