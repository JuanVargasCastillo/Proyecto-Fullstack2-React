package com.tiendavirtual.projectbackend.dto;

import com.tiendavirtual.projectbackend.enums.Rol;

public class LoginResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
    private boolean activo;
    private String token;

    public LoginResponseDTO(Long id, String nombre, String email, Rol rol, boolean activo, String token) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.activo = activo;
        this.token = token;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public Rol getRol() { return rol; }
    public boolean isActivo() { return activo; }
    public String getToken() { return token; }
}