package com.gestion.produit.dto;

import java.math.BigDecimal;

public class StockStats {

    private Long totalProduits;
    private Integer stockTotal;
    private BigDecimal valeurStock;
    private Integer produitsStockFaible;

    public StockStats() {
    }

    public StockStats(Long totalProduits, Integer stockTotal, BigDecimal valeurStock, Integer produitsStockFaible) {
        this.totalProduits = totalProduits;
        this.stockTotal = stockTotal;
        this.valeurStock = valeurStock;
        this.produitsStockFaible = produitsStockFaible;
    }

    public Long getTotalProduits() {
        return totalProduits;
    }

    public void setTotalProduits(Long totalProduits) {
        this.totalProduits = totalProduits;
    }

    public Integer getStockTotal() {
        return stockTotal;
    }

    public void setStockTotal(Integer stockTotal) {
        this.stockTotal = stockTotal;
    }

    public BigDecimal getValeurStock() {
        return valeurStock;
    }

    public void setValeurStock(BigDecimal valeurStock) {
        this.valeurStock = valeurStock;
    }

    public Integer getProduitsStockFaible() {
        return produitsStockFaible;
    }

    public void setProduitsStockFaible(Integer produitsStockFaible) {
        this.produitsStockFaible = produitsStockFaible;
    }
}
