package com.tiendavirtual.projectbackend.dto;

import java.time.Instant;
import java.util.List;

public class BoletaResponse {
    private Long id;
    private Long correlativo;
    private Double subtotal;
    private Double neto;
    private Double iva;
    private Double total;
    private Instant creadoEn;
    private List<Detalle> detalles;

    public static class Detalle {
        public Long productoId;
        public String nombre;
        public Integer cantidad;
        public Double precioUnitario;
        public Double totalLinea;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCorrelativo() { return correlativo; }
    public void setCorrelativo(Long correlativo) { this.correlativo = correlativo; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public Double getNeto() { return neto; }
    public void setNeto(Double neto) { this.neto = neto; }
    public Double getIva() { return iva; }
    public void setIva(Double iva) { this.iva = iva; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public Instant getCreadoEn() { return creadoEn; }
    public void setCreadoEn(Instant creadoEn) { this.creadoEn = creadoEn; }
    public List<Detalle> getDetalles() { return detalles; }
    public void setDetalles(List<Detalle> detalles) { this.detalles = detalles; }
}