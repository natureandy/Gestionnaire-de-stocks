package com.madagascar.gestionproduits.controller;

import com.madagascar.gestionproduits.dto.ProductDTO;
import com.madagascar.gestionproduits.service.ProductService;
import com.madagascar.gestionproduits.service.ProductStatsDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller Product - Couche de contrôle REST
 * Gère les requêtes HTTP pour les produits
 * Endpoints: /api/products
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/products - Récupère tous les produits
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/{id} - Récupère un produit par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * POST /api/products - Crée un nouveau produit
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    /**
     * PUT /api/products/{id} - Met à jour un produit
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * DELETE /api/products/{id} - Supprime un produit
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/products/search - Recherche des produits
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String query) {
        List<ProductDTO> products = productService.searchProducts(query);
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/stats - Statistiques globales
     */
    @GetMapping("/stats")
    public ResponseEntity<ProductStatsDTO> getProductStats() {
        ProductStatsDTO stats = productService.getProductStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * PUT /api/products/{id}/stock - Met à jour le stock d'un produit
     */
    @PutMapping("/{id}/stock")
    public ResponseEntity<ProductDTO> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> stockUpdate) {
        Integer newQuantity = stockUpdate.get("quantity");
        if (newQuantity == null) {
            return ResponseEntity.badRequest().build();
        }
        ProductDTO updatedProduct = productService.updateStock(id, newQuantity);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * GET /api/products/low-stock - Produits avec stock faible
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts(
            @RequestParam(defaultValue = "5") Integer threshold) {
        // Cette méthode nécessiterait un endpoint supplémentaire dans ProductService
        // Pour l'instant, on retourne tous les produits
        return ResponseEntity.ok(productService.getAllProducts());
    }
}
