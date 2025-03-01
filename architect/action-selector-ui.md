# Action Selector UI Design

## Component Layout

```
┌─ Dashboard Header ───────────────────────────────────────────┐
│                                              [Select Actions]│
└──────────────────────────────────────────────────────────────┘

┌─ Action Selector Popover ─────────────────────────────────────────────┐
│ Select Actions to Display                              [×] Close       │
│ ┌─────────────────────────────────────────────────────────────────┐   │
│ │ 🔍 Search actions...                                            │   │
│ └─────────────────────────────────────────────────────────────────┘   │
│                                                                       │
│ ┌─ Messaging ──────────────────────────────┐ [✓] Select All         │
│ │ ☐ First Response                         │                         │
│ │ ☐ Started Conversations                  │                         │
│ │ ☐ Message Blocks                         │                         │
│ │ ☐ Level 2 Messages                       │                         │
│ │ ☐ Level 3 Messages                       │                         │
│ └───────────────────────────────────────────┘                         │
│                                                                       │
│ ┌─ Engagement ─────────────────────────────┐ [✓] Select All         │
│ │ ☐ Post Engagement                        │                         │
│ │ ☐ Page Engagement                        │                         │
│ │ ☐ Reactions                              │                         │
│ │ ☐ Comments                               │                         │
│ └───────────────────────────────────────────┘                         │
│                                                                       │
│ ┌─ Interaction ────────────────────────────┐ [✓] Select All         │
│ │ ☐ Link Clicks                           │                         │
│ │ ☐ Video Views                           │                         │
│ │ ☐ Message Connections                    │                         │
│ └───────────────────────────────────────────┘                         │
│                                                                       │
│ Selected: 8 of 15 actions                                            │
│                                                                       │
│ [Reset to Default]                    [Cancel] [Apply Changes]        │
└───────────────────────────────────────────────────────────────────────┘

## Interactive Elements

1. Trigger Button
   ```
   ┌─ Select Actions ─┐
   │ [⚙️] Actions (8) │
   └─────────────────┘
   ```

2. Action Checkbox
   ```
   ┌─ Action Item ───────────────────────┐
   │ ☐ Action Name                       │
   │    Description or additional info    │
   └───────────────────────────────────────┘
   ```

3. Category Header
   ```
   ┌─ Category ──────────────────────────┐
   │ Category Name       [✓] Select All  │
   │ └─ Actions List                     │
   └───────────────────────────────────────┘
   ```

4. Search Input
   ```
   ┌─────────────────────────────────────┐
   │ 🔍 | Search actions...              │
   └─────────────────────────────────────┘
   ```

## States

1. Checkbox States
   - ☐ Unchecked
   - ✓ Checked
   - ▢ Indeterminate (for category headers)

2. Button States
   ```
   ┌─ Normal ─┐ ┌─ Hover ──┐ ┌─ Disabled ┐
   │  Button  │ │  Button  │ │  Button   │
   └──────────┘ └──────────┘ └───────────┘
   ```

3. Loading State
   ```
   ┌─ Loading ─────────────────────────┐
   │ [||||||||     ] Loading actions...│
   └───────────────────────────────────┘
   ```

## Animations

1. Popover
   - Fade in/out
   - Scale up/down from trigger

2. Selection Changes
   - Smooth checkbox transitions
   - Counter updates

3. Category Expansion
   - Smooth height transitions
   - Rotate chevron icon