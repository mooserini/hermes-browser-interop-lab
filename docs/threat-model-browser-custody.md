# Browser custody threat model

**Status:** Accepted with ADR 0001 on 2026-09-13
**Boundary:** Future isolated custody prototype; the shipped root harness remains unchanged

## Security objective

Permit one explicitly identified Hermes profile/session to perform one allowlisted operation—or a short, time-bounded sequence—against one human-selected tab instance, while making authority visible, revocable, non-inheriting, non-persistent, and unable to migrate to another browser surface.

`chrome.debugger` can instrument network activity, debug JavaScript, mutate DOM/CSS, and send allowed CDP commands.[1] Code-level allowlists, target classification, fresh grants, and per-call validation must therefore narrow a browser permission whose technical reach is broader than the product contract.

## Assets

- Tom's browser sessions, tabs, frames, credentials, form values, communications, and account state.
- Human intent and the provenance of the two gestures granting authority.
- `profileId`, `sessionId`, tab/target/frame identity, document epoch, capabilities, and lease expiration.
- Ephemeral pairing material and authenticated broker roles.
- Integrity of command/target policy, reducer state, custody indicators, and local receipts.
- Continued availability of Tom's tab after detach, failure, pause, or Stop.

## Actors

- **Human operator:** sole authority for installation, pairing, upgrades, consequential actions, route changes, and scope expansion.
- **Hermes/Ara session:** authenticated reasoning client with only the authority currently granted.
- **Custody extension:** owns browser-gesture capture, extension-controlled UI, in-memory tab grants, policy enforcement, and debugger attachment.
- **Loopback broker:** routes one authenticated principal to one validated browser binding; grants no authority itself.
- **Page:** untrusted, including its DOM, scripts, frames, overlays, navigations, and attempts to classify itself as safe.
- **Model/provider:** outside the local trust boundary; receives no browser-derived data under V1.
- **Other debugger clients/extensions/automation:** potential contention, not trusted co-owners or alternate consent channels.
- **Local OS/input stack:** trusted in V1 to deliver human-operated extension-chrome gestures; compromise or synthetic OS-level input is residual risk.

## Trust boundaries

1. Human/OS input ↔ extension-controlled chrome.
2. Page DOM ↔ extension; page cues never cross as custody proof.
3. Top frame ↔ child frames, workers, prerenders, and new documents.
4. Extension ↔ Chrome debugger target.
5. Extension ↔ loopback broker.
6. Broker ↔ exact Hermes profile/session.
7. Custody extension ↔ root read-only harness.
8. Custody tools ↔ existing `browser_*`, DevTools MCP, and disposable routes.
9. Local custody session ↔ any external model/provider.
10. Human secret entry ↔ agent-visible chat, logs, storage, and receipts.

## Proposed data flow

1. A human-operated Chrome-action click captures one exact tab, top-frame document identity, origin, and navigation/document epoch, then opens Conversational presence; it creates no action grant.
2. A second trusted event in extension-controlled chrome consumes a short-lived nonce and chooses Approval-gated or Delegated scope, top-frame click/type targets, and any exact navigation destination only if that entire pre-grant capture is unchanged. Any intervening document, history, hash, prerender, top-frame, origin, tab, or window change consumes the nonce and returns Dormant.
3. The extension snapshots validated primitive fields and creates a process-memory-only grant; no active-tab lookup may retarget it.
4. A command arrives through an exact-version, role-bound, replay-resistant loopback channel.
5. Reducer, live grant, command/target policy, route authorization, and debugger-owner checks independently approve immediately before attachment.
6. The same predicates are re-evaluated immediately before each fixed CDP call. For input, the adapter also re-resolves the human-minted handle to the live top-frame node, reruns sensitive-target classification, and requires the live hit-test target to be that same node. V1 never auto-attaches children or subscribes to CDP/page-data/network streams; its sole passive observer is the grant-scoped, finite-output lifecycle sentinel defined by ADR invariant 9.
7. The extension executes one allowlisted adapter operation, then detaches before returning a bounded outcome. A navigation operation revokes on its first transition and cannot authorize post-navigation work.
8. Extension-owned UI is rendered from the same reducer/grant state used for gating.
9. Receipts contain only anonymous session-local identifiers, authority level, capability, timestamps, outcome, and canonical reason code.

Chrome's `storage.session` is in-memory, is not exposed to content scripts by default, and is cleared on browser restart, extension reload, update, and disable.[2] V1 does not store grants, gesture nonces, or pairing material there. If used for non-authoritative UI preferences, access remains restricted to trusted extension contexts.

