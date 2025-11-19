package com.tiendavirtual.projectbackend.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import com.tiendavirtual.projectbackend.enums.Rol;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

/**
 * Proveedor de tokens JWT para Green Bunny Store.
 * - Genera tokens con subject (email), claim de rol y expiración de 24 horas.
 * - Valida tokens y extrae el username (subject).
 * - Clave secreta basada en "GreenBunnySecretKey2025" derivada a 256 bits.
 * - Maneja excepciones con mensajes claros para casos inválidos/expirados.
 */
@Component
public class JwtTokenProvider {

    private static final String SECRET_PHRASE = "GreenBunnySecretKey2025";
    private static final String ROLE_CLAIM = "rol";
    private static final Duration DEFAULT_EXPIRATION = Duration.ofHours(24);

    private final SecretKey secretKey;
    private final JwtParser jwtParser;

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    public JwtTokenProvider() {
        this.secretKey = buildHmacKey256(SECRET_PHRASE);
        this.jwtParser = Jwts.parser().verifyWith(secretKey).build();
    }

    /**
     * Genera un token JWT con email como subject, claim de rol y expiración por defecto (24h).
     */
    public String generateToken(String email, Rol rol) {
        Instant now = Instant.now();
        Instant exp = now.plus(DEFAULT_EXPIRATION);

        return Jwts.builder()
                .subject(email)
                .claim(ROLE_CLAIM, rol != null ? rol.name() : null)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Valida el token. Retorna true si es válido, false si es inválido o expiró.
     * No lanza excepción para facilitar chequeos simples.
     */
    public boolean validateToken(String token) {
        try {
            jwtParser.parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("validateToken() rechazó JWT por expiración. Motivo: {}", e.toString());
            return false; // expirado
        } catch (MalformedJwtException e) {
            log.error("validateToken() rechazó JWT por malformación. Motivo: {}", e.toString());
            return false; // mal formado
        } catch (UnsupportedJwtException e) {
            log.error("validateToken() rechazó JWT por formato no soportado. Motivo: {}", e.toString());
            return false; // no soportado
        } catch (SignatureException e) {
            log.error("validateToken() rechazó JWT por firma inválida. Motivo: {}", e.toString());
            return false; // firma inválida
        } catch (IllegalArgumentException e) {
            log.error("validateToken() rechazó JWT por argumento ilegal. Motivo: {}", e.toString());
            return false; // token vacío o nulo
        }
    }

    /**
     * Extrae el username (subject/email) del token. Lanza IllegalStateException con
     * un mensaje claro si el token es inválido o expiró.
     */
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = jwtParser.parseSignedClaims(token).getPayload();
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            throw new IllegalStateException("Token expirado: por favor autentícate nuevamente.");
        } catch (MalformedJwtException e) {
            throw new IllegalStateException("Token malformado: formato de JWT inválido.");
        } catch (UnsupportedJwtException e) {
            throw new IllegalStateException("Token no soportado: verifica el algoritmo o formato de firma.");
        } catch (SignatureException e) {
            throw new IllegalStateException("Token con firma inválida: posible manipulación detectada.");
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Token vacío o nulo: se requiere un JWT para continuar.");
        }
    }

    /**
     * Deriva una clave HMAC de 256 bits desde una frase secreta usando SHA-256.
     * Cumple los requisitos de longitud mínima de JJWT para HS256.
     */
    private static SecretKey buildHmacKey256(String secret) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = md.digest(secret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (NoSuchAlgorithmException e) {
            // No debería ocurrir en JVM estándar
            throw new IllegalStateException("SHA-256 no disponible en la JVM", e);
        }
    }
}