package com.frances.twitch;


import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.sql.DataSource;


@Configuration
public class AppConfig {

    // security filter chain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // disable CSRF protection
                .csrf().disable()
                .authorizeHttpRequests(auth ->
                        auth
                                // allow access to static resources
                                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()       // download the source from the frontend locally
                                // allow access to frontend assets
                                .requestMatchers(HttpMethod.GET, "/", "/index.html", "/*.json", "/*.png", "/static/**").permitAll()
                                // allow unauthenticated access to login, register and logout
                                .requestMatchers(HttpMethod.POST, "/login", "/register", "/logout").permitAll()
                                // allow public GET access to recommendation/game/search APIs
                                .requestMatchers(HttpMethod.GET, "/recommendation", "/game", "/search").permitAll()
                                // all other requests should be authenticated
                                .anyRequest().authenticated()
                )
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))        // if authentication failed, return unauthorized http status
                .and()
                .formLogin()     // offer a form request
                .successHandler((req, res, auth) -> res.setStatus(HttpStatus.NO_CONTENT.value()))
                .failureHandler(new SimpleUrlAuthenticationFailureHandler())
                .and()
                .logout()
                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.NO_CONTENT));
        return http.build();
    }


    @Bean
    UserDetailsManager users(DataSource dataSource) {
        // get the user information and deal with the user authentication
        return new JdbcUserDetailsManager(dataSource);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        // convert user password to encoded password
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
