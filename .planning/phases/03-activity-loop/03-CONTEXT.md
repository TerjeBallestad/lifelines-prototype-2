# Phase 3: Activity Loop - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Activities produce resources and train skills. Players can intervene to assign activities, see satisfying feedback when activities complete, and watch skills improve over time. This phase adds the "juice" — arcade-style feedback, floating numbers, visible progression.

</domain>

<decisions>
## Implementation Decisions

### Resource Feedback
- Floating numbers pop up from character AND destination counter pulses when receiving value
- Resource counters live in a persistent top bar
- 5-6 resource types (expanded beyond the 3 core: creativity, food, cleanliness)
- Pixel/retro style for floating numbers — chunky pixel font, 8-bit game feel

### Skill Progression
- XP bar with levels (progress bar fills, then level increases)
- Max level is 5
- When leveling up: in-character moment (character shows satisfaction/pride, speech bubble)
- Higher skill = faster completion + more output + occasional bonus/critical success
- Four skill categories: Practical, Creative, Social, Technical
- Phone skill (critical for Phase 5 crisis) falls under Social
- Characters start with personality-based skill levels (Blue starts with Creative 1, etc.)

### Failure & Refusal
- Low-skill failure: visible fumble (character shows frustration, reduced output, maybe small negative effect)
- Refusal communication: icon + brief text ("Too tired", etc.) — quick and clear
- Player CAN force activities past refusal, with consequences
- Forcing consequences are nuanced:
  - If pushing through fear/self-doubt: can be beneficial (character grows)
  - If pushing exhausted character: reduced output + frustration
  - Context matters for whether force is helpful or harmful

### Player Intervention UI
- Click character → see activity menu (full modal takes over screen)
- Activity menu shows full info: icon, name, resource output, skill involved, color affinity
- Each activity shows success chance % AND character attitude (face icon: eager/neutral/reluctant)

### Activity Difficulty
- Base difficulty per activity + character modifiers (skill and personality adjust it)
- Display: numeric with context ("Difficulty 3 (Hard for Elling)")
- Difficulty affects: success chance + XP gain + overskudd cost
- Harder activities are more draining but more rewarding
- Soft lock with warning: "Requires Creative 2" but can still attempt with penalty

### Claude's Discretion
- Exact XP curve for leveling
- Which specific resources beyond the 3 core (creativity, food, cleanliness)
- Mapping of activities to skill categories
- Starting skill values per character based on MTG colors
- Specific floating number animation timing and easing
- Critical success trigger conditions and bonus amounts

</decisions>

<specifics>
## Specific Ideas

- Pixel/retro aesthetic for floating numbers matches the indie game feel
- Phone skill under Social is thematically appropriate — calling for help is a social act
- Forcing mechanic adds moral weight: pushing through fear vs. burning out your character
- The "push through fear" benefit suggests some activities have a courage/anxiety dimension

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-activity-loop*
*Context gathered: 2026-01-28*
