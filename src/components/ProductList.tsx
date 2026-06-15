import { useState } from "react";
import {
  Search,
  Trash2,
  Package,
  Tag,
  Banknote,
  Boxes,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import type { Produit, MouvementStockRequest } from "../types";

interface ProductListProps {
  produits: Produit[];
  isLoading: boolean;
  onSearch: (query: string) => void;
  onDelete: (id: number) => void;
  onStockMovement: (
    produitId: number,
    type: "ENTREE" | "SORTIE",
    request: MouvementStockRequest
  ) => void;
}

export default function ProductList({
  produits,
  isLoading,
  onSearch,
  onDelete,
  onStockMovement,
}: ProductListProps) {
  const [search, setSearch] = useState("");
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [movementType, setMovementType] = useState<"ENTREE" | "SORTIE">(
    "SORTIE"
  );
  const [quantity, setQuantity] = useState("");
  const [comment, setComment] = useState("");

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  }

  function openMovement(produitId: number, type: "ENTREE" | "SORTIE") {
    setActiveProduct(produitId);
    setMovementType(type);
    setQuantity("");
    setComment("");
  }

  function submitMovement(produitId: number) {
    if (!quantity || Number(quantity) < 1) return;
    onStockMovement(produitId, movementType, {
      quantite: quantity,
      commentaire: comment,
    });
    setActiveProduct(null);
    setQuantity("");
    setComment("");
  }

  return (
    <div className="rounded-3xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Produits en stock
          </h2>
          <p className="text-sm text-slate-400">
            {produits.length} produit{produits.length > 1 ? "s" : ""} enregistré
            {produits.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Rechercher un produit..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:w-72"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-900 border-t-emerald-500" />
        </div>
      ) : produits.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-slate-300">Aucun produit trouvé</p>
            <p className="text-sm text-slate-500">
              Ajoutez un produit pour commencer.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {produits.map((produit) => (
            <div
              key={produit.id}
              className="group relative flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 transition hover:border-emerald-500/30 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-emerald-900/20"
            >
              <button
                onClick={() => produit.id && onDelete(produit.id)}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-teal-500/20 text-emerald-400">
                <Package className="h-5 w-5" />
              </div>

              <h3 className="mb-1 font-semibold text-white line-clamp-1">
                {produit.nom}
              </h3>

              {produit.description && (
                <p className="mb-4 line-clamp-2 text-sm text-slate-400">
                  {produit.description}
                </p>
              )}

              <div className="mt-auto space-y-3">
                {produit.categorie && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-slate-300">
                      {produit.categorie}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-700/50 pt-3">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                    <Banknote className="h-4 w-4" />
                    Ar {produit.prix.toLocaleString("fr-MG")}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-300">
                    <Boxes className="h-4 w-4 text-slate-500" />
                    {produit.quantite} unité
                    {produit.quantite > 1 ? "s" : ""}
                  </div>
                </div>

                {(produit.quantite <= (produit.stockMinimum || 5) || produit.stockFaible) && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Stock faible (min: {produit.stockMinimum || 5})
                  </div>
                )}

                {activeProduct === produit.id ? (
                  <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                    <p className="text-xs font-medium text-emerald-400">
                      {movementType === "ENTREE" ? "Entrée en stock" : "Sortie de stock"}
                    </p>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Quantité"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Commentaire (optionnel)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => produit.id && submitMovement(produit.id)}
                        className="flex-1 rounded-lg bg-emerald-500 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-emerald-400"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => setActiveProduct(null)}
                        className="flex-1 rounded-lg border border-slate-700 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => produit.id && openMovement(produit.id, "ENTREE")}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                    >
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                      Entrée
                    </button>
                    <button
                      onClick={() => produit.id && openMovement(produit.id, "SORTIE")}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/20"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Sortie
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
