## 2026-01-14 - Icon-only Buttons Accessibility
**Learning:** Icon-only buttons (like View/Delete in tables) are invisible to screen readers without explicit `aria-label`. Standard tooltips (`title`) are also helpful for mouse users but not sufficient for accessibility alone.
**Action:** Always add `aria-label` describing the action to any button or link that uses only an icon for content. Optionally add `title` for hover feedback.
