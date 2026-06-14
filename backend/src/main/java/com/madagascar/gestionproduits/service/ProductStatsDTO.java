package com.madagascar.gestionproduits.service;

import lombok.*;
import java.math.BigDecimal;

/**
 * DTO Statistics - Statistiques globales des produits
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductStatsDTO {

    private long totalProducts;

    private Integer totalQuantity;

    private BigDecimal totalValue;

    private Integer lowStockCount;
}
