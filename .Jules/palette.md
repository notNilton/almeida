## 2026-01-18 - Login Form Accessibility
**Learning:** Inputs without `id` and `autoComplete` attributes fail to support screen readers (via `htmlFor` association) and password managers, creating friction at the very first interaction.
**Action:** Always ensure auth forms have explicit `id`/`htmlFor` pairs and standard `autoComplete` values (`email`, `current-password`) to reduce login friction.
