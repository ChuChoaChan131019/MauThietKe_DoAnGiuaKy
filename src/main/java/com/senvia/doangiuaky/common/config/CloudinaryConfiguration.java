package com.senvia.doangiuaky.common.config;

import com.cloudinary.Cloudinary;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.Objects;

@Configuration
@EnableConfigurationProperties(CloudinaryProperties.class)
public class CloudinaryConfiguration {

    @Bean
    public Cloudinary cloudinary(CloudinaryProperties properties) {
        return new Cloudinary(Map.of(
                "cloud_name", Objects.requireNonNullElse(properties.cloudName(), ""),
                "api_key", Objects.requireNonNullElse(properties.apiKey(), ""),
                "api_secret", Objects.requireNonNullElse(properties.apiSecret(), "")));
    }
}
