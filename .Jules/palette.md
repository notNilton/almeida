## 2024-05-23 - Login Accessibility
**Learning:** Adding `aria-label` to buttons that replace text with loading spinners is critical. Without it, screen reader users only perceive an unlabeled button containing an image.
**Action:** Always verify loading states on buttons. If text is removed, add `aria-label`.
