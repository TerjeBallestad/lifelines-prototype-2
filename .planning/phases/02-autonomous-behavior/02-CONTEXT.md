# Phase 2: Autonomous Behavior - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Characters act on their own based on personality. Players observe Elling gravitating toward Blue-aligned activities (reading, thinking) and Mother toward White/Green-aligned activities (cooking, cleaning). When overskudd is low, characters refuse activities and seek comfort behaviors.

</domain>

<decisions>
## Implementation Decisions

### Decision Visibility
- Thought bubbles show decision process, not just outcome
- Bubble displays competing activity options, then settles on winner
- Animation duration varies by character: Elling deliberates longer (Blue = analysis), Mother decides faster (White = duty)
- Winning option gets subtle color pulse (faint hint of activity's color affinity), not labeled

### Activity Selection
- Activities have spatial locations (kitchen for cooking, desk for reading)
- Characters physically walk to activity locations — visible movement across screen
- Mixed activity focus: domestic (cooking, cleaning, resting, TV, phone) + creative (reading, writing/drawing)
- 6-8 activities total that differentiate Blue vs White/Green preferences

### Refusal Behavior
- Both visual signs and occasional dialogue for low overskudd
- Visual: slumped posture, slower movement, tired animation
- Dialogue: generic phrases for now, personality flavor can be added in polish
- Gradual reluctance: 40-20 overskudd = sometimes refuse, below 20 = always refuse
- Personality-specific comfort behaviors: Elling stares out window, Mother sits with hands folded

### Personality Contrast
- Elling (Blue): hesitant movement, pauses before acting, longer thought bubble deliberation, drawn to books/thinking spots
- Mother (White/Green): gravitates toward kitchen, cleaning, checking on Elling — caretaking focus
- Minimal character interaction: occasional glances or acknowledgment when passing (feels alive, not scripted)
- Personality differences accumulate over time — emergent rather than immediately obvious

### Claude's Discretion
- Visual treatment of activity locations (glow, highlight, etc.)
- Exact set of 6-8 activities and their color affinities
- Precise overskudd thresholds for refusal probability
- Movement speed and animation details

</decisions>

<specifics>
## Specific Ideas

- Thought bubbles inspired by comics — show what character is considering
- Decision animation should reveal the character's internal process
- Elling's deliberation is Blue personality made visible (analysis before action)
- Mother's quick decisions are White/Green personality (duty, natural rhythm)
- Comfort behaviors should feel character-appropriate, not generic

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-autonomous-behavior*
*Context gathered: 2026-01-27*
