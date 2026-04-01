package com.example.demo.controller;

import com.example.demo.model.Promotion;
import com.example.demo.repository.PromotionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/promotions")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionController {

    private final PromotionRepository promotionRepository;

    public PromotionController(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @PostMapping
    public ResponseEntity<?> createPromotion(@RequestBody Promotion promotion) {

        if (promotion.getCode() == null || promotion.getCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Must enter a promo code."));
        }
        
        if (promotionRepository.existsByPromoCode(promotion.getCode())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Enter a promo code that is not already in use."));
        }

        if (promotion.getDiscount() == null || promotion.getDiscount() <= 0 || promotion.getDiscount() > 1) {
            return ResponseEntity.badRequest().body(Map.of("message", "Discount must be between 0.0 and 1.0 (0 to 100%)."));
        }

        if (promotion.getStart() == null || promotion.getEnd() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Must enter start and end dates."));
        }
        if (promotion.getEnd().isBefore(promotion.getStart())) {
            return ResponseEntity.badRequest().body(Map.of("message", "End date cannot be before start date."));
        }

        Promotion savedPromo = promotionRepository.save(promotion);
        return ResponseEntity.ok(savedPromo);
    }
}
