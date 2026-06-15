# Gestion de Stock — Madagascar

Application full-stack de **gestion de stock** avec un **backend Spring Boot** (Controller / Service / Repository) et un **frontend React + Vite + Tailwind CSS**.

> 💡 Le backend est entièrement écrit en **Java Spring Boot**. Les fichiers TypeScript ne concernent que le frontend React, comme imposé par l'environnement de build.

## Fonctionnalités

### Produits
- Ajouter un produit
- Lister les produits
- Rechercher un produit
- Supprimer un produit

### Gestion de stock
- **Entrée de stock** (ajouter des unités)
- **Sortie de stock** (retirer des unités)
- Historique des mouvements
- Stock minimum avec alerte stock faible

### Tableau de bord
- Nombre total de produits
- Quantité totale en stock
- Valeur totale du stock (en Ariary)
- Nombre de produits en stock faible

## Architecture backend

```
backend/src/main/java/com/gestion/produit/
├── controller/
│   ├── ProduitController.java      # API REST produits
│   └── StockController.java        # API REST mouvements de stock
├── service/
│   ├── ProduitService.java         # Logique métier produits
│   └── StockService.java           # Logique métier stock
├── repository/
│   ├── ProduitRepository.java      # Accès données produits
│   └── MouvementStockRepository.java
├── entity/
│   ├── Produit.java
│   ├── MouvementStock.java
│   └── TypeMouvement.java
├── dto/
│   ├── MouvementStockRequest.java
│   └── StockStats.java
└── GestionProduitApplication.java
```

## Base de données

### Développement (par défaut)
Base de données **H2** en mémoire, configurée dans `application.properties`.
Console H2 : `http://localhost:8080/h2-console`

### Production
Profil **PostgreSQL** disponible dans `application-prod.properties`.
Activez-le avec :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Démarrage

### 1. Backend Spring Boot

```bash
cd backend
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`.

#### Endpoints API

Produits :
- `POST   /api/produits`              → Ajouter un produit
- `GET    /api/produits`              → Lister les produits
- `GET    /api/produits?recherche=...` → Rechercher par nom
- `GET    /api/produits/{id}`         → Détails d'un produit
- `PUT    /api/produits/{id}`         → Modifier un produit
- `DELETE /api/produits/{id}`         → Supprimer un produit

Stock :
- `POST /api/stock/entree/{produitId}`   → Entrée de stock
- `POST /api/stock/sortie/{produitId}`   → Sortie de stock
- `GET  /api/stock/stats`                → Statistiques du stock
- `GET  /api/stock/mouvements`           → Derniers mouvements
- `GET  /api/stock/mouvements/{produitId}` → Historique par produit

### 2. Frontend React

```bash
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173`.

## Construction du frontend

```bash
npm run build
```

Les fichiers statiques sont générés dans le dossier `dist/`.
