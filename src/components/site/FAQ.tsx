import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "As camisas são originais?",
    a: "Trabalhamos com versões torcedor de altíssima qualidade (tecido oficial Dry-Fit), produzidas pelas mesmas fábricas que fornecem aos clubes. Acabamento e estampa idênticos ao modelo oficial.",
  },
  {
    q: "Quais são as formas de pagamento?",
    a: "Aceitamos PIX (com 5% de desconto), cartão de crédito em até 6x e pagamento via WhatsApp com link seguro.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "Capitais: 24h a 48h via SEDEX. Demais regiões: 3 a 7 dias úteis. Clientes VIP têm prioridade no envio.",
  },
  {
    q: "Posso trocar se não servir?",
    a: "Sim! Você tem até 7 dias após o recebimento para trocar de tamanho ou modelo, sem custo adicional.",
  },
  {
    q: "Como me torno cliente VIP?",
    a: "Comprando 5 ou mais peças. Os VIPs recebem drops antecipados, entrega com prioridade e descontos exclusivos.",
  },
  {
    q: "Tem frete grátis?",
    a: "Sim — para pedidos acima de R$ 200 enviados dentro do Brasil.",
  },
];

export function FAQ() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <h2 className="text-center font-display text-4xl font-black uppercase leading-[1.05] md:text-6xl">
          Perguntas <span className="text-gold-gradient italic">frequentes</span>
        </h2>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 backdrop-blur-sm transition hover:border-[color:var(--gold)]/30"
            >
              <AccordionTrigger className="py-5 text-left text-sm font-semibold uppercase tracking-wide hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-white/70">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
