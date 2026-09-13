# Draft: Consent-Gated Agent Browser Control Model

**Status:** Rough architecture draft for discussion; not an implemented capability or current security claim

**Authors:** Ara Voss; product direction, constraints, and testing partnership by Thomas Kenny (`mooserini`)

## Purpose

Define a visible, consent-gated way for a person and agent to share one coherent browser surface at four escalating trust levels. Disposable automation, a human-delegated tab, and a dedicated collaborative profile remain execution strategies beneath that surface rather than three products the person must mentally operate.

The model separates three questions that must not be collapsed:

1. **Presence:** Is the extension merely installed, or has the person intentionally opened the agent beside this tab?
2. **Authority:** May the agent only converse, request approval for each consequential action, or operate the tab under a revocable delegated lease?
3. **Execution strategy:** Which browser transport and profile best fit the task's identity, persistence, visibility, and collaboration requirements?

The extension is the human-visible consent boundary, shared workspace, and browser-side attachment point. It is not blanket authorization for a browser profile merely because it is installed, reachable, enabled, left open, or used previously.

> **Installed, reachable, or previously enabled does not imply current intent.**

## Design principles

1. **No inferred consent.** Technical availability, an installed extension, a remembered setting, an open browser, or prior authorization never substitutes for a current intentional act.
2. **Conversation is not control.** Opening the agent beside a page permits interaction with the agent UI, not automatic inspection or manipulation of the page.
3. **Exact-scope delegation.** Authorization applies to the tab the person deliberately shares, not automatically to adjacent tabs, windows, profiles, or future navigations.
4. **Visible custody.** The interface distinguishes conversational presence, approval-gated action, and delegated control, and makes revocation obvious.
5. **Least-privileged routing.** Use disposable automation unless persistent identity, explicit human delegation, or live collaboration provides a concrete reason not to.
6. **No silent substitution.** Failure in one strategy must not silently reroute an action into a browser with different identity or authority.
7. **One agent-facing command vocabulary.** Browser transports may differ underneath, but the agent should receive consistent operations and result shapes.
8. **Identity is explicit.** A dedicated agent profile, a human-delegated profile, and a disposable profile are different principals and must never be presented as interchangeable.
9. **Lifecycle is part of security.** Launch, attachment, detachment, crash recovery, ownership, and cleanup must be as well-defined as navigation and clicking.

## Four-level human trust model

The four levels describe what a person has presently authorized within one browser surface. They are not browser backends and should not force the person to switch windows, profiles, or applications merely to express trust.

### Level 0 — Dormant

**Meaning:** The extension is installed or technically reachable, but the person has expressed no current intent to involve the agent with this tab.

- The agent side panel is closed.
- No tab authorization exists.
- No control registration is advertised for the tab.
- No page content or browser state is sent to the agent.
- Closing, forgetting about, or leaving the extension installed changes nothing.

Installation, technical readiness, and stale settings all remain at Level 0. **Available means capable, not invited.**

### Level 1 — Conversational

**Meaning:** The person has intentionally opened the agent beside the current tab, but has not granted browser-action authority.

- Chat and planning are available in the same browser surface.
- The agent may discuss what the person describes or deliberately provides.
- The tab is not automatically inspectable or controllable.
- The interface may offer higher trust levels, but it must not silently enter one.
- Closing the panel returns to Dormant unless a separately visible active lease requires explicit handling.

This level captures the user's intent to collaborate without equating attention with operational permission.

### Level 2 — Approval-gated

**Meaning:** The person permits the agent to propose browser actions, but each consequential action or bounded action batch requires approval.

- The agent identifies the intended action, target tab or origin, and material effect.
- Read-only inspection and state-changing actions may have different approval thresholds.
- Approval is scoped to the described action or batch; it is not a durable grant.
- Denial or timeout leaves the tab under human control.
- The UI plainly states when approval will be requested rather than hiding the rule behind protocol jargon.

