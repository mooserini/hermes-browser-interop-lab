# Third-party notices and provenance register

This repository is licensed under Apache-2.0. At this architecture-gate revision, **no source code from the prospective dependencies below has been copied, adapted, vendored, bundled, installed, or executed by the custody prototype**. This file records the obligations that must be satisfied before any later adapted block lands.

References to products or projects describe provenance or observed behavior. They do not imply affiliation, endorsement, certification, or approval.

## Prospective adaptable source: Playwright CRX

- Project: `ruifigueira/playwright-crx`
- Pin: `v0.15.0` / `aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac`.[3]
- Candidate source paths: `src/server/transport/crxTransport.ts` and, if needed, narrowly identified mapping logic from `src/server/crx.ts`.
- License: Apache License 2.0.[4]
- Upstream NOTICE:[5]

```text
Playwright CRX
Copyright (c) Rui Figueira

This software contains code derived from the Playwright project (https://github.com/microsoft/playwright),
available under the Apache 2.0 license (https://github.com/microsoft/playwright/blob/master/LICENSE).
```

Relevant upstream copyright notices from the upstream LICENSE appendix (the
candidate transport file separately carries `Copyright (c) Rui Figueira.`):

```text
Portions Copyright (c) Rui Figueira.
Portions Copyright (c) Microsoft Corporation.
Portions Copyright 2017 Google Inc.
```

Before distribution of an adapted block, recipients must receive the Apache-2.0 license; pertinent notices must be retained; modified files must carry prominent change notices; and names/trademarks may be used only for reasonable origin description. If nested Playwright source is later vendored, its own NOTICE and third-party files require a fresh inventory. None is vendored now.

## Prospective adaptable source: Hermes Connector / Agent Bridge

- Project: `CorsenAI/hermes-connector`
- Pin: `bfd9bc29718c4647a1438962aae28ed4d1220df6`.[8]
- Note: the pin is two documentation commits after the annotated `v0.2.4` tag's
  peeled commit `2c0cb7e40705638726e38db0385fa52237ce68f5`.[19]
- Candidate extension paths: `extension/src/protocol.js`,
  `extension/src/bindings.js`, and `extension/manifest.json`.[10][12][17]
- Candidate companion paths: `hermes-plugin/broker.py`,
  `hermes-plugin/bridge_client.py`, and `hermes-plugin/after-install.md`.[11][16][18]
- License: MIT.[9]
- Copyright: `Copyright (c) 2026 Agent Bridge contributors`.

Required MIT notice if substantial source is later copied or adapted:

```text
MIT License

Copyright (c) 2026 Agent Bridge contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The Corsen Chrome Web Store package and companion are not dependencies or distribution inputs. The listing describes the extension as unofficial and not affiliated with or endorsed by Nous Research or Google.[14]

## Behavioral reference only: AITOPIA

- Store ID: `becfinhbfclcgokjlobojlnldbfillpf`.[13]
- No corresponding extension source or open-source license has been established.
- No AITOPIA code, CRX, binary, asset, copy, or trademark is included.
- Store presentation may be cited only as product observation; Store badges, rating, or user count do not establish source provenance or security.

## Behavioral and audit reference only: Sider

- Store ID: `difoiogjjojoaoomphldepapgpbgkhkb`.[15]
- No corresponding reusable extension source or open-source license has been established.
- No Sider code, CRX, binary, or asset is included.
- The dated manifest/CRX evidence belongs to `docs/research/sider-closed-source-product-audit.md`; its temporary inspection artifact is intentionally absent from the repository.

## Required local record when adaptation begins

Every adapted block must add, in the same change:

- upstream project and URL;
- exact revision and original path;
- license and required notice text;
- local destination and a prominent modification notice;
- concise description of retained and rejected behavior;
- verification that no unrelated upstream runtime or packaged binary entered the repository.

## Sources

[3] https://github.com/ruifigueira/playwright-crx/tree/aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac — playwright-crx pinned source
[4] https://raw.githubusercontent.com/ruifigueira/playwright-crx/aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac/LICENSE — playwright-crx Apache-2.0 license
[5] https://raw.githubusercontent.com/ruifigueira/playwright-crx/aafff2cf3d9bf96cb55ed605e2b2a0c44711e6ac/NOTICE — playwright-crx NOTICE
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
