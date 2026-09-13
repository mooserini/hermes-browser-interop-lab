# Local/origin reconciliation receipt — 2026-09-13

## Purpose

Prevent browser-custody research, review findings, or local planning from being lost when development moves between local worktrees and GitHub. This receipt records the comparison performed before the authority-reducer spike began.

## Compared state

| Surface | Before reconciliation | After reconciliation |
| --- | --- | --- |
| Local `main` | `2f0a01fb1f8191e098ceb5ae593d7cd4a2889df`; behind by four commits | `03ca9487265eec649a4e5c3d7019132490521172` |
| `origin/main` | `03ca9487265eec649a4e5c3d7019132490521172` | Same |
| Local-only tracked commits on `main` | None | None |
| Stashes | None | None |
| Local-only project artifact | `.hermes/plans/2026-09-13_023827-browser-custody-integration.md` | Preserved byte-for-byte and copied to `docs/plans/2026-09-13-browser-custody-integration.md` on the spike branch |

The update used a fast-forward-only merge. No merge commit or conflict resolution was required.

## Merged work accounted for

1. PR #1: security/privacy review report, present as `JULES_REVIEW.md` through squash commit `076f6e9`.
2. PR #2: semantic-inspection optimization and tests, present through `149e50b`.
3. PR #3: sanitized service-worker error logging, present through `2f0a01f`.
4. PR #4: canonical browser/MCP testing contract in `AGENTS.md`, present through `3589b5a`.
5. PR #5: browser-custody posture, architecture, control-model draft, and Sider research, present through `18e530b`.
6. PR #6: Gemini-derived consensual extension workflow, present through merge commit `03ca948`.

Direct tree comparisons confirmed that the old testing-contract, custody-posture, fix, optimization, Gemini, and merge branches contain no newer canonical tree state that should replace `origin/main`. The Jules topic branch has different ancestry because PR #1 was squash-merged, but its final `JULES_REVIEW.md` content matches `origin/main` exactly.

A Copilot checkpoint ref at `5501b95018bc62c2d7bf67d0f6bec0d55f317e1d` also preserves the original 673-line local custody plan. The plan's SHA-256 before and after the fast-forward was unchanged:

```text
8c2e68297ecffc4db7527ec1c20690969757b570f9aec58cec386c3027c5be61
```

## Conceptual reconciliation

- The Gemini workflow recommends in-page indicators for active targets and actions.
- The custody plan makes extension-controlled side-panel and action-badge state authoritative because page DOM can be spoofed.
- Resolution: in-page cues may be useful and visible, but they remain informational. They never become the trust root or proof of custody.

## Intentionally unresolved findings

These remain documented work, not forgotten work and not claims of completion:

- stale action badge/title after navigation in the root harness;
- `chrome.tabs.TAB_ID_NONE` handling;
- rejection handling if badge/title updates themselves fail;
- deeper accessible-name behavior, including `aria-labelledby`, whitespace-only text, dynamic pages, and shadow boundaries;
- whether page text may ever be returned by the custody prototype;
- `debugger` permission, loopback networking, lease presets, and initial upstream target.

## Verification

After fast-forwarding, `npm run check` passed all six tests in the unchanged root harness. The authority-reducer spike later raised the branch total to 22 passing tests without changing the root manifest, root extension source, permissions, or network posture.
