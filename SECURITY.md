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

Report security concerns to the maintainers through an agreed private channel.
Do not include credentials, private page content, or exploit data in a public
issue.

A public security contact and coordinated-disclosure process must be added before broader distribution.

## Accepted browser-custody architecture

The repository contains an accepted architecture for future approval-gated and
delegated browser control. That acceptance does not widen the current extension's
permissions or capabilities. Any implementation that adds `debugger`, a local
broker, page mutation, page-content return, or a persistent browser identity
requires a separate threat review and explicit maintainer approval before code
lands.

If a side panel, controller pairing, or other delegated-control surface is
added, installation, technical reachability, an open panel, a paired
controller, or a prior grant must never count as current authorization.
Any future authority must be visible, tab-scoped, capability-scoped,
time-bounded, revocable, and fail closed when identity or lifecycle state
becomes ambiguous.

The normative architecture gate is
[`docs/adr/0001-browser-custody-architecture.md`](docs/adr/0001-browser-custody-architecture.md)
together with
[`docs/threat-model-browser-custody.md`](docs/threat-model-browser-custody.md).
ADR 0001 was accepted by Thomas Kenny on 2026-09-13. Its acceptance authorizes
architecture only; unresolved amendments take their fail-closed defaults, and
older plans and drafts cannot authorize an implementation slice.

## Out of scope by design

Changes that add any of the following require a new threat review rather than an ordinary feature patch:

- host permissions or automatic content scripts;
- network requests or telemetry;
- access to cookies, storage, history, identity, downloads, or native messaging;
- tools that mutate page or application state;
- collection or transmission of page content;
- remote code, obfuscation, or minification that frustrates review.
