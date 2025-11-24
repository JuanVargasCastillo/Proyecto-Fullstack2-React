package com.tiendavirtual.projectbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tiendavirtual.projectbackend.entities.Envio;

public interface EnvioRepository extends JpaRepository<Envio, Long> {
}