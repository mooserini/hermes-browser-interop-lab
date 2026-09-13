# ADR 0001: Browser custody architecture

- **Status:** Accepted
- **Accepted by:** Thomas Kenny on 2026-09-13
- **Decision owner:** Thomas Kenny
- **Prepared by:** Ara Voss, with independent adversarial review
- **Scope:** Architecture gate only; no permission, network, runtime, packaging, or deployment change
- **Supersedes when accepted:** the conflicting draft clauses listed below

## Context

The shipped root extension is a narrow, read-only interoperability harness. It uses a direct browser-action gesture, `activeTab`, fixed local injection, aggregate output, no network transport, and no durable controller state. The proposed custody prototype is a separate experiment for approval-gated or delegated action on one explicitly selected tab.

Chrome documents `chrome.debugger` as an alternate CDP transport capable of network instrumentation, JavaScript debugging, and DOM/CSS mutation; using it requires the manifest `debugger` permission.[1] That reach makes architecture and threat acceptance prerequisites, not cleanup after implementation.

The authority-reducer spike validates only four-level transition policy. It does not authorize a manifest, debugger attachment, bridge, persistence, page-content return, or Hermes integration.

## Decision

When accepted, browser custody MUST be implemented as a separate package beside the root harness. The root manifest and root runtime remain unchanged. No plan, draft, validated spike, installed state, paired controller, open panel, badge, prior lease, Store badge, successful MCP connection, or technically reachable command constitutes authorization.

A command is allowed only when all independent predicates are true immediately before debugger attachment **and again immediately before every CDP call**:

```text
allowed = authority reducer permits
       ∧ current in-memory grant validates
       ∧ command and target policy permit
       ∧ exact route has fresh human authorization
       ∧ target has one uncontested debugger owner
```

A policy denial denies that command without silently changing authority. A lifecycle or integrity failure named below revokes to Dormant. Ambiguity about which class applies is an integrity failure and revokes.

## Normative invariants

