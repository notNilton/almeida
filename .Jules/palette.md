## 2024-05-23 - Unlinked Form Labels
**Learning:** Found a pattern of form inputs not being programmatically linked to their labels. Labels are used visually but lack `htmlFor` and inputs lack `id`.
**Action:** When working on forms, systematically check for `htmlFor` + `id` pairing. This improves screen reader support and increases the hit area for focusing inputs.
