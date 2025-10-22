package com.tiendavirtual.projectbackend.services;

import java.util.List;
import com.tiendavirtual.projectbackend.entities.Producto;

public interface ProductoServices {

    Producto crear(Producto producto);
    Producto obtenerId(Long id);
    List<Producto> listarTodas();    
    void eliminar(Long id);
    Producto actualizar(Long id, Producto productoActualizado);
    Producto desactivar(Long id);
    Producto actualizarStock(Long id, int stock);
    List<Producto> listarPorCategoria(Long categoriaId);
    List<Producto> listarStockBajo(int threshold);
}