1. **Separate artifacts and closed permissions.** Custody work lives under `packages/custody-extension`; it MUST NOT broaden root `manifest.json` or root `src/`. The only proposed V1 custody permissions are `activeTab`, `scripting`, `sidePanel`, `storage`, `alarms`, and `debugger`. `host_permissions`, `<all_urls>`, `tabs`, `cookies`, `webRequest`, `nativeMessaging`, `downloads`, `history`, `management`, persistent content scripts, and any unlisted permission are denied. Changing this list requires an ADR amendment and separate explicit approval.
2. **Current consent.** Dormant, installed, enabled, connected, paired, panel-open, badge-visible, and debugger-attached states grant no action authority.
3. **Human gesture provenance and immutable pre-grant capture.** The first gesture is a human-operated Chrome action click. Its extension handler captures the exact `tabId`, top-frame document identity, top-frame origin, and navigation/document epoch available without debugger attachment, then mints a short-lived, single-use nonce unavailable to broker commands. Any document, history-state, hash, prerender, top-frame, origin, tab, or window change before the second gesture consumes the nonce and returns Dormant. A second trusted event in extension-controlled chrome (`Event.isTrusted`) chooses the level and exact scope only for that unchanged capture. Any target identity learned later must resolve to the same captured tuple. Side-panel focus, active-tab lookup, `chrome.commands`, context-menu events, CDP input, `computer_use`, or any broker/agent field cannot mint or substitute for either gesture. The extension exposes no command that triggers consent UI. The inability to distinguish physical input from compromised OS-level injection is an explicit residual trust assumption, not a solved proof.
4. **Top-frame-only grants.** Every grant binds `profileId`, `sessionId`, `tabId`, target identity, captured top-frame identity, top-frame origin, navigation/document epoch, capability set, issuance time, expiration, and status. The only legal V1 frame scope is that captured top frame. Every child frame remains unbound, including same-origin and same-process frames; workers, prerendered pages, and auto-attached child targets are also unauthorized.
5. **No inheritance or transfer.** Child tabs, popups, replacement tabs, frames, workers, history-state transitions, hash changes, prerender activation, and navigations begin unbound. There is no `attachAll`, opener inheritance, last-active fallback, active-tab rebinding, or binding transfer in V1.
6. **Fail closed.** Browser/extension restart, service-worker eviction, broker loss, Hermes-session loss, controller loss, debugger detach, tab replacement/reuse, document/epoch change, history-state transition, hash change, lease expiry, malformed input, grant/gate mismatch, and unknown events revoke to Dormant.
7. **No persisted authority.** Active grants, gesture nonces, and pairing material exist only in trusted extension/broker process memory and die with their owning session. They MUST NOT enter `storage.session`, `storage.local`, sync storage, IndexedDB, disk, logs, receipts, chat, or source control. `storage.session` may hold non-authoritative UI preferences only, with access restricted to trusted extension contexts; Chrome clears it on browser restart and also on extension reload, update, and disable.[2]
8. **One source of truth.** The same reducer and in-memory grant registry gate commands and paint extension-owned custody indicators. Page-DOM overlays are informational and spoofable.
9. **No generic tunnel or passive collection.** Raw CDP, arbitrary JavaScript, cookies, storage, history, WebAuthn, CDP/page-data/network subscriptions, credentials, browser-wide commands, and implicit target selection are denied. The sole passive exception is a bundled, grant-scoped isolated-world lifecycle sentinel installed through `scripting` after the second gesture; it may observe only document, history-state, hash, and prerender lifecycle changes and emit only a finite revocation reason, never page content or metadata. Sentinel loss or uncertainty revokes. V1 attaches immediately before one operation and detaches immediately afterward, including during a Delegated lease.
10. **No silent or automatic route hop.** An authorized existing tab, the dedicated collaborative Chrome Dev lane, and disposable Playwright are distinct routes. Absence or failure of one route returns a canonical denial plus required human action; it never invokes another route. Every route change requires a new explicit human authorization before execution. Merely documenting a route does not authorize it.
11. **One debugger and one content-capable controller.** Chrome DevTools MCP and custody `chrome.debugger` MUST NOT concurrently own the same target. While a custody grant is active, no other MCP, extension, or automation lane may read or act on that target. Contention or uncertainty stops; V1 never disconnects, steals, retries, or composes with the existing controller.
12. **Human-minted targets and precisely bounded results.** A click/type handle can be minted only when the human designates a target in extension-controlled chrome during the second gesture; it is an opaque, grant-local, short-lived identifier plus a finite role/actionability class. The custody API exposes no discovery, query, enumeration, snapshot, selector, coordinate, `tabId`, `frameId`, or JavaScript target input, and rejects any agent-supplied form of those fields. Attach identity comes only from the immutable grant. A handle/result contains no accessible name, selector, text, title, URL, geometry, attributes, HTML, or page-derived error string. “Bounded action outcome” means `{ok, reasonCode}` from a finite schema. Browser-derived page text, HTML, screenshots, URLs, tab/window titles or lists, form values, credentials, accessibility trees, selectors, console output, CDP errors, and network data never enter tool results, model context, or receipts.
13. **Sensitive targets stay human-only and live-classified.** Generic verbs do not bypass consequential-action policy. Immediately before the input CDP call, the adapter re-resolves the opaque handle to the live node, reruns target classification, and requires the live top-frame hit-test target to be that same node. Node identity, role, frame, origin, document, actionability, or hit-test mismatch—and every uncertainty—denies. `page.type` is denied for password, passkey, OTP/2FA, payment, credential, file, and other sensitive fields. `page.click` is denied for authentication, permission, Send/Post/Publish, purchase/payment, download, upload/file-choice, credential, destructive, or uncertain controls.
14. **Humans choose destinations; navigation consumes authority.** Only the second human gesture may name and approve an exact navigation destination; broker/agent URL fields are rejected. V1 permits `https:` destinations and the explicitly approved local-fixture `http:` origin only. A Delegated lease with no pre-named destination denies `page.navigate`. The first navigation, redirect, history-state transition, hash change, or prerender activation revokes before any post-navigation operation. The authorized navigation never carries the lease into the destination.
15. **Bounded leases.** V1 Delegated presets are 5 or 15 minutes only. Every operation still revalidates all predicates; Stop, Pause, human input ambiguity, and lifecycle events revoke or suspend immediately. There is no “until Stop,” indefinite, renewable-without-gesture, or service-worker-surviving lease.
16. **Canonical reasons and minimal presence.** Conversational presence reveals no tab title, URL, hostname, page text, or metadata. Receipts use bounded reason codes and anonymous session-local identifiers, never raw events, page data, destinations, selectors, or stable browsing identifiers.
17. **No live-runtime shortcut.** Development and review occur in isolated repository worktrees. No task patches Tom's live Hermes runtime.

