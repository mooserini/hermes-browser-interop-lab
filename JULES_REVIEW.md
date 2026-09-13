# Security, Privacy, and Chrome Platform Alignment Review

## Executive Summary

A comprehensive findings-only review of the **Hermes Browser Interop Lab** repository was conducted, focusing on security, privacy, and Chrome extension platform alignment.

**Conclusion:** The implementation accurately reflects its documented intent as a consent-gated, local-only, read-only research extension. The codebase employs a highly minimal, secure design with no accidental network access, storage, telemetry, credential access, remote code execution, or broad host permissions. The extension's behavior substantially aligns with its claims in `PRIVACY.md`, `SECURITY.md`, `CHROMEWEBSTORE.md`, and the newly reviewed `AGENTS.md`, noting minor wording and toolbar-state issues.

## Methodology

The review examined:
- **Implementation:** `src/service-worker.js` and `src/injected-tools.js`
- **Permissions:** `manifest.json` capabilities and boundaries
- **Data flow:** Interactions with Chrome DevTools for Agents and page content
- **Documentation:** `README.md`, `SECURITY.md`, `PRIVACY.md`, `CHROMEWEBSTORE.md`, `AGENTS.md`, and `docs/*.md`
- **Tests:** `test/injected-tools.test.js` and `test/manifest.test.js`

## Findings

### AGENTS.md Consistency
The implementation and this report are consistent with the boundaries defined in `AGENTS.md`:
- **Consent and Authority:** The extension requires a direct user gesture (`activeTab`) and respects the explicitly limited agent authority (no automated committing/publishing).
- **Privacy:** As required, no browsing data, content, or credentials are transmitted.
- **`MAIN`-world Trust Boundaries:** The report acknowledges that the injected tools run in the `MAIN` world (see Optional Suggestion #1) and that hostile pages may spoof results, aligning exactly with the `AGENTS.md` trust boundary.

### Confirmed Issues

#### 1. Transparency/Wording Issue: Page Text Access Claim
- **Location:** `src/injected-tools.js` (line 27, `inspectPageSemantics` tool result note)
- **Detail:** The tool result note claims that "No page text... were read." However, `src/injected-tools.js` reads candidate buttons' `textContent` locally to calculate the `unnamedButtons` count. While page text is not returned, stored, or transmitted, it is transiently inspected for this aggregate count.
- **Recommendation:** Treat the existing tool-result sentence claiming no page text is read as a transparency/wording issue. Update the documentation and tool result notice to state precisely that page text is not returned or transmitted, rather than claiming it is not read locally.

#### 2. Stale Toolbar UI State on Navigation
- **Location:** `src/service-worker.js`
- **Detail:** While page navigation correctly removes the injected page state and terminates `activeTab` access, the service worker does not explicitly clear the tab-specific extension badge (the `ON` text) or title on navigation. This may result in a stale toolbar UI state. It is important to distinguish this cosmetic UI state from continued page access, which is properly revoked.
- **Recommendation:** Consider listening to tab updates or navigation events to reset the badge and title when a tab navigates.

The implementation strictly adheres to its primary security boundaries:
- **Permissions:** Relies exclusively on `activeTab` and `scripting`. No host permissions are defined.
- **Data Privacy:** Code performs read-only counts via `document.querySelectorAll`. As noted above, text is transiently inspected but not returned, stored, or transmitted, avoiding credential or sensitive data extraction.
- **Remote Code & Network Access:** The codebase is entirely static and contains no dynamic evaluation (`eval`), `fetch`, `XMLHttpRequest`, or external dependencies.

### Optional Suggestions (Informational)

While the extension's risk profile is extremely low by design, the following observations are provided for hardening and completeness:

#### 1. MAIN World Execution Context Risk
- **Location:** `src/service-worker.js`, line 10 (`world: 'MAIN'`)
- **Location:** `src/injected-tools.js`, multiple lines (DOM querying and event binding)
- **Detail:** To hook into the page's global `window` for `devtoolstooldiscovery`, the tool script must be injected into Chrome's `MAIN` world instead of the default isolated extension world. This is standard and required for this use case, but it shares the JavaScript execution environment with the host page. A malicious page could modify native built-ins (such as overriding `document.querySelectorAll`, `Array.prototype.filter`, `document.documentElement`, or `window.addEventListener`) to cause exceptions or feed forged semantic counts to the DevTools client.
- **Recommendation:** No change required. Since this is an explicit consent-gated test tool aimed at interoperability rather than trusted security enforcement, this risk is acceptable. However, you may consider adding a small note in `docs/architecture.md` about how operating in the `MAIN` world implies that the host page can observe or tamper with the injected logic.

#### 2. Tab ID Edge Case Error Handling
- **Location:** `src/service-worker.js`, line 2
- **Detail:** The check `if (typeof tab.id !== 'number')` correctly guards against undefined tab IDs. However, if `tab.id` is `chrome.tabs.TAB_ID_NONE` (which is `-1`), it will pass this check. While `chrome.action.onClicked` practically always provides a valid tab ID, if `-1` is somehow provided, `executeScript` will fail, triggering the `catch` block. The `catch` block (line 27) then attempts to run `chrome.action.setBadgeText({ tabId: tab.id, ... })`. Updating the badge with a tab ID of `-1` could potentially throw an unhandled promise rejection.
- **Recommendation:** Consider explicitly guarding against `-1` by changing the check on line 2 to:
  ```javascript
  if (typeof tab.id !== 'number' || tab.id === chrome.tabs.TAB_ID_NONE) {
    return;
  }
  ```

#### 3. Unhandled Exception on Action Icon Failure
- **Location:** `src/service-worker.js`, line 27
- **Detail:** If `executeScript` throws an error (e.g., trying to run the extension on `chrome://` URLs), the extension catches it and attempts to set a "NO" badge using `Promise.all`. If the UI update itself fails (for example, if the tab was closed instantly after clicking), this `Promise.all` could produce an unhandled rejection because there is no try/catch around it in the `catch` block.
- **Recommendation:** Simply chaining a `.catch(() => {})` on the `Promise.all` in the error handler can prevent potential unhandled rejection warnings in the background worker console.

## Chrome-Platform Alignment Checklist

- [x] **No accidental network access:** Verified. No `fetch`/`XHR`.
- [x] **No persistent storage:** Verified. Ephemeral variables only.
- [x] **No telemetry:** Verified.
- [x] **No credential access:** Verified. Script only queries non-sensitive tags/roles.
- [x] **No broad host access:** Verified. `activeTab` only.
- [x] **No remote code execution:** Verified. Static payload only.
- [x] **Page-scope lifecycle:** Injected page state and access end on navigation or second click. The toolbar UI may remain stale after navigation.
- [ ] **No misleading claims:** Not fully met; the page-text-access wording discrepancy is identified above.
- [x] **Chrome policy risks:** None. Follows documented MV3 and `activeTab` principles correctly.
