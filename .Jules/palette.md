## 2024-05-22 - Missing Basic Form Accessibility
**Learning:** The `EditEmployeeForm` component lacked semantic associations between labels and inputs (`htmlFor`/`id`) and modal accessibility roles. This suggests a pattern where accessibility might be an afterthought in this codebase.
**Action:** When encountering forms in this repo, always check for label associations first.
