package com.gestion.produit.repository;

import com.gestion.produit.entity.MouvementStock;
import com.gestion.produit.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {

    List<MouvementStock> findByProduitOrderByDateDesc(Produit produit);

    List<MouvementStock> findByProduitIdOrderByDateDesc(Long produitId);

    List<MouvementStock> findTop30ByOrderByDateDesc();
}
