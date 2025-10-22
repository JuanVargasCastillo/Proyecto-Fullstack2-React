package com.tiendavirtual.projectbackend.dto;

import jakarta.validation.constraints.Min;

public class StockUpdateRequest {
    @Min(0)
    private int stock;

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}