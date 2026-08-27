import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiDollarSign, FiEdit3 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { estimatorScenarios, modelPricingSnapshot } from '../../../data/appliedAiLabContent.js'
import { estimateModelCost, estimateTokens, formatMoney } from '../../../features/lab/labEngine.js'
import { resetPlayback } from '../../../features/lab/labSlice.js'
import { MOTION_PRESETS } from '../playgroundTokens.js'
import LabInfoModal from './LabInfoModal.jsx'
import LabStatusPipeline from './LabStatusPipeline.jsx'

const TokenCostEstimator = () => {
  const [scenarioId, setScenarioId] = useState('agent')
  const [customPrompt, setCustomPrompt] = useState('')
  const [usdToIdr, setUsdToIdr] = useState(16000)
  const [currency, setCurrency] = useState('USD')
  const dispatch = useDispatch()
  const playback = useSelector((state) => state.lab.playback)

  const scenario = estimatorScenarios.find((item) => item.id === scenarioId) || estimatorScenarios[0]
  const customTokens = estimateTokens(customPrompt)
  const inputTokens =
    scenario.layers.system +
    scenario.layers.user +
    scenario.layers.retrieval +
    scenario.layers.tool +
    customTokens
  const outputTokens = scenario.layers.output
  const totalTokens = inputTokens + outputTokens

  const costs = useMemo(
    () =>
      modelPricingSnapshot.models.map((model) => ({
        model,
        ...estimateModelCost({ inputTokens, outputTokens }, model, Number(usdToIdr) || 0)
      })),
    [inputTokens, outputTokens, usdToIdr]
  )

  const tokenLayers = {
    system: scenario.layers.system,
    user: scenario.layers.user,
    retrieval: scenario.layers.retrieval,
    tool: scenario.layers.tool,
    prompt: customTokens,
    output: outputTokens
  }

  const maxLayerTokens = Math.max(...Object.values(tokenLayers), 1)
  const maxUsdCost = Math.max(...costs.map((c) => c.usd), 0.0001)

  return (
    <article className="lab-panel token-estimator">
      <div className="lab-panel-heading">
        <div>
          <span className="lab-kicker">
            <FiDollarSign /> Pricing snapshot: {modelPricingSnapshot.effectiveDate}
          </span>
          <h3>Token &amp; Cost Estimator</h3>
        </div>
        <div className="heading-actions">
          <div className="currency-toggle-group" role="group" aria-label="Currency view">
            <button
              aria-pressed={currency === 'USD'}
              className={`currency-toggle ${currency === 'USD' ? 'active' : ''}`}
              onClick={() => setCurrency('USD')}
              type="button"
            >
              USD
            </button>
            <button
              aria-pressed={currency === 'IDR'}
              className={`currency-toggle ${currency === 'IDR' ? 'active' : ''}`}
              onClick={() => setCurrency('IDR')}
              type="button"
            >
              IDR
            </button>
          </div>
          <LabInfoModal tabId="estimator" />
        </div>
      </div>
      <p className="lab-copy">
        A planning estimate based on an editable local pricing snapshot dated {modelPricingSnapshot.effectiveDate}.
        It does not use a provider API.
      </p>

      <div className="estimator-controls">
        <label className="lab-field">
          Workload
          <select
            value={scenarioId}
            onChange={(event) => {
              setScenarioId(event.target.value)
              dispatch(resetPlayback())
            }}
          >
            {estimatorScenarios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="lab-field">
          USD to IDR Rate
          <input
            min="1"
            onChange={(event) => {
              setUsdToIdr(event.target.value)
              dispatch(resetPlayback())
            }}
            type="number"
            value={usdToIdr}
          />
        </label>
      </div>

      <label className="lab-field">
        Optional prompt text <span className="field-meta"><FiEdit3 /> {customTokens} token est.</span>
        <textarea
          maxLength="1000"
          onChange={(event) => {
            setCustomPrompt(event.target.value)
            dispatch(resetPlayback())
          }}
          placeholder="Add an optional prompt to include in the estimate..."
          value={customPrompt}
        />
      </label>

      <LabStatusPipeline steps={['Count token layers', 'Compose request', 'Price each model', 'Convert currency']} />

      <div className="estimator-visual lab-visual-stage">
        <h4 className="stage-subheading">Token Breakdown by Layer</h4>
        <div className="token-layers-grid">
          {Object.entries(tokenLayers).map(([name, tokens], index) => {
            const ratio = Math.max(8, Math.round((tokens / maxLayerTokens) * 100))
            return (
              <div className="token-layer-item" key={name}>
                <div className="token-layer-meta">
                  <span className="layer-name">{name}</span>
                  <strong className="layer-count">
                    {playback.step >= 0 ? tokens.toLocaleString() : '0'}
                  </strong>
                </div>
                <div
                  aria-label={`${name} tokens: ${tokens}`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={ratio}
                  className="token-layer-track"
                  role="progressbar"
                >
                  <motion.div
                    animate={{ width: playback.step >= 0 ? `${ratio}%` : '0%' }}
                    className={`token-layer-fill layer-${name}`}
                    transition={{ delay: index * 0.05, ...MOTION_PRESETS.bar }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className={`token-flow-stream ${playback.step >= 1 ? 'active' : ''}`}>
          <span className="flow-input">{inputTokens.toLocaleString()} input tokens</span>
          <div className="stream-line">
            {[0, 1, 2, 3].map((dot) => (
              <motion.span
                animate={
                  playback.step >= 1
                    ? { x: ['0%', '100%'], opacity: [0, 1, 0] }
                    : { opacity: 0 }
                }
                className="stream-particle"
                key={dot}
                transition={{
                  delay: dot * 0.2,
                  duration: 1.2,
                  ease: 'linear',
                  repeat: playback.status === 'running' ? Infinity : 0
                }}
              />
            ))}
          </div>
          <FiArrowRight className="flow-arrow" />
          <span className="flow-output">{outputTokens.toLocaleString()} output tokens</span>
        </div>

        <div className="token-total-card">
          <span>Estimated Total Workload:</span>
          <strong>{playback.step >= 0 ? totalTokens.toLocaleString() : '0'} tokens</strong>
        </div>

        <h4 className="cost-heading">Estimated API Cost Across Providers</h4>
        <div className="pricing-grid">
          {costs.map(({ model, usd, idr }, index) => {
            const costRatio = Math.max(6, Math.min(100, Math.round((usd / maxUsdCost) * 100)))
            return (
              <motion.article
                animate={playback.step >= 2 ? { opacity: 1, y: 0 } : { opacity: 0.45, y: 8 }}
                className="pricing-card"
                key={model.id}
                transition={{ delay: index * 0.07, ...MOTION_PRESETS.card }}
              >
                <small className="pricing-provider">{model.provider}</small>
                <h5 className="pricing-model-name">{model.name}</h5>
                <strong className="pricing-primary-cost">
                  {playback.step >= 2
                    ? currency === 'USD'
                      ? formatMoney(usd, 'USD')
                      : formatMoney(idr, 'IDR')
                    : currency === 'USD'
                    ? '$0.00'
                    : 'IDR 0'}
                </strong>
                <span className="pricing-secondary-cost">
                  {playback.step >= 3
                    ? currency === 'USD'
                      ? formatMoney(idr, 'IDR')
                      : formatMoney(usd, 'USD')
                    : ''}
                </span>

                <div
                  aria-label={`Relative cost index ${costRatio}%`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={costRatio}
                  className="cost-meter"
                  role="progressbar"
                >
                  <motion.i
                    animate={{ width: playback.step >= 2 ? `${costRatio}%` : '0%' }}
                    transition={MOTION_PRESETS.bar}
                  />
                </div>

                <a
                  className="pricing-source-link"
                  href={model.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Official pricing source
                </a>
              </motion.article>
            )
          })}
        </div>
      </div>
    </article>
  )
}

export default TokenCostEstimator
