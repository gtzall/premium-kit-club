import { Truck, ShieldCheck, RefreshCcw, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

const items = [
  { Icon: Truck, title: "Entrega rápida", desc: "Em até 48h nas capitais." },
  { Icon: ShieldCheck, title: "Qualidade premium", desc: "Tecido oficial Dry-Fit." },
  { Icon: RefreshCcw, title: "Troca garantida", desc: "Até 7 dias, sem dor de cabeça." },
  { Icon: MessageCircle, title: "Suporte 24h", desc: "Resposta no WhatsApp." },
];

export function BenefitsBar() {
  return (
    <section className="relative border-y border-white/5 bg-[color:var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-x-6 gap-y-10 px-5 py-14 md:grid-cols-4 md:px-8">
        {items.map(({ Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex items-start gap-4"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/5">
              <Icon className="h-5 w-5 text-[color:var(--gold)]" />
            </div>
            <div>
              <div className="font-display text-lg font-bold">{title}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
