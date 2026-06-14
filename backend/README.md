# 🇲🇬 Gestion de Produits - Backend Spring Boot

Application de gestion de produits et stocks développée avec **Spring Boot 3.2**.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend React                          │
│                  (http://localhost:5173)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Spring Boot                        │
│                  (http://localhost:8080)                    │
├─────────────────────────────────────────────────────────────┤
│  Controller  →  Service  →  Repository  →  Database (H2)    │
│  /api/*      →  Logic    →  JPA/Hibernate →  MySQL/Postgres │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Structure du Projet

```
backend/
├── pom.xml                          # Configuration Maven
├── src/main/java/com/madagascar/gestionproduits/
│   ├── GestionProduitsApplication.java    # Point d'entrée
│   ├── config/
│   │   ├── WebConfig.java                 # Configuration CORS
│   │   └── GlobalExceptionHandler.java    # Gestion des erreurs
│   ├── controller/
│   │   ├── ProductController.java         # API /api/products
│   │   └── StockMovementController.java   # API /api/stock-movements
│   ├── dto/
│   │   ├── ProductDTO.java                # Transfert produits
│   │   ├── StockMovementDTO.java          # Transfert mouvements
│   │   └── StockMovementRequest.java      # Requête mouvements
│   ├── model/
│   │   ├── Product.java                   # Entity Produit
│   │   └── StockMovement.java             # Entity Mouvement
│   ├── repository/
│   │   ├── ProductRepository.java         # JPA Repository
│   │   └── StockMovementRepository.java   # JPA Repository
│   └── service/
│       ├── ProductService.java            # Logique métier produits
│       └── StockMovementService.java      # Logique métier stocks
└── src/main/resources/
    ├── application.properties             # Configuration
    └── data.sql                           # Données de démo
```

## 🚀 Démarrage Rapide

### Prérequis
- JDK 17 ou supérieur
- Maven 3.8+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### 1. Cloner et configurer
```bash
cd backend
```

### 2. Lancer l'application
```bash
# Avec Maven
mvn spring-boot:run

# Ou avec le wrapper Maven
./mvnw spring-boot:run
```

### 3. Accéder à l'application
- **Frontend React**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Console H2**: http://localhost:8080/h2-console

## 📡 Endpoints API

### Produits (`/api/products`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Lister tous les produits |
| GET | `/api/products/{id}` | Récupérer un produit |
| POST | `/api/products` | Créer un produit |
| PUT | `/api/products/{id}` | Modifier un produit |
| DELETE | `/api/products/{id}` | Supprimer un produit |
| GET | `/api/products/search?query=` | Rechercher |
| GET | `/api/products/stats` | Statistiques |

### Mouvements de Stock (`/api/stock-movements`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/stock-movements` | Tous les mouvements |
| GET | `/api/stock-movements/latest` | Derniers mouvements |
| POST | `/api/stock-movements` | Créer un mouvement |
| POST | `/api/stock-movements/entry` | Entrée de stock |
| POST | `/api/stock-movements/exit` | Sortie de stock |
| GET | `/api/stock-movements/stats` | Statistiques |

## 💾 Configuration Base de Données

### H2 (Développement - par défaut)
```properties
spring.datasource.url=jdbc:h2:mem:produits_db
spring.h2.console.enabled=true
```

### MySQL (Production)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestion_produits_mg
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### PostgreSQL (Production)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gestion_produits_mg
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
```

## 🧪 Tester l'API

### Avec cURL
```bash
# Lister les produits
curl http://localhost:8080/api/products

# Créer un produit
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Produit test","price":10000,"quantity":50}'

# Entrée de stock
curl -X POST http://localhost:8080/api/stock-movements/entry \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":100,"reason":"Réception fournisseur"}'

# Sortie de stock
curl -X POST http://localhost:8080/api/stock-movements/exit \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":20,"reason":"Vente client"}'
```

## 🔧 Fonctionnalités

- ✅ CRUD Produits complet
- ✅ Gestion des entrées/sorties de stock
- ✅ Historique des mouvements
- ✅ Statistiques en temps réel
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ CORS configuré pour React
- ✅ Données de démonstration incluses

## 📦 Technologies

- **Framework**: Spring Boot 3.2
- **Langage**: Java 17
- **ORM**: JPA / Hibernate
- **Database**: H2 (dev), MySQL/PostgreSQL (prod)
- **Build**: Maven
- **Validation**: Hibernate Validator

## 👨‍💻 Développeur

Application développée pour Madagascar 🇲🇬
