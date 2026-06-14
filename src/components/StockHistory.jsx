import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function StockHistory({ formatCurrency }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const data = await api.stockMovements.getLatest(50);
      setMovements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'ENTRY':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: '📥 Entrée' };
      case 'EXIT':
        return { bg: 'bg-red-500/20', text: 'text-red-400', label: '📤 Sortie' };
      case 'ADJUSTMENT':
        return { bg: 'bg-amber-500/20', text: 'text-amber-400', label: '⚙️ Ajustement' };
      case 'RETURN':
        return { bg: 'bg-violet-500/20', text: 'text-violet-400', label: '↩️ Retour' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: type };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-MG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <span>📊</span>
          <span>Historique des Mouvements de Stock</span>
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : movements.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto h-20 w-20 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-white">Aucun mouvement</h3>
          <p className="mt-2 text-purple-300">Les mouvements de stock apparaîtront ici.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Avant → Après</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Raison</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {movements.map((movement) => {
                const badge = getTypeBadge(movement.type);
                return (
                  <tr key={movement.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                      {formatDate(movement.movementDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">{movement.productName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${movement.type === 'ENTRY' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {movement.type === 'ENTRY' ? '+' : '-'}{movement.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                      {movement.quantityBefore} → {movement.quantityAfter}
                    </td>
                    <td className="px-6 py-4 text-sm text-purple-200">
                      {movement.reason || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
