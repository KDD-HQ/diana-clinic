// src/config/whatsapp-cta.ts
//
// KDD Website — WhatsApp CTA config
// Aligned with: KDD_WEBSITE_WA_PREFILL_UPDATE_v1_1.md
//               KDD_WEBSITE_TAG_CONVENTION_v1_0.md
//
// Two ways to build a WhatsApp link:
//   waLink('scar')                              → Tier 1 canonical (pinned)
//   waLinkForPath('/blog/what-is-subcision')    → Tier 2 auto-generated
//
// Recommendation: use waLinkForPath(Astro.url.pathname) as the default in the
// shared CTA component. Only pin Tier 1 pages with waLink('key') directly.

export const WHATSAPP_PHONE = "60183902910";

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1 — canonical, hand-coded, locked.
// Do NOT add or rename without Dr. Effendy's approval — historical tracking
// depends on these staying stable.
// ─────────────────────────────────────────────────────────────────────────────
export const WHATSAPP_PREFILLS = {
  home: "[WEB-HOME] Hi Klinik Dr Diana. Saya ingin bertanya / I want to ask:",
  acne: "[WEB-ACNE] Hi Klinik Dr Diana. Saya ada masalah jerawat, nak book Clinical Assessment. / I have acne concerns, I'd like to book a Clinical Assessment.",
  scar: "[WEB-SCAR] Hi Klinik Dr Diana. Saya ada parut jerawat, nak book Clinical Assessment. / I have acne scars, I'd like to book a Clinical Assessment.",
  pgmt: "[WEB-PGMT] Hi Klinik Dr Diana. Saya ada pigmentation / melasma, nak book Clinical Assessment. / I have pigmentation / melasma concerns, I'd like to book a Clinical Assessment.",
  pgmtLhala: "[WEB-PGMT-LHALA] Hi Klinik Dr Diana. Saya baca pasal Lhala Peel, nak book Clinical Assessment. / I read about Lhala Peel and would like to book a Clinical Assessment.",
  aging: "[WEB-AGING] Hi Klinik Dr Diana. Saya nak tanya pasal anti-aging treatment, nak book Clinical Assessment. / I'm interested in anti-aging treatment, I'd like to book a Clinical Assessment.",
  glow: "[WEB-GLOW] Hi Klinik Dr Diana. Saya nak improve skin quality, nak book Clinical Assessment. / I'd like to improve my skin quality, I'd like to book a Clinical Assessment.",
  eye: "[WEB-EYE] Hi Klinik Dr Diana. Saya ada masalah dark eye circle, nak book Clinical Assessment. / I have dark eye circle concerns, I'd like to book a Clinical Assessment.",
  results: "[WEB-RESULTS] Hi Klinik Dr Diana. Saya lihat treatment results, nak book Clinical Assessment. / I saw the treatment results and would like to book a Clinical Assessment.",
  blog: "[WEB-BLOG] Hi Klinik Dr Diana. Saya baca artikel di website, nak tanya lanjut. / I read your article and would like to ask more.",
  blogRejuran: "[WEB-BLOG-REJURAN] Hi Klinik Dr Diana. Saya baca pasal Rejuran, nak book Clinical Assessment. / I read about Rejuran and would like to book a Clinical Assessment.",
  blogProfhilo: "[WEB-BLOG-PROFHILO] Hi Klinik Dr Diana. Saya baca pasal Profhilo, nak book Clinical Assessment. / I read about Profhilo and would like to book a Clinical Assessment.",
  exosome: "[WEB-EXOSOME] Hi Klinik Dr Diana. Saya baca pasal ASCE Exosome, nak book Clinical Assessment. / I read about ASCE Exosome and would like to book a Clinical Assessment.",
} as const;

export type PrefillKey = keyof typeof WHATSAPP_PREFILLS;

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1 concern-map — powers Rule A + B (auto-slug → Tier 1 override).
// If a URL slug contains any of these words, we use the Tier 1 pre-fill
// instead of generating a new tag. Prevents fragmentation like
// [WEB-BLOG-ACNE] vs [WEB-ACNE].
// ─────────────────────────────────────────────────────────────────────────────
const TIER_1_CONCERN_MAP: Record<string, PrefillKey> = {
  acne: "acne",
  jerawat: "acne",
  scar: "scar",
  scars: "scar",
  parut: "scar",
  bopeng: "scar",
  pigmentation: "pgmt",
  pigmentasi: "pgmt",
  melasma: "pgmt",
  pigment: "pgmt",
  aging: "aging",
  antiaging: "aging",
  kedut: "aging",
  wrinkle: "aging",
  wrinkles: "aging",
  glow: "glow",
  booster: "glow",
  boosters: "glow",
  eye: "eye",
  darkcircle: "eye",
  darkcircles: "eye",
};

// Known named brands that trigger Rule C (brand-specific blog tag).
// Add to this list when a new brand joins KDD's portfolio.
const BRAND_SLUGS = [
  "rejuran", "profhilo", "skinvive", "radiesse", "juvelook", "sculptra",
  "plenhyage", "nctf", "revok50", "sunekos", "exosome", "asce",
  "picoplus", "picolo", "liftera", "oxygeneo", "mounjaro",
  "subcision", "tcacross", "hifu",
];

