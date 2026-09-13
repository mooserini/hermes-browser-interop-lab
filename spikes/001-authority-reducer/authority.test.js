import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AuthorityLevel,
  reduceAuthority,
} from './authority.js';

test('a direct human panel-open gesture enters Conversational from Dormant', () => {
  const result = reduceAuthority(
    { level: AuthorityLevel.DORMANT },
    { type: 'panel.opened', humanGesture: true },
  );

  assert.deepEqual(result, {
    level: AuthorityLevel.CONVERSATIONAL,
    changed: true,
    reason: 'panel-opened-by-human',
  });
});

test('technical panel availability without a human gesture stays Dormant', () => {
  const result = reduceAuthority(
    { level: AuthorityLevel.DORMANT },
    { type: 'panel.opened', humanGesture: false },
  );

  assert.deepEqual(result, {
    level: AuthorityLevel.DORMANT,
    changed: false,
    reason: 'human-gesture-required',
  });
});

test('a human can choose Approval-gated only from Conversational', () => {
  const result = reduceAuthority(
    { level: AuthorityLevel.CONVERSATIONAL },
    { type: 'authority.approval-selected', humanGesture: true },
  );

  assert.deepEqual(result, {
    level: AuthorityLevel.APPROVAL_GATED,
    changed: true,
    reason: 'approval-gated-selected-by-human',
  });
});

test('Delegated rejects a human gesture without an authenticated controller', () => {
  const result = reduceAuthority(
    { level: AuthorityLevel.APPROVAL_GATED },
    {
      type: 'authority.delegated-selected',
      humanGesture: true,
      controllerAuthenticated: false,
    },
  );

  assert.deepEqual(result, {
    level: AuthorityLevel.APPROVAL_GATED,
    changed: false,
    reason: 'controller-authentication-required',
  });
});

test('Delegated requires both a human gesture and an authenticated controller', () => {
  const result = reduceAuthority(
    { level: AuthorityLevel.APPROVAL_GATED },
    {
      type: 'authority.delegated-selected',
      humanGesture: true,
      controllerAuthenticated: true,
    },
  );

  assert.deepEqual(result, {
    level: AuthorityLevel.DELEGATED,
    changed: true,
    reason: 'delegated-selected-by-human',
  });
});

test('lifecycle ambiguity fails closed from Delegated', () => {
  for (const type of [
    'lifecycle.restart',
    'controller.lost',
    'lease.expired',
    'unexpected.event',
  ]) {
    const result = reduceAuthority(
      { level: AuthorityLevel.DELEGATED },
      { type },
    );

    assert.deepEqual(result, {
      level: AuthorityLevel.DORMANT,
      changed: true,
      reason: `fail-closed:${type}`,
    });
  }
});

test('a downgrade from Delegated takes effect without upgrade evidence', () => {
  const result = reduceAuthority(
    { level: AuthorityLevel.DELEGATED },
    {
      type: 'authority.downgrade',
      targetLevel: AuthorityLevel.CONVERSATIONAL,
    },
  );

  assert.deepEqual(result, {
    level: AuthorityLevel.CONVERSATIONAL,
    changed: true,
    reason: 'authority-downgraded',
  });
});

test('direct and implicit upgrades are rejected with explicit evidence', () => {
  const attempts = [
    [{ level: AuthorityLevel.DORMANT }, { type: 'authority.approval-selected', humanGesture: true }],
    [{ level: AuthorityLevel.DORMANT }, { type: 'authority.delegated-selected', humanGesture: true, controllerAuthenticated: true }],
    [{ level: AuthorityLevel.CONVERSATIONAL }, { type: 'authority.approval-selected', humanGesture: false }],
    [{ level: AuthorityLevel.CONVERSATIONAL }, { type: 'authority.delegated-selected', humanGesture: false, controllerAuthenticated: true }],
  ];

  for (const [state, event] of attempts) {
    assert.deepEqual(reduceAuthority(state, event), {
      level: state.level,
      changed: false,
      reason: 'upgrade-prerequisites-not-met',
    });
  }
});

