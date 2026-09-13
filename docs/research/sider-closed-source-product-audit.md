# Sider closed-source product and monetization audit

**Target:** `Sider: Chat with all AI: GPT-5, Claude, DeepSeek, Gemini, Grok`

**Chrome Web Store ID:** `difoiogjjojoaoomphldepapgpbgkhkb`

**Publisher:** Vidline Inc.

**Audit date:** 2026-09-13 EDT

**Disposition:** product/anti-pattern research only; no code reuse, installation, execution, or trust inheritance.

## Scope and evidentiary standard

This note asks whether Sider offers useful product lessons and whether its commercial design creates custody, privacy, or incentive problems relevant to the Hermes browser-control model.

It does **not** claim fraud, malicious code, fabricated ratings, or intentional deception. Those conclusions require evidence this review does not possess. It distinguishes:

1. **Verified facts** from Sider's shipped manifest, store listing, and first-party policies/help pages.
2. **Material inconsistencies** among first-party statements.
3. **Reasonable design inferences** from those verified facts.
4. **Unproved allegations**, which are excluded.

## Artifact receipt

The publicly distributed CRX was downloaded from Google's extension update service for metadata inspection only. It was never installed or executed.

- Store version at inspection: `5.32.8`
- CRX SHA-256: `215b48e5c666108f0294502519cc16a890b72e05897daf0c5c62d705015f59bb`
- Manifest version: `3`
- Inspection output was retained only as a temporary local audit artifact and is
  not included in this repository.

## Verified findings

### 1. The extension possesses an unusually broad browser surface

The shipped manifest declares:

- required permissions: `storage`, `cookies`, `contextMenus`, `scripting`, `userScripts`, `activeTab`, `unlimitedStorage`, `tabs`, `sidePanel`, `offscreen`, `alarms`, and `declarativeNetRequest`;
- optional permissions: `tabCapture` and `tabGroups`;
- required host access: `<all_urls>` plus `https://*.openai.com/`;
- `content-all.js` at `document_end` in **all frames** on `<all_urls>`, including `about:blank` frames;
- `all-frames.js` at `document_start` in **all frames** on `<all_urls>`, including `about:blank` frames;
- extra main-world scripts on YouTube, Netflix, Google Docs, and selected sites.

That does not establish misuse. It does establish that the extension is structurally capable of observing and modifying an enormous portion of a person's browsing environment. For a closed-source product, the user must trust both the publisher and every future auto-update across that entire surface.

The Chrome Web Store listing discloses handling of personally identifiable information and website content and says the publisher declares that data is not sold outside approved use cases, not used for unrelated purposes, and not used for creditworthiness or lending. Chrome's “Featured,” “good record,” and “recommended practices” badges are distribution-policy signals, not source transparency or a security proof.

### 2. Marketing minimizes the sensitivity of the requested position

The store presentation sells convenience: “on any tab,” “in every input box,” webpage/PDF/audio/video analysis, multi-tab chat, email writing, search injection, saved prompts, and a broad “Swiss Army knife” metaphor. The promotional screenshots show polished inputs and outputs but no persistent display of:

- which origin or tab is authorized;
- what page content is being captured;
- which model/provider receives it;
- whether authority is read-only or action-capable;
- an expiring grant, pause control, or revocation boundary.

The product may expose some controls elsewhere; the claim here is narrower: its public product story normalizes ubiquitous access while omitting custody as a first-class concept.

### 3. The business model layers several conversion mechanisms over that browser surface

Sider's first-party materials document all of the following:

- subscriptions with metered monthly credits;
- monthly credits that do not carry over;
- one-time nonrefundable Booster Packs;
- automatic renewal with **no renewal reminder email**;
- monthly subscription payments that are final and nonrefundable once processed;
- yearly refunds limited to seven days and usage thresholds;
- legacy-plan migration where old credits do not carry over and the old plan cannot be restored;
- a Rewards Center that grants credits for “exploring Sider's features”;
- referral credits;
- an affiliate program paying up to `$45` per referred subscription with a 60-day cookie window;
- ads cookies used to measure and refine external acquisition campaigns;
- affiliate cookies used to attribute sign-ups and purchases.

These devices are legal and common individually. Together they create a strong incentive to maximize feature exposure, recurring engagement, credit consumption, upgrading, and referrals. That incentive is badly aligned with a custody-first browser agent, which should minimize data access, tool surface, prompts, and background presence.

### 4. The credit system obscures marginal cost at the moment of action

Current plans deduct a unified credit pool based on actual usage. The legacy schedule demonstrates how variable the underlying metering can be: model choice, file length, token use, media duration, thinking mode, search, and feature add-ons can each change the charge. Some compound actions deduct both the answering model's credits and the feature's credits.

A user can inspect a post-hoc credits log, but the public operational model is not a simple “one action, one stated cost” contract. For our design, resource usage must never become a slot-machine-shaped substitute for clear limits.

