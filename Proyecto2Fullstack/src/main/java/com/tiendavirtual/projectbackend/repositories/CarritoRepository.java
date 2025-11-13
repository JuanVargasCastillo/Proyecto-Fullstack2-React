package com.tiendavirtual.projectbackend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendavirtual.projectbackend.entities.Carrito;
import com.tiendavirtual.projectbackend.entities.Users;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuarioAndActivoTrue(Users usuario);
}