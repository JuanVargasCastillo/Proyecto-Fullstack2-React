package com.tiendavirtual.projectbackend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tiendavirtual.projectbackend.entities.Producto;
import com.tiendavirtual.projectbackend.repositories.ProductoRepositories;

@Service
public class ProductoServicesImpl implements ProductoServices{

    @Autowired
    private ProductoRepositories productoRepositories;

    @Override
    public Producto crear(Producto producto){
        return productoRepositories.save(producto);
    }

    @Override
    public Producto obtenerId(Long id) {
        return productoRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Override
    public List<Producto> listarTodas() {
        return (List<Producto>) productoRepositories.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!productoRepositories.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productoRepositories.deleteById(id);
    }

    @Override
    public Producto actualizar(Long id, Producto productoActualizado) {
        Producto existente = obtenerId(id);
        existente.setNombre(productoActualizado.getNombre());
        existente.setDescripcion(productoActualizado.getDescripcion());
        existente.setPrecio(productoActualizado.getPrecio());
        existente.setCategoria(productoActualizado.getCategoria());
        existente.setActivo(productoActualizado.getActivo());
        // Persistir la URL de imagen estable asignada en el controlador
        existente.setImagenUrl(productoActualizado.getImagenUrl());
        return productoRepositories.save(existente);
    }

    @Override
    public Producto desactivar(Long id){
        Producto producto = obtenerId(id);
        producto.setActivo(false);
        return productoRepositories.save(producto);
    }

    @Override
    public Producto actualizarStock(Long id, int stock) {
        Producto producto = obtenerId(id);
        producto.setStock(stock);
        return productoRepositories.save(producto);
    }

    @Override
    public List<Producto> listarPorCategoria(Long categoriaId) {
        return productoRepositories.findByCategoriaId(categoriaId);
    }

    @Override
    public List<Producto> listarStockBajo(int threshold) {
        return productoRepositories.findByStockLessThan(threshold);
    }

}
