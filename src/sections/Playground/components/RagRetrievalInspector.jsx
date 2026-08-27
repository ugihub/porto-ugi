import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiDatabase, FiSearch } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { retrievalCorpus } from '../../../data/appliedAiLabContent.js'
import { rankDocuments } from '../../../features/lab/labEngine.js'
import { resetPlayback } from '../../../features/lab/labSlice.js'
import { MOTION_PRESETS } from '../playgroundTokens.js'
import LabInfoModal from './LabInfoModal.jsx'
import LabStatusPipeline from './LabStatusPipeline.jsx'

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightText({ text, queryTokens }) {
  if (!queryTokens || queryTokens.length === 0) return <span>{text}</span>

  const pattern = new RegExp(`(${queryTokens.map(escapeRegExp).join('|')})`, 'gi')
  const parts = text.split(pattern)

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = queryTokens.some((token) => token.toLowerCase() === part.toLowerCase())
        return isMatch ? (
          <mark className="rag-match" key={index}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      })}
    </span>
  )
}

const RagRetrievalInspector = () => {
  const [query, setQuery] = useState('pricing estimate')
  const dispatch = useDispatch()
  const playback = useSelector((state) => state.lab.playback)
  const documents = useMemo(() => rankDocuments(query, retrievalCorpus), [query])

  const visibleDocuments =
    playback.step >= 2 ? documents : retrievalCorpus.map((document) => ({ ...document, score: 0 }))
  const queryTokens = useMemo(() => {
    const raw = query.toLowerCase().match(/[a-z0-9]+/g) || []
    return Array.from(new Set(raw)).slice(0, 12)
  }, [query])

  return (
    <article className="lab-panel retrieval-inspector">
      <div className="lab-panel-heading">
        <div>
          <span className="lab-kicker"><FiDatabase /> LOCAL RETRIEVAL FIXTURE</span>
          <h3>RAG Retrieval Inspector</h3>
        </div>
        <LabInfoModal tabId="retrieval" />
      </div>
      <p className="lab-copy">
        Inspect lexical retrieval against a small local corpus. Scores are explainable and deterministic.
      </p>

      <label className="lab-field">
        Retrieval query
        <span className="lab-input-wrap">
          <FiSearch />
          <input
            onChange={(event) => {
              setQuery(event.target.value)
              dispatch(resetPlayback())
            }}
            placeholder="Type query to filter..."
            value={query}
          />
        </span>
      </label>

      <LabStatusPipeline steps={['Tokenize query', 'Score candidates', 'Re-rank documents', 'Select context']} />

      <div className="rag-visual lab-visual-stage">
        <div className="query-token-lane">
          <span className="token-lane-label">Query tokens:</span>
          <div className="token-chips-wrapper">
            <AnimatePresence>
              {playback.step >= 0 &&
                queryTokens.map((token, index) => (
                  <motion.span
                    animate={{ opacity: 1, scale: 1 }}
                    className="rag-token-chip"
                    exit={{ opacity: 0, scale: 0.8 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    key={`${token}-${index}`}
                    transition={{ delay: index * 0.05, ...MOTION_PRESETS.micro }}
                  >
                    {token}
                  </motion.span>
                ))}
            </AnimatePresence>
            {queryTokens.length === 0 && <span className="empty-tokens">No active tokens</span>}
          </div>
        </div>

        <motion.div className="retrieval-results" layout>
          {visibleDocuments.map((document, index) => {
            const ranked = playback.step >= 2
            const selected = playback.step >= 3 && index < 3
            const score = playback.step >= 1 ? documents.find((item) => item.id === document.id)?.score || 0 : 0
            const maxScore = Math.max(...documents.map((d) => d.score), 1)
            const scoreRatio = Math.min(100, Math.round((score / maxScore) * 100))

            return (
              <motion.article
                className={`retrieval-row ${selected ? 'selected-context' : ''}`}
                key={document.id}
                layout
                transition={MOTION_PRESETS.list}
              >
                <div className="retrieval-row-header">
                  <strong className="retrieval-title">
                    <HighlightText queryTokens={queryTokens} text={`#${ranked ? index + 1 : '-'} ${document.title}`} />
                  </strong>
                  <span className="retrieval-score-badge">
                    {score} {score === 1 ? 'match' : 'matches'}
                  </span>
                </div>

                <div
                  aria-label={`Score ${scoreRatio}%`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={scoreRatio}
                  className="score-track"
                  role="progressbar"
                >
                  <motion.i
                    animate={{ width: `${scoreRatio}%` }}
                    transition={MOTION_PRESETS.bar}
                  />
                </div>

                <p className="retrieval-text">
                  <HighlightText queryTokens={queryTokens} text={document.text} />
                </p>

                <div className="retrieval-row-footer">
                  <code className="retrieval-route">{document.actionRoute}</code>
                  {selected && (
                    <motion.span
                      animate={{ opacity: 1, x: 0 }}
                      className="selected-badge"
                      initial={{ opacity: 0, x: 8 }}
                    >
                      <FiCheck /> Selected context
                    </motion.span>
                  )}
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </article>
  )
}

export default RagRetrievalInspector
