# Keshav Katwe — portfolio

An Astro rebuild of the original Jekyll portfolio. Static HTML, responsive CSS and a small TypeScript interaction layer; no client-side framework runtime.

## Local development

Use Node 22.12+ and npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Featured projects are edited in `src/data/projects.ts`. Layout lives in `src/pages/index.astro`, styling in `src/styles/global.css`, and progressive motion in `src/scripts/motion.ts`.

## Motion and accessibility

Native scrolling, semantic links and disclosure controls, visible keyboard focus, lazy project images, OS reduced-motion support and a persistent animation pause button. Pointer tilt only runs on devices with a fine pointer. The page remains readable with JavaScript disabled. No autoplay video, tracking or contact-form service.

## Content and assets

Pushwing and Agenvik visuals are from their public websites. Agenvik's pictured workspace is demo content. The InvestSky phone is an original illustrative interaction study, not an employer screenshot. Outcomes are candidate-reported, drawn from the approved résumé. The downloadable PDF is an unchanged copy of the locked FE UAE Final résumé.

Google Fonts supplies Manrope and DM Sans with system font fallbacks. External product pages and the Pushwing walkthrough open only when selected.

## Review and deployment

Work is isolated on `codex/astro-portfolio`. CI checks and builds the site; it does not deploy. No live-site change is made by pushing this branch. After approval, configure GitHub Pages to use GitHub Actions and add Astro's official Pages deployment workflow for the repository's default branch. Astro's `site` already points to the user-site URL, so no repository base path is needed.

## Research and direction

- [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/): static build and user-site hosting.
- [Dennis Snellenberg](https://www.dennissnellenberg.com/): editorial hierarchy and intentional interaction as a reference, without copying layouts or assets.
- [Rauno Freiberg](https://rauno.me/): attention to interface craft and small interactions.
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API): one-shot, viewport-aware reveals.

The visual direction pairs warm paper, dark editorial type, lilac and acid-green accents, original CSS/SVG scenes, and restrained spring-like easing. Content remains the centre of the experience.
