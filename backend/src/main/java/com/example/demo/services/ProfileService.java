package com.example.demo.services;

import com.example.demo.model.Address;
import com.example.demo.model.Card;
import com.example.demo.model.User;
import com.example.demo.model.UserPreference;
import com.example.demo.repository.AddressRepository;
import com.example.demo.repository.CardRepository;
import com.example.demo.repository.UserPreferenceRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class ProfileService {
    
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CardRepository cardRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    private static final String SECRET = "MySuperSecretKey";

    public ProfileService(UserRepository userRepository, AddressRepository addressRepository, CardRepository cardRepository, UserPreferenceRepository userPreferenceRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.cardRepository = cardRepository;
        this.userPreferenceRepository = userPreferenceRepository;
    }

    public Address saveOrUpdateAddress(Integer userId, Address newAddress) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByUser(user).orElse(new Address());
        address.setUser(user);
        address.setStreet(newAddress.getStreet());
        address.setCity(newAddress.getCity());
        address.setState(newAddress.getState());
        address.setZip(newAddress.getZip());

        return addressRepository.save(address);
    }

    public List<Card> getCards(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return cardRepository.findByUser(user);
}

    public Card addCard(Integer userId, Card card) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        long count = cardRepository.countByUser(user);
        if (count >= 3) {
            throw new RuntimeException("User cannot havee more than 3 payment cards.");
        }

        String encrypted = encryptCardNumber(card.getEncryptedCardNumber());
        card.setEncryptedCardNumber(encrypted);

        card.setUser(user);
        return cardRepository.save(card);
    }

    public UserPreference savePreferences(Integer userId, UserPreference incoming) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        UserPreference pref = userPreferenceRepository.findById(userId).orElse(new UserPreference());

        pref.setUser(user);
        pref.setFavoriteGenres(incoming.getFavoriteGenres());
        pref.setPrefferedLanguage(incoming.getPrefferedLanguage());

        return userPreferenceRepository.save(pref);
    }

    public UserPreference getPreferences(Integer userId) {
        return userPreferenceRepository.findById(userId).orElse(null);
    }

    private String encryptCardNumber(String cardNumber) {
        try {
            SecretKeySpec key = new SecretKeySpec(SECRET.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] encrypted = cipher.doFinal(cardNumber.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Card encryption failed");
        }
    }
}
