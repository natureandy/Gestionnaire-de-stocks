package com.madagascar.gestionproduits.service;

import com.madagascar.gestionproduits.dto.ProductDTO;
import com.madagascar.gestionproduits.model.Product;
import com.madagascar.gestionproduits.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Product - Couche métier
 * Contient la logique métier pour la gestion des produits
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Récupère tous les produits
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Récupère un produit par son ID
     */
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + id));
        return ProductDTO.fromEntity(product);
    }

    /**
     * Crée un nouveau produit
     */
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .quantity(productDTO.getQuantity())
                .build();
        
        Product savedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(savedProduct);
    }

    /**
     * Met à jour un produit existant
     */
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + id));
        
        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return ProductDTO.fromEntity(updatedProduct);
    }

    /**
     * Supprime un produit
     */
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Produit non trouvé avec l'ID: " + id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Recherche des produits
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String query) {
        List<Product> products = productRepository.searchProducts(query);
        return products.stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Met à jour le stock d'un produit
     */
    public ProductDTO updateStock(Long productId, Integer newQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + productId));
        
        product.updateQuantity(newQuantity);
        Product updatedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(updatedProduct);
    }

    /**
     * Calcule la valeur totale du stock
     */
    @Transactional(readOnly = true)
    public BigDecimal getTotalStockValue() {
        return productRepository.getTotalStockValue();
    }

    /**
     * Calcule la quantité totale en stock
     */
    @Transactional(readOnly = true)
    public Integer getTotalQuantity() {
        Integer total = productRepository.getTotalQuantity();
        return total != null ? total : 0;
    }

    /**
     * Récupère les statistiques globales
     */
    @Transactional(readOnly = true)
    public ProductStatsDTO getProductStats() {
        long totalProducts = productRepository.count();
        Integer totalQuantity = getTotalQuantity();
        BigDecimal totalValue = getTotalStockValue();
        List<Product> lowStockProducts = productRepository.findLowStockProducts(5);
        
        return ProductStatsDTO.builder()
                .totalProducts(totalProducts)
                .totalQuantity(totalQuantity)
                .totalValue(totalValue != null ? totalValue : BigDecimal.ZERO)
                .lowStockCount(lowStockProducts.size())
                .build();
    }
}
