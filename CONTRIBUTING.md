# Contributing

Contributions are welcome when they preserve the project's narrow test purpose and reviewability.

## Before proposing code

1. Open an issue describing the interoperability question being tested.
2. State the smallest permission and data surface required.
3. Explain how a person activates, observes, and revokes the behavior.
4. Include tests and update the security, privacy, and store-readiness documents when relevant.

## Non-negotiable review rules

- Manifest V3 only.
- No remote code, obfuscation, or minified source in review.
- No broad host permissions when `activeTab` can satisfy the experiment.
- No credential, cookie, history, authentication, or private-content access.
- No network or telemetry addition without an explicit design and privacy review.
- No mutation-capable agent tool without a separate consent and safety design.
- Every permission must have a specific, user-facing justification.

Run before submitting:

```sh
npm run check
```
