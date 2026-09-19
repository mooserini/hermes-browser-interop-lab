# Accepted Decision: Dual-Channel Agentic Browser Workbench

**Status:** Accepted

**Decision date:** 2026-09-18

**Author:** Ara Voss

**Product direction, constraints, and testing partnership:** Human maintainer

## Decision authority

This record is the current project authority for choosing browser lanes and sequencing browser-agent integration work. It supersedes conflicting roadmap guidance in the draft control model and makes the [2026-09-13 browser custody integration plan](../plans/2026-09-13-browser-custody-integration.md) contingency architecture rather than the default implementation sequence.

The repository's current code still defines what exists. This decision defines what to build and what not to require before useful browser work can be tested.

## Context

The project has two distinct needs:

1. test the same Chrome behavior ordinary users receive; and
2. explore forward-looking WebMCP, third-party developer tools, and emerging browser-agent capabilities.

One browser channel should not pretend to answer both questions. Google Chrome Stable and Google Chrome Dev can run simultaneously, and Chrome DevTools MCP can address them as explicit channels through Chrome's supported secure auto-connect path.

The existing Resonant Sidecar is a useful conversational and observability surface, but its current zero-tool policy suppresses the capability this work intends to test. The project does not need a custom broker, cryptographic lease system, or extension-owned CDP transport merely to discover whether the supported Chrome path works.

## Decision

### 1. Maintain two explicit browser lanes

- **Chrome Stable — reality lane.** Use Stable to test mainstream extension behavior, side-panel and service-worker behavior, native messaging, authenticated human workflows, and the experience common Chrome users receive.
- **Chrome Dev — future lane.** Use Dev to test experimental WebMCP, third-party developer tools, and browser capabilities approaching Stable.

Both lanes may run simultaneously. Select them by named channel (`stable` or `dev`), not by remembered port numbers or an implicit fallback chain.

Failure in one lane must be reported. It must not silently route work into the other browser identity.

### 2. Use Chrome DevTools MCP as the primary integration path

The first implementation path is Google's supported Chrome DevTools MCP connection using secure auto-connect and the intended browser channel.

Its responsibilities include supported browser and extension operations, page interaction, console and network inspection, service-worker and side-panel inspection, extension lifecycle operations, and experimental WebMCP or third-party-tool discovery where the selected channel supports them.

Chrome's remote-debugging setting, connection approval, automation indicator, and disconnect control are valid consent surfaces for development and testing. The project will not reject them solely because they are browser-provided rather than implemented by the Resonant Sidecar.

### 3. Keep raw CDP as a complementary escape hatch

Hermes `browser_cdp` remains available for low-level protocol experiments and capabilities absent from the supported MCP surface.

Secure auto-connect and classic CDP discovery are different transports. A secure listener that returns HTTP 404 for `/json/version` is not thereby a broken Chrome connection, and it is not automatically compatible with Hermes's classic raw-CDP discovery path.

When classic raw CDP is needed, use a separately and visibly launched browser endpoint or improve the upstream adapter. Raw CDP is not a prerequisite for the first Sidecar tool slice.

### 4. Make the Resonant Sidecar visible and useful before making it universal

The Sidecar remains the local agent conversation and tool-activity surface. The first tool-capable slice is intentionally narrow:

- Hermes is the first and only tool-capable agent adapter.
- The Sidecar shows the selected lane, tool start, broad operation, completion or failure, and bounded result.
- Stop remains available during active work.
- Grok and Codex parity is deferred until the Hermes path works end to end.
- The first slice adds no extension permission.

The current Sidecar permissions—`nativeMessaging`, `sidePanel`, and `storage`—are sufficient for proving an external DevTools MCP path. Do not add `debugger`, `activeTab`, `scripting`, `tabs`, host permissions, or content scripts merely to make the architecture look complete.

### 5. Shape safeguards around actual capabilities

A visible, operator-targeted, read-only development action may run through Chrome's approved connection without a custom per-action lease protocol.

Consequential operations remain separately gated, including publication, external messages, purchases, account or permission changes, uploads, downloads, destructive actions, and irreversible state changes.

This is neither blanket browser authority nor a ban on future capability. It is a refusal to make speculative governance machinery the entrance fee for harmless, observable experimentation.

### 6. Require live evidence

