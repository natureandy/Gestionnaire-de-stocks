/**
 * Service API - Communication avec le backend Spring Boot
 * Base URL configurée pour le backend Spring Boot
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Fonction utilitaire pour les requêtes fetch
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Erreur HTTP: ${response.status}`);
    }
    
    // Pour les réponses 204 (No Content)
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * API Products
 */
export const productsApi = {
  getAll: () => fetchApi('/products'),
  getById: (id) => fetchApi(`/products/${id}`),
  create: (data) => fetchApi('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchApi(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchApi(`/products/${id}`, {
    method: 'DELETE',
  }),
  search: (query) => fetchApi(`/products/search?query=${encodeURIComponent(query)}`),
  getStats: () => fetchApi('/products/stats'),
  updateStock: (id, quantity) => fetchApi(`/products/${id}/stock`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
};

/**
 * API Stock Movements
 */
export const stockMovementsApi = {
  getAll: () => fetchApi('/stock-movements'),
  getByProduct: (productId) => fetchApi(`/stock-movements/product/${productId}`),
  getLatest: (limit = 10) => fetchApi(`/stock-movements/latest?limit=${limit}`),
  create: (data) => fetchApi('/stock-movements', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  entry: (productId, quantity, reason = 'Entrée de stock') => 
    fetchApi('/stock-movements/entry', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, reason }),
    }),
  exit: (productId, quantity, reason = 'Sortie de stock') => 
    fetchApi('/stock-movements/exit', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, reason }),
    }),
  getStats: () => fetchApi('/stock-movements/stats'),
  getDashboard: () => fetchApi('/stock-movements/dashboard'),
};

export default {
  products: productsApi,
  stockMovements: stockMovementsApi,
};
