import { motion } from 'framer-motion'
import { FiAlertCircle, FiCheck, FiPlay, FiRotateCcw } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { runLabPlayback } from '../../../features/lab/labSlice.js'
import { MOTION_PRESETS, STATUS_LABELS } from '../playgroundTokens.js'

const LabStatusPipeline = ({ steps, totalSteps = steps.length, failedAt = -1 }) => {
  const dispatch = useDispatch()
  const playback = useSelector((state) => state.lab.playback)
  const isRunning = playback.status === 'running'
  const isComplete = playback.status === 'complete'
  const isFailed = playback.status === 'complete' && failedAt >= 0
  const currentStatusLabel = STATUS_LABELS[playback.status] || playback.status

  const getStepState = (index) => {
    if (isComplete) {
      if (index === failedAt) return 'failed'
      if (failedAt >= 0 && index > failedAt) return 'pending'
      return 'completed'
    }
    if (isRunning) {
      if (index === playback.step) return 'active'
      if (index < playback.step) return 'completed'
      return 'pending'
    }
    return 'pending'
  }

  return (
    <div className="lab-playback">
      <div className="lab-playback-bar">
        <div className="playback-status-wrapper">
          <span
            aria-live="polite"
            className={`playback-status ${playback.status} ${isFailed ? 'failed' : ''}`}
          >
            <i className="status-dot" />
            <span className="status-text">{currentStatusLabel}</span>
          </span>
        </div>
        <button
          aria-label={playback.status === 'idle' ? 'Run pipeline' : isRunning ? 'Pipeline processing' : 'Replay pipeline'}
          className="lab-command"
          disabled={isRunning}
          onClick={() => dispatch(runLabPlayback({ totalSteps }))}
          type="button"
        >
          {playback.status === 'idle' ? (
            <FiPlay className="btn-icon" />
          ) : (
            <FiRotateCcw className={`btn-icon ${isRunning ? 'spinning' : ''}`} />
          )}
          <span>
            {playback.status === 'idle'
              ? 'Run process'
              : isRunning
              ? 'Processing...'
              : 'Replay process'}
          </span>
        </button>
      </div>

      <ol aria-label="Execution pipeline steps" className="lab-pipeline">
        {steps.map((step, index) => {
          const state = getStepState(index)
          const isActive = state === 'active'
          const isDone = state === 'completed'
          const isError = state === 'failed'

          return (
            <li
              aria-current={isActive ? 'step' : undefined}
              className={`pipeline-step ${state}`}
              key={step}
            >
              <div className="step-indicator">
                <motion.div
                  animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  className="step-badge"
                  transition={isActive ? { duration: 0.8, repeat: Infinity } : MOTION_PRESETS.micro}
                >
                  {isDone ? (
                    <FiCheck className="step-icon step-icon-done" />
                  ) : isError ? (
                    <FiAlertCircle className="step-icon step-icon-error" />
                  ) : (
                    <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                  )}
                </motion.div>
              </div>
              <div className="step-info">
                <span className="step-name">{step}</span>
                <span className="step-state-label sr-only">{state}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default LabStatusPipeline
