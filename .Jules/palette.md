## 2024-05-23 - Accessibility First Steps
**Learning:** Found critical accessibility gaps in the login page: missing `htmlFor` on labels and `id` on inputs. This breaks the "click label to focus" interaction and hurts screen reader support. Also missing `autocomplete` attributes.
**Action:** Always check form inputs for `id`, `htmlFor`, and `autocomplete` attributes as a first step in reviewing forms.

## 2024-05-23 - Password Visibility
**Learning:** The login page lacks a password visibility toggle. This is a standard pattern that improves usability and reduces login errors.
**Action:** Implement a toggle button for password fields using `Eye` and `EyeOff` icons.
