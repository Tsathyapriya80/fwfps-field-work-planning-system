package com.example.backend.service;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public boolean authenticate(String username, String password) {
        // Mock authentication logic
        return "user".equals(username) && "password".equals(password);
    }
}