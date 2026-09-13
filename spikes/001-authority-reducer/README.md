# 001: Authority reducer

> Review evidence: [REVIEW.md](REVIEW.md)

## Question

**Given** one of the four browser-custody authority levels and an event carrying explicit human/controller evidence, **when** a pure reducer evaluates the event, **then** can it permit only deliberate legal upgrades while making downgrades immediate and lifecycle ambiguity fail closed?

## Scope

This spike tests the policy core only. It adds no Chrome permissions, service worker, side panel, debugger transport, network listener, persistence, or Hermes integration.

## Contract under test

- Levels: Dormant, Conversational, Approval-gated, Delegated.
- Opening the panel may enter Conversational only when tied to a direct human gesture.
- Approval-gated and Delegated cannot be entered directly from Dormant.
- Every upgrade requires a direct human gesture.
- Delegated additionally requires an authenticated controller.
- Downgrades do not require permission and take effect immediately.
- Authority-selection events only upgrade; callers use `authority.downgrade` or `authority.stop` to reduce authority.
- Restart, controller loss, lease expiry, unknown events, malformed inputs, unknown levels, and invalid downgrade targets fail to Dormant.
- Reducer results have a stable `{ level, changed, reason }` shape and do not propagate arbitrary state fields.

## Verdict: VALIDATED

### What worked

- A pure reducer can encode all four authority levels without depending on Chrome APIs or mutable process state.
- Dormant enters Conversational only through a direct human panel-open gesture.
- Direct or implicit escalation is rejected with an explicit reason.
- Delegated requires both a current human gesture and authenticated-controller evidence.
- Downgrades apply immediately without requiring upgrade evidence.
- Restart, controller loss, lease expiry, and unknown events collapse active authority to Dormant.

### What didn't

- This spike does not prove that Chrome events, extension UI, storage, or a loopback broker will supply truthful event evidence.
- It does not yet bind authority to a tab instance, origin/navigation epoch, capability set, session, or expiration timestamp; those belong in the grant-validation spike.
- The bounded threat model assumes plain data records. Before promotion, snapshot validated fields into local primitives so getters or proxies cannot change values between validation and return.
- Unknown event reasons currently include the raw event type. Production code should emit a canonical reason code and keep untrusted event text out of receipts and logs.

### Surprises

- Treating unknown events as revocation produces a small denial-of-service surface, but it prevents version skew or malformed event names from preserving control. That is the correct tradeoff at the authority boundary.
- Human intent and controller authentication are separate prerequisites. Combining them into one boolean would make later auditing materially weaker.

### Recommendation for the real build

Promote the reducer contract into the isolated custody package only after the architecture/provenance gate is accepted. Keep it pure, feed it typed/validated events, and make the same reducer output drive both command gating and extension-owned custody indicators. Do not add `debugger`, transport, or persistence as part of that promotion.
