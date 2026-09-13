# Architecture and trust boundary

> **Current contract:** This document describes the shipped one-tab harness.
> The broader [browser custody model](agent-browser-control-model-draft.md) is a
> draft trajectory only and adds no present capability or permission.

## Data flow

```text
person clicks extension action
        │
        ▼
Chrome grants temporary activeTab access
        │
        ▼
service worker injects fixed src/injected-tools.js into MAIN world
        │
        ▼
page listens for devtoolstooldiscovery
        │
        ▼
Chrome DevTools for Agents discovers two read-only tools
        │
        ▼
local agent may invoke a tool and receive a small JSON result
```

There is no server, remote endpoint, account, secret, analytics collector, or persistent state.

## Why an extension

Chrome's third-party developer tools are exposed by page JavaScript. A test extension lets a person temporarily add a known, reviewable tool group to a page they control without modifying the page's source or installing a permanent content script. This makes the experiment removable and preserves a clear user gesture.

## Execution worlds

The service worker uses `chrome.scripting.executeScript()` with `world: "MAIN"` because Chrome DevTools for Agents dispatches `devtoolstooldiscovery` on the page's global `window`. An isolated extension world would not receive that page event.

The injected script is static repository code. It neither evaluates strings nor loads remote code.

## Lifecycle

- First action click: install the listener, show a notice, and set the action badge to `ON`.
- Second action click: remove the listener and notice, and clear the badge.
- Navigation or tab close: Chrome revokes `activeTab`; page state and the listener disappear naturally.
- Service-worker termination: harmless because the worker stores no state. Toggle state lives only in the current page.

## Tool contract

### `describeHermesInteropHarness`

Returns fixed declarations about purpose, activation, scope, and absence of collection/network/mutation capabilities.

### `auditPageSemantics`

Returns only integer counts and a declared document language. It deliberately excludes:

- DOM text and HTML;
- URLs and link targets;
- form values and user input;
- cookies, local storage, and session storage;
- network requests and responses;
- authentication state or credentials.

## Experimental dependency

The `devtoolstooldiscovery` contract belongs to Chrome DevTools for Agents and is experimental. The extension detects nothing and does nothing privileged if no compatible client asks for tools. Contract changes should be isolated to `src/injected-tools.js` and covered by tests before release.
