# Palette's Journal

## 2025-05-18 - [Fixing Orphaned Form Labels]
**Learning:** Found critical login inputs without associated labels. Adding `htmlFor` + `id` is a 2-minute fix that massively improves accessibility and hit-area usability. Also, password managers fail silently without `autoComplete` attributes.
**Action:** Always check form inputs for `id` attributes and verify label association. Add `autoComplete` to all auth-related fields by default.