## Decision register

Thomas Kenny accepted D1–D16 together with this ADR on 2026-09-13. This acceptance governs architecture only; each implementation slice still requires the separate authorization named below. An unresolved future amendment takes its fail-closed default.

| ID | Accepted architecture decision | Fail-closed default for an unresolved amendment |
|---|---|---|
| D1 | A separate `packages/custody-extension` may use only the exact V1 permission list in invariant 1. | No package manifest and no `debugger`. |
| D2 | A separate loopback WebSocket bridge may be built after protocol review. | Repository remains network-silent. |
| D3 | V1 targets only human-designated opaque handles and returns only the precisely defined handles and `{ok, reasonCode}` outcomes in invariant 12. | No target discovery and no browser-derived content or metadata return. |
| D4 | Delegated lease presets are 5 and 15 minutes; neither survives eviction/restart or renews without a fresh gesture. | No Delegated lease. |
| D5 | First implementation and proof remain in this laboratory. | No Hermes upstream or live-runtime change. |
| D6 | V1 custody supports only an explicitly authorized tab in `ara-chrome-dev`; disposable Playwright remains a separate, separately approved testing route, never a fallback. Tom's ordinary signed-in profile is out of scope. | No personal-profile control and no route fallback. |
| D7 | DevTools MCP or custody `chrome.debugger` may own a target, never both; custody does not disconnect MCP. | Stop on existing ownership or uncertainty. |
| D8 | Every document/history/hash/prerender transition, including same-origin reload and an agent-authorized navigation, changes the epoch and revokes. | Revoke. |
| D9 | Browser/extension restart, service-worker eviction, broker/session loss, or any attempted reconstruction lands Dormant. | Dormant; never reconstruct authority. |
| D10 | Initial verbs are `page.click`, `page.type`, and `page.navigate`, constrained by invariants 12–14; there is no discovery or generic snapshot verb and no agent-selected target. | Deny all actions. |
| D11 | Human Chrome-action click opens Conversational presence only; a second trusted extension-chrome gesture selects action authority, top-frame targets, and any navigation destination for the captured tab. | Conversational only. |
| D12 | Pause, Stop, panel close, navigation/history/hash change, detach, loss, eviction, and expiry are named reducer events synchronized with grants. | Unknown or desynchronized state revokes. |
| D13 | Stop and lease end land Dormant; Pause suspends until a fresh human gesture. | Dormant. |
| D14 | Pairing is human-mediated, role-bound, extension-origin-pinned, loopback-only, process-memory-only, replay-resistant, and owned by one live session. | No pairing or listener. |
| D15 | Root harness, custody prototype, DevTools MCP, disposable automation, and existing `browser_*` tools remain distinct and may not dual-wield one custody target; in-page cues never prove custody. | Preserve current routes and artifact identity. |
| D16 | Sensitive targets and consequential actions remain human-only even when expressed through generic verbs during Delegated control. | Deny. |

## Superseded draft contradictions

