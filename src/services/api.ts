import axios from "axios";
import type {
  Produit,
  MouvementStock,
  MouvementStockRequest,
  StockStats,
} from "../types";

const API_URL = "http://localhost:8080/api";

const STORAGE_KEY = "produits";
const MOVEMENTS_KEY = "mouvements_stock";

let backendDisponible = true;

function getLocalProduits(): Produit[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalProduits(produits: Produit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produits));
}

function getLocalMovements(): MouvementStock[] {
  const data = localStorage.getItem(MOVEMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalMovements(movements: MouvementStock[]) {
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
}

export async function listerProduits(recherche?: string): Promise<Produit[]> {
  if (backendDisponible) {
    try {
      const response = await axios.get(`${API_URL}/produits`, {
        params: recherche ? { recherche } : {},
        timeout: 1500,
      });
      return response.data;
    } catch (error) {
      backendDisponible = false;
      console.warn("Backend indisponible, utilisation du stockage local.", error);
    }
  }

  const produits = getLocalProduits();
  if (recherche) {
    return produits.filter((p) =>
      p.nom.toLowerCase().includes(recherche.toLowerCase())
    );
  }
  return produits;
}

export async function ajouterProduit(produit: Produit): Promise<Produit> {
  if (backendDisponible) {
    try {
      const response = await axios.post(`${API_URL}/produits`, produit, {
        timeout: 1500,
      });
      return response.data;
    } catch (error) {
      backendDisponible = false;
      console.warn("Backend indisponible, sauvegarde locale.", error);
    }
  }

  const produits = getLocalProduits();
  const nouveauProduit = {
    ...produit,
    id: Date.now(),
    valeurStock: produit.prix * produit.quantite,
    stockFaible: produit.quantite <= produit.stockMinimum,
  };
  produits.unshift(nouveauProduit);
  saveLocalProduits(produits);
  return nouveauProduit;
}

export async function supprimerProduit(id: number): Promise<void> {
  if (backendDisponible) {
    try {
      await axios.delete(`${API_URL}/produits/${id}`, { timeout: 1500 });
      return;
    } catch (error) {
      backendDisponible = false;
      console.warn("Backend indisponible, suppression locale.", error);
    }
  }

  const produits = getLocalProduits().filter((p) => p.id !== id);
  saveLocalProduits(produits);
}

export async function entreeStock(
  produitId: number,
  request: MouvementStockRequest
): Promise<MouvementStock> {
  if (backendDisponible) {
    try {
      const response = await axios.post(
        `${API_URL}/stock/entree/${produitId}`,
        request,
        { timeout: 1500 }
      );
      return response.data;
    } catch (error) {
      backendDisponible = false;
      console.warn("Backend indisponible, mouvement local.", error);
    }
  }

  const produits = getLocalProduits();
  const produit = produits.find((p) => p.id === produitId);
  if (!produit) throw new Error("Produit non trouvé");

  const qte = Number(request.quantite);
  produit.quantite += qte;
  produit.valeurStock = produit.prix * produit.quantite;
  produit.stockFaible = produit.quantite <= produit.stockMinimum;
  saveLocalProduits(produits);

  const mouvement: MouvementStock = {
    id: Date.now(),
    produit,
    type: "ENTREE",
    quantite: qte,
    commentaire: request.commentaire,
    date: new Date().toISOString(),
  };
  const movements = getLocalMovements();
  movements.unshift(mouvement);
  saveLocalMovements(movements);
  return mouvement;
}

export async function sortieStock(
  produitId: number,
  request: MouvementStockRequest
): Promise<MouvementStock> {
  if (backendDisponible) {
    try {
      const response = await axios.post(
        `${API_URL}/stock/sortie/${produitId}`,
        request,
        { timeout: 1500 }
      );
      return response.data;
    } catch (error) {
      backendDisponible = false;
      console.warn("Backend indisponible, mouvement local.", error);
    }
  }

  const produits = getLocalProduits();
  const produit = produits.find((p) => p.id === produitId);
  if (!produit) throw new Error("Produit non trouvé");

  const qte = Number(request.quantite);
  if (produit.quantite < qte) throw new Error("Stock insuffisant");

  produit.quantite -= qte;
  produit.valeurStock = produit.prix * produit.quantite;
  produit.stockFaible = produit.quantite <= produit.stockMinimum;
  saveLocalProduits(produits);

  const mouvement: MouvementStock = {
    id: Date.now(),
    produit,
    type: "SORTIE",
    quantite: qte,
    commentaire: request.commentaire,
    date: new Date().toISOString(),
  };
  const movements = getLocalMovements();
  movements.unshift(mouvement);
  saveLocalMovements(movements);
  return mouvement;
}

export async function getStockStats(): Promise<StockStats> {
  if (backendDisponible) {
    try {
      const response = await axios.get(`${API_URL}/stock/stats`, {
        timeout: 1500,
      });
      return response.data;
    } catch (error) {
      backendDisponible = false;
      console.warn("Backend indisponible, stats locales.", error);
    }
  }

  const produits = getLocalProduits();
  const stockTotal = produits.reduce((sum, p) => sum + p.quantite, 0);
  const valeurStock = produits.reduce((sum, p) => sum + p.prix * p.quantite, 0);
  const produitsStockFaible = produits.filter(
    (p) => p.quantite <= p.stockMinimum
  ).length;

  return {
    totalProduits: produits.length,
    stockTotal,
    valeurStock,
    produitsStockFaible,
  };
}

export async function getMouvements(): Promise<MouvementStock[]> {
  if (backendDisponible) {
    try {
      const response = await axios.get(`${API_URL}/stock/mouvements`, {
        timeout: 1500,
      });
      return response.data;
    } catch (error) {
      backendDisponible = false;
      console.warn("Backend indisponible, mouvements locaux.", error);
    }
  }
  return getLocalMovements();
}

export function estBackendDisponible(): boolean {
  return backendDisponible;
}
