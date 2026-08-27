import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiAlertTriangle, FiCheckCircle, FiFileText, FiLock, FiShield, FiXCircle } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { reliabilityFixtures } from '../../../data/appliedAiLabContent.js'
import { evaluateReliability } from '../../../features/lab/labEngine.js'
import { resetPlayback } from '../../../features/lab/labSlice.js'
import { MOTION_PRESETS } from '../playgroundTokens.js'
import LabInfoModal from './LabInfoModal.jsx'
import LabStatusPipeline from './LabStatusPipeline.jsx'

const AgentReliabilityGate = () => {
  const [fixtureId, setFixtureId] = useState(reliabilityFixtures[0].id)
  const dispatch = useDispatch()
  const playback = useSelector((state) => state.lab.playback)
  const fixture = reliabilityFixtures.find((item) => item.id === fixtureId) || reliabilityFixtures[0]
  const result = evaluateReliability(fixture)
  const isAllowed = result.status === 'allowed'
  const failedAt = !fixture.schemaValid ? 0 : result.status === 'evidence-required' ? 1 : -1
  const totalSteps = failedAt >= 0 ? failedAt + 1 : 3
  const packetStep = Math.max(0, Math.min(playback.step, failedAt >= 0 ? failedAt : 2))

  const gates = [
    {
      id: 'schema',
      label: 'Schema',
      detail: fixture.schemaValid ? 'Valid action contract' : 'Invalid action contract',
      icon: FiFileText
    },
    {
      id: 'evidence',
      label: 'Evidence',
      detail: fixture.risk === 'high' && fixture.evidence.length === 0 ? 'Evidence missing' : 'Policy satisfied',
      icon: FiShield
    },
    {
      id: 'decision',
      label: 'Decision',
      detail: isAllowed ? 'Execution allowed' : 'Execution stopped',
      icon: FiLock
    }
  ]

  const getGateState = (index) => {
    if (playback.status === 'idle') return 'idle'
    if (index > playback.step) return 'pending'
    if (playback.status === 'complete' && index === failedAt) return 'failed'
    if (index <= playback.step) return 'passed'
    return 'pending'
  }

  return (
    <article className="lab-panel reliability-gate">
      <div className="lab-panel-heading">
        <div>
          <span className="lab-kicker"><FiShield /> DETERMINISTIC CHECK</span>
          <h3>Agent Reliability Gate</h3>
        </div>
        <LabInfoModal tabId="reliability" />
      </div>
      <p className="lab-copy">
        Validate a proposed action before it can execute. This is a local policy check, not model judgment.
      </p>

      <label className="lab-field">
        Test fixture
        <select
          value={fixtureId}
          onChange={(event) => {
            setFixtureId(event.target.value)
            dispatch(resetPlayback())
          }}
        >
          {reliabilityFixtures.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <LabStatusPipeline
        failedAt={failedAt}
        steps={['Schema validation', 'Evidence policy', 'Execution decision']}
        totalSteps={totalSteps}
      />

      <div className="gate-visual lab-visual-stage">
        <div className="gate-track">
          <div className="gate-track-line" />
          {gates.map(({ id, label, detail, icon: Icon }, index) => {
            const state = getGateState(index)
            const isCurrentFailed = state === 'failed'

            return (
              <motion.div
                animate={
                  isCurrentFailed
                    ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.4 } }
                    : { opacity: 1, y: 0 }
                }
                className={`gate-node ${state}`}
                key={id}
              >
                <div className="gate-icon-wrapper">
                  <Icon className="gate-icon" />
                  {state === 'passed' && <FiCheckCircle className="gate-status-badge passed" />}
                  {state === 'failed' && <FiXCircle className="gate-status-badge failed" />}
                </div>
                <strong className="gate-label">{label}</strong>
                <small className="gate-detail">{state === 'idle' ? 'Ready' : detail}</small>
              </motion.div>
            )
          })}

          <AnimatePresence>
            {playback.status !== 'idle' && (
              <motion.div
                animate={{
                  left: ['10%', '50%', '90%'][packetStep],
                  scale: playback.status === 'complete' && failedAt >= 0 ? 1.15 : 1
                }}
                className={`gate-packet ${
                  playback.status === 'complete' && failedAt >= 0 ? 'stopped' : 'moving'
                }`}
                initial={false}
                transition={MOTION_PRESETS.packet}
              >
                <FiShield />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {playback.status === 'complete' && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            aria-live="polite"
            className={`gate-result ${result.status}`}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={MOTION_PRESETS.micro}
          >
            {isAllowed ? (
              <FiCheckCircle className="result-icon allowed" />
            ) : (
              <FiAlertTriangle className="result-icon blocked" />
            )}
            <div className="result-content">
              <strong>{result.status.replace('-', ' ')}</strong>
              <p>{result.reason}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <dl className="gate-facts">
        <div className="fact-item">
          <dt>Risk Level</dt>
          <dd className={`risk-tag risk-${fixture.risk}`}>{fixture.risk}</dd>
        </div>
        <div className="fact-item">
          <dt>Evidence Attached</dt>
          <dd>{fixture.evidence.length} item(s)</dd>
        </div>
        <div className="fact-item">
          <dt>Action Schema</dt>
          <dd className={fixture.schemaValid ? 'valid-tag' : 'invalid-tag'}>
            {fixture.schemaValid ? 'valid contract' : 'invalid contract'}
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default AgentReliabilityGate
