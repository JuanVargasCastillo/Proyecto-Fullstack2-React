package com.tiendavirtual.projectbackend.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import com.tiendavirtual.projectbackend.entities.Users;

public interface UsersRepository extends CrudRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
}
