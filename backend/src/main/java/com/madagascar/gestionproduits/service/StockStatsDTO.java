package com.madagascar.gestionproduits.service;

import lombok.*;

/**
 * DTO Statistics - Statistiques des mouvements de stock
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockStatsDTO {

    private Integer totalEntryQuantity;

    private Integer totalExitQuantity;

    private long entryCount;

    private long exitCount;
}
