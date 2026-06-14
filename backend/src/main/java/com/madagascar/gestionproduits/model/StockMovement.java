package com.madagascar.gestionproduits.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity StockMovement - Historique des mouvements de stock
 * Permet de tracer les entrées et sorties de stock
 */
@Entity
@Table(name = "stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Le type de mouvement est requis")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType type;

    @NotNull(message = "La quantité est requise")
    @Min(value = 1, message = "La quantité doit être au moins 1")
    @Column(nullable = false)
    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false)
    private Integer quantityBefore;

    @Column(nullable = false)
    private Integer quantityAfter;

    @Column(nullable = false, updatable = false)
    private LocalDateTime movementDate;

    @Column
    private String createdBy;

    /**
     * Type de mouvement de stock
     */
    public enum MovementType {
        ENTRY("Entrée de stock"),
        EXIT("Sortie de stock"),
        ADJUSTMENT("Ajustement"),
        RETURN("Retour");

        private final String label;

        MovementType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    @PrePersist
    protected void onMovement() {
        movementDate = LocalDateTime.now();
    }
}
