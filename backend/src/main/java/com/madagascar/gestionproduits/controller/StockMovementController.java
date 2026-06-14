package com.madagascar.gestionproduits.controller;

import com.madagascar.gestionproduits.dto.StockMovementDTO;
import com.madagascar.gestionproduits.dto.StockMovementRequest;
import com.madagascar.gestionproduits.service.StockMovementService;
import com.madagascar.gestionproduits.service.StockStatsDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller StockMovement - Couche de contrôle REST
 * Gère les requêtes HTTP pour les mouvements de stock
 * Endpoints: /api/stock-movements
 */
@RestController
@RequestMapping("/api/stock-movements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    /**
     * GET /api/stock-movements - Récupère tous les mouvements
     */
    @GetMapping
    public ResponseEntity<List<StockMovementDTO>> getAllMovements() {
        List<StockMovementDTO> movements = stockMovementService.getAllMovements();
        return ResponseEntity.ok(movements);
    }

    /**
     * GET /api/stock-movements/product/{productId} - Mouvements d'un produit
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockMovementDTO>> getMovementsByProduct(
            @PathVariable Long productId) {
        List<StockMovementDTO> movements = stockMovementService.getMovementsByProduct(productId);
        return ResponseEntity.ok(movements);
    }

    /**
     * GET /api/stock-movements/latest - Derniers mouvements
     */
    @GetMapping("/latest")
    public ResponseEntity<List<StockMovementDTO>> getLatestMovements(
            @RequestParam(defaultValue = "10") int limit) {
        List<StockMovementDTO> movements = stockMovementService.getLatestMovements(limit);
        return ResponseEntity.ok(movements);
    }

    /**
     * GET /api/stock-movements/date-range - Mouvements par période
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<StockMovementDTO>> getMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<StockMovementDTO> movements = stockMovementService.getMovementsByDateRange(startDate, endDate);
        return ResponseEntity.ok(movements);
    }

    /**
     * POST /api/stock-movements - Crée un mouvement de stock
     * Types supportés: ENTRY, EXIT, ADJUSTMENT, RETURN
     */
    @PostMapping
    public ResponseEntity<StockMovementDTO> createMovement(
            @Valid @RequestBody StockMovementRequest request) {
        StockMovementDTO createdMovement = stockMovementService.createMovement(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMovement);
    }

    /**
     * POST /api/stock-movements/entry - Entrée de stock (raccourci)
     */
    @PostMapping("/entry")
    public ResponseEntity<StockMovementDTO> entryStock(
            @RequestBody Map<String, Object> request) {
        StockMovementRequest movementRequest = StockMovementRequest.builder()
                .productId(Long.valueOf(request.get("productId").toString()))
                .type("ENTRY")
                .quantity((Integer) request.get("quantity"))
                .reason((String) request.getOrDefault("reason", "Entrée de stock"))
                .createdBy((String) request.getOrDefault("createdBy", "System"))
                .build();
        
        StockMovementDTO createdMovement = stockMovementService.createMovement(movementRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMovement);
    }

    /**
     * POST /api/stock-movements/exit - Sortie de stock (raccourci)
     */
    @PostMapping("/exit")
    public ResponseEntity<StockMovementDTO> exitStock(
            @RequestBody Map<String, Object> request) {
        StockMovementRequest movementRequest = StockMovementRequest.builder()
                .productId(Long.valueOf(request.get("productId").toString()))
                .type("EXIT")
                .quantity((Integer) request.get("quantity"))
                .reason((String) request.getOrDefault("reason", "Sortie de stock"))
                .createdBy((String) request.getOrDefault("createdBy", "System"))
                .build();
        
        StockMovementDTO createdMovement = stockMovementService.createMovement(movementRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMovement);
    }

    /**
     * GET /api/stock-movements/stats - Statistiques des mouvements
     */
    @GetMapping("/stats")
    public ResponseEntity<StockStatsDTO> getStockStats() {
        StockStatsDTO stats = stockMovementService.getStockStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/stock-movements/dashboard - Données pour le dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("stats", stockMovementService.getStockStats());
        dashboard.put("latestMovements", stockMovementService.getLatestMovements(5));
        return ResponseEntity.ok(dashboard);
    }
}
