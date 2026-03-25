package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses") //PLACEHOLDER
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Integer addressId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zip")
    private String zip;

    public Address() {
    }

    public Integer getAddressId() {
        return addressId;
    }

    public void setId(Integer addressId) { 
        this.addressId = addressId; 
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStreet() { 
        return street; 
    }

    public void setStreet(String street) { 
        this.street = street; 
    
    }

    public String getCity() { 
        return city; 
    }

    public void setCity(String city) { 
        this.city = city; 
    }
    
    public String getState() { 
        return state; 
    }

    public void setState(String state) { 
        this.state = state; 
    }

    public String getZip() { 
        return zip; 
    }

    public void setZip(String zip) { 
        this.zip= zip; 
    }
    
}