This is the natural collaborative default when the correct next action is clearer to the agent than the desired breadth of authority is.

### Level 3 — Delegated control

**Meaning:** The person grants an identified controller a temporary, bounded, revocable lease to drive the selected tab without per-action approval.

- The toolbar icon, badge, and side panel visibly indicate delegated control.
- The active controller identity, tab, origin, capability set, and lease scope are inspectable.
- A prominent **Stop control** action immediately cancels the lease.
- Commands outside the negotiated capability set are rejected.
- Authority is bound to the selected tab, controller, browser profile, and session.
- Human input remains authoritative, and the UI prevents ambiguous simultaneous control where practical.

Delegated control is the browser equivalent of “full send,” not a permanent entitlement. For a browser-focused extension it should mean full control of the explicitly delegated browser scope—not unrestricted filesystem or whole-computer authority unless those are separately disclosed and granted.

## Trust-level transitions

```text
          ┌─────────┐   open agent panel   ┌────────────────┐
          │ Dormant │ ───────────────────▶ │ Conversational │
          └─────────┘                      └────────────────┘
               ▲                              │           │
               │ close / revoke               │ choose    │ choose delegated
               │                              │ approval  │ control
               │                              ▼           ▼
               │                      ┌────────────────┐  ┌───────────────────┐
               └──────────────────────│ Approval-gated │  │ Delegated control │
                                      └────────────────┘  └───────────────────┘
                                               ▲                 │
                                               └─────────────────┘
                                                reduce authority
```

Required invariants:

- Dormant must never transition directly to Approval-gated or Delegated control without a current human action.
- Opening the side panel enters Conversational, not browser control.
- Approval-gated authority applies only to the action or batch actually approved.
- Delegated control requires both a current human grant and an authenticated controller lease.
- Controller loss, extension restart, lease expiry, or ambiguous state must fail to a lower-authority state.
- Remembered preference may improve UI convenience but may not manufacture current intent.

Internal connection states such as disconnected, controller-available, leased, and executing still exist, but they are implementation lifecycle states rather than the four human trust levels.

## Execution strategies beneath one browser experience

These strategies are selected underneath the human-facing trust model. They must not become three unrelated desktop surfaces that force the person to chase the agent among browsers. When a different process or profile is technically necessary, the product should launch, present, and identify it as one coherent collaborative browser experience.

### Strategy A — Disposable automation

**Environment:** Ephemeral Playwright-controlled Chromium or another explicitly disposable browser context.

**Use when:**

- no tab is presently Approval-gated or under Delegated control;
- the task requires no persistent browser identity;
- public or untrusted browsing is sufficient;
- isolated, unattended automation is preferable.

**Properties:**

- separate temporary profile;
- no human account assumed;
- no reuse of personal cookies or credentials;
- deterministic cleanup;
- headless or visible presentation chosen for task needs, not identity theater.

This is the default fallback, not a degraded emergency mode. It may remain invisible when headless operation is appropriate, while its results return through the same agent conversation surface.

### Strategy B — Human-delegated personal tab

**Environment:** A tab in a person's existing Chromium profile, placed under Approval-gated or Delegated control through the extension.

**Use when:**

- the person deliberately chooses the current personal tab;
- existing human authentication or page context is relevant;
- collaboration is bounded to that tab.

**Properties:**

- authority comes from the direct user gesture;
- access is tab-scoped and capability-scoped;
- surrounding profile state is not implicitly authorized;
- the agent acts as a disclosed delegate, not as the profile owner;
- failure must not silently fall back to a different identity or browser.

### Strategy C — Dedicated collaborative agent browser

**Environment:** Visible Google Chrome Dev using a dedicated collaborative profile and the same consent/controller protocol.

**Use when:**

- a persistent agent identity is required;
- the task benefits from the operator and agent sharing a visible browser;
- authentication, visual judgment, passkeys, OAuth, CAPTCHA, or another human checkpoint may occur;
- a durable development and interoperability environment is preferable to a personal tab.

