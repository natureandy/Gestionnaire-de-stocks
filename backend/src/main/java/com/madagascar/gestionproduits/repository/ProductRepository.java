package com.madagascar.gestionproduits.repository;

import com.madagascar.gestionproduits.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository Product - Couche d'accès aux données
 * Interface avec JPA pour les opérations CRUD
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Recherche des produits par nom (case insensitive)
     */
    List<Product> findByNameContainingIgnoreCase(String name);

    /**
     * Recherche des produits par description (case insensitive)
     */
    List<Product> findByDescriptionContainingIgnoreCase(String description);

    /**
     * Recherche complète (nom OU description)
     */
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);

    /**
     * Compte le nombre total de produits
     */
    long count();

    /**
     * Calcule la valeur totale du stock (SUM de price * quantity)
     */
    @Query("SELECT SUM(p.price * p.quantity) FROM Product p")
    BigDecimal getTotalStockValue();

    /**
     * Calcule la quantité totale en stock
     */
    @Query("SELECT SUM(p.quantity) FROM Product p")
    Integer getTotalQuantity();

    /**
     * Trouve les produits avec stock faible
     */
    @Query("SELECT p FROM Product p WHERE p.quantity <= :threshold ORDER BY p.quantity ASC")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);

    /**
     * Trouve les produits en rupture de stock
     */
    List<Product> findByQuantityLessThanEqual(Integer quantity);
}
