
## Mudanças visuais (Home)

**Navbar**
- Trocar o "G" placeholder pelo logo real `gn_football_logo.png` (upload via lovable-assets).
- Remover o texto "GN Football / Premium Jerseys" ao lado — manter só o escudo dentro da pílula glass, no estilo Panenka (logo + links na mesma barra arredondada flutuante centralizada).

**Hero**
- Remover badge "Coleção 2025/26 / Edição limitada / Entrega expressa" (eyebrow rotativo).
- Remover o ticker/marquee superior ("Frete grátis...").
- Fixar UMA imagem de fundo (a dos jogadores: `jogadores_futebol_limpo.png`) — sem carrossel de slides nem indicadores.
- Conteúdo central (título + subtítulo + CTAs centralizados), estilo Panenka "THE DUGOUT IS WAITING".
- Imagem do campo (`hero-field`) passa a aparecer mais abaixo, como transição esfumada para a próxima seção (gradiente vertical, sem corte duro).

**Atmosfera unificada**
- Remover `BenefitsBar` (faixa "Entrega rápida / Qualidade premium...").
- Remover `Reviews` ("Vozes da torcida").
- Substituir bordas/cards sólidos entre seções por gradientes radiais/lineares contínuos, de forma que Hero → Categorias → Destaques → FAQ pareçam a mesma cena esfumada.

**FAQ (nova seção)**
- Componente `FAQ.tsx` no estilo da imagem: título grande "PERGUNTAS FREQUENTES", lista de accordions com fundo translúcido escuro e ícone "+".
- Perguntas: autenticidade, formas de pagamento, prazo de entrega, troca, como virar VIP, frete grátis.

**Página dedicada `/jogadores`**
- Nova rota usando a imagem `jogadores_futebol_limpo.png` em destaque (hero da página) com copy sobre a marca/atletas.
- Adicionar link "Jogadores" na navbar.

## Funcionalidades

**Carrinho funcional**
- Store global com Zustand: `useCart` (add, remove, updateQty, clear, totals).
- `CartDrawer` (shadcn `Sheet`) com lista de itens, subtotal, botão "Finalizar no WhatsApp" (monta mensagem) e botão "Pagar com PIX" (placeholder copy-to-clipboard chave PIX).
- `JerseyCard` ganha botão "Adicionar"; badge do carrinho no header reflete contagem real.
- Persistência em `localStorage`.

**Auth (Lovable Cloud) — Admin & VIP**
- Habilitar email+senha (Google fica para depois para reduzir escopo).
- Tabelas via migração:
  - `profiles (id uuid PK = auth.users.id, full_name, total_purchased_items int default 0, created_at)`
  - `app_role` enum: `admin | vip | user`
  - `user_roles (id, user_id, role, unique(user_id,role))`
  - Função `has_role(uuid, app_role)` SECURITY DEFINER.
  - GRANTs + RLS conforme padrão.
  - Trigger `handle_new_user` cria profile no signup.
- Rota `/auth` (login + signup).
- Rota `/conta` (perfil, contagem de peças compradas, status VIP, vantagens listadas).
- Rota `/_authenticated/_admin/admin` para painel admin (apenas placeholder de listagem por enquanto, pois CRUD completo é Fase 3).
- Lógica VIP: a flag de VIP é concedida automaticamente quando `total_purchased_items >= 5` (configurável). Vantagens exibidas: drops antecipados, entrega prioritária, descontos.

## Detalhes técnicos

- Upload do logo: `lovable-assets create --file /mnt/user-uploads/gn_football_logo.png --filename gn-logo.png > src/assets/gn-logo.png.asset.json`.
- Upload da imagem jogadores: idem → `src/assets/players-hero.png.asset.json`.
- `Hero.tsx`: remover state `i`, slides, marquee. Fundo único = players-hero. Adicionar overlay vertical com `hero-field` no rodapé do hero (`absolute bottom-0 h-[60%]` com `mask-image` gradiente para fundir).
- `useCart` em `src/stores/cart.ts` (Zustand + persist middleware).
- `src/components/site/CartDrawer.tsx` controlado por estado no Navbar.
- `src/lib/auth.ts` helpers: `signIn`, `signUp`, `signOut`, `useAuth` hook lendo `onAuthStateChange`.
- Painel admin atrás de `_authenticated/_admin` checando `has_role(uid,'admin')` via server fn.

## Fora de escopo (próxima fase)

- CRUD completo de produtos no admin (criar/editar/remover do banco) — hoje produtos vivem em `src/data/products.ts`. Vou estruturar o painel já preparado para receber, mas migrar produtos para o banco fica para a Fase 3.
- Integração real PIX com gateway (hoje será chave estática + comprovante por WhatsApp).
- Google OAuth (pode ser adicionado depois sem refactor).

Confirma para eu implementar tudo isso?