Static tests prove protocol and UI logic. They do not prove a browser integration.

A browser claim requires a live receipt identifying, without collecting unrelated personal browser data:

- intended lane and browser-reported channel/version;
- connection result;
- extension source path, commit, and runtime digest where applicable;
- enabled feature categories;
- local fixture origin;
- each matrix row as pass, fail, not run, or unverified.

## First acceptance slice

The first slice is complete only when all of the following are observed:

1. Stable and Dev are available as separate, named Chrome DevTools MCP lanes.
2. The exact Resonant Sidecar worktree under test is identified.
3. The Sidecar opens and connects to a Hermes session.
4. Hermes performs one harmless browser inspection against an operator-selected local fixture.
5. The Sidecar visibly renders tool start, completion, bounded result, and stopped or failed state.
6. The same Sidecar commit is exercised in Stable and Dev.
7. Dev discovers and invokes one read-only WebMCP or third-party fixture tool.
8. Navigation, disablement, or fixture teardown removes the page-provided tool as expected.
9. A tracked receipt records every matrix row without turning partial success into “browser works.”

## Explicit non-goals for the first slice

Do not implement these unless a live test demonstrates the need and a later reviewed decision approves the expansion:

- a new loopback HTTP or WebSocket broker;
- a custom `chrome.debugger` transport;
- a per-tab cryptographic lease system;
- a universal browser command abstraction;
- automatic disposable-Playwright fallback routing;
- Grok or Codex tool parity;
- broad extension permissions or persistent page access;
- background or unattended browser launch;
- arbitrary shell or filesystem execution from the Sidecar;
- a general approval framework for every possible future action;
- raw-CDP support over Chrome's secure auto-connect bridge;
- a redesign of the existing Sidecar review/refresh subsystem.

These are deferrals, not permanent prohibitions. Evidence may justify them later. Architectural appetite does not.

## Relationship to existing documents

- The [consent-gated browser-control model](../agent-browser-control-model-draft.md) remains a future product-model draft. Its custom custody, lease, and transport concepts are not prerequisites for the accepted development slice.
- The [browser custody integration plan](../plans/2026-09-13-browser-custody-integration.md) is preserved as contingency architecture for capabilities that the official path cannot provide.
- The current interoperability harness remains a narrow, direct-gesture, read-only test fixture. This decision does not claim that the harness or Sidecar already implements the accepted workbench.
- Implementation must still occur in isolated branches or worktrees and receive ordinary diff, test, and publication review.

## Reconsideration triggers

Revisit this decision only when evidence establishes one of these conditions:

- Chrome DevTools MCP cannot expose a required supported operation;
- Hermes ACP cannot carry the needed configured tool or lifecycle event;
- the Sidecar cannot display or interrupt the observed lifecycle without a protocol change;
- the intended product behavior requires extension-owned runtime tab custody;
- raw protocol access is needed for a concrete missing capability;
- Chrome changes or removes the relied-upon connection surface.

When reconsidering, record the exact failed behavior and choose the smallest missing layer. Do not restart the whole architecture from generalized anxiety.

## Consequences

### Positive

- Stable answers “does this work for ordinary users now?” while Dev answers “what can we exercise next?”
- Official browser tooling is tested before custom transport is built.
- Useful read-only work is no longer blocked by a speculative universal safety system.
- The Sidecar gains observable tool activity without an immediate permission expansion.
- Future custom custody work must be justified by a demonstrated gap.

### Tradeoffs

- Stable and Dev may legitimately behave differently.
- Chrome's supported connection model remains an upstream dependency.
- Raw CDP and secure auto-connect remain separate operational paths.
- The first slice deliberately leaves Grok and Codex without browser-tool parity.
- Broader product-level custody questions remain open until the narrow path produces evidence.

## Primary references

- [Build Chrome extensions with coding agents](https://developer.chrome.com/docs/extensions/ai/build-with-ai)
- [Chrome DevTools for coding agents](https://developer.chrome.com/docs/devtools/agents)
- [Chrome DevTools MCP configuration](https://developer.chrome.com/docs/devtools/agents/get-started/configuration)
- [Auto-connect to a running Chrome instance](https://developer.chrome.com/docs/devtools/agents/use-cases/auto-connect)
- [Chrome DevTools MCP source](https://github.com/ChromeDevTools/chrome-devtools-mcp)
