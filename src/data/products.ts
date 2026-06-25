// Catálogo importado de gn-football.kyte.site
export type Category =
  | "europeus"
  | "brasileiros"
  | "selecoes"
  | "retro"
  | "conjuntos";

export interface Product {
  id: string;
  slug: string;
  name: string;
  team?: string;
  league?: string;
  category: Category;
  price: number;
  originalPrice?: number;
  image: string;
  featured?: boolean;
}

const k = (id: string) =>
  `https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/4J0LPNaH3IYyOuz8PlGcwgkbwol2%2Fthumb_280_${id}.jpg?alt=media`;

export const products: Product[] = [
  // Times Europeus
  { id: "barca-travis", slug: "barcelona-x-travis-scott", name: "Camisa Barcelona x Travis Scott", team: "Barcelona", league: "La Liga", category: "europeus", price: 149.9, originalPrice: 200, image: k("D938876D-E975-4836-B030-E4B46CEBC211"), featured: true },
  { id: "alnassr", slug: "al-nassr", name: "Camisa Al Nassr", team: "Al Nassr", league: "Saudi League", category: "europeus", price: 149.9, image: k("2F2F1226-9B01-4E4A-B6B0-84E8AC04B25D") },
  { id: "barca2526", slug: "barcelona-2025-26", name: "Camisa Barcelona 2025/26", team: "Barcelona", league: "La Liga", category: "europeus", price: 149.9, image: k("7D38A4EE-A7D5-488B-9D2B-012D60DFBB10"), featured: true },
  { id: "celta", slug: "celta-de-vigo-100-anos", name: "Camisa Celta de Vigo — 100 anos", team: "Celta de Vigo", league: "La Liga", category: "europeus", price: 149.9, image: k("C3B52533-3000-4701-ABA4-ED603E42CE2F") },
  { id: "fulham", slug: "fulham-2025-26", name: "Camisa Fulham 2025/26", team: "Fulham", league: "Premier League", category: "europeus", price: 149.9, image: k("13675F8F-4FA9-4AB6-9AFE-033C44E78C20") },
  { id: "napoli", slug: "napoli-2024-25", name: "Camisa Napoli 2024/25", team: "Napoli", league: "Serie A", category: "europeus", price: 149.9, image: k("3913724A-577C-4020-893B-5376A76087C0") },
  { id: "marseille", slug: "olympique-marseille", name: "Camisa Olympique de Marseille", team: "Marseille", league: "Ligue 1", category: "europeus", price: 159.9, image: k("BBB829C2-9E2B-43CE-B15C-B8B097D0E278") },
  { id: "porto", slug: "porto", name: "Camisa Porto", team: "FC Porto", league: "Primeira Liga", category: "europeus", price: 149.9, image: k("E19A6BE2-30E0-4C19-990E-D861AE899CC6") },
  { id: "psg", slug: "psg", name: "Camisa PSG", team: "Paris Saint-Germain", league: "Ligue 1", category: "europeus", price: 149.9, image: k("A0A7436F-A6F8-48B1-B48D-BE26AF7AF3E0"), featured: true },
  { id: "tottenham", slug: "tottenham-2025-26", name: "Camiseta Tottenham 2025/26", team: "Tottenham", league: "Premier League", category: "europeus", price: 149.9, image: k("4964B46E-12E3-4C8B-B316-3F45E7BB5EE2") },

  // Times Brasileiros
  { id: "corinthians", slug: "corinthians-2026", name: "Camisa Corinthians 2026", team: "Corinthians", league: "Brasileirão", category: "brasileiros", price: 149.9, image: k("BB93567D-7D2B-4BDC-9C25-3ED1F9EFA01D"), featured: true },
  { id: "cruzeiro", slug: "cruzeiro-treino", name: "Camisa Cruzeiro — Treino", team: "Cruzeiro", league: "Brasileirão", category: "brasileiros", price: 169.9, image: k("7B1F6D2C-DFA3-4120-8C5E-AA05A8F51D9D") },
  { id: "flamengo", slug: "flamengo-treino", name: "Camisa Flamengo — Treino", team: "Flamengo", league: "Brasileirão", category: "brasileiros", price: 169.9, image: k("10119DA4-90CE-4C7C-B348-67E3B4FBD9C9"), featured: true },
  { id: "palmeiras", slug: "palmeiras-2025-26", name: "Camisa Palmeiras 2025/26", team: "Palmeiras", league: "Brasileirão", category: "brasileiros", price: 149.9, image: k("5E0A3C8B-5FBE-4FC6-91FB-979A3EA1BE8E") },
  { id: "santos", slug: "santos-2025-26", name: "Camisa Santos 2025/26", team: "Santos", league: "Brasileirão", category: "brasileiros", price: 149.9, image: k("A327F7DC-8A31-42AF-951A-3E214BFB12AA") },
  { id: "santos-cbjr", slug: "santos-charlie-brown-jr", name: "Camisa Santos x Charlie Brown Jr", team: "Santos", league: "Brasileirão", category: "brasileiros", price: 149.9, image: k("5A397CB8-2CC0-49FA-BA15-2C8BF4A814DF") },

  // Seleções
  { id: "brasil-gk", slug: "brasil-goleiro", name: "Camisa Brasil (Goleiro)", team: "Brasil", league: "Seleção", category: "selecoes", price: 199.9, image: k("36FB98D1-BEB5-44AC-8D55-39482DBE3845") },
  { id: "brasil-2026", slug: "brasil-jogador-2026", name: "Camisa Brasil Modelo Jogador 2026", team: "Brasil", league: "Seleção", category: "selecoes", price: 175, originalPrice: 500, image: k("594102F9-25EB-48F7-8CDA-92F19B82FF4D"), featured: true },

  // Retrô
  { id: "milan2006", slug: "ac-milan-2006", name: "Camisa AC Milan 2006", team: "AC Milan", league: "Retrô", category: "retro", price: 219.9, image: k("93536513-3EDD-40EF-865B-83941FC02E2B") },
  { id: "brasil2002", slug: "brasil-2002", name: "Camisa Brasil 2002", team: "Brasil", league: "Retrô", category: "retro", price: 219.9, image: k("8DB4916A-0536-4FDC-9584-B39AFE213A86"), featured: true },
  { id: "brasilazul2004", slug: "brasil-azul-2004", name: "Camisa Brasil Azul 2004", team: "Brasil", league: "Retrô", category: "retro", price: 220, image: k("2F4C4B29-CE74-401E-ACE3-6B87A38B99FE") },
  { id: "england1998", slug: "inglaterra-1998", name: "Camisa Inglaterra 1998", team: "Inglaterra", league: "Retrô", category: "retro", price: 219.9, image: k("BC506875-68EE-40A1-8408-4E7CFF7C0921") },
  { id: "italia95", slug: "italia-1995-96", name: "Camisa Itália 1995/96", team: "Itália", league: "Retrô", category: "retro", price: 199.9, image: k("863AE3E8-226E-46F7-9825-643FF9A63E90") },
  { id: "manu2008", slug: "manchester-united-final-uefa-2008", name: "Camisa Manchester United — Final UEFA 2008", team: "Manchester United", league: "Retrô", category: "retro", price: 199.9, originalPrice: 250, image: k("B561B524-36F9-404D-BFFB-74CA051DF114") },

  // Conjuntos
  { id: "conj-alemanha", slug: "conjunto-alemanha", name: "Conjunto Alemanha", team: "Alemanha", league: "Conjunto", category: "conjuntos", price: 249.9, image: k("C23CBF7C-7BA4-4F35-A7E9-2AA9CCD65465") },
  { id: "conj-holanda", slug: "conjunto-holanda", name: "Conjunto Holanda", team: "Holanda", league: "Conjunto", category: "conjuntos", price: 249.9, image: k("3B9E3570-E94C-41C1-A59F-6164AC08BFEF") },
  { id: "conj-juve", slug: "conjunto-juventus", name: "Conjunto Juventus", team: "Juventus", league: "Conjunto", category: "conjuntos", price: 249.9, image: k("0A47FC29-472C-4342-B293-448493AB5383") },
  { id: "conj-real", slug: "conjunto-real-madrid", name: "Conjunto Real Madrid", team: "Real Madrid", league: "Conjunto", category: "conjuntos", price: 249.9, image: k("FF78BA68-9DFD-43E3-B1E6-005936E14BFC") },
  { id: "conj-spfc", slug: "conjunto-sao-paulo", name: "Conjunto São Paulo", team: "São Paulo", league: "Conjunto", category: "conjuntos", price: 279.9, image: k("F6A5290D-04C9-42E6-83F8-499E5CAEEB96") },
  { id: "corta-spfc", slug: "corta-vento-sao-paulo", name: "Corta-vento São Paulo Oficial", team: "São Paulo", league: "Conjunto", category: "conjuntos", price: 249.9, image: k("8921F7C1-5EE6-43CB-9522-9800E40CA85E") },
];

export const categories: { slug: Category; label: string; tagline: string }[] = [
  { slug: "europeus",    label: "Times Europeus",   tagline: "Da Premier à La Liga" },
  { slug: "brasileiros", label: "Times Brasileiros", tagline: "Coração nacional" },
  { slug: "selecoes",    label: "Seleções",          tagline: "Cores que vestem o mundo" },
  { slug: "retro",       label: "Retrô",             tagline: "Eternizadas no tempo" },
  { slug: "conjuntos",   label: "Conjuntos",         tagline: "Looks completos" },
];

export const featuredProducts = products.filter(p => p.featured);
