## 2024-05-24 - Accessibility Pattern: Form Associations
**Learning:** React forms in this codebase frequently omit `htmlFor` and `id` attributes, relying on visual layout. This renders forms inaccessible to screen readers.
**Action:** Systematically check all form components (like `EditEmployeeForm`) for this pattern and refactor to use `useId` for robust association.
