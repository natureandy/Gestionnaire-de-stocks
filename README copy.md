# 🇲🇬 Gestion de Produits - Madagascar

Application complète de gestion de produits et stocks avec **Backend Spring Boot** et **Frontend React**.

## 📋 Vue d'ensemble

| Composant | Technologie | Port |
|-----------|-------------|------|
| **Frontend** | React + Vite + Tailwind CSS | 5173 |
| **Backend** | Spring Boot 3.2 + Java 17 | 8080 |
| **Database** | H2 (dev) / MySQL / PostgreSQL | - |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  - Interface utilisateur moderne et stylisée                │
│  - Gestion des produits et stocks                           │
│  - Historique des mouvements                                │
│  - Statistiques en temps réel                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Spring Boot)                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐          │
│  │Controller│ →  │ Service  │ →  │  Repository  │          │
│  │  /api/*  │    │  Logique │    │   JPA/H2     │          │
│  └──────────┘    └──────────┘    └──────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Démarrage

### 1. Lancer le Backend Spring Boot
```bash
cd backend
mvn spring-boot:run
```

Le backend démarre sur **http://localhost:8080**

### 2. Lancer le Frontend React
```bash
# Dans un autre terminal
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

## ✨ Fonctionnalités

### Frontend React
- 📦 **Gestion des produits** (CRUD complet)
- 📊 **Statistiques** (total produits, stock, valeur)
- 📥📤 **Entrées/Sorties de stock** avec historique
- 🔍 **Recherche** de produits
- 🎨 **Design moderne** avec thème sombre stylé
- 💰 **Devise Malgache** (Ariary - MGA)

### Backend Spring Boot
- 🏗️ **Architecture MVC** (Controller/Service/Repository)
- 📡 **API REST** complète
- 💾 **Base de données** H2/MySQL/PostgreSQL
- ✅ **Validation** des données
- 🚨 **Gestion des erreurs**
- 🔓 **CORS** configuré

## 📡 API Endpoints

### Produits
- `GET /api/products` - Lister tous
- `POST /api/products` - Créer
- `PUT /api/products/{id}` - Modifier
- `DELETE /api/products/{id}` - Supprimer
- `GET /api/products/stats` - Statistiques

### Mouvements de Stock
- `POST /api/stock-movements/entry` - Entrée
- `POST /api/stock-movements/exit` - Sortie
- `GET /api/stock-movements` - Historique
- `GET /api/stock-movements/stats` - Stats

## 🎨 Thème et Design

- **Palette**: Violet, Émeraude, Cyan, Amber
- **Style**: Glassmorphism avec effets de flou
- **Animations**: Background animé, transitions fluides
- **Responsive**: Mobile, Tablette, Desktop

## 📁 Structure

```
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/madagascar/gestionproduits/
│   │       ├── controller/     # API REST
│   │       ├── service/        # Logique métier
│   │       ├── repository/     # Accès données
│   │       ├── model/          # Entities JPA
│   │       └── dto/            # Data Transfer Objects
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql
│
├── src/                        # React Frontend
│   ├── components/             # Composants UI
│   ├── services/               # API calls
│   ├── App.jsx                 # Component principal
│   └── main.jsx                # Point d'entrée
│
└── README.md                   # Ce fichier
```

## 🔧 Configuration

### Backend - Base de données

Par défaut, l'application utilise **H2 en mémoire** pour le développement.

Pour utiliser **MySQL** en production, modifier `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestion_produits_mg
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### Frontend - API URL

Modifier `src/services/api.js` si le backend n'est pas sur `localhost:8080`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📊 Données de Démo

Le backend inclut des données de démonstration avec des produits malgaches:
- Riz Malagasy
- Café de Madagascar
- Vanille de Sava
- Miel Naturel
- Huile de Coco
- Épices Masala
- Chocolat Noir
- Rhum Arrangeur
- Savon Naturel
- Panier Vannerie

## 🛠️ Technologies

### Backend
- Java 17
- Spring Boot 3.2
- Spring Data JPA
- Hibernate Validator
- H2 Database
- Maven

### Frontend
- React 18
- Vite
- Tailwind CSS
- JavaScript (ES6+)

## 📝 License

Application développée pour Madagascar 🇲🇬
