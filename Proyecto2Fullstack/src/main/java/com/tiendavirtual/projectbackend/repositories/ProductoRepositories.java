package com.tiendavirtual.projectbackend.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.tiendavirtual.projectbackend.entities.Producto;

public interface  ProductoRepositories extends CrudRepository <Producto, Long>{
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByCategoriaId(Long categoriaId);
    List<Producto> findByNombreContainingIgnoreCaseAndCategoriaId(String nombre, Long categoriaId);
    List<Producto> findByStockLessThan(int stock);
}
