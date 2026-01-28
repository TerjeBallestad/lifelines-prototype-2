# Before the Fall

## What This Is

A web-based prototype of the Lifelines "Before the Fall" demo — testing whether MTG color personalities plus minimal configuration can create characters that feel distinct and interesting. Two characters (Elling and his Mother) live together for ~10 in-game days, ending with a crisis that reveals how skill gaps lead to tragedy. This is a systems testbed before building the full game in Unreal Engine.

## Core Value

**Validate that minimal input creates complex, compelling character behavior.** If MTG colors + a handful of stats don't produce characters worth watching and optimizing around, nothing else matters.

## Requirements

### Validated

- ✓ MTG color system drives character behavior (activity preference, resource output, style) — v1.0
- ✓ Characters act autonomously, defaulting to comfort/least resistance — v1.0
- ✓ Player can intervene to push characters toward growth activities — v1.0
- ✓ Activities produce visible resource output with juicy feedback (numbers + expression) — v1.0
- ✓ Shadow state flips character behavior when colors become unhealthy — v1.0
- ✓ Overskudd system gates what characters can/will do — v1.0
- ✓ Day/time progression with ~10 day arc — v1.0
- ✓ Quest system with simple objectives ("Produce 300 creativity") — v1.0
- ✓ Crisis sequence on day 10 — skill checks determine outcome — v1.0
- ✓ Two endings: Mother saved (rare) vs Mother lost (default) — v1.0
- ✓ Character skills visible and trainable — v1.0

### Active

- [ ] Discoverable personality — watch behavior first, reveal mechanics later (deferred to v2)

### Out of Scope

- Conversation system — focus on activities first, add social layer later
- Multiple patients — this is a 2-character demo
- Facility/home building — single fixed environment
- Meta-progression/unlocks — no roguelike layer for prototype
- Realistic simulation — arcade feel over accuracy
- Full skill tree — only skills needed for demo
- Audio — visual feedback first, add sound later

## Context

**Current state (v1.0 shipped):**
- ~4,800 lines of TypeScript (React 19, MobX, Tailwind 4, DaisyUI)
- Complete gameplay loop: Day 1 → Day 10 crisis → epilogue → reset
- Core thesis validated: MTG colors create distinct, observable behavior
- Human verification passed: "Elling prefers Blue, Mother prefers White/Green" observable within 5 minutes

**Project lineage:** Part of Lifelines, a "cozy roguelike life-sim" about rehabilitating patients in Norwegian social housing. The full vision is Stardew Valley's rhythm + Hades' meta-progression + The Sims' emergence. This prototype tests the character foundation.

**Design philosophy:** "NBA Street vs NBA2K" — arcade feel, not simulation. Fast feedback, exaggerated consequences, satisfying juice. Norwegian storytelling (identity/competence) not American heroism.

**Characters:**
- **Elling** — Blue (1.0), Green (0.4). Anxious, creative, retreats to books. Shadow: perfectionism paralysis.
- **Mother (Ella)** — White (0.7), Green (0.5), Blue (0.3). Capable caretaker who enables Elling's dependency.

**The thesis:** By the time Mother collapses, the player has internalized that Elling lacks the skills to cope. The tragedy isn't scripted — it emerges from systems they've been learning. **VALIDATED in v1.0.**

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
| Skip conversation system | Focus on core activity loop first; social layer adds complexity | ✓ Good — kept scope tight, validated core loop |
| MTG colors as primary personality driver | Minimal input, rich output; proven framework | ✓ Good — distinct behavior observable in 5 min |
| Arcade feel over simulation | Fun > accuracy; avoid over-engineering trap | ✓ Good — floating numbers, celebrations feel satisfying |
| Discoverable stats | Mystery is part of fun; watch then understand | ⚠️ Deferred — stats visible immediately in v1, revisit in v2 |
| Shadow as behavior flip | Clean mode switch, not gradual degradation | ✓ Good — shadow state at overskudd < 30 works well |
| Utility AI (60% color + 40% needs) | Balance personality with survival needs | ✓ Good — characters feel alive, not robotic |
| Fixed timestep at 60fps | Deterministic simulation regardless of frame rate | ✓ Good — consistent behavior across devices |
| Spring animations for UI | Satisfying "juice" without complexity | ✓ Good — level-up and quest celebrations feel rewarding |

---
*Last updated: 2026-01-28 after v1.0 milestone*
