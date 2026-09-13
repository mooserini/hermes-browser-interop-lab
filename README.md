# Hermes Browser Interop Lab

A deliberately narrow Manifest V3 extension for testing whether Hermes can use Chrome DevTools for Agents' experimental third-party developer tools through an explicit, inspectable browser action.

This is a lab, not a covert automation layer. The person operating Chrome decides when it runs by clicking the extension action on a normal web page. The injected tool group disappears on navigation or when the action is clicked again.

## Intent

The project exists to explore a legitimate upstream path for Hermes browser interoperability while making the security boundary obvious to Chrome, Chromium, Hermes, and independent reviewers.

It is designed to be:

- **consent-gated** — activation requires a direct extension-action gesture;
- **page-scoped** — access applies only to the active tab and ends on navigation;
- **read-only** — the exposed tools return fixed harness information or aggregate semantic counts;
- **content-minimizing** — tools do not return page text, field values, URLs, cookies, storage, or credentials;
- **network-silent** — the extension contains no `fetch`, analytics, telemetry, or remote code;
- **inspectable** — there is no build step or minification; the files Chrome runs are the files in this repository.

## What it demonstrates

On activation, the extension injects a listener for Chrome DevTools for Agents' experimental `devtoolstooldiscovery` event into the current page. It exposes two tools:

1. `describeHermesInteropHarness` — states the harness's purpose and limits.
2. `auditPageSemantics` — returns aggregate HTML and accessibility counts without returning content.

Chrome's third-party developer-tool mechanism is experimental and currently requires Chrome DevTools for Agents 0.25.0 or later plus its experimental third-party-tools flag.

## Permission boundary

| Manifest capability | Why it exists | What it does not grant |
| --- | --- | --- |
| `activeTab` | Temporarily authorizes the page only after the person clicks the extension action. | No persistent access to browsing history or every site. |
| `scripting` | Injects the fixed, repository-visible test harness into that explicitly activated page. | No remote code and no automatic background injection. |

The manifest declares **no host permissions**, `tabs`, storage, cookies, web request, downloads, identity, native messaging, debugger, or clipboard permissions.

## Local verification

Requirements:

- Chrome Dev or newer with extension Developer mode enabled
- Chrome DevTools for Agents 0.25.0+
- Node.js 22+

Run static and contract tests:

```sh
npm run check
```

Load the extension manually:

1. Open `chrome://extensions` in Chrome Dev.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this repository directory.
4. Open `demo/index.html` through a local HTTP server (or use any ordinary page you control).
5. Click the extension action. An `ON` badge and an in-page notice confirm activation.
6. Ask Chrome DevTools for Agents to list third-party tools.
7. Click the extension action again to disable the harness.

A local server can be started without adding a dependency:

```sh
python3 -m http.server 8765 --directory demo
```

Then open <http://127.0.0.1:8765/>.

## Security posture

Please read [SECURITY.md](SECURITY.md), [PRIVACY.md](PRIVACY.md), [docs/architecture.md](docs/architecture.md), and the [primary references](docs/references.md). Test against the included local fixture or pages you own. Do not use the project to bypass authentication, extract private content, defeat browser security boundaries, or conceal automation.

## Relationship to Hermes and Chrome

This is an independent interoperability experiment. It is not currently part of Hermes Agent, Google Chrome, Chromium, or Nous Research, and it is not endorsed by those projects. A successful experiment may later be proposed upstream through their ordinary review processes.

## Research direction — no implementation claim

The current extension remains the narrow, read-only harness described above. A
separate research track is evaluating whether a future browser-control surface
can preserve the same explicit-custody principle while supporting graduated,
revocable authority:

- **Dormant** — installed or reachable, but not invited;
- **Conversational** — the agent is present beside the page, with no page access;
- **Approval-gated** — each bounded action requires current approval;
- **Delegated control** — one identified controller receives a temporary,
  capability-limited lease over an explicitly selected tab.

Read the [consent-gated browser-control model](docs/agent-browser-control-model-draft.md)
for the proposed architecture, routing policy, open decisions, and acceptance
criteria. This is a design proposal, not functionality shipped by this repository.

The research also studies proprietary products only as observable product or
anti-pattern evidence. Their closed code is not a dependency or source. See the
[Sider product and monetization audit](docs/research/sider-closed-source-product-audit.md)
for the evidentiary standard and one documented example.

## Authorship

Authored by **Ara Voss**. Product direction, constraints, and testing partnership by **Thomas Kenny (`mooserini`)**.

## License

Apache License 2.0. See [LICENSE](LICENSE).
