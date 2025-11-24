package com.tiendavirtual.projectbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EnvioRequest {
  @NotBlank
  private String nombre;
  @NotBlank
  private String apellidos;
  @NotBlank
  @Email
  private String correo;
  @NotBlank
  private String calle;
  private String departamento;
  @NotBlank
  private String region;
  @NotBlank
  private String comuna;
  private String indicacionesEntrega;

  private String codigoCupon;

  public String getNombre() { return nombre; }
  public void setNombre(String nombre) { this.nombre = nombre; }
  public String getApellidos() { return apellidos; }
  public void setApellidos(String apellidos) { this.apellidos = apellidos; }
  public String getCorreo() { return correo; }
  public void setCorreo(String correo) { this.correo = correo; }
  public String getCalle() { return calle; }
  public void setCalle(String calle) { this.calle = calle; }
  public String getDepartamento() { return departamento; }
  public void setDepartamento(String departamento) { this.departamento = departamento; }
  public String getRegion() { return region; }
  public void setRegion(String region) { this.region = region; }
  public String getComuna() { return comuna; }
  public void setComuna(String comuna) { this.comuna = comuna; }
  public String getIndicacionesEntrega() { return indicacionesEntrega; }
  public void setIndicacionesEntrega(String indicacionesEntrega) { this.indicacionesEntrega = indicacionesEntrega; }

  public String getCodigoCupon() { return codigoCupon; }
  public void setCodigoCupon(String codigoCupon) { this.codigoCupon = codigoCupon; }
}