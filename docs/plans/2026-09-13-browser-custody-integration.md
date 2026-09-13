# Hermes Browser Custody Integration Plan

> **For Hermes:** Use subagent-driven development to implement this plan task-by-task. Keep all implementation and review in isolated repository branches/worktrees; do not patch the live Hermes runtime.

**Goal:** Build and verify a visible, user-governed Hermes browser-custody prototype by combining a narrowly adapted `playwright-crx` debugger transport, a hardened Corsen-style authenticated loopback bridge, and selected side-panel UX lessons—while preserving Hermes’s four authority levels and rejecting broad, implicit, proprietary, or monetization-driven control patterns.

**Architecture:** The extension owns consent, custody display, per-tab grants, and debugger attachment. A local loopback broker owns authenticated routing between one Hermes profile/session and one authorized browser tab. Hermes remains the reasoning/tool client. The initial prototype does **not** embed the full Playwright runtime in the MV3 service worker; it adapts only the proven `chrome.debugger` transport and attach/detach ideas needed by a narrow command adapter. Existing disposable Playwright remains the deterministic fallback when no valid browser lease exists.

**Tech stack:** Chrome Manifest V3; plain JavaScript modules; native Chrome `sidePanel`, `action`, `storage.session`, `scripting`, and `debugger` APIs; WebSocket loopback protocol; Python 3.11 managed through `uv`; Node.js 22 test runner; Apache-2.0/MIT-compatible attribution.

---

## 1. Source decision ledger

### 1.1 `ruifigueira/playwright-crx@v0.15.0`

Pinned source: `aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac`  
License: Apache-2.0, with Playwright/Google notices.

**Adopt as concepts**

- `chrome.debugger` as a Playwright/CDP transport.
- Explicit `attach(tabId)` and `detach(tabId)` ownership.
- Tab-ID ↔ target-ID mapping.
- Detach without closing the human’s tab.
- Default/incognito context separation if incognito is ever added.

**Adapt before use**

- Reduce the transport to the small CDP/action subset Hermes actually needs.
- Put grant validation before every attach and command.
- Persist no authority in service-worker globals.
- Treat debugger detach, service-worker eviction, navigation, broker loss, lease expiry, and Chrome restart as revocation events.

**Reject**

- Shipping the recorder extension as Hermes’s control product.
- `attachAll`.
- Automatic attachment of opener-created tabs.
- Full Playwright 1.53 runtime inside the MV3 service worker.
- Recorder/player UI and install-time release-tab behavior.
- Assuming Chrome’s debugger banner is sufficient custody UI.

### 1.2 `CorsenAI/hermes-connector@bfd9bc29718c4647a1438962aae28ed4d1220df6`

Pinned source: exact commit above.  
License: MIT.

**Adopt as concepts**

- Loopback-only broker.
- Exact protocol/version negotiation with no downgrade.
- Role-bound challenge/response authentication.
- Separate browser and Hermes-agent roles.
- Fail-closed `profileId + sessionId` routing.
- Explicit binding transfer rather than active-tab fallback.
- Broker launch locking and version-aware supervision.

**Adapt before use**

- Use session-only pairing credentials for the lab; never persist the pairing secret to a plaintext file or `chrome.storage.local`.
- Scope state broadcasts to the authenticated principal rather than broadcasting every browser binding.
- Add a strict command allowlist at both broker and extension.
- Bind broker lifetime and grants to Hermes process/session heartbeats.
- Replace integer-tab persistence with a navigation-aware tab-instance identity.
- Keep the dedicated `ara-chrome-dev` profile as the canonical collaborative profile.

**Reject**

- Installing into every Hermes profile automatically.
- Treating Tom’s ordinary signed-in Chrome profile as the product boundary.
- Automatic grant inheritance for newly opened tabs.
- A page-DOM overlay as the authoritative custody indicator.
- A long-lived detached broker with no owning-session reaper.
- Shipping or trusting Corsen’s packaged Store item/companion as the house path.

### 1.3 AITOPIA (`becfinhbfclcgokjlobojlnldbfillpf`)

Chrome Web Store status: Featured; “follows recommended practices”; current listing reports version 6.9.0, 1,000,000 users, and 28.2K ratings.  
Source status: no corresponding official public source repository found; no open-source license established.

**Adapt as product observations only**

