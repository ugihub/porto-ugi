export const MOTION_PRESETS = {
  card: {
    type: 'spring',
    stiffness: 120,
    damping: 18
  },
  list: {
    type: 'spring',
    stiffness: 260,
    damping: 28
  },
  micro: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  },
  packet: {
    type: 'spring',
    stiffness: 90,
    damping: 20,
    mass: 0.8
  },
  bar: {
    type: 'spring',
    stiffness: 120,
    damping: 20
  }
}

export const STATUS_LABELS = {
  idle: 'Idle',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  pending: 'Pending',
  active: 'Active',
  passed: 'Passed',
  blocked: 'Blocked',
  evidence_required: 'Evidence required'
}

export const BREAKPOINTS = {
  mobile: 360,
  mobileWide: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440
}
