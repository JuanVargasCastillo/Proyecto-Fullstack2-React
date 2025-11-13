package com.tiendavirtual.projectbackend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendavirtual.projectbackend.entities.BoletaDetalle;

@Repository
public interface BoletaDetalleRepository extends JpaRepository<BoletaDetalle, Long> {
    List<BoletaDetalle> findByBoletaId(Long boletaId);
}