- A native side panel as the persistent conversational surface.
- An explicit model/agent selector.
- A visible web/page-context switch.
- Separate modes for chat, page context, and actions.
- Draft-first treatment for consequential communication: the human reviews and sends.

**Reject**

- Copying or reverse-engineering its code.
- `<all_urls>` injection or “assistant everywhere” defaults.
- Cloud routing, prompt training, marketplaces, credits, referral prompts, and unrelated media tooling.
- Treating Featured/Store approval, popularity, or ratings as a security audit or open-source provenance.
- Treating extension installation as page authorization.

### 1.4 Sider (`difoiogjjojoaoomphldepapgpbgkhkb`)

Chrome Web Store status at inspection: Featured; “follows recommended practices”; version 5.32.8; 5,000,000 users; 114.3K ratings.  
Source status: closed-source shipped extension; Sider's public GitHub organization does not establish source provenance for this product.  
Research receipt: `docs/research/sider-closed-source-product-audit.md`; directly inspected CRX SHA-256 `215b48e5c666108f0294502519cc16a890b72e05897daf0c5c62d705015f59bb` without installation or execution.

**Adapt as product observations only**

- Keep the assistant visibly adjacent to its exact source.
- Use narrow task verbs such as “Summarize this page” rather than one ambient “AI everywhere” mode.
- Display attached files/tabs, model/provider selection, and source-linked passages or timestamps.
- Use an inspectable input → draft/result flow.

**Treat as an anti-pattern study**

- Required `<all_urls>` plus all-frame scripts at `document_start` and `document_end`, alongside `cookies`, `scripting`, `userScripts`, `tabs`, `offscreen`, and `unlimitedStorage` permissions.
- Ubiquitous browser access presented as convenience without a first-class visible authorization lease.
- Subscriptions, expiring monthly credits, nonrefundable boosters, automatic renewal without reminder email, rewards-for-feature-use, referrals, affiliate tracking, and up-to-$45 sale commissions.
- Materially inconsistent generated-content rights: the Terms disclaim Sider ownership while the Privacy Policy asserts possible joint copyright and Sider reuse rights.
- Privacy terms retaining account data after closure and communications after the last contact for 99 years.
- Popularity claims with unreconciled store, cross-browser, and cross-platform denominators.

**Reject**

- Copying, deobfuscating, or adapting shipped code.
- Always-on all-origin/all-frame injection or cookie access.
- Credits, streaks, feature-reward loops, referral prompts, affiliate prompts, engagement nudges, and artificial expiry.
- Hidden marginal cost, ambiguous “free” claims, or post-hoc-only metering.
- Cloud content use or retention beyond the immediate requested operation unless separately and explicitly authorized.
- Treating Featured status, ratings, user counts, publisher history, or recommended-practices badges as security or custody evidence.

### 1.5 Provenance rule

Create `THIRD_PARTY_NOTICES.md` before any adapted source lands. Every adapted block must identify the upstream repository, exact commit/tag, original path, license, and local changes. AITOPIA and Sider contribute **no code** and receive only behavioral-reference citations. Sider's packaged CRX is audit evidence, not a dependency, fixture, or repository artifact.

---

## 2. Non-negotiable product contract

### Authority levels

| Level | Browser access | Human interaction | Automatic behavior |
|---|---|---|---|
| **Dormant** | None; no page read, debugger, or bridge command | Extension may be installed | None |
| **Conversational** | Side-panel conversation only; no page context | Human opens/selects conversation | No tab binding |
| **Approval-gated** | One named action against one currently authorized tab | Every mutating or sensitive action requires a fresh approval | No inherited grants; no background continuation |
| **Delegated control** | Explicit capability set on one tab instance for a bounded lease | Human starts, can pause/downgrade/stop at any time | Only allowlisted actions within lease; new tabs start unbound |

### Required invariants

