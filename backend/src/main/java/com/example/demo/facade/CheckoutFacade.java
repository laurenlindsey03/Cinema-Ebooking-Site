package com.example.demo.facade;

import java.util.Map;

public interface CheckoutFacade {
    Map<String, Object> processOrder(Map<String, Object> payload);
}
