-- ============================================
-- Données de démonstration - Madagascar 🇲🇬
-- ============================================

-- Insertion de produits de démonstration
INSERT INTO products (name, description, price, quantity, created_at, updated_at) VALUES
('Riz Malagasy - 5kg', 'Riz blanc de qualité supérieure, produit localement à Madagascar', 25000, 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Café de Madagascar - 250g', 'Café arabica torréfié, origine Manakara', 18000, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vanille de Sava - 100g', 'Vanille bourbon de première qualité, région Sava', 45000, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Miel Naturel - 500ml', 'Miel pur des ruches de Madagascar', 12000, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Huile de Coco - 1L', 'Huile de coco vierge, pressée à froid', 15000, 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Épices Masala - 200g', 'Mélange d''épices traditionnelles malgaches', 8000, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chocolat Noir - 100g', 'Chocolat artisanal à base de cacao de Madagascar', 10000, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rhum Arrangeur - 70cl', 'Rhum traditionnel aux fruits tropicaux', 35000, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Savon Naturel - Pack 3', 'Savons artisanaux aux huiles essentielles', 9000, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Panier Vannerie', 'Panier tressé main par des artisans locaux', 20000, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertion de mouvements de stock de démonstration
INSERT INTO stock_movements (product_id, type, quantity, reason, quantity_before, quantity_after, movement_date, created_by) VALUES
(1, 'ENTRY', 100, 'Réception de commande fournisseur', 50, 150, CURRENT_TIMESTAMP, 'Admin'),
(2, 'ENTRY', 50, 'Réception de commande fournisseur', 30, 80, CURRENT_TIMESTAMP, 'Admin'),
(3, 'ENTRY', 30, 'Réception de commande fournisseur', 20, 50, CURRENT_TIMESTAMP, 'Admin'),
(4, 'ENTRY', 60, 'Réception de commande fournisseur', 40, 100, CURRENT_TIMESTAMP, 'Admin'),
(5, 'ENTRY', 50, 'Réception de commande fournisseur', 25, 75, CURRENT_TIMESTAMP, 'Admin'),
(1, 'EXIT', 20, 'Vente client #001', 150, 130, CURRENT_TIMESTAMP, 'Vendeur1'),
(2, 'EXIT', 10, 'Vente client #002', 80, 70, CURRENT_TIMESTAMP, 'Vendeur1'),
(6, 'ENTRY', 80, 'Réception de commande fournisseur', 40, 120, CURRENT_TIMESTAMP, 'Admin'),
(7, 'ENTRY', 40, 'Réception de commande fournisseur', 20, 60, CURRENT_TIMESTAMP, 'Admin'),
(8, 'ENTRY', 25, 'Réception de commande fournisseur', 15, 40, CURRENT_TIMESTAMP, 'Admin'),
(9, 'ENTRY', 150, 'Réception de commande fournisseur', 50, 200, CURRENT_TIMESTAMP, 'Admin'),
(10, 'ENTRY', 20, 'Réception de commande fournisseur', 10, 30, CURRENT_TIMESTAMP, 'Admin'),
(3, 'EXIT', 5, 'Vente client #003', 50, 45, CURRENT_TIMESTAMP, 'Vendeur2'),
(1, 'EXIT', 30, 'Vente client #004', 130, 100, CURRENT_TIMESTAMP, 'Vendeur2'),
(5, 'EXIT', 15, 'Vente client #005', 75, 60, CURRENT_TIMESTAMP, 'Vendeur1'),
(4, 'ENTRY', 40, 'Réception de commande fournisseur', 60, 100, CURRENT_TIMESTAMP, 'Admin'),
(6, 'EXIT', 25, 'Vente client #006', 120, 95, CURRENT_TIMESTAMP, 'Vendeur1'),
(7, 'EXIT', 10, 'Vente client #007', 60, 50, CURRENT_TIMESTAMP, 'Vendeur2'),
(9, 'EXIT', 50, 'Vente client #008', 200, 150, CURRENT_TIMESTAMP, 'Vendeur1'),
(1, 'ENTRY', 50, 'Réception de commande fournisseur', 100, 150, CURRENT_TIMESTAMP, 'Admin');
