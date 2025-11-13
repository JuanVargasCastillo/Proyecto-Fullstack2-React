package com.tiendavirtual.projectbackend.dto;

import java.util.List;

public class CartResponse {
    private Long carritoId;
    private Double subtotal;
    private List<Item> items;

    public static class Item {
        public Long id;
        public Long productoId;
        public String nombre;
        public Integer cantidad;
        public Double precioUnitario;
        public Double totalLinea;
    }

    public Long getCarritoId() { return carritoId; }
    public void setCarritoId(Long carritoId) { this.carritoId = carritoId; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}