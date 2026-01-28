# Phase 4: Quest System - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Player direction through simple objectives. 3 quests that teach mechanics and guide gameplay toward day 10 crisis. Tracking progress, visual quest panel, and completion feedback. Quest rewards or complex branching are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Quest Panel Design
- Collapsible side panel on right side of screen
- When collapsed: shows icon + mini progress bar/percentage for current quest
- When expanded: shows full quest description and progress details
- Separate from main game action, non-intrusive positioning

### Quest Content & Flow
- 3 quests total in fixed sequence (tutorial-style early, broader milestone last)
- Mixed approach: early tutorial quests, then broader milestone
- Quest progression: 1. Morning routine basics, 2. Produce X creativity, 3. Train phone skill to level 2
- Mechanic-focused framing (clear, direct, game-y) - not narrative-wrapped
- Quests auto-chain: completing one triggers the next

### Progress Visualization
- Progress bar WITH number overlay (e.g., bar fill + "47/100")
- Real-time updates as resources come in (like floating numbers)
- Spring animation on progress bar (consistent with XP bar feel)
- Visual emphasis at 80%+ progress (glow, pulse, or color change)

### Completion Feedback
- Celebration popup modal when quest completes, game pauses
- Manual dismiss required (player clicks to close)
- Separate introduction popup for next quest after completion popup closes
- No special ending when all quests complete - game continues normally to day 10

### Claude's Discretion
- Exact panel width and collapse animation
- Specific quest thresholds (exact creativity amount, etc.)
- Popup styling and animation details
- 80% near-complete effect specifics (glow vs pulse vs color)

</decisions>

<specifics>
## Specific Ideas

- Spring animation consistent with existing XP bar pattern
- Progress updates should feel connected to floating number feedback already in game
- Pause during celebration popup matches level-up celebration pattern

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 04-quest-system*
*Context gathered: 2026-01-28*
