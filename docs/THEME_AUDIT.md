# ApplyMate Blogger XML inventory and parity plan

Input: user-supplied 8,709-line / ~778 KB XML derived from Plus UI 3.7.0 premium theme with ApplyMate overrides. The theme's notice says it is paid and provides a purchasing channel. This project does **not** embed or republish the premium source; it recreates key layout patterns independently.

## Actual theme observations

- Header image URL in Blogger (`Header01`), responsive sticky header heights 60px desktop / 55px mobile.
- Desktop navigation width 230px, mobile left drawer; visible navigation widget and page links.
- Content width up to 1280px; article width ~780px; sidebar 300px.
- Original colors: light body #fdfcff, text #08102b, accent #482dff, links #1976d2; dark mode #1e1e1e.
- Carousel: five enabled image slides (`Image01`..`Image05`). Other slides disabled.
- Default desktop layout includes pinned post, normal Blogger posts, Popular Posts, Labels; separate footer sections.
- Blog Search, bookmark widget, theme modes, related posts, pagination, contact form, RSS/ATOM, metadata, social sharing, lightbox, syntax highlighting and various experimental components.
- The XML contains Blogger-specific `<b:section>`, `<b:widget>`, `<data:...>` and `<expr:...>` expressions; it cannot operate as standalone HTML/Node without replacing these runtime dependencies.

## Parity categories

| Feature | New implementation | Status |
| --- | --- | --- |
| Brand/header/desktop sidebar/responsive drawer | Original independent CSS + semantic HTML | LOCAL IMPLEMENTED; pixel diff pending |
| Five-slide carousel | Accessible controls, reduced-motion handling | LOCAL IMPLEMENTED |
| Light/dark | Local preference, system default | LOCAL IMPLEMENTED |
| Search and categories | Server-rendered filtered results | LOCAL IMPLEMENTED |
| Post template, table of contents, sources | Structured article renderer | LOCAL IMPLEMENTED |
| Save/bookmark | Browser localStorage; no login | LOCAL IMPLEMENTED |
| Share | Web Share API + copy fallback | LOCAL IMPLEMENTED |
| RSS/sitemap/robots/metadata | Per-route generation | LOCAL IMPLEMENTED |
| Related posts | Needs content coverage and relevance rules | PLANNED |
| Pagination | Needed after archive import | PLANNED |
| Comments/contact | Prefer moderated low-data feedback; no Blogger dependency | PLANNED |
| Full old post archive and URLs | Requires Blogger content export, media rights, URL map | NOT IMPORTED |
| PWA/AMP/stories/translate | Defer unless shown useful; native responsive HTML + feeds first | DEFERRED |
| Cookie consent | Only show if data processing actually requires it | CONDITIONAL |
| Safelink countdown/ads | Not included (poor trust; no dark patterns) | RETIRED |
| Actual theme pixel-diff test | Need baseline screenshots at matching desktop/tablet/mobile widths | PENDING |

## Visual acceptance

Use screenshot diff at 1440x900, 768x1024 and 390x844, across light/dark states and three page types: home, article and search. Threshold target: visually faithful layout, logos, typography rhythm, spacing and major structures. Do not claim "pixel perfect" from CSS inspection alone. Audit fonts/licensing before copying external assets. Full old-site snapshots and user-approved license scope needed to copy any original premium styling implementation exactly.
