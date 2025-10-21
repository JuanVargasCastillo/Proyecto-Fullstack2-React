package com.vivitasol.projectbackend.repositories;

import org.springframework.data.repository.CrudRepository;
import com.vivitasol.projectbackend.entities.Users;

public interface UsersRepository extends CrudRepository<Users, Long> {
}
