package com.vivitasol.projectbackend.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vivitasol.projectbackend.entities.Users;
import com.vivitasol.projectbackend.repositories.UsersRepository;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    public Users crear(Users user) {
        return usersRepository.save(user);
    }

    public Users obtenerId(Long id) {
        return usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<Users> listarTodos() {
        return (List<Users>) usersRepository.findAll();
    }

    public Users actualizar(Long id, Users userActualizado) {
        Users user = obtenerId(id);
        user.setNombre(userActualizado.getNombre());
        user.setEmail(userActualizado.getEmail());
        user.setPassword(userActualizado.getPassword());
        user.setRol(userActualizado.getRol());
        return usersRepository.save(user);
    }

    public void eliminar(Long id) {
        usersRepository.deleteById(id);
    }
}