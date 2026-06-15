package com.gestion.produit.service;

import com.gestion.produit.entity.Produit;
import com.gestion.produit.repository.MouvementStockRepository;
import com.gestion.produit.repository.ProduitRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final MouvementStockRepository mouvementStockRepository;

    public ProduitService(ProduitRepository produitRepository,
                          MouvementStockRepository mouvementStockRepository) {
        this.produitRepository = produitRepository;
        this.mouvementStockRepository = mouvementStockRepository;
    }

    public Produit ajouterProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    public List<Produit> listerTousLesProduits() {
        return produitRepository.findAll();
    }

    public Produit trouverProduitParId(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé avec l'id : " + id));
    }

    public List<Produit> rechercherParNom(String nom) {
        return produitRepository.findByNomContainingIgnoreCase(nom);
    }

    public Produit mettreAJourProduit(Long id, Produit produitMisAJour) {
        Produit produitExistant = trouverProduitParId(id);
        produitExistant.setNom(produitMisAJour.getNom());
        produitExistant.setDescription(produitMisAJour.getDescription());
        produitExistant.setPrix(produitMisAJour.getPrix());
        produitExistant.setQuantite(produitMisAJour.getQuantite());
        produitExistant.setStockMinimum(produitMisAJour.getStockMinimum());
        produitExistant.setCategorie(produitMisAJour.getCategorie());
        return produitRepository.save(produitExistant);
    }

    @Transactional
    public void supprimerProduit(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé avec l'id : " + id));
        mouvementStockRepository.deleteAll(mouvementStockRepository.findByProduitOrderByDateDesc(produit));
        produitRepository.delete(produit);
    }
}
