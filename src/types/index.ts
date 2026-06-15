export interface Produit {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  quantite: number;
  stockMinimum: number;
  categorie: string;
  valeurStock?: number;
  stockFaible?: boolean;
}

export interface ProduitFormData {
  nom: string;
  description: string;
  prix: string;
  quantite: string;
  stockMinimum: string;
  categorie: string;
}

export interface MouvementStockRequest {
  quantite: string;
  commentaire: string;
}

export interface MouvementStock {
  id?: number;
  produit?: Produit;
  type: "ENTREE" | "SORTIE";
  quantite: number;
  commentaire?: string;
  date?: string;
}

export interface StockStats {
  totalProduits: number;
  stockTotal: number;
  valeurStock: number;
  produitsStockFaible: number;
}
