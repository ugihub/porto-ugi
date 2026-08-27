import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiBox, FiCheck, FiCpu, FiFileText, FiPackage, FiTerminal, FiTruck, FiZap } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { warehouseScenarios } from '../../../data/appliedAiLabContent.js'
import { getDeliveryPosition } from '../../../features/lab/labEngine.js'
import { resetPlayback } from '../../../features/lab/labSlice.js'
import { MOTION_PRESETS } from '../playgroundTokens.js'
import LabInfoModal from './LabInfoModal.jsx'
import LabStatusPipeline from './LabStatusPipeline.jsx'

const traceStages = [
  { key: 'request', label: 'Request', icon: FiFileText },
  { key: 'intent', label: 'Intent', icon: FiCpu },
  { key: 'arguments', label: 'Arguments', icon: FiPackage },
  { key: 'execution', label: 'Execution', icon: FiZap },
  { key: 'result', label: 'Result', icon: FiTerminal }
]

const WarehouseToolCallConsole = () => {
  const [scenarioId, setScenarioId] = useState(warehouseScenarios[0].id)
  const dispatch = useDispatch()
  const playback = useSelector((state) => state.lab.playback)
  const [livePrompt, setLivePrompt] = useState('Check stock for SKU A-17')
  const [liveResult, setLiveResult] = useState('')
  const [liveError, setLiveError] = useState('')
  const [isRunningLive, setIsRunningLive] = useState(false)

  const scenario = warehouseScenarios.find((item) => item.id === scenarioId) || warehouseScenarios[0]
  const liveDemoEnabled = import.meta.env.VITE_ENABLE_WAREHOUSEFLOW_LIVE_DEMO === 'true'
  const visibleStep = Math.max(playback.step, 0)
  const deliveryPosition = getDeliveryPosition(visibleStep)

  const traceValues = {
    request: scenario.request,
    intent: scenario.intent,
    arguments: JSON.stringify(scenario.arguments),
    execution: 'Recorded local tool simulation',
    result: scenario.result
  }

  const runLiveDemo = async () => {
    setIsRunningLive(true)
    setLiveError('')
    setLiveResult('')
    try {
      const response = await fetch('/api/lab/warehouseflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: livePrompt })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'The live demo is unavailable right now.')
      setLiveResult(data.content)
    } catch (error) {
      setLiveError(error.message)
    } finally {
      setIsRunningLive(false)
    }
  }

  return (
    <article className="lab-panel warehouse-console">
      <div className="lab-panel-heading">
        <div>
          <span className="lab-kicker"><FiBox /> RECORDED TRACE</span>
          <h3>WarehouseFlow Tool-Call Console</h3>
        </div>
        <LabInfoModal tabId="warehouse" />
      </div>
      <p className="lab-copy">
        A deterministic recorded tool-call flow. It does not contact an LLM or create warehouse data.
      </p>

      <label className="lab-field">
        Scenario
        <select
          value={scenarioId}
          onChange={(event) => {
            setScenarioId(event.target.value)
            dispatch(resetPlayback())
          }}
        >
          {warehouseScenarios.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <LabStatusPipeline steps={traceStages.map((stage) => stage.label)} />

      <div className="warehouse-layout">
        <div className="warehouse-flow lab-visual-stage">
          <div aria-label="WarehouseFlow delivery route" className="delivery-map">
            <svg
              aria-hidden="true"
              className="delivery-route"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <polyline
                className="delivery-road"
                points="5,72 28,24 50,72 72,24 94,72"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                className="delivery-road-marking"
                points="5,72 28,24 50,72 72,24 94,72"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {traceStages.map(({ key, label, icon: Icon }, index) => {
              const active = playback.status === 'running' && index === playback.step
              const done =
                index < playback.step || (playback.status === 'complete' && index <= playback.step)
              const position = getDeliveryPosition(index)

              return (
                <div
                  aria-current={active ? 'step' : undefined}
                  className={`delivery-stop ${done ? 'done' : ''} ${active ? 'active' : ''}`}
                  key={key}
                  style={{ left: `${position.left}%`, top: `${position.top}%` }}
                >
                  <span className="delivery-stop-marker">
                    {done ? <FiCheck /> : <Icon />}
                  </span>
                  <span className="delivery-stop-label">{label}</span>
                </div>
              )
            })}

            <AnimatePresence>
              {playback.status !== 'idle' && (
                <motion.div
                  animate={{
                    left: `${deliveryPosition.left}%`,
                    rotate: deliveryPosition.rotate,
                    top: `${deliveryPosition.top}%`,
                    x: '-50%',
                    y: '-50%'
                  }}
                  className="delivery-vehicle"
                  exit={{ opacity: 0, scale: 0.8 }}
                  initial={{ left: '5%', opacity: 0, rotate: 0, scale: 0.8, top: '72%', x: '-50%', y: '-50%' }}
                  transition={MOTION_PRESETS.packet}
                >
                  <FiTruck />
                  {playback.status !== 'complete' && (
                    <span className="vehicle-package">
                      <FiPackage />
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {playback.status === 'complete' && (
                <motion.div
                  animate={{ opacity: 1, scale: [0.7, 1.15, 1], y: 0 }}
                  className="delivered-package"
                  initial={{ opacity: 0, scale: 0.7, y: -16 }}
                  transition={MOTION_PRESETS.micro}
                >
                  <FiPackage />
                  <span>Delivered</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="warehouse-terminal-container">
          <div className="trace-terminal">
            <div className="terminal-header">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">Execution Trace Log</span>
            </div>
            <div className="terminal-body">
              <AnimatePresence mode="popLayout">
                {traceStages.map(({ key, label }, index) => {
                  if (index > playback.step) return null
                  const syntaxClass = `syntax-${key}`
                  return (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      className="terminal-row"
                      initial={{ opacity: 0, x: -14 }}
                      key={key}
                      transition={MOTION_PRESETS.micro}
                    >
                      <span className="terminal-key">{label.toLowerCase()}</span>
                      <code className={`terminal-val ${syntaxClass}`}>{traceValues[key]}</code>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              {playback.status === 'idle' && (
                <p className="terminal-placeholder">Press &apos;Run process&apos; to inspect the tool-call trace.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="warehouse-footer">
        <p className="lab-local-note">
          <FiZap /> Local fixture: no model request, token use, or operational side effect.
        </p>
        <a
          className="lab-reference-link"
          href="https://huggingface.co/Ugisr/warehouseflow-gemma3-1b-it-gguf"
          rel="noreferrer"
          target="_blank"
        >
          WarehouseFlow model on Hugging Face
        </a>
      </div>

      {liveDemoEnabled && (
        <div className="live-demo">
          <label className="lab-field">
            Optional live prompt
            <input
              maxLength="1000"
              onChange={(event) => setLivePrompt(event.target.value)}
              value={livePrompt}
            />
          </label>
          <button
            className="lab-command"
            disabled={isRunningLive}
            onClick={runLiveDemo}
            type="button"
          >
            {isRunningLive ? 'Running...' : 'Run live demo'}
          </button>
          {liveResult && <p className="live-demo-result">{liveResult}</p>}
          {liveError && <p className="live-demo-error">{liveError}</p>}
        </div>
      )}
    </article>
  )
}

export default WarehouseToolCallConsole
