# Palette's Journal

Tracking critical UX and Accessibility learnings.

## 2025-05-18 - Accessibility Gaps in Form Components
**Learning:** Found critical accessibility gaps in `EditEmployeeForm` (missing `htmlFor`/`id` pairs and `aria-label` on icon-only buttons). This suggests a pattern where visual design was prioritized over semantic HTML structure.
**Action:** When working on forms in this codebase, explicitly check for label associations and ensure all icon-only buttons carry descriptive `aria-label` attributes.
