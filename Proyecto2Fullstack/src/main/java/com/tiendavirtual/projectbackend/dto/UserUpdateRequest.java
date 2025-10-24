package com.tiendavirtual.projectbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.tiendavirtual.projectbackend.enums.Rol;

public class UserUpdateRequest {
    @NotBlank
    private String nombre;

    @NotBlank
    @Email
    private String email;

    // Password opcional para actualización
    private String password;

    @NotNull
    private Rol rol;

    @NotNull
    private Boolean activo;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}