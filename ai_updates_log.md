# AI Updates Log

*This file tracks all automated or AI-assisted features, upgrades, and modifications made to the project across all sessions.*

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
