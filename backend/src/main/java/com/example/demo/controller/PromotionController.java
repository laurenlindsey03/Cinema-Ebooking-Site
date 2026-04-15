package com.example.demo.controller;

import com.example.demo.model.Promotion;
import com.example.demo.repository.PromotionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;

import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import java.util.List;


import java.util.Map;

@RestController
@RequestMapping("/admin/promotions")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionController {

    private final PromotionRepository promotionRepository;
    private final UserRepository userRepository; 
    private final JavaMailSender mailSender;  

    public PromotionController(PromotionRepository promotionRepository, UserRepository userRepository, JavaMailSender mailSender) {
        this.promotionRepository = promotionRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    @PostMapping
    public ResponseEntity<?> createPromotion(@RequestBody Promotion promotion) {

        if (promotion.getCode() == null || promotion.getCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Must enter a promo code."));
        }
        
        if (promotionRepository.existsByCode(promotion.getCode())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Enter a promo code that is not already in use."));
        }

        if (promotion.getDiscount() == null || promotion.getDiscount() <= 0 || promotion.getDiscount() > 100) {
            return ResponseEntity.badRequest().body(Map.of("message", "Discount must be between 0 and 100%"));
        }

        if (promotion.getStart() == null || promotion.getEnd() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Must enter start and end dates."));
        }
        if (promotion.getEnd().isBefore(promotion.getStart())) {
            return ResponseEntity.badRequest().body(Map.of("message", "End date cannot be before start date."));
        }

        Promotion savedPromo = promotionRepository.save(promotion);

        List<User> subscribedUsers = userRepository.findByReceivePromotionsTrue();

        String subject = "Cinema E-Booking Promotion: " + savedPromo.getDiscount() + "% off!";
        String body = "Use promo code " + savedPromo.getCode() + " to get " + 
                      savedPromo.getDiscount() + "% off your next booking.\n" +
                      "This offer is valid from " + savedPromo.getStart() + 
                      " to " + savedPromo.getEnd() + "!\n";

        for (User user : subscribedUsers) {
            try {
                SimpleMailMessage emailMessage = new SimpleMailMessage();
                emailMessage.setTo(user.getEmail());
                emailMessage.setSubject(subject);
                emailMessage.setText(body);
                mailSender.send(emailMessage);
            } catch (Exception e) {
                System.out.println("Failed to send promo email.");
            }
        }

        return ResponseEntity.ok(savedPromo);

    }
}
