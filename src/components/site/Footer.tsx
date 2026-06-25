import { Instagram, MessageCircle, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[color:var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <div className="font-display text-3xl font-black leading-tight">
            GN <span className="text-gold-gradient italic">Football.</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Camisas premium dos maiores clubes e seleções do mundo. Curadoria, qualidade e
            atendimento de campeão.
          </p>
        </div>

        <div>
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">Navegar</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[color:var(--gold)]">Início</Link></li>
            <li><Link to="/catalogo" className="hover:text-[color:var(--gold)]">Catálogo</Link></li>
            <li><Link to="/catalogo" search={{ cat: "retro" } as never} className="hover:text-[color:var(--gold)]">Retrô</Link></li>
            <li><Link to="/catalogo" search={{ cat: "selecoes" } as never} className="hover:text-[color:var(--gold)]">Seleções</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">Contato</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[color:var(--gold)]" /> +55 11 96038-5479</li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-[color:var(--gold)]" /> @gn.football</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[color:var(--gold)]" /> Guarulhos, SP</li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">Newsletter</div>
          <p className="text-sm text-muted-foreground">Receba drops e cupons antes de todo mundo.</p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="seu@email.com"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-[color:var(--gold)]/60"
            />
            <button className="btn-gold rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider">OK</button>
          </form>
        </div>
      </div>

      {/* Giant logotype */}
      <div className="pointer-events-none select-none overflow-hidden border-t border-white/5">
        <div className="font-display text-[clamp(5rem,18vw,16rem)] font-black leading-none tracking-tighter text-white/[0.04] text-center -mt-8">
          GN FOOTBALL
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-6 text-center text-xs text-muted-foreground md:px-8">
        © {new Date().getFullYear()} GN Football. Todos os direitos reservados.
      </div>
    </footer>
  );
}
