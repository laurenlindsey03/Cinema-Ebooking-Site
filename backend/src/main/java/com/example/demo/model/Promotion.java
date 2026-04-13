package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String code;

    // store as integer X% (not as 0.X)
    @Column(nullable = false)
    private Integer discount;

    @Column(nullable = false)
    private LocalDate start;

    @Column(nullable = false)
    private LocalDate end;

    public Integer getId() { 
        return id; 
    }

    public void setId(Integer id) { 
        this.id = id; 
    }

    public String getCode() { 
        return code; 
    }
    
    public void setCode(String code) { 
        this.code = code; 
    }

    public Integer getDiscount() { 
        return discount; 
    }

    public void setDiscount(Integer discount) { 
        this.discount = discount; 
    }

    public LocalDate getStart() { 
        return start; 
    }

    public void setStart(LocalDate start) { 
        this.start = start; 
    }

    public LocalDate getEnd() { 
        return end; 
    }

    public void setEnd(LocalDate end) { 
        this.end = end; 
    }

}