1. Installation, enabled status, side-panel visibility, broker connection, pairing, and prior grants never imply current tab authorization.
2. Authority may downgrade immediately from any level. Upgrade requires a direct human gesture.
3. Grants are bound to `profileId`, `sessionId`, `tabId`, target identity, origin/navigation epoch, capability set, and expiration.
4. Navigation, tab replacement, Chrome restart, extension update/reload, broker loss, Hermes-session loss, debugger detach, or lease expiry revokes the grant.
5. Opening a child tab never transfers or inherits authority.
6. The extension action badge and side panel—not page-controlled DOM—are the authoritative custody display.
7. The broker and extension both reject unknown messages and capabilities.
8. No credentials, cookies, page text, form values, URLs, or browsing history are logged.
9. The dedicated `ara-chrome-dev` profile is the only collaborative persistent-profile lane in the lab.
10. If no valid lease exists, route deterministically to disposable Playwright or fail with an explicit “authorization required”; never seize another browser surface.
11. No authority, feature exposure, or data access may be coupled to credits, referrals, rewards, streaks, affiliate incentives, upgrade pressure, or engagement metrics.
12. If an operation has external model/API cost, disclose its provider, scope, and cost basis before execution; never use expiring credits or deliberately opaque metering.
13. Session-derived page content is deleted with the session unless Tom explicitly saves a named artifact.

---

## 3. Repository shape

Preserve the current root extension as the narrow read-only WebMCP/third-party-tool harness. Build the new custody experiment beside it so the current manifest and security promises do not silently broaden.

```text
packages/
  custody-extension/
    manifest.json
    src/
      service-worker.js
      authority.js
      grants.js
      tab-identity.js
      protocol.js
      bridge-client.js
      command-policy.js
      control-adapter.js
      debugger-transport.js
      sidepanel.html
      sidepanel.js
      sidepanel.css
    test/
      authority.test.js
      grants.test.js
      tab-identity.test.js
      protocol.test.js
      bridge-client.test.js
      command-policy.test.js
      debugger-transport.test.js
      manifest.test.js
      sidepanel.test.js
  hermes-bridge/
    pyproject.toml
    uv.lock
    src/hermes_browser_bridge/
      __init__.py
      auth.py
      protocol.py
      routing.py
      broker.py
      lifecycle.py
      plugin.py
    tests/
      test_auth.py
      test_protocol.py
      test_routing.py
      test_broker.py
      test_lifecycle.py
      test_plugin.py
  protocol-fixtures/
    v1-valid.json
    v1-invalid.json
    approval-flow.json
    delegated-expiry.json
    navigation-revocation.json

docs/
  adr/0001-browser-custody-architecture.md
  threat-model-browser-custody.md
  prior-art-browser-custody.md
  browser-custody-test-matrix.md
THIRD_PARTY_NOTICES.md
```

Likely root changes after the architecture gate:

- Modify: `package.json` — add workspace/check scripts without removing current checks.
- Modify: `AGENTS.md` — add rules for the new package while preserving the root harness invariants.
- Modify: `README.md`, `SECURITY.md`, `PRIVACY.md` — distinguish the read-only harness from the separately gated custody prototype.
- Do **not** replace root `manifest.json`, `src/service-worker.js`, or `src/injected-tools.js`.

---

## 4. Protocol and data contracts

### Grant record

```js
{
  grantId,
  profileId,
  sessionId,
  tabId,
  targetId,
  origin,
  navigationEpoch,
  level,              // approval-gated | delegated
  capabilities,       // explicit array from COMMAND_CAPABILITIES
  issuedAt,
  expiresAt,
  status              // active | paused | revoked | expired
}
```

Store active grants only in `chrome.storage.session`. Reconstructing after a browser or extension restart is forbidden; the correct restart state is Dormant or Conversational.

### Bridge envelope

```js
{
  protocol: 1,
  type,
  requestId,
  role,               // browser | agent
  profileId,
  sessionId,
  issuedAt,
  nonce,
  payload
}
```

Required message classes:

- Pairing: `challenge`, `pair_proof`, `paired`, `version_mismatch`.
- Presence: `hello`, `heartbeat`, `goodbye`.
- Custody: `grant_request`, `grant_approved`, `grant_denied`, `grant_revoked`, `grant_expired`.
- Commands: `command_request`, `command_approval_required`, `command_approved`, `command_result`, `command_error`.
- Binding: `binding_sync`, `binding_transfer`, `binding_revoked`.

Every message has a JSON schema in `packages/protocol-fixtures/`; JS and Python tests must consume the same fixtures.

### Session-only pairing

For the lab:

1. Broker creates a random pairing secret in process memory and displays it locally once.
2. Human enters it into the extension.
3. Browser and broker prove knowledge with role-bound HMAC challenges; the secret itself is never sent over the WebSocket.
4. Extension keeps the secret in `chrome.storage.session`; broker keeps it in process memory.
5. Browser/extension restart or broker restart requires pairing again.

This deliberately trades convenience for clean custody. Durable keychain-backed pairing is a later product decision, not an excuse for a plaintext credential cache.

