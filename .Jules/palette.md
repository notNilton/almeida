## 2026-01-21 - Login Page Accessibility
**Learning:** Even stylish "glassmorphism" login pages often miss basic a11y. Form labels were visual-only (no connection to inputs), and error states relied solely on visual appearance.
**Action:** Always verify `htmlFor`/`id` connections and ensure error containers have `role="alert"` for screen readers, regardless of how modern the UI looks.