## Threat register

| ID | Threat / failure | Required control | Residual / verification |
|---|---|---|---|
| T1 | Install, enabled, paired, panel-open, badge, prior lease, or technical reach is treated as consent. | Only the two-event flow in ADR invariant 3 can mint a grant; the broker exposes no consent trigger. | Test every non-authorizing state, forged booleans, commands, context menus, active-tab changes, and automated input lanes. OS-level input compromise remains residual. |
| T2 | Stale grant survives navigation, SPA/history/hash transition, prerender activation, tab reuse, replacement, restart, reload, worker eviction, or expiry. | Immutable tab/target/top-frame/document-epoch grant; named revocation events; process-memory-only state. | Deterministic lifecycle, redirect, history, hash, prerender, eviction, and tab-ID-reuse tests. |
| T3 | Reducer, live grant, UI, and debugger ownership disagree. | One composed decision path; UI derived from gate state; lifecycle/integrity mismatch revokes while ordinary policy denial does not. | Tests where a Delegated label or attached debugger cannot permit a command without every predicate. |
| T4 | Page spoofs custody UI or pairing prompt. | Extension action/side panel are authoritative; page overlays informational only; pairing secret never enters page DOM. | Adversarial fixture with convincing fake indicators. |
| T5 | Broker impersonation, role confusion, replay, wrong Origin, downgrade, or oversized frame. | Exact protocol equality; role-bound challenge/response; nonce/timestamp replay cache; exact extension-Origin pin; frame limits. | Cross-language fixtures reject each malformed case. |
| T6 | Loopback listener becomes remotely reachable or is port-squatted. | Bind only verified loopback addresses; reject non-loopback config; authenticate both roles; bounded launch lock; owning-session reaper. | Socket tests for `127.0.0.1`/`::1`, remote bind rejection, occupied-port failure, and owner exit. |
| T7 | Pairing secret or grant leaks through storage, disk, arguments, chat, logs, receipts, or page contexts. | Masked human entry and process memory only; no `storage.session/local`, sync, IndexedDB, disk, or command-line secret; structured redaction. | Static scans, storage-access tests, and process-exit clearing tests. |
| T8 | Generic CDP tunnel exceeds the allowlist or silently collects passive data. | No raw `sendCommand`, event subscription, auto-attach, arbitrary JS, or browser-wide operation; attach and detach around one fixed operation. | Raw-CDP, Runtime-eval, Network/DOM-event, cookie, storage, history, WebAuthn, and target commands denied. |
| T9 | Target addressing or “structural” output leaks content or lets an agent select arbitrary nodes. | Only human-designated opaque handles; no discovery/query/enumeration API and no selector, coordinate, JS, tab/frame ID, accessibility name/tree, title, URL, geometry, error, or metadata fields. | Reject every agent-supplied addressing form; shape tests seed secrets into every omitted field. |
| T10 | Generic click/type/navigate reaches a sensitive, changed, overlaid, or consequential target. | Immediately before input, re-resolve the handle to the live top-frame node, rerun the finite classifier, and require the live hit-test target to equal that node; identity/role/frame/origin/document/actionability change, hit-test mismatch, or uncertainty denies. Only the human gesture can bind an exact `https:` or approved local-fixture destination. | Bait-and-switch and overlay-interception fixtures plus credentials, 2FA, permissions, send/publish, payment, downloads, uploads/file choice, destructive controls, and agent-supplied URL rejection. |
| T11 | DevTools MCP and custody extension fight for one target or dual-wield capabilities. | Exclusive debugger/content-capable controller; no disconnect, steal, retry, composition, or fallback; `onDetach` revokes immediately. Chrome documents detach when DevTools is invoked.[1] | Contention test proves safe stop, untouched tab, and no secondary content route. |
| T12 | New tabs, popups, frames, workers, opener-created targets, or binding transfer inherit authority. | Captured top frame is the only V1 frame scope; no child-frame authority even when same-origin/same-process; no attach-all, auto-attach, opener inheritance, fallback, rebinding, or transfer. | Every child/alternate target remains unbound under every authority level. |
| T13 | Route changes identity or browser after failure. | Route selector returns canonical denial and required human action without executing; every different route requires new explicit authorization. | Matrix proves no automatic fallback among custody, MCP, and disposable routes. |
| T14 | Side-panel focus or an intervening page transition is used to retarget a pending grant. | First Chrome-action event captures tab, top-frame document identity, origin, and epoch; second gesture can scope only that immutable capture; focus or lifecycle changes consume the nonce rather than retarget. | Between gestures, switch tabs/windows, navigate, reload, mutate history/hash, activate a prerender, and replace the top frame; every case denies and returns Dormant. |
| T15 | Simultaneous human input conflicts with automation. | Human activity pauses or cancels when intent becomes ambiguous; Stop always wins. | Interleaving tests and bounded detach deadline. |
| T16 | Service-worker eviction or lifecycle-sentinel loss creates false recovery. | Eviction or sentinel loss is a named revocation; grants and pairing are not stored or reconstructed. The sentinel reports only finite lifecycle reason codes and no page data. | Eviction, sentinel-loss, document, history, hash, and prerender tests always land Dormant without content output. |
| T17 | Logs and receipts become browsing surveillance. | No URLs, titles, hostnames, page text, prompts, screenshots, destinations, selectors, raw events/errors, proof material, or stable cross-session browsing identifiers. | Snapshot tests of every receipt and log schema. |
| T18 | Permission expansion lands in the root harness or hidden inside the custody package. | Root freeze plus exact V1 custody permission allowlist; any addition requires ADR amendment and separate approval. | Diff and manifest contract tests reject each unlisted permission and persistent injection. |
| T19 | A plan, Store badge, review, popularity, or “documented” route is treated as approval. | Provenance is factual and non-endorsing; acceptance belongs to Tom; implementation needs separate slice authorization. | Documentation review rejects certification or implied-permission language. |
| T20 | External model receives browser content through custody or a composed MCP route. | V1 returns no browser-derived content; other content-capable controllers are excluded from the target during custody. | Provider/network and dual-route tests fail closed. |
| T21 | Pause/Stop closes or damages the human tab. | Detach debugger without closing the tab; command cancellation is bounded and idempotent. | Lifecycle test verifies the original tab survives. |
| T22 | Long leases become ambient authority. | Only 5/15-minute presets; no renewal without fresh gestures; per-call checks; eviction/lifecycle ends the lease. | Clock, expiry, pause, Stop, and attempted-renewal tests. |
| T23 | Commercial incentives pressure broader custody. | No credits, streaks, referrals, affiliate prompts, artificial expiry, engagement nudges, or authority-coupled upsells. | Product and release review. |

