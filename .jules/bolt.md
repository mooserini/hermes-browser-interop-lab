## 2026-09-13 - Avoid duplicate DOM querySelectorAll and spread operations in DOM audits
**Learning:** In page audit scripts (`injected-tools.js`), running redundant `document.querySelectorAll()` queries for overlapping selectors (e.g. counting total buttons then filtering for unnamed buttons with `[...querySelectorAll()]`) creates duplicate DOM traversals and intermediate array heap allocations.
**Action:** Query selector once, reuse NodeList length, and iterate directly in a single pass to compute derived sub-metrics.
