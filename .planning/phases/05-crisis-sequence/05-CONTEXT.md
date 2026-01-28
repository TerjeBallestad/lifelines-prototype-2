# Phase 5: Crisis Sequence - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Day 10 crisis event where Mother collapses and Elling must respond. Success depends on skills trained during days 1-9. Implements shadow state behavior during crisis. Two possible endings: Mother saved or Mother lost.

</domain>

<decisions>
## Implementation Decisions

### Crisis Trigger & Buildup
- Building signs appear on day 10 morning before collapse
- Mother shows visibly slower movement speed as warning sign
- Elling's thought bubble occasionally shows concern about Mother
- Collapse happens later on day 10 after warning period

### Crisis UI & Presentation
- Modal overlay appears over paused game world
- Urgent/alarming visual tone: red tones, flashing elements, exclamation marks
- Implicit time pressure through text/visuals, no visible countdown timer
- Mother's sprite shown lying down inside the crisis modal

### Player Actions During Crisis
- Multiple actions attemptable in sequence: Phone, Help Mother, Run to neighbor
- Skill check display shows which skill is being tested and pass/fail result
- Failed actions can be retried with decreasing success chance each attempt
- Other actions (help, neighbor) buy time but only calling emergency can save her

### Outcome & Resolution
- Two distinct endings: Mother saved or Mother lost
- Specific action required: successful phone call to emergency services saves her
- Text epilogue describes what happened after the crisis
- Post-ending offers both "Return to Menu" and "Try Again" (restart from day 1)

### Claude's Discretion
- Exact warning sign timing (how many hours of slower movement before collapse)
- How much success chance decreases on retry attempts
- Shadow state visual presentation during crisis
- Specific epilogue text content
- Animation/transition details for crisis modal

</decisions>

<specifics>
## Specific Ideas

- Warning signs should be noticeable but not heavy-handed — player should be able to miss them if not paying attention
- Skill check display creates satisfying "RPG moment" where training pays off
- The retry-with-penalty mechanic adds tension without hard-locking the player

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-crisis-sequence*
*Context gathered: 2026-01-28*
