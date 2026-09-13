# Chrome Web Store Listing — Hermes Browser Interop Lab

> Last Updated: 2026-09-12
> Status: Research draft; not ready for submission

## Store Listing

**Extension Name**
Hermes Browser Interop Lab

**Short Description**
Enables narrow, read-only browser interoperability tests on a page you explicitly choose.

**Detailed Description**
Hermes Browser Interop Lab lets developers test local AI-assisted browser diagnostics on a page they explicitly choose.

It provides two narrow capabilities: describing the test harness and counting semantic page elements for accessibility-oriented inspection. It does not return page text, field values, URLs, cookies, credentials, or browsing history.

To use it, open a page you control and click the extension action. A visible badge and page notice confirm that the lab is active. Click the action again, navigate away, or close the page to end access.

The extension collects no data, sends no network requests, uses no analytics, and runs no remote code. Its source is intentionally unminified for inspection.

Support and feedback details will be added before publication.

**Category**
Developer Tools

**Single Purpose**
Enable explicit, current-page testing of narrow read-only diagnostics with a locally connected developer agent.

**Primary Language**
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ⬜ Not created | |
| Screenshot 1 | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 2 | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile | 440×280 | ⬜ Not created | |

### Screenshot Notes

1. Included local fixture with the visible enabled notice and `ON` badge.
2. Chrome DevTools for Agents listing the two read-only tools and showing the harness description result.

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `activeTab` | permissions | Temporarily enables the lab only on the page where the person directly clicks the extension action; access ends when the page navigates or closes. |
| `scripting` | permissions | Adds the fixed, reviewable diagnostic tool definitions to the explicitly activated page so the local developer agent can discover them. |

No host permissions are requested.

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

### Data Use Certification

- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**
Pending public repository or project-site URL. See `PRIVACY.md`.

## Distribution

**Visibility**: Unlisted during research; public only after review
**Regions**: Pending

## Developer Info

**Publisher Name**: Pending owner decision
**Contact Email**: Pending owner decision
**Support URL / Email**: Pending public repository
**Homepage URL**: Pending public repository

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 0.1.0 | 2026-09-12 | Initial consent-gated, read-only interoperability harness. | Draft |

## Review Notes

### Known Issues / Limitations

- Depends on an experimental Chrome DevTools for Agents feature and its experimental third-party-tools flag.
- Runs only on ordinary scriptable pages after a direct user gesture.
- Does not run on browser-internal pages such as `chrome://extensions`.
- Store assets, public privacy-policy URL, support channel, and publisher identity are intentionally pending.

### Rejection History

None.
