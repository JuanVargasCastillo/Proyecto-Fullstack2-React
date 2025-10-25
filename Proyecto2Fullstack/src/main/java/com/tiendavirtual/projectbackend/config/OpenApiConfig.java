package com.tiendavirtual.projectbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI tiendaVirtualOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API Tienda Virtual – Panel Administrador")
                .description("Documentación del backend para la gestión de usuarios, productos y autenticación simple. Proyecto académico desarrollado por estudiantes de Duoc UC.")
                .version("1.0.0")
                .contact(new Contact()
                    .name("vpobletel@profesor.duoc.cl")
                    .email("vpobletel@profesor.duoc.cl") 
                    .url(null)) 
                .license(new License()
                    .name("Apache 2.0")
                    .url("https://www.apache.org/licenses/LICENSE-2.0.html"))
            );
    }
}
