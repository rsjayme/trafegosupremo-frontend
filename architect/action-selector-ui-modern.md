# Modern Action Selector UI Design

## Main Interface

```
┌─ Action Selector Dialog ───────────────────────────────────────────┐
│                                                                    │
│  Select Metrics to Display                            ⨉ Close      │
│  ──────────────────────────────────────────────────────────────    │
│                                                                    │
│  🔍 Filter metrics...                                              │
│                                                                    │
│  Messaging                                                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ [First Response]  [Started Convos]  [Message Blocks]       │   │
│  │ [Level 2 MSG]     [Level 3 MSG]     [Welcome Views]       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Engagement                                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ [Post Engagement] [Page Engagement] [Reactions]            │   │
│  │ [Comments]        [Posts]          [Saved Posts]          │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Interaction                                                       │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ [Link Clicks]     [Video Views]    [Message Connect]       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

Note: [] represents selectable chips/segments
```

## Chip States and Interactions

```
┌─ Unselected ─┐  ┌─ Selected ──┐  ┌─ Hover ────┐  ┌─ Disabled ──┐
│  Metric      │  │ ✓ Metric    │  │  Metric    │  │  Metric     │
└──────────────┘  └─────────────┘  └────────────┘  └─────────────┘

Colors and States:
- Unselected: Subtle border, light background
- Selected: Brand color, white text, checkmark
- Hover: Slightly darker background
- Disabled: Muted colors, reduced opacity
```

## Category Selection

```
┌─ Category Header ──────────────────────────────────────────────┐
│ Messaging                                                      │
│ ┌─ Quick Select ─────────────────────────────────────────┐    │
│ │ [None] [Essential] [All]                               │    │
│ └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Selection Summary

```
┌─ Bottom Bar ───────────────────────────────────────────────────┐
│ Selected: 8 metrics                                            │
│                                                               │
│ [Reset] ──────────────────────────────── [Cancel] [Apply] │
└───────────────────────────────────────────────────────────────┘
```

## Search Experience

```
┌─ Search Results ────────────────────────────────────────────┐
│ "eng" matches 3 metrics                                     │
│                                                            │
│ [Post Engagement]    Engagement │ Selected                  │
│ [Page Engagement]    Engagement │ Not selected              │
│ [Post Reactions]     Engagement │ Selected                  │
└────────────────────────────────────────────────────────────┘
```

## Animations and Transitions

1. Chip Selection:
   - Scale bounce on select
   - Smooth color transition
   - Checkmark fade in/out

2. Category Changes:
   - Height animation for expand/collapse
   - Fade for content
   - Smooth scroll into view

3. Search Filtering:
   - Smooth fade out of non-matches
   - Results highlight animation
   - Type-ahead suggestions

## Interactive Patterns

1. Drag to Select:
   ```
   [Metric 1] [Metric 2] [Metric 3]
       └─────── Drag ──────┘
   Result: All metrics in drag range are toggled
   ```

2. Keyboard Navigation:
   ```
   Tab: Move between chips
   Space: Toggle selection
   Shift+Arrow: Multi-select
   ```

3. Touch Interactions:
   ```
   Tap: Toggle selection
   Long Press: Show metric details
   Swipe: Navigate categories
   ```

## Visual Feedback

1. Selection:
   - Ripple effect on tap
   - Scale animation
   - Color transition

2. Category:
   - Progress indicator
   - Selection count
   - Visual grouping

3. System Status:
   - Loading shimmer
   - Save confirmation
   - Error states

## Accessibility

1. ARIA Labels:
   ```html
   <button 
     role="switch"
     aria-checked="true"
     aria-label="Show Post Engagement metric"
   >
     Post Engagement
   </button>
   ```

2. Focus Indicators:
   - High contrast outlines
   - Clear focus state
   - Skip navigation