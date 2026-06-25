import { motion } from "motion/react";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { brl } from "@/lib/format";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";

interface Props {
  product: Product;
  onAddToCart?: (p: Product) => void;
  onSelect?: (p: Product) => void;
  index?: number;
}

export function JerseyCard({ product, onAddToCart, onSelect, index = 0 }: Props) {
  const addToCart = useCart((s) => s.add);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = (p: Product) => {
    if (onAddToCart) onAddToCart(p);
    else {
      addToCart(p);
      toast.success(`${p.name} adicionado ao carrinho`);
    }
  };


  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      <button
        type="button"
        onClick={() => onSelect?.(product)}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--surface)] text-left"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--gradient-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--ink)]">
            -{discount}%
          </span>
        )}
        {product.featured && discount === 0 && (
          <span className="absolute left-3 top-3 rounded-full border border-[color:var(--gold)]/40 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--gold-soft)] backdrop-blur">
            Destaque
          </span>
        )}

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd(product);
            }}

            className="btn-gold flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-wider"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </button>
        </div>
      </button>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {product.league && (
            <div className="truncate text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {product.league}
            </div>
          )}
          <h3 className="mt-1 truncate font-display text-base font-bold">{product.name}</h3>
        </div>
        <div className="shrink-0 text-right">
          {product.originalPrice && (
            <div className="text-[11px] text-muted-foreground line-through">
              {brl(product.originalPrice)}
            </div>
          )}
          <div className="font-display text-lg font-black text-[color:var(--gold)]">
            {brl(product.price)}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
