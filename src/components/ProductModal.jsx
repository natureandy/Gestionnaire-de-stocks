import React, { useState } from 'react';
import api from '../services/api';

export default function ProductModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    quantity: product?.quantity || 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (product?.id) {
        await api.products.update(product.id, formData);
      } else {
        await api.products.create(formData);
      }
      onSuccess();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-3xl border border-white/20 w-full max-w-lg shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-white">
            {product?.id ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Nom du produit *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="Ex: Riz Malagasy"
              required
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 bg-white/10 border ${errors.description ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
              placeholder="Décrivez le produit..."
              required
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Prix (Ar) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 bg-white/10 border ${errors.price ? 'border-red-500' : 'border-white/20'} rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                required
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Quantité *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-3 bg-white/10 border ${errors.quantity ? 'border-red-500' : 'border-white/20'} rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                required
              />
              {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
            >
              {loading ? 'Enregistrement...' : (product?.id ? 'Mettre à jour' : 'Créer')}
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
