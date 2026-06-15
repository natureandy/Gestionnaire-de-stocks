package com.gestion.produit.controller;

import com.gestion.produit.dto.MouvementStockRequest;
import com.gestion.produit.dto.StockStats;
import com.gestion.produit.entity.MouvementStock;
import com.gestion.produit.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/entree/{produitId}")
    public ResponseEntity<MouvementStock> entreeStock(
            @PathVariable Long produitId,
            @Valid @RequestBody MouvementStockRequest request) {
        return ResponseEntity.ok(stockService.entreeStock(produitId, request));
    }

    @PostMapping("/sortie/{produitId}")
    public ResponseEntity<MouvementStock> sortieStock(
            @PathVariable Long produitId,
            @Valid @RequestBody MouvementStockRequest request) {
        return ResponseEntity.ok(stockService.sortieStock(produitId, request));
    }

    @GetMapping("/mouvements/{produitId}")
    public ResponseEntity<List<MouvementStock>> historique(@PathVariable Long produitId) {
        return ResponseEntity.ok(stockService.historiqueMouvements(produitId));
    }

    @GetMapping("/mouvements")
    public ResponseEntity<List<MouvementStock>> derniersMouvements() {
        return ResponseEntity.ok(stockService.derniersMouvements());
    }

    @GetMapping("/stats")
    public ResponseEntity<StockStats> statistiques() {
        return ResponseEntity.ok(stockService.getStats());
    }
}