test('malformed reducer inputs fail closed instead of throwing or preserving authority', () => {
  const attempts = [
    [null, { type: 'panel.opened', humanGesture: true }, false],
    [{ level: AuthorityLevel.DELEGATED }, null, true],
    [{ level: 'admin' }, { type: 'panel.opened', humanGesture: true }, true],
  ];

  for (const [state, event, changed] of attempts) {
    assert.deepEqual(reduceAuthority(state, event), {
      level: AuthorityLevel.DORMANT,
      changed,
      reason: 'fail-closed:invalid-input',
    });
  }
});

test('a malformed downgrade revokes Delegated authority', () => {
  for (const targetLevel of [undefined, 'admin', AuthorityLevel.DELEGATED]) {
    assert.deepEqual(
      reduceAuthority(
        { level: AuthorityLevel.DELEGATED },
        { type: 'authority.downgrade', targetLevel },
      ),
      {
        level: AuthorityLevel.DORMANT,
        changed: true,
        reason: 'fail-closed:invalid-downgrade',
      },
    );
  }
});

test('a rejected transition returns a stable result shape', () => {
  assert.deepEqual(
    reduceAuthority(
      { level: AuthorityLevel.CONVERSATIONAL, accidentalPayload: 'must-not-propagate' },
      { type: 'panel.opened', humanGesture: true },
    ),
    {
      level: AuthorityLevel.CONVERSATIONAL,
      changed: false,
      reason: 'no-transition',
    },
  );
});

test('Stop immediately returns every active level to Dormant', () => {
  for (const level of [
    AuthorityLevel.CONVERSATIONAL,
    AuthorityLevel.APPROVAL_GATED,
    AuthorityLevel.DELEGATED,
  ]) {
    assert.deepEqual(
      reduceAuthority({ level }, { type: 'authority.stop' }),
      {
        level: AuthorityLevel.DORMANT,
        changed: true,
        reason: 'authority-stopped',
      },
    );
  }
});

test('Conversational may enter Delegated only with both prerequisites', () => {
  assert.deepEqual(
    reduceAuthority(
      { level: AuthorityLevel.CONVERSATIONAL },
      {
        type: 'authority.delegated-selected',
        humanGesture: true,
        controllerAuthenticated: true,
      },
    ),
    {
      level: AuthorityLevel.DELEGATED,
      changed: true,
      reason: 'delegated-selected-by-human',
    },
  );
});

test('an authority selection never acts as a downgrade', () => {
  assert.deepEqual(
    reduceAuthority(
      { level: AuthorityLevel.DELEGATED },
      { type: 'authority.approval-selected', humanGesture: true },
    ),
    {
      level: AuthorityLevel.DELEGATED,
      changed: false,
      reason: 'upgrade-prerequisites-not-met',
    },
  );
});

test('coercible non-string downgrade targets fail closed', () => {
  const targets = [
    [AuthorityLevel.CONVERSATIONAL],
    new String(AuthorityLevel.CONVERSATIONAL),
    { toString: () => AuthorityLevel.CONVERSATIONAL },
  ];

  for (const targetLevel of targets) {
    assert.deepEqual(
      reduceAuthority(
        { level: AuthorityLevel.DELEGATED },
        { type: 'authority.downgrade', targetLevel },
      ),
      {
        level: AuthorityLevel.DORMANT,
        changed: true,
        reason: 'fail-closed:invalid-downgrade',
      },
    );
  }
});

test('an empty event type is malformed input', () => {
  assert.deepEqual(
    reduceAuthority(
      { level: AuthorityLevel.DELEGATED },
      { type: '' },
    ),
    {
      level: AuthorityLevel.DORMANT,
      changed: true,
      reason: 'fail-closed:invalid-input',
    },
  );
});
