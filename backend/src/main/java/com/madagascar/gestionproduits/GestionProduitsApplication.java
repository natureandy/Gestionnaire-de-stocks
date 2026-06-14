package com.madagascar.gestionproduits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application principale - Gestion de Produits Madagascar
 * Architecture: Controller → Service → Repository
 */
@SpringBootApplication
public class GestionProduitsApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionProduitsApplication.class, args);
        System.out.println("🇲🇬 Application Gestion de Produits démarrée avec succès!");
    }
}