The following older clauses were superseded when this ADR was accepted; they remain non-authorizing:

| Older guidance | Resolution in this ADR |
|---|---|
| Integration plan and control-model draft allow automatic disposable-Playwright fallback. | D6 and invariant 10 require a separate human-approved route; no fallback. |
| Control-model Strategy B describes an ordinary existing/personal Chromium profile. | D6 limits custody to an explicitly authorized `ara-chrome-dev` tab; Tom's ordinary profile is out of scope. |
| Integration plan allows restart to Dormant **or Conversational** and the draft discusses persisted session recovery. | D9 and invariants 6–7 always land Dormant and forbid reconstruction. |
| Integration plan says the first action click creates a pending grant request. | D11: first action click creates Conversational presence only, not a grant. |
| Validated reducer names `panel.opened` as the event entering Conversational, while the integration plan calls the first click a pending grant request. | Invariant 3 and D11 require a human Chrome-action click, immutable pre-grant capture, and Conversational presence only; panel availability, focus, or a broker-opened panel grants nothing. |
| Draft vocabulary includes `snapshot`, `screenshot`, `read_console`, and `list_tabs`; the plan mentions `page.snapshot` and `file.choose`. | D3/D10 and invariant 12 replace them with human-designated opaque handles; V1 has no discovery/query/enumeration API. |
| Integration plan protocol includes `binding_transfer`. | Invariant 5 rejects transfer; a new tab needs a fresh two-gesture grant. |
| Integration plan stores active grants and the extension pairing secret in `storage.session`; the older workflow recommends it for transient action state. | Invariant 7 forbids grants, nonces, pairing material, and all authoritative action state in browser storage. |
| Draft leaves same-origin reload preservation open. | D8 revokes on every document/history/hash/prerender transition. |
| Draft says “full control” as a capability category. | The phrase grants nothing; only the closed verb, target, data, and permission sets in this ADR apply. |
| Plan/draft command routes imply one vocabulary can hide route choice. | Invariant 10 requires route-specific authorization before execution. |
| Prior planning suggests `storage.session` grant recovery. | Invariant 7 forbids authority and pairing material in storage; worker eviction revokes. |
| Integration plan proposes an “until I stop” Delegated preset. | Invariant 15 and D4 permit only 5- and 15-minute presets; no indefinite or Stop-only lease exists. |
| Integration plan later repeats explicit transfer as a broker-routing test and deterministic disposable fallback as an acceptance criterion. | Invariants 5 and 10 supersede both: there is no transfer and no automatic route fallback. |

Where any plan, draft, spike, workflow, or research note conflicts with this table, this ADR's fail-closed rule governs the custody track.

## Consequences

- The architecture favors visible friction over stale or ambient authority.
- Same-origin reloads and SPA transitions require fresh authorization in V1.
- A useful command may remain unavailable until a narrower target/data contract is accepted.
- Debugger contention interrupts the workflow rather than silently displacing DevTools.
- Short reattachments cost performance but reduce passive debugger reach.
- Future convenience changes require an ADR amendment, tests, threat-model updates, and explicit decision-owner acceptance.

## Architecture-gate acceptance

This ADR moved from `Proposed` to `Accepted` on 2026-09-13 after:

- D1–D16 were accepted by the decision owner;
- `docs/threat-model-browser-custody.md`, `docs/prior-art-browser-custody.md`, and `THIRD_PARTY_NOTICES.md` are reviewed together;
- root manifest/source freeze and current tests are verified;
- the supersession table is complete enough that older drafts cannot fill a silence;
- no implementation, permission, listener, pairing secret, or live-runtime change is present in the gate diff.

Implementation still requires a separate scoped authorization after acceptance.

## Sources

[1] https://developer.chrome.com/docs/extensions/reference/api/debugger — Chrome Extensions debugger API
[2] https://developer.chrome.com/docs/extensions/reference/api/storage — Chrome Extensions storage API