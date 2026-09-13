# Privacy-Scoped, User-Visible Consensual Extension Design Workflow

A companion guide and architectural reference for engineering user-visible, consensual browser extension interfaces (e.g., `mooserini/hermes-browser-interop-lab`).

## 1\. Core Principles

- **Zero Unbounded Scraping**: Keep DOM evaluation in-page. Transmit only structured counts, semantic element descriptors, or targeted handles back to the agent host.  
- **User-Visible Execution**: All active agent targets, evaluations, and state changes must render visible indicators (bounding boxes, viewport badges, action toasts) directly in the active tab.  
- **Strict Consensual Gates**: High-impact actions (form submissions, navigation changes, state mutations) require explicit user authorization.  
- **Telemetry & Claim Truthfulness**: Never state that page text was unread if local scripts evaluated `element.textContent` (even for internal counting). All claims must match runtime execution down to the byte.

## 2\. Injected Script Auditing Checklist (`injected-tools.js`)

- [ ] **Text Access Transparency**: Distinguish between "0 bytes transmitted off-page" and "0 DOM nodes evaluated". If evaluating button labels to calculate unnamed buttons, declare local evaluation or rely strictly on `aria-label` / `aria-labelledby` / accessible name calculation.  
- [ ] **Whitespace Normalization**: Verify edge cases where `textContent` contains only whitespace characters (`\s+`).  
- [ ] **Indirect Labels**: Support `aria-labelledby` by resolving target ID nodes without leaking full page tree content.  
- [ ] **Sanitization**: Ensure no password inputs, auth tokens, or hidden sensitive elements are parsed into candidate lists.

## 3\. Automated Review Remediation (Jules / Linters)

- Verify test coverage in `test/injected-tools.test.js` for:  
  - Whitespace-only text content  
  - `aria-labelledby` resolution  
  - Missing names on icon-only buttons  
  - Dynamic SPAs and shadow DOM boundaries

## 4\. MV3 Manifest & Permissions Hardening

- Eliminate `<all_urls>` host permissions in favor of `activeTab`.  
- Use declarative user gestures where possible.  
- Avoid persistent background state; rely on `chrome.storage.session` for transient action state across worker lifecycles.

&nbsp;