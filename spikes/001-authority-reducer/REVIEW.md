# Authority reducer review trail

This receipt preserves the evidence behind the `VALIDATED` verdict in [README.md](README.md). It is a review history, not an institutional certification.

## Scope reviewed

- `authority.js`
- `authority.test.js`
- `README.md`

The spike is pure policy logic. It adds no Chrome API use, permissions, persistence, network transport, browser attachment, or Hermes-runtime modification.

## Test-first implementation

Each new policy behavior was introduced through a failing test before its minimal implementation. The first missing-module test failed as expected, followed by red/green slices for:

- human-gesture entry into Conversational;
- rejection without a human gesture;
- Approval-gated selection;
- authenticated Delegated selection;
- fail-closed lifecycle and unknown events;
- immediate downgrade;
- rejection of direct and implicit upgrades;
- malformed inputs and unknown levels;
- malformed downgrade targets;
- stable reducer result shape;
- Stop and remaining transition paths;
- coercible non-string downgrade targets;
- empty event types.

## Independent review rounds

### Round 1 — pass with hardening suggestions

No security concerns or logic errors were reported for well-formed records. The reviewer recommended failing closed on null/malformed inputs and unknown authority levels, rejecting malformed downgrade targets, adding transition coverage, and returning a stable result shape. Those recommendations were implemented and tested rather than deferred.

### Round 2 — failed

The reviewer found a real JavaScript property-key coercion flaw. A downgrade target such as `['conversational']`, a boxed string, or an object with a matching `toString()` could pass rank lookup and then be returned as a non-enum `level`. That contradicted the fail-closed contract.

The flaw was reproduced in a failing regression test. The fix requires both:

```js
typeof event.targetLevel === 'string'
VALID_LEVELS.has(event.targetLevel)
```

before rank comparison. Array, boxed-string, and coercible-object cases now revoke to Dormant as invalid downgrades.

### Round 3 — pass

The targeted final review reported:

- no security concerns;
- no logic errors;
- the coercion fail-open is closed for ordinary and data-shaped malformed inputs;
- every such path returns one of the four canonical string authority levels;
- the bounded `VALIDATED` verdict holds.

## Promotion notes

The final review retained two non-blocking notes for production promotion:

1. Snapshot validated primitive fields before using them again so hostile getters or proxies cannot change a value between validation and return. Such objects are outside this spike's plain-data-record threat model but should not cross the production protocol boundary unsanitized.
2. Replace raw event-type interpolation in reasons with canonical codes before reasons enter durable receipts or logs.

## Final verification

```text
npm run check
22 tests passed
0 tests failed
```

The static scan found no hardcoded secret assignments or dangerous execution/deserialization primitives. No commit or publication was performed until Thomas Kenny explicitly requested durable preservation.
