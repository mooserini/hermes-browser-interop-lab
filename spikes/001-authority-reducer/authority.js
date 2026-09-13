export const AuthorityLevel = Object.freeze({
  DORMANT: 'dormant',
  CONVERSATIONAL: 'conversational',
  APPROVAL_GATED: 'approval-gated',
  DELEGATED: 'delegated',
});

const VALID_LEVELS = new Set(Object.values(AuthorityLevel));

const AUTHORITY_RANK = Object.freeze({
  [AuthorityLevel.DORMANT]: 0,
  [AuthorityLevel.CONVERSATIONAL]: 1,
  [AuthorityLevel.APPROVAL_GATED]: 2,
  [AuthorityLevel.DELEGATED]: 3,
});

const KNOWN_EVENTS = new Set([
  'panel.opened',
  'authority.approval-selected',
  'authority.delegated-selected',
  'authority.downgrade',
  'authority.stop',
]);

export function reduceAuthority(state, event) {
  if (
    state === null
    || typeof state !== 'object'
    || !VALID_LEVELS.has(state.level)
    || event === null
    || typeof event !== 'object'
    || typeof event.type !== 'string'
    || event.type.trim().length === 0
  ) {
    return {
      level: AuthorityLevel.DORMANT,
      changed: state?.level !== undefined && state.level !== AuthorityLevel.DORMANT,
      reason: 'fail-closed:invalid-input',
    };
  }

  if (state.level === AuthorityLevel.DORMANT && event.type === 'panel.opened') {
    if (event.humanGesture !== true) {
      return {
        level: AuthorityLevel.DORMANT,
        changed: false,
        reason: 'human-gesture-required',
      };
    }

    return {
      level: AuthorityLevel.CONVERSATIONAL,
      changed: true,
      reason: 'panel-opened-by-human',
    };
  }

  if (
    state.level === AuthorityLevel.CONVERSATIONAL
    && event.type === 'authority.approval-selected'
    && event.humanGesture === true
  ) {
    return {
      level: AuthorityLevel.APPROVAL_GATED,
      changed: true,
      reason: 'approval-gated-selected-by-human',
    };
  }

  if (
    (state.level === AuthorityLevel.CONVERSATIONAL
      || state.level === AuthorityLevel.APPROVAL_GATED)
    && event.type === 'authority.delegated-selected'
    && event.humanGesture === true
  ) {
    if (event.controllerAuthenticated !== true) {
      return {
        level: state.level,
        changed: false,
        reason: 'controller-authentication-required',
      };
    }

    return {
      level: AuthorityLevel.DELEGATED,
      changed: true,
      reason: 'delegated-selected-by-human',
    };
  }

  if (
    event.type === 'authority.approval-selected'
    || event.type === 'authority.delegated-selected'
  ) {
    return {
      level: state.level,
      changed: false,
      reason: 'upgrade-prerequisites-not-met',
    };
  }

  if (event.type === 'authority.downgrade') {
    const validTarget = typeof event.targetLevel === 'string'
      && VALID_LEVELS.has(event.targetLevel);
    const currentRank = AUTHORITY_RANK[state.level];
    const targetRank = validTarget
      ? AUTHORITY_RANK[event.targetLevel]
      : undefined;

    if (validTarget && targetRank < currentRank) {
      return {
        level: event.targetLevel,
        changed: true,
        reason: 'authority-downgraded',
      };
    }

    return {
      level: AuthorityLevel.DORMANT,
      changed: state.level !== AuthorityLevel.DORMANT,
      reason: 'fail-closed:invalid-downgrade',
    };
  }

  if (event.type === 'authority.stop') {
    return {
      level: AuthorityLevel.DORMANT,
      changed: state.level !== AuthorityLevel.DORMANT,
      reason: 'authority-stopped',
    };
  }

  if (!KNOWN_EVENTS.has(event.type)) {
    return {
      level: AuthorityLevel.DORMANT,
      changed: state.level !== AuthorityLevel.DORMANT,
      reason: `fail-closed:${event.type}`,
    };
  }

  return {
    level: state.level,
    changed: false,
    reason: 'no-transition',
  };
}
