## Mudanças

### 1. Footer — remover Newsletter
Remover a coluna inteira de Newsletter do `Footer.tsx` e ajustar o grid para 3 colunas.

### 2. PromoBanner — fusão real com o resto do site
Hoje ainda tem `py-28/40` + máscara local que cria uma "ilha". Vou:
- Remover o background próprio do banner; manter apenas conteúdo.
- Criar um wrapper único em `routes/index.tsx` que aplica UMA camada de imagem de campo esfumada cobrindo `CategoriesGrid → FeaturedProducts → PromoBanner → FAQ`, com parallax leve e máscara só nas pontas (topo do bloco e base antes do Footer). Resultado: todas as seções compartilham a mesma "atmosfera".

### 3. CMS no site (admin único edita tudo)
Novas tabelas no banco:
- `products` — id, slug, name, category, price, original_price, image_url, badges (text[]), featured (bool), active (bool), description, sizes (text[]), stock.
- `promotions` — id, title, subtitle, discount_label, cta_text, cta_url, image_url, active, sort.
- `site_settings` — key/value JSON (para textos do hero, etc — opcional, começo só com products + promotions).
- Bucket de Storage `product-images` (público) para upload de fotos.

RLS:
- SELECT público (anon + authenticated) só em rows `active=true`.
- INSERT/UPDATE/DELETE só para `has_role(auth.uid(),'admin')`.
- Bucket: leitura pública, escrita só admin.

Seed: migrar os ~30 produtos atuais de `src/data/products.ts` para a tabela via INSERT.
Após migração, `FeaturedProducts`, `CategoriesGrid` filtros e `/catalogo` leem do banco (TanStack Query) em vez do array estático. O array vira só fallback de tipos.

### 4. Admin — CRUD completo
Adicionar abas no `/_authenticated/admin`:
- **Produtos**: tabela com inline edit (preço, destaque, ativo), botão "Novo", modal de edição com upload de imagem direto pro bucket, campos badges/tamanhos/descrição/estoque.
- **Promoções (banner)**: lista + criar/editar/excluir; toggle ativo controla qual aparece no PromoBanner da home.
- Manter abas Clientes e Stats.

### 5. Seção VIP pública na home
Nova `VipShowcase.tsx` entre `FeaturedProducts` e `PromoBanner`:
- Headline "Clube GN VIP"
- 3 cards de vantagens (Drops antecipados, Entrega prioritária, Descontos exclusivos)
- Critério: 5+ peças compradas vira VIP automaticamente
- CTA: se logado e não‑VIP → "Faltam X peças"; se VIP → "Você é VIP"; se deslogado → "Entrar / Criar conta"
- Mesma atmosfera esfumada (sem caixa rígida).

### 6. PromoBanner dinâmico
Lê a promoção ativa de `promotions` (a primeira `active=true` ordenada por `sort`). Se nenhuma ativa, oculta a seção.

## Detalhes técnicos
- Storage: bucket `product-images` público; upload via `supabase.storage.from('product-images').upload(...)` no modal admin; retorna `getPublicUrl`.
- Queries: `useQuery(['products'])`, `useQuery(['promotion-active'])`, `useQuery(['admin-products'])` separadas. Invalidate após mutation.
- Tipos: regenerados automaticamente após migração.

## Fora de escopo
- Editor de textos do hero/FAQ (pode entrar depois via `site_settings`).
- Checkout real / pagamento PIX (segue WhatsApp + cópia de chave).
