## 2024-05-23 - Login Form Accessibility
**Learning:** Found critical accessibility gaps in the login form: missing label/input associations and `autoComplete` attributes. This prevents screen readers from announcing fields and password managers from working correctly.
**Action:** Always check form inputs for `id` and `htmlFor` attributes, and verify `autoComplete` values are set for auth fields. Use `useId` in React 19+ for robust ID generation.
