package com.tiendavirtual.projectbackend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.repositories.UsersRepository;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Users crear(Users user) {
        if (StringUtils.hasText(user.getPassword()) && !isBcryptHash(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
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
        if (StringUtils.hasText(userActualizado.getPassword())) {
            user.setPassword(isBcryptHash(userActualizado.getPassword())
                    ? userActualizado.getPassword()
                    : passwordEncoder.encode(userActualizado.getPassword()));
        }
        user.setRol(userActualizado.getRol());
        return usersRepository.save(user);
    }

    public void eliminar(Long id) {
        usersRepository.deleteById(id);
    }

    public Users cambiarEstado(Long id, boolean activo) {
        Users user = obtenerId(id);
        user.setActivo(activo);
        return usersRepository.save(user);
    }

    private boolean isBcryptHash(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }
}