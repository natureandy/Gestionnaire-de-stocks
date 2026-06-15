package com.gestion.produit.service;

import com.gestion.produit.dto.MouvementStockRequest;
import com.gestion.produit.dto.StockStats;
import com.gestion.produit.entity.MouvementStock;
import com.gestion.produit.entity.Produit;
import com.gestion.produit.entity.TypeMouvement;
import com.gestion.produit.repository.MouvementStockRepository;
import com.gestion.produit.repository.ProduitRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StockService {

    private final ProduitRepository produitRepository;
    private final MouvementStockRepository mouvementStockRepository;

    public StockService(ProduitRepository produitRepository,
                        MouvementStockRepository mouvementStockRepository) {
        this.produitRepository = produitRepository;
        this.mouvementStockRepository = mouvementStockRepository;
    }

    @Transactional
    public MouvementStock entreeStock(Long produitId, MouvementStockRequest request) {
        Produit produit = trouverProduit(produitId);
        produit.setQuantite(produit.getQuantite() + request.getQuantite());
        produitRepository.save(produit);

        MouvementStock mouvement = new MouvementStock(
                produit,
                TypeMouvement.ENTREE,
                request.getQuantite(),
                request.getCommentaire()
        );
        return mouvementStockRepository.save(mouvement);
    }

    @Transactional
    public MouvementStock sortieStock(Long produitId, MouvementStockRequest request) {
        Produit produit = trouverProduit(produitId);

        if (produit.getQuantite() < request.getQuantite()) {
            throw new IllegalArgumentException(
                    "Stock insuffisant. Disponible : " + produit.getQuantite()
            );
        }

        produit.setQuantite(produit.getQuantite() - request.getQuantite());
        produitRepository.save(produit);

        MouvementStock mouvement = new MouvementStock(
                produit,
                TypeMouvement.SORTIE,
                request.getQuantite(),
                request.getCommentaire()
        );
        return mouvementStockRepository.save(mouvement);
    }

    @Transactional(readOnly = true)
    public List<MouvementStock> historiqueMouvements(Long produitId) {
        return mouvementStockRepository.findByProduitIdOrderByDateDesc(produitId);
    }

    @Transactional(readOnly = true)
    public List<MouvementStock> derniersMouvements() {
        return mouvementStockRepository.findTop30ByOrderByDateDesc();
    }

    @Transactional(readOnly = true)
    public StockStats getStats() {
        List<Produit> produits = produitRepository.findAll();

        long totalProduits = produits.size();
        int stockTotal = produits.stream().mapToInt(Produit::getQuantite).sum();
        BigDecimal valeurStock = produits.stream()
                .map(Produit::getValeurStock)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int produitsStockFaible = (int) produits.stream()
                .filter(Produit::isStockFaible)
                .count();

        return new StockStats(totalProduits, stockTotal, valeurStock, produitsStockFaible);
    }

    private Produit trouverProduit(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé avec l'id : " + id));
    }
}
