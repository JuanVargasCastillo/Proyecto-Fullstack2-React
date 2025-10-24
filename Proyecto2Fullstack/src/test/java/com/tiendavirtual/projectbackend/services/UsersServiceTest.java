package com.tiendavirtual.projectbackend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.enums.Rol;
import com.tiendavirtual.projectbackend.repositories.UsersRepository;
import com.tiendavirtual.projectbackend.dto.UserUpdateRequest;

public class UsersServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private UsersService usersService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldEncryptPasswordOnCreateUser() {
        Users user = new Users();
        user.setNombre("Juan Pérez");
        user.setEmail("juan@example.com");
        user.setPassword("123456");
        user.setRol(Rol.CLIENTE);

        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> {
            Users u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        Users created = usersService.crear(user);

        verify(usersRepository, times(1)).save(any(Users.class));
        assertNotNull(created.getId());
        assertEquals("Juan Pérez", created.getNombre());
        assertTrue(created.getPassword().startsWith("$2a$"));
        assertNotEquals("123456", created.getPassword());
    }

    @Test
    void shouldKeepBCryptPasswordOnUpdateUser() {
        Long userId = 1L;
        Users existingUser = new Users();
        existingUser.setId(userId);
        existingUser.setNombre("Juan");
        existingUser.setEmail("juan@example.com");
        existingUser.setPassword("$2a$10$existingHashedPassword");
        existingUser.setRol(Rol.CLIENTE);
        existingUser.setActivo(true);

        UserUpdateRequest updateData = new UserUpdateRequest();
        updateData.setNombre("Juan Carlos");
        updateData.setEmail("juan.carlos@example.com");
        updateData.setPassword("$2a$10$existingHashedPassword");
        updateData.setRol(Rol.VENDEDOR);
        updateData.setActivo(true);

        when(usersRepository.findById(userId)).thenReturn(java.util.Optional.of(existingUser));
        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Users updated = usersService.actualizar(userId, updateData);

        verify(usersRepository, times(1)).findById(userId);
        verify(usersRepository, times(1)).save(any(Users.class));
        assertEquals("Juan Carlos", updated.getNombre());
        assertEquals("juan.carlos@example.com", updated.getEmail());
        assertEquals("$2a$10$existingHashedPassword", updated.getPassword());
        assertEquals(Rol.VENDEDOR, updated.getRol());
    }

    @Test
    void shouldToggleUserActiveState() {
        Long userId = 1L;
        Users user = new Users();
        user.setId(userId);
        user.setNombre("María González");
        user.setEmail("maria@example.com");
        user.setActivo(false);

        when(usersRepository.findById(userId)).thenReturn(java.util.Optional.of(user));
        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Users result = usersService.cambiarEstado(userId, true);

        verify(usersRepository, times(1)).findById(userId);
        verify(usersRepository, times(1)).save(any(Users.class));
        assertTrue(result.getActivo());
    }
}