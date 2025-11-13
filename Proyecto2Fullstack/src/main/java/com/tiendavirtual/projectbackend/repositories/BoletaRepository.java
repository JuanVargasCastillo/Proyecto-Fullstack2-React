package com.tiendavirtual.projectbackend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendavirtual.projectbackend.entities.Boleta;
import com.tiendavirtual.projectbackend.entities.Users;

@Repository
public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    List<Boleta> findByUsuarioOrderByCreadoEnDesc(Users usuario);
}