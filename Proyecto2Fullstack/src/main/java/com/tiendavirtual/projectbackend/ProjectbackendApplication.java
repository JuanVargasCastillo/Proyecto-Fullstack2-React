package com.tiendavirtual.projectbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.enums.Rol;
import com.tiendavirtual.projectbackend.repositories.UsersRepository;

@SpringBootApplication
public class ProjectbackendApplication {
    public static void main(String[] args) {
        // Mostrar hash BCrypt de "123456" al inicio, antes de levantar Spring
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("BCrypt(123456)=" + encoder.encode("123456"));
        SpringApplication.run(ProjectbackendApplication.class, args);
    }

    /*
    @Bean
    CommandLineRunner initAdmin(UsersRepository usersRepository) {
        return args -> {
            String adminEmail = "admin@tienda.com";
            if (usersRepository.findByEmail(adminEmail).isEmpty()) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                Users admin = new Users();
                admin.setNombre("Administrador");
                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("Admin1234"));
                admin.setRol(Rol.SUPER_ADMIN);
                admin.setActivo(true);
                usersRepository.save(admin);
            }
        };
    }
    */
}
