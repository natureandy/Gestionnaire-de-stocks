import React, { useState } from 'react';
import api from '../services/api';

export default function StockMovementModal({ product, onClose, onSuccess }) {
  const [movementType, setMovementType] = useState('ENTRY');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const qty = parseInt(quantity);
    if (movementType === 'EXIT' && qty > product.quantity) {
      setErrors({ quantity: `Stock insuffisant. Maximum: ${product.quantity}` });
      setLoading(false);
      return;
    }

    try {
      await api.stockMovements.create({
        productId: product.id,
        type: movementType,
        quantity: qty,
        reason: reason || (movementType === 'ENTRY' ? 'Entrée de stock' : 'Sortie de stock'),
      });
      onSuccess();
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-3xl border border-white/20 w-full max-w-lg shadow-2xl">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-white">Gestion de Stock</h2>
          <p className="text-amber-100 mt-1">{product.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              {errors.general}
            </div>
          )}

          {/* Current Stock Info */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Stock actuel:</span>
              <span className="text-2xl font-bold text-white">{product.quantity} unités</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-purple-200">Valeur:</span>
              <span className="text-lg font-semibold text-emerald-400">
                {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', minimumFractionDigits: 0 }).format(product.price * product.quantity)}
              </span>
            </div>
          </div>

          {/* Movement Type */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Type de mouvement *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMovementType('ENTRY')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  movementType === 'ENTRY'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-purple-200 hover:border-white/30'
                }`}
              >
                <div className="text-2xl mb-2">📥</div>
                <div className="font-semibold">Entrée</div>
              </button>
              <button
                type="button"
                onClick={() => setMovementType('EXIT')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  movementType === 'EXIT'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-white/5 border-white/10 text-purple-200 hover:border-white/30'
                }`}
              >
                <div className="text-2xl mb-2">📤</div>
                <div className="font-semibold">Sortie</div>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Quantité *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={movementType === 'EXIT' ? product.quantity : undefined}
              className={`w-full px-4 py-3 bg-white/10 border ${errors.quantity ? 'border-red-500' : 'border-white/20'} rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="0"
              required
            />
            {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
            {movementType === 'EXIT' && (
              <p className="text-amber-400 text-xs mt-1">Maximum: {product.quantity} unités disponibles</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Raison</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={movementType === 'ENTRY' ? 'Ex: Réception fournisseur' : 'Ex: Vente client'}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading || !quantity}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
            >
              {loading ? 'Traitement...' : `Valider ${movementType === 'ENTRY' ? "l'entrée" : 'la sortie'}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