**Properties:**

- dedicated browser-profile identity;
- visible agent custody;
- human observation and intervention;
- explicit launch ownership and lifecycle records;
- no attachment to unrelated personal browser processes;
- clean detach, shutdown, crash recovery, and orphan reaping.

## Deterministic routing policy

```text
INPUT: requested browser action, task context, live controller registry

1. Is an exact tab currently Approval-gated or under Delegated control for this controller/session?
   YES → Route only to that authorized tab under the selected trust rule.

2. Does the task require persistent Ara identity or explicit live collaboration?
   YES → Offer or launch the dedicated collaborative Chrome Dev strategy inside the same product experience.
          Begin at Conversational and require a current authority choice before control.

3. Otherwise → Use disposable Playwright Chromium.
```

Additional rules:

- A Dormant extension is not selected merely because it exists.
- A Conversational panel may suggest a strategy or trust level but may not infer action authority.
- A task that begins in disposable mode does not acquire personal authentication by silently switching strategies.
- If the selected strategy fails, report the failure and required choice. Do not impersonate continuity by falling back to another profile.
- Sensitive actions may require a fresh confirmation even during Delegated control.

## Common command vocabulary and transport adapters

The agent-facing contract should expose consistent conceptual operations:

```text
navigate
snapshot
click
type
press
scroll
screenshot
read_console
list_tabs
```

The implementation may route them through different adapters:

```text
Agent browser command
        │
        ├── Playwright adapter ── disposable Chromium
        ├── CDP adapter ───────── dedicated Chrome Dev
        └── Extension adapter ─── explicitly authorized existing tab
```

The adapters should normalize command inputs, structured results, errors, cancellation, and capability reporting. They should not pretend that the underlying authority is identical.

Playwright belongs to the same browser-automation lineage as Puppeteer: it was created by engineers associated with Puppeteer and carries forward the DevTools-driven page automation model while broadening browser and testing support. This lineage reinforces that disposable, headed, and attached modes are variations on mature browser-control foundations rather than three inventions from scratch. It does not erase transport or trust-boundary differences.

## ChatGPT Browser Use precedent

Two evidence classes inform this precedent and should not be conflated.

### Verified from public documentation

OpenAI documents a browser-extension path for using ChatGPT Work or Codex inside an existing Chrome-family tab, signed-in session, and regular browser profile.[1] It separately documents a built-in browser with its own profile and states that Computer Use can open pages, click, type, inspect rendered state, take screenshots, and verify results.[2] Site tools are its implementation of WebMCP and let a website expose predefined operations to the agent alongside the live page and signed-in state.[3]

### Unpublished operator observation

An operator-captured recording and its corresponding Google Chrome settings showed:

- one Chrome window, visible tab, page, and profile remain on screen;
- the ChatGPT side panel opens and closes within that browser surface;
- conversation is available without a browser or desktop transition;
- an orange authority control opens a menu labeled **How should ChatGPT actions be approved?**;
- the menu offers **Ask for approval** — “Always ask to edit external files and use the internet” — and **Full access** — “Unrestricted access to the internet and any file on your computer”;
- **Full access** is visibly selected in the recording;
- the corresponding settings showed the Google Chrome extension installed, WebMCP site tools enabled, per-category policies for history, browsing, downloads, and uploads, and **Enable full CDP access** enabled for connected Browser Use sessions.

The public documentation corroborates the general extension, browser-control, and site-tool product family. It does **not** independently verify the quoted approval-menu copy, the orange control, or the full-CDP setting observed in the unpublished recording. The combined evidence suggests—but does not prove from public sources alone—that side chat, browser control, site tools, permission policy, and optional full CDP are composed behind one browser experience.

The recording does not show an action being executed and therefore does not prove that a CDP command was issued during that session. No literal `CDP` label is visible in dense frame sampling of the video; the settings screen supplies the missing evidence that full CDP capability was enabled. The orange control should still be described to ordinary users as an authority or approval badge rather than by protocol jargon. The stronger lesson is that transport details can remain underneath a plain-language, graduated trust control in one persistent browser surface.