---

## 5. Implementation tasks

### Task 1: Record architecture, provenance, and threat boundary

**Objective:** Make the design and reuse boundary reviewable before permissions or network code appear.

**Files:**

- Create: `docs/adr/0001-browser-custody-architecture.md`
- Create: `docs/prior-art-browser-custody.md`
- Create: `docs/threat-model-browser-custody.md`
- Create: `THIRD_PARTY_NOTICES.md`
- Modify: `AGENTS.md`

**Steps:**

1. Copy the source decision ledger and non-negotiable contract from this plan into the ADR.
2. Document trust boundaries: page ↔ extension; extension ↔ loopback broker; broker ↔ Hermes profile/session; persistent Ara profile ↔ disposable browser.
3. Enumerate threats: stale grants, tab-ID reuse, navigation, service-worker eviction, broker impersonation, agent-profile impersonation, replay, command confusion, malicious page overlays, secret leakage, debugger contention, orphaned processes, ambient all-origin access, engagement incentives, and cost-obscuring metering.
4. Add the explicit rule that `debugger` or network permissions require this threat review and Tom’s scoped approval before implementation.
5. Add exact upstream licenses/commits plus AITOPIA and Sider “behavioral reference only” entries. Link `docs/research/sider-closed-source-product-audit.md`; do not add the Sider CRX to the repository.
6. Encode anti-monetization requirements: no credits, artificial expiry, rewards, streaks, referrals, affiliate prompts, engagement nudges, or authority-coupled upsells; disclose any real external cost before execution.
7. Run `npm run check`; expected: existing six tests pass unchanged.
8. Commit: `docs: define browser custody architecture and provenance`.

**Gate:** No implementation work starts until this ADR is reviewed and accepted.

### Task 2: Add package scaffolding without broadening the current extension

**Objective:** Create isolated extension and bridge packages while keeping the existing root harness unchanged.

**Files:**

- Create directories/files from Section 3.
- Modify: `package.json`
- Create: `packages/hermes-bridge/pyproject.toml`

**Steps:**

1. Add npm workspace/check scripts for `packages/custody-extension`.
2. Configure `packages/hermes-bridge` for Python 3.11 and `pytest` via `uv`; never use bare system Python on Russet.
3. Add placeholder package tests that prove both packages are discovered.
4. Run `npm run check` and `uv run --project packages/hermes-bridge pytest`.
5. Commit: `build: scaffold isolated browser custody packages`.

### Task 3: Implement the authority reducer first

**Objective:** Encode the four levels and legal transitions independently of Chrome APIs.

**Files:**

- Create: `packages/custody-extension/src/authority.js`
- Create: `packages/custody-extension/test/authority.test.js`

**Steps:**

1. Write failing tests for every legal upgrade, every immediate downgrade, rejected implicit upgrades, restart-to-Dormant, and no carryover from “extension enabled.”
2. Run the single test; expected: fail because the reducer does not exist.
3. Implement a pure reducer with exhaustive event handling and fail-closed unknown events.
4. Run tests; expected: pass.
5. Commit: `feat: encode browser authority state machine`.

### Task 4: Implement navigation-aware grants and expiry

**Objective:** Ensure an authorization cannot survive the tab/page/session it was issued for.

**Files:**

- Create: `packages/custody-extension/src/grants.js`
- Create: `packages/custody-extension/src/tab-identity.js`
- Create: corresponding tests.

**Steps:**

1. Write failing tests for origin changes, same-origin navigation epoch changes, tab replacement, tab-ID reuse, browser restart, session mismatch, expiry, pause, and explicit revoke.
2. Implement immutable grant creation and `validateGrant(commandContext)`.
3. Store only active session grants; never restore them from durable storage.
4. Add an alarm/heartbeat expiry hook with a deterministic pure-time seam for tests.
5. Run package tests.
6. Commit: `feat: bind browser grants to tab instances and leases`.

### Task 5: Define the command policy before the executor

**Objective:** Prevent the bridge from becoming a generic CDP tunnel.

**Files:**

- Create: `packages/custody-extension/src/command-policy.js`
- Create: `packages/custody-extension/test/command-policy.test.js`

**Initial capabilities:**

- Conversational: none.
- Approval-gated: `page.snapshot`, `page.click`, `page.type`, `page.navigate`, `file.choose` only after per-action approval; `message.send`, purchases, permission grants, credential reads, and downloads remain denied.
- Delegated: the same explicit allowlist for the lease; no raw CDP method passthrough.

