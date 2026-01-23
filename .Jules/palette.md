## 2025-02-12 - Systematic missing label associations
**Learning:** Multiple form components (`EditEmployeeForm`, `ContractForm`, `LoginPage`) are missing `htmlFor`/`id` associations and `aria-label`s on icon buttons. This indicates a systematic gap in basic form accessibility practices within the `back-office` workspace.
**Action:** Always check form components for missing label associations and icon-only buttons for missing ARIA labels as a priority audit step.
