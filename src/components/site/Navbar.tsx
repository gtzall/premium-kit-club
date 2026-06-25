import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import gnLogo from "@/assets/gn-logo.png.asset.json";
import { useCart } from "@/stores/cart";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/jogadores", label: "Jogadores" },
  { to: "/catalogo", label: "Retrô", search: { cat: "retro" } },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, open: openCart } = useCart();
  const { user, isAdmin } = useAuth();
  const total = count();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-4 z-50 mx-auto flex w-fit max-w-[95vw] items-center gap-1 rounded-full px-2 py-2 transition-all",
        "glass shadow-[var(--shadow-glass)]",
        scrolled && "top-2",
      )}
    >
      <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-black overflow-hidden shrink-0">
        <img src={gnLogo.url} alt="GN Football" className="h-9 w-9 object-contain" />
      </Link>

      <nav className="hidden items-center md:flex">
        {links.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            search={l.search as never}
            className="rounded-full px-4 py-2 text-sm text-white/80 transition hover:text-white"
            activeProps={{ className: "text-[color:var(--gold)]" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-1 pl-1">
        <Link
          to={user ? "/conta" : "/auth"}
          aria-label="Conta"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:border-[color:var(--gold)]/50"
        >
          <User className="h-4 w-4" />
        </Link>
        {isAdmin && (
          <Link to="/admin" className="hidden rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[color:var(--gold)] md:inline-flex">
            Admin
          </Link>
        )}
        <button
          aria-label="Carrinho"
          onClick={openCart}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:border-[color:var(--gold)]/50"
        >
          <ShoppingBag className="h-4 w-4" />
          {total > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--gradient-gold)] text-[10px] font-bold text-[color:var(--ink)]">
              {total}
            </span>
          )}
        </button>
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl glass p-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                search={l.search as never}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-white/80 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
}
