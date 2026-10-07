package com.ecommerce.javacore.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        String jwtAuthName = "Bearer";
        return new OpenAPI()
                .info(new Info()
                        .title("E-commerce Empire Java Core API")
                        .description("Spring Boot 3 - Multi-seller e-commerce backend")
                        .version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList(jwtAuthName))
                .components(new Components()
                        .addSecuritySchemes(jwtAuthName, new SecurityScheme()
                                .name(jwtAuthName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}