**Steps:**

1. Write table-driven failing tests mapping level + capability + grant + approval to allow/deny.
2. Add explicit deny rules for raw CDP, cookies, storage, history, credential APIs, arbitrary JavaScript, downloads, clipboard, extension management, and browser-wide commands.
3. Implement the policy as a pure function used by both UI and executor.
4. Run tests and commit: `feat: add fail-closed browser command policy`.

### Task 6: Build and cross-test protocol v1

**Objective:** Make JS and Python agree on exact messages, errors, versioning, and replay rejection.

**Files:**

- Create: `packages/custody-extension/src/protocol.js`
- Create: `packages/hermes-bridge/src/hermes_browser_bridge/protocol.py`
- Create: `packages/protocol-fixtures/*.json`
- Create: JS/Python protocol tests.

**Steps:**

1. Write fixtures for valid, malformed, wrong-version, wrong-role, stale timestamp, duplicate nonce, unknown type, and oversized payload messages.
2. Verify both implementations reject the same invalid fixtures.
3. Require exact protocol equality; emit visible `version_mismatch`; never downgrade.
4. Cap message and result sizes before parsing/forwarding.
5. Run JS and Python protocol tests.
6. Commit: `feat: define versioned browser bridge protocol`.

### Task 7: Implement ephemeral mutual authentication

**Objective:** Authenticate browser and agent roles without creating durable plaintext secrets.

**Files:**

- Create: `packages/hermes-bridge/src/hermes_browser_bridge/auth.py`
- Create: `packages/custody-extension/src/bridge-client.js`
- Create: auth/client tests.

**Steps:**

1. Write failing tests for browser-Origin enforcement, empty agent Origin, role-bound proofs, wrong secret, replayed nonce, expired challenge, and broker proof verification.
2. Generate the pairing secret in broker memory only.
3. Use HMAC-SHA256 challenge/response with constant-time comparison on Python; compare decoded proof bytes without early exit in JavaScript.
4. Keep the extension secret in `chrome.storage.session` only and clear it on disconnect/unpair.
5. Redact proofs, nonces, commands, URLs, and payloads from logs.
6. Run tests and commit: `feat: add session-only mutual bridge authentication`.

### Task 8: Implement fail-closed broker routing and lifecycle

**Objective:** Route one authenticated Hermes session to one authorized browser binding and reap abandoned state.

**Files:**

- Create: `packages/hermes-bridge/src/hermes_browser_bridge/routing.py`
- Create: `broker.py`, `lifecycle.py`, and tests.

**Steps:**

1. Write failing tests for exact `profileId + sessionId` routing, no last-active fallback, explicit transfer, principal-scoped state, heartbeat expiry, owner-process exit, duplicate broker launch, and unknown command rejection.
2. Bind only to `127.0.0.1`/`::1`; reject non-loopback configuration.
3. Maintain browser/agent registries in memory; do not persist bindings in the lab.
4. Add bounded launch locking and an owning-session heartbeat reaper.
5. Close sockets and revoke bindings when the owner disappears; prove no detached orphan remains.
6. Run `uv run --project packages/hermes-bridge pytest`.
7. Commit: `feat: add authenticated session-scoped browser broker`.

### Task 9: Build trustworthy side-panel custody UI

**Objective:** Present conversation and authority without letting UI presence imply control.

**Files:**

- Create: `sidepanel.html`, `sidepanel.js`, `sidepanel.css`, `sidepanel.test.js`.

**Required UI:**

- Current level label and color.
- Current Hermes profile/session.
- Current tab’s hostname only after authorization.
- Capability list and lease countdown.
- `Approve once`, `Delegate for…`, `Pause`, `Downgrade`, and `Stop` controls.
- Per-action approval card showing exact action, target description, and data involved.
- Explicit model/agent selector as metadata only; changing it never transfers grants.
- Page-context toggle off by default.
- Consequential communication stays draft-only; the human sends.

**Steps:**

1. Write DOM tests proving install/connected/open states display no control authority.
2. Write tests for every authority label and one-click Stop/downgrade.
3. Implement accessible keyboard/focus behavior and reduced-motion support.
4. Ensure custody indicators live only in extension-controlled surfaces and action badges.
5. Commit: `feat: add explicit browser custody side panel`.