## Prior art and implementation leverage

This design emerged independently, but the core mechanism is established prior art and should be reused where it is sound rather than rebuilt from folklore:

| Reference | What it already demonstrates | How it should inform this design |
| --- | --- | --- |
| **Microsoft Playwright Extension** | Connects Playwright MCP to existing authenticated Chrome or Edge tabs. A human approves each connection by default; each client receives a visibly distinct tab group; a tab belongs to only one client; moving tabs into or out of that group changes the client's reachable scope; connections can be disconnected individually. The profile can also be selected explicitly.[4][5] | Preserve its tab-group custody, per-connection approval, profile selection, and Playwright-compatibility lessons. Do not assume the entire extension is the correct substrate for Hermes's narrower authority model. |
| **`playwright-crx`** | Provides an inspectable Apache-2.0 Chrome-extension transport for connecting Playwright concepts to Chrome tabs through `chrome.debugger`, including explicit attach/detach and target mapping.[12] | Adapt only the smallest transport patterns needed after grant validation. Reject attach-all behavior, automatic child-tab inheritance, recorder UI, and embedding a full Playwright runtime in an evictable service worker. |
| **CorsenAI `hermes-connector`** | Demonstrates a local browser/agent bridge with role separation, protocol negotiation, pairing, and profile/session routing.[13] | Adapt loopback, role, and session concepts only after hardening authentication, principal-scoped state, grant checks, credential custody, and process reaping. Do not ship or trust its packaged companion as the house path. |
| **Gemini in Chrome Auto Browse** | Requires opt-in and a reviewed plan followed by **Start Task**; marks the active task tab; exposes **Take over task**, **Give back task**, and **Stop**; supports local authenticated Chrome and a separate remote-browser fallback; and asks for confirmation before sensitive steps.[6] | Borrow the visible turn-taking and hand-back semantics. Keep local and remote/disposable execution identities explicit rather than silently substituting one for the other. |
| **Claude in Chrome** | Uses a side-panel extension to read, click, type, navigate, group tabs, inspect console/network/DOM state, and run background work. Its connector is disabled by default per conversation, its action mode can pause for approval, and its documented permission set explains why `debugger`, `tabs`, `tabGroups`, `webNavigation`, and related powers are requested.[7] | Borrow the separation between conversational presence, per-conversation enablement, site scope, action approval, and visibly grouped agent tabs. Use its permission disclosure as a comparison point, not as a permission shopping list. |
| **Real Browser MCP** | Provides an inspectable MIT-licensed Manifest V3 extension plus local MCP/WebSocket bridge for controlling an already-open authenticated browser. Its source includes origin validation and documents local-only transport, but its manifest requests `debugger`, content-script execution, and `<all_urls>` access.[8] | Study its bridge, reconnection, testing, and security documentation. Do not inherit its broad permission footprint without a capability-by-capability justification and stronger lease semantics. |
| **Chrome MCP Server (`mcp-chrome`)** | Provides an inspectable MIT-licensed extension/native-messaging architecture with broad Chrome APIs, CDP session management, cross-tab operation, and a large tool surface.[9] | Mine architecture and failure-mode lessons, especially native messaging and CDP session handling. Its breadth makes it a useful stress case rather than the default minimum-authority template. |
| **Chrome DevTools MCP** | Google's open-source MCP server exposes DevTools inspection, network/console diagnosis, simulated interaction, and performance tracing to coding agents.[10] | Reuse the established DevTools tool vocabulary where appropriate, while keeping its developer-control role distinct from human-facing consent and tab custody. |
| **Microsoft Edge Copilot Mode** | Demonstrates opt-in browser-native assistance, permissioned multi-tab context, task actions, on/off controls, and visible cues when Copilot is observing or acting.[11] | Treat it as further product evidence that one-browser collaboration should expose observation and action state visibly. |
| **AITOPIA** | Demonstrates a compact side-panel assistant, model selection, page-context controls, and draft-oriented workflows, but no corresponding official open-source implementation was established.[14] | Use only as visible product-UX evidence. Do not copy code, inherit its broad-access posture, or treat Store badges and popularity as provenance. |
| **Sider** | Demonstrates polished page-adjacent AI workflows alongside a closed, unusually broad permission surface, consumption-based monetization, aggressive retention language, and inconsistent first-party content-rights statements.[15] | Use as a documented anti-pattern study. Keep only narrow UX observations; inherit no code, binary, trust, telemetry, credit system, engagement mechanism, or ambient authority. |

