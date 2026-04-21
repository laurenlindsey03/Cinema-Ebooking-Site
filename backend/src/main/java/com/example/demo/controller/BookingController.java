package com.example.demo.controller;

import com.example.demo.facade.CheckoutFacade;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final CheckoutFacade checkoutFacade;

    public BookingController(CheckoutFacade checkoutFacade) {
        this.checkoutFacade = checkoutFacade;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> processCheckout(@RequestBody Map<String, Object> payload) {
        Map<String, Object> result = checkoutFacade.processOrder(payload);
        return ResponseEntity.ok(result);
    }
}