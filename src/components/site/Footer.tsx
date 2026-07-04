import { Instagram, MessageCircle, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[color:var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-3 md:px-8">
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
      </div>

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
