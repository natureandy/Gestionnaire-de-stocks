package com.madagascar.gestionproduits.repository;

import com.madagascar.gestionproduits.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository StockMovement - Couche d'accès aux données
 * Interface avec JPA pour les opérations CRUD sur les mouvements de stock
 */
@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    /**
     * Récupère tous les mouvements pour un produit donné
     */
    List<StockMovement> findByProductIdOrderByMovementDateDesc(Long productId);

    /**
     * Récupère les mouvements par type
     */
    List<StockMovement> findByTypeOrderByMovementDateDesc(StockMovement.MovementType type);

    /**
     * Récupère les mouvements dans une période donnée
     */
    @Query("SELECT sm FROM StockMovement sm WHERE sm.movementDate BETWEEN :startDate AND :endDate ORDER BY sm.movementDate DESC")
    List<StockMovement> findByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Compte les mouvements par type
     */
    long countByType(StockMovement.MovementType type);

    /**
     * Calcule la quantité totale entrée
     */
    @Query("SELECT COALESCE(SUM(sm.quantity), 0) FROM StockMovement sm WHERE sm.type = 'ENTRY'")
    Integer getTotalEntryQuantity();

    /**
     * Calcule la quantité totale sortie
     */
    @Query("SELECT COALESCE(SUM(sm.quantity), 0) FROM StockMovement sm WHERE sm.type = 'EXIT'")
    Integer getTotalExitQuantity();

    /**
     * Récupère les derniers mouvements (pour dashboard)
     */
    @Query("SELECT sm FROM StockMovement sm ORDER BY sm.movementDate DESC LIMIT :limit")
    List<StockMovement> findLatestMovements(@Param("limit") int limit);
}
