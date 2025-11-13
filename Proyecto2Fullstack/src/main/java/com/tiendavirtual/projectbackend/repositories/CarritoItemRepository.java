package com.tiendavirtual.projectbackend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendavirtual.projectbackend.entities.CarritoItem;

@Repository
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByCarritoId(Long carritoId);
    Optional<CarritoItem> findByCarritoIdAndProductoId(Long carritoId, Long productoId);
}