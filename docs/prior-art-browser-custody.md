# Browser custody prior-art ledger

**Purpose:** Preserve useful concepts without inheriting another product's permissions, code surface, incentives, or claims.
**Rule:** Adopted concepts are re-derived behind this repository's consent and threat model. Code reuse requires exact source, revision, license, original path, local-change notice, and review.

Nothing here implies endorsement, certification, affiliation, or approval by Google, Chrome, Microsoft, Playwright, Nous Research, Corsen AI, AITOPIA, Sider, or an agent provider.

## `ruifigueira/playwright-crx`

- **Pinned revision:** tag `v0.15.0`, commit `aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac`.[3]
- **License:** Apache-2.0 with upstream LICENSE and NOTICE obligations.[4][5]
- **Status:** Code-adaptable only after the architecture gate; no code copied in this gate.

| Disposition | Items |
|---|---|
| Adopt as concepts | `chrome.debugger` transport; explicit `attach(tabId)`/`detach(tabId)`; tab-ID↔target-ID mapping; detach without closing the human tab; default/incognito context distinction.[6] |
| Adapt before use | Reduce to a fixed operation/CDP subset; validate grant immediately before attach and every command; bind target to a navigation-aware grant; retain exact attribution and prominent local-change notices. |
| Reject | Full Playwright runtime in the MV3 worker; recorder/player; raw CDP passthrough; `attachAll`; automatic opener/popup inheritance; browser-wide target harvesting. `attachAll` belongs to `src/server/crx.ts`, while opener auto-attachment appears in the transport.[6][7] |

If nested Playwright code is later vendored, its own notices must be reviewed separately. This gate does not vendor it.

## `CorsenAI/hermes-connector`

- **Pinned revision:** `bfd9bc29718c4647a1438962aae28ed4d1220df6`; this is a post-release documentation commit, two documentation commits after the annotated `v0.2.4` tag's peeled commit `2c0cb7e40705638726e38db0385fa52237ce68f5`.[8][19]
- **License:** MIT, `Copyright (c) 2026 Agent Bridge contributors`.[9]
- **Status:** Concepts may be reimplemented or code may be adapted only with exact attribution after the gate. The Store package and companion are not the house path.

| Disposition | Items |
|---|---|
| Adopt as concepts | Loopback-only routing; exact version negotiation; browser/agent roles; role-bound challenge/response; exact `profileId + sessionId` routing; principal-scoped state.[10][11] Launch locking.[16] |
| Adapt before use | Ephemeral human-mediated pairing; origin pinning; smaller frame/result limits; per-session lifecycle reaping; explicit capability allowlist; navigation-aware tab identity. |
| Reject | Durable `credentials.json` and pairing material in `storage.local`.[10][11] Detached/shared broker behavior without an owning-session reaper.[16] Broad command vocabulary and `<all_urls>`.[10][12] Fallback to the first bound tab during binding normalization/removal, and binding transfer.[17] Installation into every existing Hermes profile.[18] Ordinary signed-in Chrome as the default product boundary.[14] |

The Store listing describes the product as local, unofficial, and not affiliated with or endorsed by Nous Research or Google.[14] This repository preserves that distinction.

## AITOPIA

- **Store ID:** `becfinhbfclcgokjlobojlnldbfillpf`.[13]
- **Source/license status:** No corresponding extension source or reusable license has been established.
- **Disposition:** Behavioral reference only; no code, CRX, binary, or trust inheritance.

Useful product observations are limited to what the listing visibly supports: persistent sidebar proximity, explicit model choices, task-shaped reading/writing actions, file attachment, and search-adjacent responses.[13] These are interface observations, not evidence for custody, privacy, provenance, or safety. “Featured,” rating, and user-count signals are not security review.

Reject ambient “every page/every input” framing, marketplace pressure, unrelated media tooling, cloud routing without exact disclosure, and installation-as-consent.

## Sider

- **Store ID:** `difoiogjjojoaoomphldepapgpbgkhkb`.[15]
- **Source/license status:** Closed-source shipped extension; no reusable source license established.
- **Disposition:** Behavioral and anti-pattern research only; no code, CRX, binary, installation, execution, or trust inheritance.

The repository's dated audit at `docs/research/sider-closed-source-product-audit.md` is the authority for its inspected CRX hash and manifest observations. The current listing supports only current listing claims; a matching version number does not prove byte identity.[15]

Adopt only visible product lessons: compact side-panel adjacency, named task verbs, visible model/provider selection, and source-linked results. Reject `<all_urls>`/all-frame presence, cookie and unlimited-storage reach, ubiquitous injection, ambiguous content use, hidden marginal cost, expiring credits, rewards, referrals, affiliate pressure, and engagement incentives.

## Promotion checklist for any adapted block

Before adapted code lands:

1. Name upstream repository, exact commit/tag, original file/path, license, and local destination.
2. Preserve required copyright and NOTICE text.
3. Mark modified files prominently.
4. Demonstrate that the local block is smaller than the source surface and cannot expose rejected behaviors.
5. Add tests for every rejected behavior that could otherwise reappear.
6. Re-run license and provenance review against the actual diff.
7. State plainly that attribution is not endorsement.

## Sources

[3] https://github.com/ruifigueira/playwright-crx/tree/aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac — playwright-crx pinned source
[4] https://raw.githubusercontent.com/ruifigueira/playwright-crx/aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac/LICENSE — playwright-crx Apache-2.0 license
[5] https://raw.githubusercontent.com/ruifigueira/playwright-crx/aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac/NOTICE — playwright-crx NOTICE
[6] https://raw.githubusercontent.com/ruifigueira/playwright-crx/aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac/src/server/transport/crxTransport.ts — playwright-crx transport source
[7] https://raw.githubusercontent.com/ruifigueira/playwright-crx/aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac/src/server/crx.ts — playwright-crx application source
[8] https://github.com/CorsenAI/hermes-connector/commit/bfd9bc29718c4647a1438962aae28ed4d1220df6 — Hermes Connector pinned commit
[9] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/LICENSE — Hermes Connector MIT license
[10] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/extension/src/protocol.js — Hermes Connector protocol source
[11] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/hermes-plugin/broker.py — Hermes Connector broker source
[12] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/extension/manifest.json — Hermes Connector manifest
[13] https://chromewebstore.google.com/detail/aitopia/becfinhbfclcgokjlobojlnldbfillpf — AITOPIA Chrome Web Store listing
[14] https://chromewebstore.google.com/detail/hermes-connector-%E2%80%94-by-cor/cdhaldcgafmkcnpanlmmpaebabnlledm — Hermes Connector Chrome Web Store listing
[15] https://chromewebstore.google.com/detail/sider-chat-with-all-ai-gp/difoiogjjojoaoomphldepapgpbgkhkb?hl=en-US — Sider Chrome Web Store listing
[16] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/hermes-plugin/bridge_client.py — Hermes Connector bridge client
[17] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/extension/src/bindings.js — Hermes Connector bindings
[18] https://raw.githubusercontent.com/CorsenAI/hermes-connector/bfd9bc29718c4647a1438962aae28ed4d1220df6/hermes-plugin/after-install.md — Hermes Connector post-install guide
[19] https://github.com/CorsenAI/hermes-connector/releases/tag/v0.2.4 — Hermes Connector 0.2.4 release
