package com.tiendavirtual.projectbackend.dto;

import java.time.Instant;
import java.util.List;

public class BoletaResponse {
    private Long id;
    private Long correlativo;
    private Double subtotal;
    private Double descuento;
    private Double neto;
    private Double iva;
    private Double total;
    private Double costoEnvio;
    private Instant creadoEn;
    private List<Detalle> detalles;
    private EnvioInfo envio;
    private String codigoCupon;

    public static class Detalle {
        public Long productoId;
        public String nombre;
        public Integer cantidad;
        public Double precioUnitario;
        public Double totalLinea;
    }

    public static class EnvioInfo {
        public String nombre;
        public String apellidos;
        public String correo;
        public String calle;
        public String departamento;
        public String region;
        public String comuna;
        public String indicacionesEntrega;
        public Double costoEnvio;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCorrelativo() { return correlativo; }
    public void setCorrelativo(Long correlativo) { this.correlativo = correlativo; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }
    public Double getNeto() { return neto; }
    public void setNeto(Double neto) { this.neto = neto; }
    public Double getIva() { return iva; }
    public void setIva(Double iva) { this.iva = iva; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public Double getCostoEnvio() { return costoEnvio; }
    public void setCostoEnvio(Double costoEnvio) { this.costoEnvio = costoEnvio; }
    public Instant getCreadoEn() { return creadoEn; }
    public void setCreadoEn(Instant creadoEn) { this.creadoEn = creadoEn; }
    public List<Detalle> getDetalles() { return detalles; }
    public void setDetalles(List<Detalle> detalles) { this.detalles = detalles; }
    public EnvioInfo getEnvio() { return envio; }
    public void setEnvio(EnvioInfo envio) { this.envio = envio; }
    public String getCodigoCupon() { return codigoCupon; }
    public void setCodigoCupon(String codigoCupon) { this.codigoCupon = codigoCupon; }
}