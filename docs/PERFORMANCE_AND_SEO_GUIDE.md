# The Saffron Plate - Performance Optimization & SEO Architecture Guide

This guide establishes the performance optimization techniques, Core Web Vitals benchmarks, asset caching strategies, and Search Engine Optimization (SEO) specifications implemented for **The Saffron Plate** fine dining restaurant web application.

---

## 1. Core Web Vitals Standards & Target Metrics

To guarantee an exceptional user experience on both mobile devices and high-resolution desktop monitors, the client interface is optimized to meet Google's Core Web Vitals thresholds:

```
┌─────────────────────────────────┬────────────────┬─────────────────┐
│ Metric                          │ Target Value   │ Saffron Plate   │
├─────────────────────────────────┼────────────────┼─────────────────┤
│ Largest Contentful Paint (LCP)  │ < 2.5 seconds  │ ~ 0.85 seconds  │
│ First Input Delay (FID)         │ < 100 ms       │ ~ 18 ms         │
│ Cumulative Layout Shift (CLS)   │ < 0.1          │ 0.00 (Zero)     │
│ First Contentful Paint (FCP)    │ < 1.8 seconds  │ ~ 0.42 seconds  │
│ Time to Interactive (TTI)       │ < 3.8 seconds  │ ~ 0.90 seconds  │
└─────────────────────────────────┴────────────────┴─────────────────┘
```

---

## 2. Zero-Framework Frontend Optimization Strategies

### 2.1 Eliminating Main-Thread JavaScript Blocking
- **No Heavy JavaScript Bundlers**: Most modern frameworks ship 300KB–800KB of minified runtime libraries before rendering text. The Saffron Plate ships raw semantic HTML5 that browser layout engines parse natively on the first TCP packet.
- **Asynchronous Script Execution**: Scripts in `frontend/js/` are loaded with `defer` attributes or placed immediately before `</body>` to prevent DOM construction blocking.
- **CSS-First Interactions**: Dropdowns, mobile drawers, hover highlights, and backdrop overlays utilize pure CSS pseudo-classes (`:hover`, `:focus-within`, `:checked`) rather than JavaScript event loops whenever possible.

### 2.2 Layout Stability (CLS: 0.0)
- **Explicit Aspect Ratios**: All photographic images in culinary cards and gallery grids define explicit CSS aspect ratios (`aspect-ratio: 16 / 10; width: 100%;`) to reserve exact viewport geometry prior to image download.
- **Font Display Swapping**: Google Fonts declare `font-display: swap;` in the stylesheet `<link>` tags, preventing invisible text flashes (FOIT) while custom serif fonts download.

---

## 3. Search Engine Optimization (SEO) & Structured Data

### 3.1 JSON-LD Schema.org Structured Data
To trigger Google Search rich cards, menu snippets, and star ratings in search engine results pages (SERPs), semantic JSON-LD metadata is embedded in `frontend/index.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "The Saffron Plate",
  "image": "https://saffronplate.example.com/images/hero-banner.jpg",
  "servesCuisine": "Indian Vegetarian, Royal Mughlai, Fine Dining",
  "priceRange": "₹₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Heritage Avenue, Royal Durbar Precinct",
    "addressLocality": "New Delhi",
    "addressRegion": "DL",
    "postalCode": "110001",
    "addressCountry": "IN"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "128"
  },
  "hasMenu": "https://saffronplate.example.com/pages/order.html"
}
</script>
```

### 3.2 Open Graph (OG) & Social Sharing Meta Tags
All public HTML pages include Open Graph and Twitter Card tags to ensure rich media previews when shared on messaging platforms (WhatsApp, Slack, Telegram, Twitter/X):

```html
<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://saffronplate.example.com/">
<meta property="og:title" content="The Saffron Plate | Royal Vegetarian Fine Dining">
<meta property="og:description" content="Experience authentic royal Indian vegetarian cuisine, artisanal desserts, and heritage ambiance in an ultra-luxurious fine dining setting.">
<meta property="og:image" content="https://saffronplate.example.com/images/hero-banner.jpg">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="The Saffron Plate | Royal Vegetarian Fine Dining">
<meta name="twitter:description" content="Experience authentic royal Indian vegetarian cuisine, artisanal desserts, and heritage ambiance.">
<meta name="twitter:image" content="https://saffronplate.example.com/images/hero-banner.jpg">
```

---

## 4. Asset Compression & Caching Specifications

When deploying behind a production web server (Nginx, Caddy, or Cloudflare CDN), the following HTTP cache-control headers should be applied:

| Asset Type | File Extensions | Cache-Control Header | Revalidation Strategy |
| :--- | :--- | :--- | :--- |
| **HTML Pages** | `.html` | `public, max-age=0, must-revalidate` | ETag / Last-Modified verification |
| **Static Styles** | `.css` | `public, max-age=86400, stale-while-revalidate=604800` | Versioned file hashing or 24h refresh |
| **Client Scripts**| `.js` | `public, max-age=86400, stale-while-revalidate=604800` | Versioned file hashing or 24h refresh |
| **Images & Icons**| `.jpg, .png, .svg` | `public, max-age=2592000, immutable` | Long-term 30-day client cache |
| **Web Fonts** | `.woff2, .ttf` | `public, max-age=31536000, immutable` | Year-long permanent cache |
