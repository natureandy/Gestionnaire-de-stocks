package com.madagascar.gestionproduits.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * DTO StockMovement - Transfert de données pour les mouvements de stock
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovementDTO {

    private Long id;

    private Long productId;

    private String productName;

    @NotNull(message = "Le type de mouvement est requis")
    private String type;

    @NotNull(message = "La quantité est requise")
    @Min(value = 1, message = "La quantité doit être au moins 1")
    private Integer quantity;

    private String reason;

    private Integer quantityBefore;

    private Integer quantityAfter;

    private LocalDateTime movementDate;

    private String createdBy;

    /**
     * Convertit un StockMovement en StockMovementDTO
     */
    public static StockMovementDTO fromEntity(com.madagascar.gestionproduits.model.StockMovement movement) {
        return StockMovementDTO.builder()
                .id(movement.getId())
                .productId(movement.getProduct().getId())
                .productName(movement.getProduct().getName())
                .type(movement.getType().name())
                .quantity(movement.getQuantity())
                .reason(movement.getReason())
                .quantityBefore(movement.getQuantityBefore())
                .quantityAfter(movement.getQuantityAfter())
                .movementDate(movement.getMovementDate())
                .createdBy(movement.getCreatedBy())
                .build();
    }
}