### 5. Sider's current legal documents materially contradict each other

Sider's Terms of Use (last updated 2025-05-08) state:

- the user retains ownership and full rights to generated content; and
- Sider does not claim ownership based solely on user inputs.

Sider's Privacy Policy (last updated 2025-03-05) states instead:

- the user, Sider, and potentially third-party model providers may **jointly hold copyright**;
- Sider reserves rights to use generated content for internal research, product improvement, and demonstration;
- no joint owner may license or transfer that copyright without prior written consent from all other joint owners.

Those statements create materially different ownership and commercialization positions. This audit cannot determine which clause a court would enforce. It can conclude that a reasonable user cannot derive one coherent content-rights contract from the two current documents.

### 6. The privacy policy contains disproportionate retention terms

The policy says:

- account-related information is retained for **99 years after account closure**;
- communication information is retained for **99 years after the last communication**;
- usage/analytics information is retained for three months and then anonymized or deleted;
- data may be shared with service providers for operation, analytics, and research;
- Sider reserves use of generated content for internal research, product improvement, and demonstrations.

Ninety-nine years is functionally generational retention, not ordinary account wind-down. Its presence under a section labeled GDPR compliance is particularly difficult to reconcile with a custody/minimization posture, regardless of whether the company can articulate a legal basis.

### 7. First-party popularity claims use inconsistent denominators

At inspection, the Chrome Web Store reported `5,000,000` users and `114.3K` ratings. The store description claimed more than six million weekly active users across Chrome and Edge. Sider's affiliate page claimed more than ten million weekly active users.

These may refer to different platforms, dates, or measurement methods. The pages do not give enough denominator/date detail to reconcile them. Treat popularity claims as marketing, not architectural evidence.

### 8. Public GitHub activity does not make this extension open source

The `Sider-ai` GitHub organization contains public repositories, including forks and unrelated projects. The current public repository inventory did not identify a source repository corresponding to the shipped Chrome extension. No open-source license for the extension itself was established.

## Judgment

The initial concern is directionally justified, with one wording correction:

- **Proved:** Sider converted a useful browser-side assistant pattern into a closed, highly privileged, telemetry- and conversion-rich commercial platform. Its first-party documents expose aggressive retention, recurring-credit economics, affiliate acquisition, no renewal reminders, narrow refunds, and conflicting content-ownership claims.
- **Not proved:** fraud, malicious data exfiltration, review manipulation, deliberate misrepresentation, or unlawful conduct.

The clean description is **commercial incentive misalignment plus material disclosure inconsistency**, not a criminal accusation.

## What to learn from it

### Adapt only as visible product observations

- Keep the assistant adjacent to the source.
- Use explicit, task-shaped actions such as “Summarize this page.”
- Show exact attached files/tabs and source-linked timestamps or passages.
- Preserve a compact side panel and recognizable input/output flow.
- Make model/provider selection visible.

### Invert its design pressures

- No `<all_urls>` host access in the baseline manifest.
- No all-frame always-on scripts.
- No cookie permission.
- No `unlimitedStorage` without a narrowly demonstrated need.
- No feature-reward loops, consumable credits, streaks, referrals, affiliate prompts, or engagement nudges.
- No authority gained from installation, side-panel presence, feature discovery, or prior use.
- No content upload without a named source preview, provider destination, data-use statement, and direct human action.
- No ambiguous “free” claim where meaningful use is metered.
- No hidden marginal cost; show resource impact before execution where cost exists.
- No retention by default; session data dies with the session unless the operator explicitly saves an artifact.
- One coherent content-rights contract; generated artifacts remain the operator's, subject only to upstream model terms disclosed before use.

## Sources

Primary:

- [Chrome Web Store listing](https://chromewebstore.google.com/detail/sider-chat-with-all-ai-gp/difoiogjjojoaoomphldepapgpbgkhkb?hl=en-US)
- [Sider Privacy Policy](https://sider.ai/policies/privacy.html)
- [Sider Terms of Use](https://sider.ai/policies/terms)
- [Sider Payment Issues / billing and refund rules](https://sider.ai/help-center/faqs/sider-payment-issue)
- [Sider credit calculation rules](https://sider.ai/help-center/credits/New-Credits-Calculation-Rules)
- [Sider Rewards Center release note](https://sider.ai/whats-new/browser-extension/Sider-v5_2_0)
- [Sider affiliate program](https://sider.ai/affiliate)
- [Sider public GitHub organization inventory](https://api.github.com/orgs/Sider-ai/repos?per_page=100)

Secondary corroboration only:

- [Chrome-Stats extension metadata](https://chrome-stats.com/d/difoiogjjojoaoomphldepapgpbgkhkb)

The direct CRX manifest—not Chrome-Stats—was used as the authority for permission and content-script claims.
