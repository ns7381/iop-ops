package com.cloud.ops.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.Http401AuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by Nathan on 2017/1/12.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                    .antMatchers("/yfjs-lib/**", "/app/**", "/assets/**", "/v1/login").permitAll()
                    .anyRequest().authenticated()
                .and()
                    .formLogin()
                    .loginPage("/").loginProcessingUrl("/v1/login")
                    .successHandler(successHandler())
                    .failureHandler(failureHandler())
                    .permitAll()
                .and()
                    .exceptionHandling()
                    .accessDeniedHandler(accessDeniedHandler())
                    .authenticationEntryPoint(new Http403ForbiddenEntryPoint())
                .and()
                    .logout()
                    .permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
    }

    private AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            ObjectMapper objectMapper = new ObjectMapper();
            out.print(objectMapper.writeValueAsString(authentication.getPrincipal()));
            out.flush();
        };
    }

    private AuthenticationFailureHandler failureHandler() {
        return (httpServletRequest, httpServletResponse, e) -> {
            httpServletResponse.getWriter().append("Authentication failure");
            httpServletResponse.setStatus(401);
        };
    }
    private AccessDeniedHandler accessDeniedHandler() {
        return (httpServletRequest, httpServletResponse, e) -> {
            httpServletResponse.getWriter().append("Access denied");
            httpServletResponse.setStatus(403);
        };
    }
}
