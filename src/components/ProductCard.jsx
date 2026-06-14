import React from 'react';

export default function ProductCard({ product, onEdit, onStock, formatCurrency }) {
  const stockStatus = product.quantity > 10 
    ? { color: 'emerald', label: 'En stock' }
    : product.quantity > 0 
      ? { color: 'amber', label: 'Stock faible' }
      : { color: 'red', label: 'Rupture' };

  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    red: 'from-red-500 to-pink-500'
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden hover:border-white/30 transition-all duration-200 hover:transform hover:scale-105 hover:shadow-2xl">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${colorClasses[stockStatus.color]} p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
            {stockStatus.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <p className="text-purple-200 text-sm line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-300 text-xs">Prix</p>
            <p className="text-xl font-bold text-white">{formatCurrency(product.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-purple-300 text-xs">Stock</p>
            <p className="text-xl font-bold text-white">{product.quantity} unités</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-purple-300 text-xs">Valeur</p>
            <p className="text-lg font-semibold text-emerald-400">
              {formatCurrency(product.price * product.quantity)}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onStock(product)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-2 rounded-xl transition-all duration-200 shadow-lg"
              title="Gérer le stock"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(product)}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white p-2 rounded-xl transition-all duration-200 shadow-lg"
              title="Modifier"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