The strongest practical conclusion is that a new browser-driving engine is not
the default next step. The first technical spike should test a narrow,
grant-checked `chrome.debugger` transport adapted from inspectable prior art,
behind an authenticated loopback bridge and an extension-owned authority state
machine. It must not import a recorder product, attach-all behavior, a generic
CDP tunnel, or a full Playwright runtime into the service worker merely because
those pieces already exist.

Proprietary ChatGPT, Gemini, Claude, Copilot, AITOPIA, and Sider packages are
behavior and safety references only. Their distributed binaries may be
observable, but code must not be copied from packages whose source license does
not authorize reuse.

Open-source Playwright and Real Browser MCP can be inspected and, where their licenses permit, reused with the required notices and attribution.[5][8]

Chrome MCP Server and Chrome DevTools MCP provide additional inspectable implementations under their published terms.[9][10]

No implementation begins from this document alone. Permission expansion,
loopback transport, persistent-profile control, and any return of page content
remain separate review gates. The present repository continues to ship only its
existing direct-gesture, read-only, network-silent harness.

## Extension responsibilities

The production extension should:

1. Present Dormant, Conversational, Approval-gated, and Delegated control distinctly.
2. Treat opening the side panel as conversational presence, not control authorization.
3. Require a direct user gesture to enter Approval-gated or Delegated control.
4. Authenticate the local controller before accepting an active lease.
5. Bind authorization to tab, origin policy, browser-profile identity, controller identity, and session.
6. Negotiate the smallest capability set needed.
7. Reject commands beyond the granted scope.
8. Expose immediate Stop, Reduce authority, and Revoke controls.
9. Recover safely from Manifest V3 service-worker termination using persisted session state rather than process globals.
10. Emit no browsing telemetry and connect only through the documented local control channel.
11. Make controller loss and ambiguous state visibly fail closed.

## Hermes/controller responsibilities

Hermes should:

1. Prefer disposable automation when no current consent or identity requirement exists.
2. Treat Dormant and Conversational as non-authorizing.
3. Present its identity and requested capabilities before entering Approval-gated or Delegated control.
4. Maintain one authoritative lease per controlled tab unless a future multi-controller policy is explicitly designed.
5. Cancel outstanding operations when control is stopped.
6. Never broaden tab authorization into profile authorization.
7. Record enough local metadata to explain which controller, profile, tab, session, and capability set were used without collecting page content unnecessarily.
8. Own every process it launches and avoid terminating any browser process it cannot positively identify as its own.
9. Report strategy failure instead of silently changing identities.

## Human intervention and turn-taking

Visible collaboration needs an explicit turn-taking rule. A first draft:

- Human input always remains authoritative.
- Selecting **Stop control** revokes the active lease immediately.
- Manual interaction during an agent command pauses or cancels that command where detectable.
- The extension should make control possession visible rather than allowing human and agent input to race silently.
- Authentication secrets, one-time codes, passkeys, and consent dialogs remain human-controlled unless a separately approved secure mechanism handles them.

## Lifecycle safety requirements

A complete implementation must define and test:

