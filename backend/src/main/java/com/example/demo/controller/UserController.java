package com.example.demo.controller;

import com.example.demo.model.PasswordReset;
import com.example.demo.model.User;
import com.example.demo.services.UserServices;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private final UserServices userServices;

    public UserController(UserServices userServices) {
        this.userServices = userServices;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userServices.register(user);
    }

    @GetMapping("/verify")
    public String verifyAccount(@RequestParam String token) {
        return userServices.verifyAccount(token);
    }

    @GetMapping("/{userId}")
        public User getUser(@PathVariable Integer userId) {
        return userServices.getUserById(userId);
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> body) {
        return userServices.login(body.get("email"), body.get("password"));
    }

    @PostMapping("/forgot-password")
    public PasswordReset forgotPassword(@RequestBody Map<String, String> body) {
        return userServices.requestPasswordReset(body.get("email"));
    }

    @PostMapping("/reset-password")
    public User resetPassword(@RequestBody Map<String, String> body) {
        return userServices.resetForgottenPassword(body.get("token"), body.get("newPassword"));
    }

    @PutMapping("/{userId}/change-password")
    public String changePassword(@PathVariable Integer userId, @RequestBody Map<String, String> body) {
        userServices.changePassword(userId, body.get("oldPassword"), body.get("newPassword"));
        return "Password changed successfully";
    }

    @PutMapping("/{userId}/profile")
    public User updateProfile(@PathVariable Integer userId, @RequestBody User user) {
        return userServices.updateProfile(userId, user);
    }
}
