package com.tiendavirtual.projectbackend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "envios")
public class Envio {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "boleta_id")
  private Boleta boleta;

  private String nombre;
  private String apellidos;
  private String correo;
  private String calle;
  private String departamento;
  private String region;
  private String comuna;
  private String indicacionesEntrega;

  private Double costoEnvio;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Boleta getBoleta() { return boleta; }
  public void setBoleta(Boleta boleta) { this.boleta = boleta; }
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
  public Double getCostoEnvio() { return costoEnvio; }
  public void setCostoEnvio(Double costoEnvio) { this.costoEnvio = costoEnvio; }
}