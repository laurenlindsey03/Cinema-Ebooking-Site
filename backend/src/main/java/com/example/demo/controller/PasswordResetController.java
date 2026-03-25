package com.example.demo.controller;

import com.example.demo.model.PasswordReset;
import com.example.demo.services.PasswordResetService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request/{userId}")
    public PasswordReset requestReset(@PathVariable Integer userId) {
        return passwordResetService.createResetToken(userId);
    }

    @PostMapping("/reset")
    public String resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPasswordHash = body.get("newPasswordHash");
        return passwordResetService.resetPassword(token, newPasswordHash);
    }
    
}
