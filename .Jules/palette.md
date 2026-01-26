# Palette's UX Journal 🎨

## 2026-01-26 - Accessible Form Patterns
**Learning:** Found multiple form components (`ContractForm`, `LoginPage`) missing standard label-input associations and accessible modal roles.
**Action:** When working on forms in this repo, always use `useId` to generate unique IDs for `htmlFor`/`id` pairs, and ensure modal containers have `role="dialog"` and `aria-modal="true"`.
