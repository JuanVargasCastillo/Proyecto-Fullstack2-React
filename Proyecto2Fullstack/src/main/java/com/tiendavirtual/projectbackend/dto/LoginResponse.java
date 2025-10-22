package com.tiendavirtual.projectbackend.dto;

import com.tiendavirtual.projectbackend.enums.Rol;

public class LoginResponse {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
    private boolean activo;

    public LoginResponse(Long id, String nombre, String email, Rol rol, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public Rol getRol() { return rol; }
    public boolean isActivo() { return activo; }
}