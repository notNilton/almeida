## 2026-01-27 - Form Accessibility Pattern
**Learning:** React functional components in this repo consistently miss associating labels with inputs using `htmlFor` and `id`.
**Action:** Use `useId` hook to generate unique IDs for all form inputs and strictly enforce `htmlFor` association in future components.
