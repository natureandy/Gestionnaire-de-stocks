import { useEffect, useState, useCallback } from "react";
import {
  Boxes,
  Server,
  WifiOff,
  LayoutDashboard,
  Package,
  TrendingDown,
  Wallet,
  History,
} from "lucide-react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import {
  ajouterProduit,
  listerProduits,
  supprimerProduit,
  entreeStock,
  sortieStock,
  getStockStats,
  getMouvements,
  estBackendDisponible,
} from "./services/api";
import type { Produit, MouvementStockRequest, StockStats, MouvementStock } from "./types";

export default function App() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [stats, setStats] = useState<StockStats | null>(null);
  const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "history">("dashboard");

  const fetchData = useCallback(async (query?: string) => {
    setIsLoading(true);
    try {
      const [data, statistiques, historique] = await Promise.all([
        listerProduits(query),
        getStockStats(),
        getMouvements(),
      ]);
      setProduits(data);
      setStats(statistiques);
      setMouvements(historique);
    } catch (error) {
      console.error(error);
      showNotification("Erreur lors du chargement des données", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function showNotification(message: string, type: "success" | "error") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  async function handleProductAdded(produit: Produit) {
    try {
      await ajouterProduit(produit);
      showNotification("Produit ajouté avec succès", "success");
      await fetchData(searchQuery);
    } catch (error) {
      console.error(error);
      showNotification("Erreur lors de l'ajout du produit", "error");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    try {
      await supprimerProduit(id);
      showNotification("Produit supprimé avec succès", "success");
      await fetchData(searchQuery);
    } catch (error) {
      console.error(error);
      showNotification("Erreur lors de la suppression", "error");
    }
  }

  async function handleSearch(query: string) {
    setSearchQuery(query);
    await fetchData(query);
  }

  async function handleStockMovement(
    produitId: number,
    type: "ENTREE" | "SORTIE",
    request: MouvementStockRequest
  ) {
    try {
      if (type === "ENTREE") {
        await entreeStock(produitId, request);
        showNotification("Entrée de stock enregistrée", "success");
      } else {
        await sortieStock(produitId, request);
        showNotification("Sortie de stock enregistrée", "success");
      }
      await fetchData(searchQuery);
    } catch (error: any) {
      console.error(error);
      showNotification(
        error?.response?.data?.message || error?.message || "Erreur lors du mouvement de stock",
        "error"
      );
    }
  }

  const backendOnline = estBackendDisponible();

  const statCards = [
    {
      label: "Produits",
      value: stats?.totalProduits ?? 0,
      icon: Package,
      color: "text-emerald-400",
      bg: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      label: "Stock total",
      value: stats?.stockTotal ?? 0,
      icon: Boxes,
      color: "text-teal-400",
      bg: "from-teal-500/20 to-teal-500/5",
    },
    {
      label: "Valeur du stock",
      value: stats ? `Ar ${stats.valeurStock.toLocaleString("fr-MG")}` : "Ar 0",
      icon: Wallet,
      color: "text-cyan-400",
      bg: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      label: "Stock faible",
      value: stats?.produitsStockFaible ?? 0,
      icon: TrendingDown,
      color: "text-amber-400",
      bg: "from-amber-500/20 to-amber-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-900 shadow-lg shadow-emerald-500/30">
              <Boxes className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Gestion de Stock
              </h1>
              <p className="text-sm text-slate-400">
                Suivi des produits • Madagascar 🇲🇬
              </p>
            </div>
          </div>

          <div
            className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium ${
              backendOnline
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            }`}
          >
            {backendOnline ? (
              <>
                <Server className="h-3.5 w-3.5" />
                API Spring Boot connectée
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                Mode local (localStorage)
              </>
            )}
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.bg} ${card.color}`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "dashboard"
                ? "bg-emerald-500 text-slate-900"
                : "border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Tableau de bord
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "history"
                ? "bg-emerald-500 text-slate-900"
                : "border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <History className="h-4 w-4" />
            Historique
          </button>
        </div>

        {/* Content */}
        {activeTab === "dashboard" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ProductForm onProductAdded={handleProductAdded} />
            </div>
            <div className="lg:col-span-2">
              <ProductList
                produits={produits}
                isLoading={isLoading}
                onSearch={handleSearch}
                onDelete={handleDelete}
                onStockMovement={handleStockMovement}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Historique des mouvements
            </h2>
            {mouvements.length === 0 ? (
              <p className="text-slate-500">Aucun mouvement enregistré.</p>
            ) : (
              <div className="space-y-2">
                {mouvements.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          m.type === "ENTREE"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {m.type === "ENTREE" ? "+" : "-"}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {m.type === "ENTREE" ? "Entrée" : "Sortie"} de{" "}
                          {m.quantite} unité{m.quantite > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-slate-400">
                          {m.produit?.nom || "Produit local"}
                          {m.commentaire && ` • ${m.commentaire}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {m.date
                        ? new Date(m.date).toLocaleString("fr-MG")
                        : "Date inconnue"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {notification && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl transition ${
            notification.type === "success"
              ? "bg-emerald-500 text-slate-900"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}