### Task 10: Add the explicit current-tab gesture

**Objective:** Bind authorization to the human’s current tab without broad host access or tab harvesting.

**Files:**

- Create: `packages/custody-extension/manifest.json`
- Create/modify: package service worker and manifest tests.

**Manifest posture:**

- Required: `activeTab`, `scripting`, `sidePanel`, `storage`, `alarms`, `debugger`.
- No `<all_urls>`, content scripts, cookies, history, downloads, native messaging, externally connectable web origins, or remote code.
- Incognito disabled for v1.

**Steps:**

1. Write a failing manifest contract test for exactly the approved permission set and forbidden fields.
2. Make extension-action click open the side panel and create only a pending current-tab grant request.
3. Require a second explicit selection of Approval-gated or Delegated control before debugger attachment.
4. Test navigation/reload/tab-close/extension-reload revocation.
5. Commit: `feat: require explicit current-tab custody gesture`.

### Task 11: Adapt the narrow debugger transport

**Objective:** Execute allowlisted commands on one validated tab without embedding the full Playwright CRX product.

**Files:**

- Create: `packages/custody-extension/src/control-adapter.js`
- Create: `debugger-transport.js`
- Create: tests.
- Modify: `THIRD_PARTY_NOTICES.md`.

**Steps:**

1. Add fixture tests for attach, target discovery, command dispatch, response correlation, detach, external debugger cancellation, target close, navigation, and service-worker reconstruction-to-revoked.
2. Adapt only the necessary mapping patterns from `playwright-crx/src/server/transport/crxTransport.ts`, preserving Apache-2.0 attribution and exact source references.
3. Do not expose `attachAll`, raw `sendCommand`, popup inheritance, browser-wide CDP domains, or full Playwright APIs.
4. Validate the grant and command policy immediately before attach and immediately before every command.
5. Detach without closing the human’s tab on pause, downgrade, revoke, expiry, broker loss, or error.
6. Commit: `feat: add grant-checked Chrome debugger transport`.

### Task 12: Register a narrow Hermes plugin surface

**Objective:** Give Hermes explicit custody-aware tools without overriding existing browser tools.

**Files:**

- Create/modify: `packages/hermes-bridge/src/hermes_browser_bridge/plugin.py`
- Create: `packages/hermes-bridge/tests/test_plugin.py`

**Initial tools:**

- `browser_custody_status`
- `browser_custody_request`
- `browser_custody_command`
- `browser_custody_release`

**Steps:**

1. Write tests that require the real Hermes `profileId` and tool-call `sessionId` and reject caller-supplied impersonation.
2. Make status content principal-scoped and secret-free.
3. Make request return “human approval required” rather than promoting authority.
4. Make command fail if no matching active grant exists.
5. Keep existing `browser_*` routes intact; do not silently override them.
6. Run plugin tests in the project `uv` environment.
7. Commit: `feat: expose custody-aware Hermes bridge tools`.

### Task 13: Add deterministic route selection

**Objective:** Preserve one coherent browser experience without silently substituting control surfaces.

**Routing order:**

1. Use the exact authorized existing tab if a valid custody lease exists.
2. Otherwise offer/start the dedicated collaborative `ara-chrome-dev` lane when the task needs persistent identity and Tom authorizes it.
3. Otherwise use disposable Playwright.
4. If the requested action requires a different route than the one shown, stop and explain; never hop silently.

**Files:**

- Create: `packages/hermes-bridge/src/hermes_browser_bridge/router.py`
- Create: `packages/hermes-bridge/tests/test_router.py`
- Update ADR and tool descriptions.

**Steps:**

1. Write table-driven tests for each route and every unavailable/expired/mismatched condition.
2. Implement pure route selection returning route + reason + required human action.
3. Add telemetry-free structured local receipts with no URL/content/secret fields.
4. Commit: `feat: add deterministic browser custody routing`.

### Task 14: Run adversarial and lifecycle verification

**Objective:** Prove the design fails closed under the failure modes the prior art leaves weak.

**Files:**

- Create: `docs/browser-custody-test-matrix.md`
- Add integration tests under both packages.

**Automated cases:**

- Service-worker eviction/restart.
- Browser restart and tab-ID reuse.
- Broker crash/restart.
- Hermes session exit.
- Extension update/reload.
- Navigation and cross-origin redirect.
- DevTools opening and canceling debugger attachment.
- Second Hermes session attempting to steal a binding.
- Replay, stale message, wrong role, wrong Origin, wrong version, oversized message.
- Unknown command and raw-CDP attempts.
- New tab and popup remain unbound.
- Stop/downgrade detaches within a bounded interval.

