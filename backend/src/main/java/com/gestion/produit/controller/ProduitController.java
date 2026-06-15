package com.gestion.produit.controller;

import com.gestion.produit.entity.Produit;
import com.gestion.produit.service.ProduitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*")
public class ProduitController {

    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @PostMapping
    public ResponseEntity<Produit> ajouterProduit(@Valid @RequestBody Produit produit) {
        Produit nouveauProduit = produitService.ajouterProduit(produit);
        return new ResponseEntity<>(nouveauProduit, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Produit>> listerProduits(@RequestParam(required = false) String recherche) {
        List<Produit> produits;
        if (recherche != null && !recherche.isBlank()) {
            produits = produitService.rechercherParNom(recherche);
        } else {
            produits = produitService.listerTousLesProduits();
        }
        return ResponseEntity.ok(produits);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> trouverProduit(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.trouverProduitParId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> mettreAJourProduit(@PathVariable Long id, @Valid @RequestBody Produit produit) {
        return ResponseEntity.ok(produitService.mettreAJourProduit(id, produit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerProduit(@PathVariable Long id) {
        produitService.supprimerProduit(id);
        return ResponseEntity.noContent().build();
    }
}
