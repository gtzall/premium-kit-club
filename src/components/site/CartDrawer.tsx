import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/stores/cart";
import { brl } from "@/lib/format";
import { Minus, Plus, Trash2, MessageCircle, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PIX_KEY = "11960385479";
const WHATSAPP = "5511960385479";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal, clear } = useCart();
  const [copied, setCopied] = useState(false);

  const total = subtotal();

  function checkoutWhatsApp() {
    if (items.length === 0) return;
    const lines = items
      .map((i) => `• ${i.qty}x ${i.name} — ${brl(i.qty * i.price)}`)
      .join("%0A");
    const msg = `Olá! Quero finalizar meu pedido:%0A%0A${lines}%0A%0ATotal: ${brl(total)}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
  }

  async function copyPix() {
    await navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    toast.success("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent className="flex w-full flex-col bg-[color:var(--surface)] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Seu Carrinho</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Seu carrinho está vazio.
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3 rounded-xl border border-white/5 bg-black/30 p-3">
                  <img src={i.image} alt={i.name} className="h-20 w-16 rounded-md object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="line-clamp-2 text-sm font-semibold">{i.name}</div>
                    <div className="text-xs text-[color:var(--gold)]">{brl(i.price)}</div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-white/10">
                        <button onClick={() => setQty(i.id, i.qty - 1)} className="grid h-7 w-7 place-items-center hover:text-[color:var(--gold)]"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-xs">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} className="grid h-7 w-7 place-items-center hover:text-[color:var(--gold)]"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl font-black text-[color:var(--gold)]">{brl(total)}</span>
              </div>
              <button onClick={checkoutWhatsApp} className="btn-gold flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wider">
                <MessageCircle className="h-4 w-4" /> Finalizar no WhatsApp
              </button>
              <button onClick={copyPix} className="btn-outline-gold flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copiado!" : `PIX: ${PIX_KEY}`}
              </button>
              <button onClick={clear} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">Esvaziar carrinho</button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
