package com.senvia.doangiuaky.identity.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().permitAll() // Allow all requests for now since we're just doing UI mockups
            )
            .formLogin(form -> form
                .loginPage("/login") // Use our custom login page
                .permitAll()
            )
            .logout(logout -> logout.permitAll());

        return http.build();
    }
}
