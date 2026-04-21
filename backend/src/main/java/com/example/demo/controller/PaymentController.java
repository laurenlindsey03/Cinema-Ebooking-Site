package com.example.demo.controller;

import com.example.demo.model.CardResponse;
import com.example.demo.services.ProfileService; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final ProfileService profileService;

    public PaymentController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/saved-cards")
    public ResponseEntity<List<CardResponse>> getSavedCards(@RequestParam Integer userId) {
        return ResponseEntity.ok(profileService.getCards(userId));
    }

}