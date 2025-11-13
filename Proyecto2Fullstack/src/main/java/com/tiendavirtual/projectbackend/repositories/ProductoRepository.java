package com.tiendavirtual.projectbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendavirtual.projectbackend.entities.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}