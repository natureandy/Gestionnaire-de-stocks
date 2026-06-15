import { useState } from "react";
import { PackagePlus, Loader2 } from "lucide-react";
import type { Produit, ProduitFormData } from "../types";

interface ProductFormProps {
  onProductAdded: (produit: Produit) => void;
}

const INITIAL_FORM: ProduitFormData = {
  nom: "",
  description: "",
  prix: "",
  quantite: "",
  stockMinimum: "5",
  categorie: "",
};

export default function ProductForm({ onProductAdded }: ProductFormProps) {
  const [form, setForm] = useState<ProduitFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<ProduitFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProduitFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<ProduitFormData> = {};
    if (!form.nom.trim()) newErrors.nom = "Le nom est obligatoire";
    if (!form.prix || Number(form.prix) < 0)
      newErrors.prix = "Le prix doit être positif";
    if (!form.quantite || Number(form.quantite) < 0)
      newErrors.quantite = "La quantité doit être positive";
    if (!form.stockMinimum || Number(form.stockMinimum) < 0)
      newErrors.stockMinimum = "Le stock minimum doit être positif";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const produit: Produit = {
        nom: form.nom.trim(),
        description: form.description.trim(),
        prix: Number(form.prix),
        quantite: Number(form.quantite),
        stockMinimum: Number(form.stockMinimum),
        categorie: form.categorie.trim(),
      };
      await onProductAdded(produit);
      setForm(INITIAL_FORM);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-900 shadow-lg shadow-emerald-500/30">
          <PackagePlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Nouveau produit
          </h2>
          <p className="text-sm text-slate-400">
            Ajoutez un produit au stock
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="nom"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Nom du produit <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Ex: Riz Makalioka"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.nom && (
              <p className="mt-1 text-xs text-red-400">{errors.nom}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="categorie"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Catégorie
            </label>
            <input
              type="text"
              id="categorie"
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              placeholder="Ex: Agriculture"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="prix"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Prix (Ar) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="prix"
              name="prix"
              min="0"
              step="1"
              value={form.prix}
              onChange={handleChange}
              placeholder="45 000"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.prix && (
              <p className="mt-1 text-xs text-red-400">{errors.prix}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="quantite"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Quantité <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="quantite"
              name="quantite"
              min="0"
              step="1"
              value={form.quantite}
              onChange={handleChange}
              placeholder="100"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.quantite && (
              <p className="mt-1 text-xs text-red-400">{errors.quantite}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="stockMinimum"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Stock min
            </label>
            <input
              type="number"
              id="stockMinimum"
              name="stockMinimum"
              min="0"
              step="1"
              value={form.stockMinimum}
              onChange={handleChange}
              placeholder="5"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.stockMinimum && (
              <p className="mt-1 text-xs text-red-400">{errors.stockMinimum}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Description du produit..."
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-emerald-500/25"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Ajout en cours...
            </>
          ) : (
            <>
              <PackagePlus className="h-4 w-4" />
              Ajouter le produit
            </>
          )}
        </button>
      </form>
    </div>
  );
}
