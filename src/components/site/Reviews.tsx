import { motion } from "motion/react";
import { Star } from "lucide-react";

const reviews = [
  { name: "Lucas M.", team: "São Paulo", text: "Camisa idêntica à oficial. Acabamento absurdo, chegou em 2 dias." },
  { name: "Bruno H.", team: "Flamengo", text: "Já comprei 3 vezes. Confio de olhos fechados. Atendimento nota 10." },
  { name: "Rafa C.", team: "Barcelona", text: "A do Travis Scott é simplesmente brutal. Recebo elogio toda vez que uso." },
  { name: "Diego A.", team: "Brasil 2002", text: "Retrô lindíssima. Tecido grosso, costura impecável. Recomendo demais." },
];

export function Reviews() {
  return (
    <section className="relative border-t border-white/5 bg-[color:var(--surface)]/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 max-w-2xl">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
            04 — Vozes da torcida
          </div>
          <h2 className="font-display text-4xl font-black leading-[1.05] md:text-6xl">
            Mais de <span className="text-gold-gradient">3 mil</span> torcedores vestidos.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass flex flex-col gap-4 rounded-2xl p-6"
            >
              <div className="flex gap-0.5 text-[color:var(--gold)]">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="font-display text-lg leading-snug">"{r.text}"</blockquote>
              <figcaption className="mt-auto text-xs uppercase tracking-widest text-muted-foreground">
                {r.name} · {r.team}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