The Corsen reference demonstrates useful role-bound loopback routing, but its source also includes durable credentials, broad actions, and `<all_urls>` permission that this design rejects.[10][11][12] Its binding logic includes last-active fallback, which this design also rejects.[17] Its bridge and installation flow demonstrate detached/shared broker behavior and multi-profile installation rather than the owning-session lifecycle required here.[16][18]

## Security gates before code

- D1–D16 in ADR 0001 are accepted or deferred with fail-closed defaults.
- Root `manifest.json` remains exactly the current narrow permission posture; root runtime code is unchanged.
- No network listener, `debugger`, pairing material, or content-return path exists in the architecture-gate diff.
- Threat rows map to named future tests before the relevant implementation slice begins.
- Any permission, data-flow, target, gesture, lease, or route expansion amends this model before code lands.
- Live-browser claims follow `AGENTS.md`; mocks and screenshots never substitute for attested runtime evidence.

## Residual risk

Even a narrow adapter runs atop a technically powerful debugger permission. Chrome UI, extension-controlled indicators, and tests reduce but cannot eliminate compromised-extension, compromised-browser, compromised-OS/input, malicious-page, classification, or operator-error risk. Because OS-level synthetic input may be indistinguishable from physical input to Chrome, the custody client exposes no route to trigger consent and V1 treats human-operated extension chrome as a trust assumption. The prototype remains a laboratory until adversarial lifecycle tests, live Chrome Dev receipts, provenance review, and separate final acceptance all pass.

## Sources

[1] https://developer.chrome.com/docs/extensions/reference/api/debugger — Chrome Extensions debugger API
[2] https://developer.chrome.com/docs/extensions/reference/api/storage — Chrome Extensions storage API
[10] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/extension/src/protocol.js — Hermes Connector protocol source
[11] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/hermes-plugin/broker.py — Hermes Connector broker source
[12] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/extension/manifest.json — Hermes Connector manifest
[16] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/hermes-plugin/bridge_client.py — Hermes Connector bridge client
[17] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/extension/src/bindings.js — Hermes Connector bindings
[18] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/hermes-plugin/after-install.md — Hermes Connector post-install guide