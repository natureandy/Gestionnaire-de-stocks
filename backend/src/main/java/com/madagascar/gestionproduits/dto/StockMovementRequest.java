package com.madagascar.gestionproduits.dto;

import lombok.*;
import jakarta.validation.constraints.*;

/**
 * DTO Request - Demande de mouvement de stock
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovementRequest {

    @NotNull(message = "L'ID du produit est requis")
    private Long productId;

    @NotNull(message = "Le type de mouvement est requis")
    private String type;

    @NotNull(message = "La quantité est requise")
    @Min(value = 1, message = "La quantité doit être au moins 1")
    private Integer quantity;

    @Size(max = 500, message = "La raison ne peut pas dépasser 500 caractères")
    private String reason;

    private String createdBy;
}
