# Security Policy

## Intended security boundary

Hermes Browser Interop Lab is an explicit-consent, current-page test harness. It should never require persistent host access, hidden injection, remote code, credential access, browser-history access, or network interception.

The current extension:

- runs only after the person clicks its action;
- uses `activeTab` rather than broad host permissions;
- injects fixed local code in the top frame only;
- exposes read-only aggregate diagnostics;
- makes activation visible with a badge and page notice;
- contains no network requests, telemetry, remote assets, or third-party dependencies;
- loses access when the page navigates or closes.

## Safe testing

Use the included local fixture or a page you own. Do not test on authentication, banking, health, private communications, or other sensitive pages. Do not use this project to bypass browser controls or access data without authorization.

## Reporting a vulnerability

Until a public repository and private reporting channel exist, report security concerns directly to the maintainers through an agreed private channel. Do not include credentials, private page content, or exploit data in a public issue.

A public security contact and coordinated-disclosure process must be added before broader distribution.

## Out of scope by design

Changes that add any of the following require a new threat review rather than an ordinary feature patch:

- host permissions or automatic content scripts;
- network requests or telemetry;
- access to cookies, storage, history, identity, downloads, or native messaging;
- tools that mutate page or application state;
- collection or transmission of page content;
- remote code, obfuscation, or minification that frustrates review.
