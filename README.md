# Keshav Katwe — portfolio

An interactive Astro portfolio with an Electric Workshop art direction: oversized kinetic typography, a reactive chrome sculpture, colorful project chapters, engineering stories, and a playable Bug Bash arcade. Static HTML, CSS and TypeScript; no client-side framework runtime or additional animation dependencies.

[Visit the portfolio](https://keshavkatwe.github.io/) · [GitHub profile](https://github.com/keshavkatwe)

## Featured work

| Project | Engineering focus | Explore |
| --- | --- | --- |
| **Agenvik** | Document-grounded AI agents for web, WhatsApp, and Slack. Open source under MIT. | [Case study](https://keshavkatwe.github.io/work/agenvik/) · [Source](https://github.com/keshavkatwe/agenvik) · [Product](https://agenvik.com) |
| **Pushwing** | A React dashboard, API, and hosted MCP server for publishing workflows. | [Case study](https://keshavkatwe.github.io/work/pushwing/) · [Product](https://pushwing.com) |

## Local development

Use Node 22.12+ and npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Featured project summaries are edited in `src/data/projects.ts`; full engineering stories live in `src/data/stories.ts` and render at `/work/[slug]/`. The progressively enhanced system explorer keeps every step readable without JavaScript. Layout lives in `src/pages/index.astro`, styling in `src/styles/global.css`, and progressive motion in `src/scripts/motion.ts`.

`src/scripts/sculpture.ts` renders an original ray-marched WebGL sculpture. Move the pointer to rotate it; click or press Enter to remix its finish. An original SVG replaces it when WebGL is unavailable. Rendering stops outside the viewport, in hidden tabs, or while motion is paused. `src/components/BugBash.astro`, `src/scripts/game.ts`, and `src/styles/game.css` contain the self-contained 30-second game.

## Motion and accessibility

Native scrolling, semantic links, visible keyboard focus, lazy project images, OS reduced-motion support and a persistent animation pause button. Pointer tilt only runs on devices with a fine pointer. The page remains readable with JavaScript disabled. No autoplay video, tracking or contact-form service.

Bug Bash starts only on request. Catch acid-green bugs, avoid blue releases, and earn streak bonuses. Use touch, mouse, or keys 1–6; P/Escape pauses. It pauses when the tab is hidden or keyboard focus leaves the game. A best score is stored on the visitor's device. Earned engineering snapshots remain selectable between rounds. Work, résumé and contact links are always available without playing.

## Content and assets

Pushwing and Agenvik visuals are from their public websites. Agenvik's pictured workspace is demo content. The InvestSky phone is an original illustrative interaction study, not an employer screenshot. Outcomes are candidate-reported, drawn from the approved résumé. The downloadable PDF is an unchanged copy of the locked FE UAE Final résumé.

Google Fonts supplies Manrope and DM Sans with system font fallbacks. External product pages and the Pushwing walkthrough open only when selected.

## Review and deployment

The source is maintained on `master`. `.github/workflows/deploy.yml` checks and builds the site on Node 22, uploads `dist` as a Pages artifact and deploys through GitHub Actions. Pushes to `master` deploy automatically; the workflow can also be dispatched manually. `check.yml` checks development branches and pull requests.

GitHub Pages must use GitHub Actions as its build source. Astro's `site` points to the user-site URL, so no repository base path is needed. Previous versions remain recoverable through Git history.

## Research and direction

- [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/): static build and user-site hosting.
- [Bruno Simon](https://bruno-simon.com/): optional play, rewarding exploration, and clear multi-input controls.
- [Dennis Snellenberg](https://dennissnellenberg.com/): oversized expressive typography and clear work navigation.
- [Lusion](https://lusion.co/): a signature reactive visual and distinct project chapters.
- [Cuberto](https://cuberto.com/): expressive interaction alongside concrete selected-work stories.
- [Active Theory](https://activetheory.net/): immersive atmosphere with simple work/contact navigation.
- [Rauno Freiberg](https://rauno.me/): attention to interface craft and small interactions.
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API): one-shot, viewport-aware reveals.

References researched on 16 October 2026. Their interaction principles informed the direction; no third-party layout, code or artwork was copied. The original visual system pairs warm paper, black type, cobalt chrome, acid green and coral. Original CSS/SVG scenes and the WebGL sculpture sit alongside real public product visuals. Engineering facts and résumé content are preserved.