- clean launch and attachment;
- clean detach without closing a human-owned browser;
- clean shutdown of an agent-owned browser;
- extension service-worker suspension and restart;
- Hermes restart or crash;
- browser crash;
- stale lease expiry;
- PID reuse and executable mismatch;
- concurrent Hermes sessions;
- another controller attached to the same profile;
- navigation and tab replacement;
- prevention and safe reaping of agent-owned orphan processes.

## Relationship to the current interoperability lab

The current laboratory proves a narrower boundary: direct-gesture `activeTab` activation, fixed script injection, minimal read-only page tools, no host permissions, no network transport, and no persistent controller state.

This document does **not** claim that the existing extension already implements general browser control. Moving from the lab to a controller requires an explicit scope decision because it changes permissions, transport, data flow, UI, threat model, privacy documentation, and browser-store disclosures.

The lab can serve as the inspectable consent nucleus. A production controller may evolve from it only if the expanded role remains plainly documented and independently reviewable.

## Open decisions

1. Should same-origin reload preserve Approval-gated or Delegated authority, or require a fresh gesture every time?
2. What lease duration balances collaboration with stale-intent protection?
3. Should Delegated control return to Approval-gated, Conversational, or Dormant after a normal command sequence?
4. Which command subset can remain within `activeTab` and `scripting`, and which capabilities would require `chrome.debugger` or another explicitly justified permission?
5. Should the dedicated collaborative browser auto-launch after task-level human approval, or always require a browser-side gesture?
6. How should simultaneous human input pause or cancel an in-flight command?
7. What local transport and authentication mechanism best connects the extension to Hermes without remote exposure?
8. Which audit metadata is useful without becoming browsing surveillance?
9. Should the production controller retain this repository and extension identity or graduate into a separately named artifact?

## Initial acceptance criteria

The model is ready to leave draft status when tests demonstrate:

- Dormant and Conversational never grant action authority;
- opening the side panel alone cannot transition into Approval-gated or Delegated control;
- only the intentionally shared tab accepts commands;
- cross-origin navigation follows the declared revocation policy;
- revocation interrupts active work;
- controller and service-worker crashes fail closed;
- a personal browser survives detach untouched;
- an agent-owned browser closes cleanly and leaves no orphan;
- routing falls back to disposable Chromium only when policy allows it;
- no fallback silently changes browser identity;
- every delegated-control surface identifies the agent/controller and offers immediate stop.

## Sources

[1] https://learn.chatgpt.com/docs/chrome-extension — Browser extension | ChatGPT Learn
[2] https://learn.chatgpt.com/docs/browser — Browser | ChatGPT Learn
[3] https://learn.chatgpt.com/docs/webmcp — Site tools | ChatGPT Learn
[4] https://playwright.dev/mcp/configuration/browser-extension — Connecting to Browsers | Playwright
[5] https://github.com/microsoft/playwright/tree/main/packages/extension — Playwright Chrome Extension source and operating model
[6] https://support.google.com/chrome/answer/16821166?hl=en — Ask Gemini in Chrome to complete tasks with auto browse
[7] https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome — Get started with Claude in Chrome
[8] https://github.com/ofershap/real-browser-mcp — real-browser-mcp
[9] https://github.com/hangwin/mcp-chrome — Chrome MCP Server
[10] https://developer.chrome.com/blog/chrome-devtools-mcp — Chrome DevTools MCP for your AI agent
[11] https://blogs.windows.com/msedgedev/2025/07/28/introducing-copilot-mode-in-edge-a-new-way-to-browse-the-web — Introducing Copilot Mode in Edge
[12] https://github.com/ruifigueira/playwright-crx — `playwright-crx` source and Apache-2.0 license
[13] https://github.com/CorsenAI/hermes-connector — Hermes Connector source and MIT license
[14] https://chromewebstore.google.com/detail/aitopia/becfinhbfclcgokjlobojlnldbfillpf — AITOPIA Chrome Web Store listing
[15] [Sider closed-source product audit](research/sider-closed-source-product-audit.md) — evidence, disposition, and primary sources
