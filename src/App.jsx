import { useEffect, useState } from 'react';
import api from './services/api';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import StockMovementModal from './components/StockMovementModal';
import StatsCard from './components/StatsCard';
import StockHistory from './components/StockHistory';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalQuantity: 0, totalValue: 0, lowStockCount: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  
  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, statsData, stockStatsData] = await Promise.all([
        api.products.getAll(),
        api.products.getStats(),
        api.stockMovements.getStats()
      ]);
      setProducts(productsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur de connexion au backend');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await api.products.search(query);
        setProducts(results);
      } catch (err) {
        setError(err.message);
      }
    } else {
      loadData();
    }
  };

  const handleProductSuccess = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setSuccessMessage(editingProduct ? 'Produit modifié avec succès !' : 'Produit ajouté avec succès !');
    setTimeout(() => setSuccessMessage(null), 3000);
    loadData();
  };

  const handleStockSuccess = () => {
    setIsStockModalOpen(false);
    setSelectedProduct(null);
    setSuccessMessage('Mouvement de stock enregistré avec succès !');
    setTimeout(() => setSuccessMessage(null), 3000);
    loadData();
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setIsStockModalOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-3 rounded-2xl shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gestion de Produits</h1>
                <p className="text-sm text-purple-200">🇲🇬 Madagascar - Spring Boot Backend</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nouveau Produit</span>
                </span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mt-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'products'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              📦 Produits
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              📊 Historique des Stocks
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </span>
              <button onClick={() => setError(null)} className="text-red-300 hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{successMessage}</span>
              </span>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-300 hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Produits"
            value={stats.totalProducts}
            icon="📦"
            gradient="from-emerald-500 to-teal-500"
          />
          <StatsCard
            title="Stock Total"
            value={`${stats.totalQuantity} unités`}
            icon="📊"
            gradient="from-amber-500 to-orange-500"
          />
          <StatsCard
            title="Valeur du Stock"
            value={formatCurrency(stats.totalValue)}
            icon="💰"
            gradient="from-violet-500 to-purple-500"
          />
          <StatsCard
            title="Stock Faible"
            value={stats.lowStockCount}
            icon="⚠️"
            gradient="from-red-500 to-pink-500"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'products' ? (
          <>
            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <svg className="mx-auto h-20 w-20 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-white">Aucun produit</h3>
                <p className="mt-2 text-purple-300">Commencez par ajouter votre premier produit.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={openEditModal}
                    onStock={openStockModal}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <StockHistory formatCurrency={formatCurrency} />
        )}

        {/* Backend Info */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
            <span>🏗️</span>
            <span>Architecture Spring Boot</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/30">
              <div className="text-3xl mb-3">📦</div>
              <h4 className="font-bold text-emerald-400 mb-2">Repository</h4>
              <p className="text-purple-200 text-sm">
                Couche d'accès aux données avec JPA/Hibernate. Gère la persistance MySQL/PostgreSQL/H2.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/30">
              <div className="text-3xl mb-3">⚙️</div>
              <h4 className="font-bold text-amber-400 mb-2">Service</h4>
              <p className="text-purple-200 text-sm">
                Couche métier avec logique de validation et gestion des mouvements de stock.
              </p>
            </div>
            <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-6 border border-violet-500/30">
              <div className="text-3xl mb-3">🎮</div>
              <h4 className="font-bold text-violet-400 mb-2">Controller</h4>
              <p className="text-purple-200 text-sm">
                API REST avec endpoints /api/products et /api/stock-movements.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 backdrop-blur-sm border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-purple-300 text-sm">
            🇲🇬 Application de Gestion de Produits - Madagascar | Backend Spring Boot + Frontend React
          </p>
        </div>
      </footer>

      {/* Modals */}
      {isProductModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
          onSuccess={handleProductSuccess}
        />
      )}

      {isStockModalOpen && selectedProduct && (
        <StockMovementModal
          product={selectedProduct}
          onClose={() => { setIsStockModalOpen(false); setSelectedProduct(null); }}
          onSuccess={handleStockSuccess}
        />
      )}
    </div>
  );
}

export default App;
