# Before the Fall

## What This Is

A web-based prototype of the Lifelines "Before the Fall" demo — testing whether MTG color personalities plus minimal configuration can create characters that feel distinct and interesting. Two characters (Elling and his Mother) live together for ~10 in-game days, ending with a crisis that reveals how skill gaps lead to tragedy. This is a systems testbed before building the full game in Unreal Engine.

## Core Value

**Validate that minimal input creates complex, compelling character behavior.** If MTG colors + a handful of stats don't produce characters worth watching and optimizing around, nothing else matters.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] MTG color system drives character behavior (activity preference, resource output, style)
- [ ] Characters act autonomously, defaulting to comfort/least resistance
- [ ] Player can intervene to push characters toward growth activities
- [ ] Activities produce visible resource output with juicy feedback (numbers + expression)
- [ ] Shadow state flips character behavior when colors become unhealthy
- [ ] Overskudd system gates what characters can/will do
- [ ] Day/time progression with ~10 day arc
- [ ] Quest system with simple objectives ("Produce 300 creativity")
- [ ] Crisis sequence on day 10 — skill checks determine outcome
- [ ] Two endings: Mother saved (rare) vs Mother lost (default)
- [ ] Character skills visible and trainable
- [ ] Discoverable personality — watch behavior first, reveal mechanics later

### Out of Scope

- Conversation system — focus on activities first, add social layer later
- Multiple patients — this is a 2-character demo
- Facility/home building — single fixed environment
- Meta-progression/unlocks — no roguelike layer for prototype
- Realistic simulation — arcade feel over accuracy
- Full skill tree — only skills needed for demo
- Audio — visual feedback first, add sound later

## Context

**Project lineage:** Part of Lifelines, a "cozy roguelike life-sim" about rehabilitating patients in Norwegian social housing. The full vision is Stardew Valley's rhythm + Hades' meta-progression + The Sims' emergence. This prototype tests the character foundation.

**Design philosophy:** "NBA Street vs NBA2K" — arcade feel, not simulation. Fast feedback, exaggerated consequences, satisfying juice. Norwegian storytelling (identity/competence) not American heroism.

**Characters:**
- **Elling** — Blue (0.8), Green (0.4). Anxious, creative, retreats to books. Shadow: perfectionism paralysis.
- **Mother (Ella)** — White (0.7), Green (0.5), Blue (0.3). Capable caretaker who enables Elling's dependency.

**The thesis:** By the time Mother collapses, the player has internalized that Elling lacks the skills to cope. The tragedy isn't scripted — it emerges from systems they've been learning.

**Reference projects:**
- `/Users/godstemning/projects-local/mental-sine-waves` — preferred tech stack and coding style
- `/Users/godstemning/projects-local/lifelines-prototypes` — earlier prototype work
- Demo design docs in this folder — narrative and system specifications

## Constraints

- **Tech stack**: React 19, MobX, Vite/Rolldown, Tailwind 4, DaisyUI, TypeScript (matching mental-sine-waves)
- **Scope**: Prototype quality — testable and iteratable, not production-ready
- **Platform**: Web browser (desktop)
- **Duration**: Single developer, exploring systems before Unreal build

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skip conversation system | Focus on core activity loop first; social layer adds complexity | — Pending |
| MTG colors as primary personality driver | Minimal input, rich output; proven framework | — Pending |
| Arcade feel over simulation | Fun > accuracy; avoid over-engineering trap | — Pending |
| Discoverable stats | Mystery is part of fun; watch then understand | — Pending |
| Shadow as behavior flip | Clean mode switch, not gradual degradation | — Pending |

---
*Last updated: 2026-01-27 after initialization*
