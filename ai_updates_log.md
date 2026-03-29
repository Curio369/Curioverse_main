# AI Updates Log

*This file tracks all automated or AI-assisted features, upgrades, and modifications made to the project across all sessions.*

## [2026-03-28 16:20] - Antigravity Guide Implementation & 3D Parallax
- **SEO & Accessibility Phase:** Added Open Graph metadata and secured external links (`rel="noopener noreferrer"`) in `index.html`.
- **3D Animation Phase:** Added a global CSS `--tilt` 3D parallax effect to all Bento Grid `.glass-card` elements driven by normalized mouse position.
- **Performance Phase:** Modified Three.js render loops to pause when the browser tab is hidden (saving CPU/GPU). Upgraded custom cursor physics to use smoother `0.15` spring dampening.
- **UI/UX Polish Phase:** Tailored custom dark mode WebKit scrollbars. Added deeper `rgba(0,0,0,0.8)` hover shadows and `preserve-3d` transforms for cards to enhance the premium glassmorphism.
- **Security Phase:** Added `'use strict';` mode to `script.js` for robust error checking.

## [2026-03-26 01:34] - Interactive 3D Web Experience Polish
- **Added:** Nested "Inner Core" Icosahedron to the background scene with counter-rotational animation for added mechanical depth.
- **Added:** "Tech Debris" Field consisting of 15 floating low-poly wireframe shapes (Tetrahedrons/Octahedrons) with randomized drift and rotation.
- **Implemented:** Mouse Repulsion Physics using normalized coordinate projection. Background debris and foreground particles now active avoid the cursor with a spring-like force.
- **Optimized:** Foreground particle shader with distance-based clip-space repulsion logic and smoother cubic falloff for a cleaner glow.

## [2026-03-26 01:28] - GPU-Accelerated DNA & Premium UX Sprung Interactions
- **Optimized:** DNA Helix animation `margins/top → translate3d/scale`. Eliminated layout thrashing by moving animation logic to the GPU via hardware-accelerated transforms.
- **Added:** `will-change: transform` to all DNA elements (`.dna-rung`, `.dna-node`, `.dna-bar`) for proactive layer promotion.
- **Upgraded:** CSS transitions `0.3s ease → 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)` for high-end "sprung" micro-interactions on skill tags, cards, and milestone images.
- **Added:** Dynamic performance-safe scale effects (`1.05/1.1`) and high-fidelity box-shadow glows to hover states, following `@ui-ux-pro-max` premium standards.
- **Integrated:** Stitch MCP project `CurioVerse Batman UI Redesign` for layout inspiration and AI-driven variant generation.

## [2026-03-22 18:15] - Dense Flowing Strands & Zero-Jitter Scroll
- **Upgraded:** Particle count `40 → 150`, base point size `150 → 350` for thicker, more prominent strands.
- **Upgraded:** Movement amplitude Y `1.5 → 3.5`, X `0.5 → 2.0`, added Z-axis drift `±1.0` for longer, sweeping flowing motion.
- **Added:** Per-particle speed variation attribute (`aSpeed: 0.3-1.0`) so strands move at different paces.
- **Added:** `smoothstep` cubic edge falloff in fragment shader for softer, more organic glow.
- **Upgraded:** Opacity `0.2+0.15 → 0.30+0.20` pulse with dynamic `vAlphaBoost` for brighter, livelier particles.
- **Added:** `scrollOffset` uniform smoothly lerped on CPU (`0.003` factor) \u2014 particles now drift with scroll parallax instead of being static.
- **Fixed:** All 3 scroll event listeners now use `{ passive: true }` to prevent browser scroll-blocking jank.
- **Tuned:** Wider particle spread: X `30→40`, Y `20→30`, Z depth `5→8` units.

## [2026-03-22 18:11] - Ultra-smooth Cinematic Scroll Pass
- **Tuned:** Background scroll lerp `0.015 → 0.004` for near-zero jitter interpolation.
- **Tuned:** Background rotation easing `0.02 → 0.006` for glacial, cinematic shape drift.
- **Tuned:** Foreground scroll lerp `0.02 → 0.005` so particles glide instead of snap.
- **Tuned:** Companion spring stiffness `0.008 → 0.003` for much lazier, floatier movement.
- **Tuned:** Companion velocity damping `0.9 → 0.95` (more momentum, less abrupt stops).
- **Tuned:** Companion rotation spring `0.015 → 0.005`, rotation damping `0.9 → 0.94` for silky tilts.

## [2026-03-22 14:44] - Extra-smooth Scroll Pass
- **Tuned:** Background scroll lerp `0.04 → 0.015`, rotation easing `0.03 → 0.02`.
- **Tuned:** Foreground scroll lerp `0.05 → 0.02`, companion spring stiffness `0.015 → 0.008`.

## [2026-03-22 14:41] - Smooth Scroll for DNA Particles
- **Fixed:** Eliminated jittery particle/companion movement during scroll by adding per-frame lerp interpolation (`scrollYOffset += (target - current) * 0.05`) instead of snapping directly to the scroll position.
- **Fixed:** Background 3D Icosahedron now also uses a smoothed scroll value (`smoothScrollBg`) and a gentler easing factor (`0.03` instead of `0.05`).

## [2026-03-22] - Log Initialization & Effects Recap
- **Added:** Created `ai_updates_log.md` to systematically track all future AI-driven structural and functional changes.
- **Recap of Recent Visual & 3D Upgrades (The "DNA/Flowing" Effects):**
  - **Background 3D:** Integrated a responsive 3D geometric shape (fractured Icosahedron) using Three.js that dynamically rotates based on your scroll position.
  - **Foreground Particles:** Built a Three.js buffer geometry particle system. The particles use sine and cosine phase shifts (`sin(time * 0.5 + aPhase)`, `cos(time * 0.3 + aPhase)`) to create a flowing, weaving light effect that resembles a double-helix or DNA strand.
  - **UI/UX:** Added custom magnetic cursors, scroll-revealing glassmorphism cards (Bento Grid), and a noise-overlay texture for a premium dark mode aesthetic.
