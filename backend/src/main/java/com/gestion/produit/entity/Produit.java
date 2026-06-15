package com.gestion.produit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "produits")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du produit est obligatoire")
    private String nom;

    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @Min(value = 0, message = "Le prix doit être positif")
    private BigDecimal prix;

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 0, message = "La quantité doit être positive")
    private Integer quantite;

    @Min(value = 0, message = "Le stock minimum doit être positif")
    private Integer stockMinimum = 5;

    private String categorie;

    public Produit() {
    }

    public Produit(String nom, String description, BigDecimal prix, Integer quantite, String categorie) {
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.quantite = quantite;
        this.categorie = categorie;
    }

    @Transient
    public BigDecimal getValeurStock() {
        return prix.multiply(BigDecimal.valueOf(quantite));
    }

    @Transient
    public boolean isStockFaible() {
        return quantite <= stockMinimum;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Integer getStockMinimum() {
        return stockMinimum;
    }

    public void setStockMinimum(Integer stockMinimum) {
        this.stockMinimum = stockMinimum;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }
}
