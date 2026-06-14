package com.madagascar.gestionproduits.service;

import com.madagascar.gestionproduits.dto.StockMovementDTO;
import com.madagascar.gestionproduits.dto.StockMovementRequest;
import com.madagascar.gestionproduits.model.Product;
import com.madagascar.gestionproduits.model.StockMovement;
import com.madagascar.gestionproduits.repository.ProductRepository;
import com.madagascar.gestionproduits.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service StockMovement - Couche métier pour les mouvements de stock
 * Gère les entrées et sorties de stock
 */
@Service
@RequiredArgsConstructor
@Transactional
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;

    /**
     * Crée un mouvement de stock (entrée ou sortie)
     */
    public StockMovementDTO createMovement(StockMovementRequest request) {
        // Vérifier que le produit existe
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + request.getProductId()));

        // Valider le type de mouvement
        StockMovement.MovementType movementType;
        try {
            movementType = StockMovement.MovementType.valueOf(request.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Type de mouvement invalide: " + request.getType());
        }

        // Pour une sortie, vérifier qu'il y a assez de stock
        if (movementType == StockMovement.MovementType.EXIT) {
            if (product.getQuantity() < request.getQuantity()) {
                throw new RuntimeException(
                    String.format("Stock insuffisant pour le produit '%s'. Stock actuel: %d, demandé: %d",
                        product.getName(), product.getQuantity(), request.getQuantity())
                );
            }
        }

        // Sauvegarder la quantité avant le mouvement
        Integer quantityBefore = product.getQuantity();

        // Mettre à jour la quantité du produit selon le type de mouvement
        Integer newQuantity;
        switch (movementType) {
            case ENTRY:
            case RETURN:
                newQuantity = quantityBefore + request.getQuantity();
                break;
            case EXIT:
                newQuantity = quantityBefore - request.getQuantity();
                break;
            case ADJUSTMENT:
                newQuantity = request.getQuantity(); // Ajustement direct
                break;
            default:
                throw new RuntimeException("Type de mouvement non supporté: " + movementType);
        }

        // Mettre à jour le produit
        product.updateQuantity(newQuantity);
        productRepository.save(product);

        // Créer le mouvement de stock
        StockMovement movement = StockMovement.builder()
                .product(product)
                .type(movementType)
                .quantity(request.getQuantity())
                .reason(request.getReason())
                .quantityBefore(quantityBefore)
                .quantityAfter(newQuantity)
                .createdBy(request.getCreatedBy())
                .build();

        StockMovement savedMovement = stockMovementRepository.save(movement);
        return StockMovementDTO.fromEntity(savedMovement);
    }

    /**
     * Récupère tous les mouvements de stock
     */
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getAllMovements() {
        return stockMovementRepository.findAll().stream()
                .map(StockMovementDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les mouvements pour un produit spécifique
     */
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getMovementsByProduct(Long productId) {
        return stockMovementRepository.findByProductIdOrderByMovementDateDesc(productId).stream()
                .map(StockMovementDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les derniers mouvements
     */
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getLatestMovements(int limit) {
        return stockMovementRepository.findLatestMovements(limit).stream()
                .map(StockMovementDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les mouvements dans une période
     */
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return stockMovementRepository.findByDateRange(startDate, endDate).stream()
                .map(StockMovementDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Calcule les statistiques des mouvements
     */
    @Transactional(readOnly = true)
    public StockStatsDTO getStockStats() {
        Integer totalEntry = stockMovementRepository.getTotalEntryQuantity();
        Integer totalExit = stockMovementRepository.getTotalExitQuantity();
        long entryCount = stockMovementRepository.countByType(StockMovement.MovementType.ENTRY);
        long exitCount = stockMovementRepository.countByType(StockMovement.MovementType.EXIT);

        return StockStatsDTO.builder()
                .totalEntryQuantity(totalEntry != null ? totalEntry : 0)
                .totalExitQuantity(totalExit != null ? totalExit : 0)
                .entryCount(entryCount)
                .exitCount(exitCount)
                .build();
    }
}
