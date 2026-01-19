## 2024-05-22 - Form Accessibility Basics
**Learning:** Screen readers require strict matching between `label.htmlFor` and `input.id` to announce controls correctly. Missing `autoComplete` attributes on auth fields hinders password managers.
**Action:** Audit all forms for `htmlFor`/`id` parity and add `autoComplete` to auth inputs during UI review.
