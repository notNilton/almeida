## 2024-05-21 - Auth Form Accessibility Gaps
**Learning:** Found auth forms using visual-only labels without `htmlFor`/`id` association, breaking screen reader navigation. Also missing standard `autoComplete` attributes.
**Action:** When auditing forms, immediately check for `id` match with `htmlFor` and ensure `autoComplete` is present for credential fields.
