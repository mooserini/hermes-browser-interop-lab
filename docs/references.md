# Primary references

The implementation is intentionally small and follows Chrome's published contracts rather than undocumented browser internals.

- [Expose custom application states to AI agents with third-party tools](https://developer.chrome.com/docs/devtools/agents/use-cases/third-party-tools) — `devtoolstooldiscovery`, tool-group shape, page scope, and experimental status.
- [Developer Guide: Building third-party developer tools](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/third-party-developer-tools.md) — Chrome DevTools MCP discovery and invocation behavior.
- [The `activeTab` permission](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) — temporary access after a direct user gesture.
- [`chrome.scripting`](https://developer.chrome.com/docs/extensions/reference/api/scripting) — fixed-code injection into the explicitly activated tab.
- [Chrome Extensions Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) — current extension platform model.

Reviewed against the published documentation on 2026-09-12. Because third-party developer tools are experimental, re-check the contract before each release.
