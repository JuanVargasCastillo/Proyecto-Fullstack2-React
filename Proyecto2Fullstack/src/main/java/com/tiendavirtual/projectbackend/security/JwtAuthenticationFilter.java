package com.tiendavirtual.projectbackend.security;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.enums.Rol;
import com.tiendavirtual.projectbackend.services.UsersService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        if (isPermittedPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        log.debug("Authorization header recibido: {}", authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("Authorization header ausente o sin formato Bearer");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        try {
            if (!tokenProvider.validateToken(token)) {
                log.error("JWT rechazado: {}", token);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido o expirado");
                return;
            }
        } catch (Exception e) {
            log.error("JWT rechazado: {}", token);
            log.error("Motivo: {}", e.toString());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido o expirado");
            return;
        }

        try {
            String email = tokenProvider.getUsernameFromToken(token);
            Optional<Users> optUser = usersService.findByEmail(email);
            if (optUser.isEmpty()) {
                log.info("Usuario no encontrado para email: {}", email);
                filterChain.doFilter(request, response);
                return;
            }

            Users user = optUser.get();
            Rol rol = user.getRol();
            String roleName = rol != null ? "ROLE_" + rol.name() : "ROLE_USER";
            java.util.List<SimpleGrantedAuthority> authorities;
            if (rol != null) {
                authorities = java.util.Arrays.asList(
                        new SimpleGrantedAuthority(roleName),
                        new SimpleGrantedAuthority(rol.name())
                );
            } else {
                authorities = java.util.Collections.singletonList(new SimpleGrantedAuthority(roleName));
            }

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    authorities
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("Autenticación establecida para {} con rol {}", email, roleName);

        } catch (IllegalStateException ex) {
            log.info("Error al procesar JWT: {}", ex.getMessage());
            // Continuar sin autenticación
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPermittedPath(String path) {
        if (path == null) return false;
        return path.startsWith("/api/auth/") || path.startsWith("/uploads/");
    }
}