package com.tiendavirtual.projectbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI tiendaVirtualOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API Tienda Virtual – Panel Administrador")
                .description("Documentación del backend para la gestión de usuarios, productos y autenticación simple.")
                .version("1.0.0")
            );
    }
}