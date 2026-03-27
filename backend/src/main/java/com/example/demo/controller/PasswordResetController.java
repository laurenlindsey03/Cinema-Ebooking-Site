package com.example.demo.controller;

import com.example.demo.model.PasswordReset;
import com.example.demo.services.PasswordResetService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> requestReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        passwordResetService.requestPasswordReset(email);
        return ResponseEntity.ok("link sent");
    }

    @PostMapping("/reset")
    public String resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPasswordHash = body.get("newPasswordHash");
        return passwordResetService.resetPassword(token, newPasswordHash);
    }
    
}