**Commands:**

```sh
npm run check
uv run --project packages/hermes-bridge pytest
```

Expected: all existing root tests and all new JS/Python tests pass.

**Live Chrome Dev matrix:** Follow `AGENTS.md` preflight exactly; record Chrome Dev version, `ara-chrome-dev` profile, extension source digest, extension ID, commit, each authority transition, debugger attach/detach, navigation revocation, broker reaping, and disposable fallback. Mark anything not directly observed `not run` or `unverified`.

Commit: `test: verify browser custody and orphan cleanup`.

### Task 15: Review before any packaging or upstream proposal

**Objective:** Keep the prototype clean, attributable, and separate from Tom’s live runtime.

**Steps:**

1. Run a security review focused on permissions, authentication, replay, data minimization, custody UI spoofing, and process cleanup.
2. Run license/provenance review against exact adapted blocks.
3. Run Chrome Web Store policy review, while explicitly stating that Store review is not a security certification.
4. Confirm no minification, obfuscation, remote code, telemetry, analytics, or secrets in artifacts.
5. Confirm the root read-only harness still has its original permissions and behavior.
6. Only after all gates pass, create a separate isolated Hermes Agent worktree and upstream PR proposal. Never patch `~/.hermes/hermes-agent` directly.
7. Packaging, Store submission, publication, maintainer contact, and live installation each require separate explicit authorization from Tom.

---

## 6. Acceptance criteria

The prototype is complete only when all of these are demonstrated:

- [ ] Four authority levels exist as enforced state, not labels.
- [ ] Extension installed/on, side panel open, broker connected, and paired all remain non-authorizing states.
- [ ] Approval-gated mode prompts once per sensitive/mutating command.
- [ ] Delegated mode is tab-instance-, capability-, profile-, session-, and time-bounded.
- [ ] New tabs and popups never inherit authority.
- [ ] Every downgrade/expiry/failure detaches debugger control without closing Tom’s tab.
- [ ] Chrome/extension/broker/Hermes restarts cannot resurrect grants.
- [ ] Broker is loopback-only, mutually authenticated, exact-versioned, replay-resistant, principal-scoped, and reaped.
- [ ] No generic CDP tunnel or arbitrary JavaScript execution is exposed.
- [ ] No `<all_urls>` host permission or automatic content script exists.
- [ ] The side panel and action badge show the same authoritative state.
- [ ] Existing root harness tests remain green.
- [ ] New JS and Python unit/integration suites pass.
- [ ] Live Chrome Dev test receipts identify exact browser/profile/source/commit.
- [ ] Disposable Playwright remains available and is selected deterministically only when no valid collaborative lease exists.
- [ ] All adapted code has exact Apache-2.0/MIT provenance; AITOPIA contributes no code.

---

## 7. Risks and deliberate tradeoffs

- **`debugger` is a broad, visible permission.** Code-level gating does not narrow Chrome’s install warning. The prototype must justify it and keep its use inspectable.
- **Session-only pairing adds friction.** That is preferable to durable plaintext secrets during the lab phase. A keychain-backed durable design can follow after threat review.
- **Not embedding full Playwright means a smaller initial action surface.** This avoids a large stale runtime in an evictable service worker. Expand only when a demonstrated use case justifies it.
- **A side panel can look reassuring while authority is wrong.** State must come from the same reducer/grant registry that gates commands—not duplicated UI flags.
- **A hostile page can spoof in-page indicators.** Page overlays are informational only; extension chrome is authoritative.
- **Store acceptance proves distribution-policy compliance, not source quality or safety.** Treat it as one release gate, never the trust root.

## 8. Open decisions requiring Tom’s approval before implementation

1. Approve creating the separate `packages/custody-extension` manifest with the `debugger` permission.
2. Approve adding a loopback WebSocket companion package to this currently network-silent repository.
3. Choose the initial Delegated-control lease presets (recommended: 5 minutes, 15 minutes, and “until I stop”; no indefinite persistence).
4. Decide whether page text may be returned in the prototype at all, or whether v1 remains structural/action-only.
5. Decide whether the first upstream target is this lab alone or a later isolated Hermes Agent PR after the lab passes.