// Filler words stripped when generating a slug tag.
const FILLER = new Set([
  "the", "a", "an", "and", "or", "for", "to", "with", "in", "on", "at", "of", "is", "are",
  "your", "my", "our", "how", "why", "what", "when", "where", "best", "top", "guide",
  "treatment", "malaysia", "2024", "2025", "2026", "untuk", "pasal", "yang", "dan",
]);

/**
 * Normalize a URL slug into an auto-tag suffix per Tier 2 rules.
 * Returns uppercase, distinctive-noun-only, max 12 chars.
 */
function normalizeSlug(slug: string): string {
  const words = slug
    .toLowerCase()
    .split(/[-_/]+/)
    .filter(w => w && !FILLER.has(w) && !/^\d+$/.test(w));

  // Prefer a known brand if present in the slug.
  // Check single words, then adjacent word pairs (e.g. "tca-cross" → "tcacross").
  const brand = words.find(w => BRAND_SLUGS.includes(w));
  if (brand) return brand.toUpperCase().slice(0, 12);
  for (let i = 0; i < words.length - 1; i++) {
    const pair = words[i] + words[i + 1];
    if (BRAND_SLUGS.includes(pair)) return pair.toUpperCase().slice(0, 12);
  }

  // Otherwise take the first meaningful noun
  const noun = words[0] ?? "";
  return noun.toUpperCase().slice(0, 12);
}

/**
 * Check if a slug maps to a Tier 1 concern (Rule A/B).
 * If yes, return the Tier 1 key so the caller uses that pre-fill instead.
 */
function resolveTier1(slug: string): PrefillKey | null {
  const words = slug.toLowerCase().split(/[-_/]+/);
  for (const w of words) {
    if (TIER_1_CONCERN_MAP[w]) return TIER_1_CONCERN_MAP[w];
  }
  return null;
}

/**
 * Build a WhatsApp link from a pinned Tier 1 key.
 * Use this only on the 13 canonical Tier 1 pages.
 */
export function waLink(key: PrefillKey): string {
  const msg = encodeURIComponent(WHATSAPP_PREFILLS[key]);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${msg}`;
}

/**
 * Build a WhatsApp link auto-tagged from the current page path.
 * Use this as the default in the shared CTA component / layout.
 *
 *   /                                    → Tier 1 home
 *   /treatments/acne                     → Tier 1 acne (via TIER_1_CONCERN_MAP)
 *   /treatments/mounjaro-weight-loss     → [WEB-TREAT-MOUNJARO]
 *   /blog/what-is-subcision              → [WEB-BLOG-SUBCISION]
 *   /blog/why-acne-comes-back            → Tier 1 acne (Rule B)
 *   /blog/is-radiesse-worth-it           → [WEB-BLOG-RADIESSE] (Rule C brand wins)
 *   /results/pigmentation                → Tier 1 pgmt
 *   /pages/asce-exosome-therapy-...      → [WEB-PAGE-EXOSOME] (brand-detected)
 */
export function waLinkForPath(path: string): string {
  // Homepage
  if (!path || path === "/" || path === "") return waLink("home");

  // Match /section/slug
  const match = path.match(/^\/(treatments|blog|results|pages)\/(.+?)\/?$/);
  if (!match) return waLink("home");

  const [, section, slug] = match;

  // Rule C: brand-specific blog wins even if concern maps to Tier 1.
  // Check single words + adjacent word pairs (e.g. "tca-cross" → "tcacross").
  const slugWords = slug.toLowerCase().split(/[-_/]+/);
  let brand = slugWords.find(w => BRAND_SLUGS.includes(w));
  if (!brand) {
    for (let i = 0; i < slugWords.length - 1; i++) {
      const pair = slugWords[i] + slugWords[i + 1];
      if (BRAND_SLUGS.includes(pair)) { brand = pair; break; }
    }
  }

  const tier1 = resolveTier1(slug);
  const brandOverridesTier1 = brand && section === "blog";

  if (tier1 && !brandOverridesTier1) {
    return waLink(tier1);
  }

  // Tier 2 auto-generation
  const suffix = normalizeSlug(slug);
  const prefixMap: Record<string, string> = {
    treatments: "TREAT",
    blog: "BLOG",
    results: "RESULTS",
    pages: "PAGE",
  };
  const tag = `[WEB-${prefixMap[section]}-${suffix}]`;

  // Build message per Tag Convention §4 template
  const displayRaw = brand ?? slug.split(/[-_/]+/).find(w => !FILLER.has(w)) ?? "";
  const displayName = displayRaw.charAt(0).toUpperCase() + displayRaw.slice(1);

  const message = section === "blog"
    ? `${tag} Hi Klinik Dr Diana. Saya baca pasal ${displayName}, nak tanya lanjut. / I read about ${displayName} and would like to ask more.`
    : `${tag} Hi Klinik Dr Diana. Saya nak tanya pasal ${displayName}, nak book Clinical Assessment. / I'm interested in ${displayName}, I'd like to book a Clinical Assessment.`;

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}