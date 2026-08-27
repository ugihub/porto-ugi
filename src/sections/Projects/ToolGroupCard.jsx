import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { FaBrain, FaCodeBranch, FaCubes, FaDatabase, FaExternalLinkAlt, FaGithub, FaInfoCircle, FaLayerGroup, FaNetworkWired } from 'react-icons/fa'
import { FiCheck, FiHelpCircle } from 'react-icons/fi'

const visuals = {
  'llm-agents': {
    Icon: FaBrain,
    className: 'bento-card--agents',
    accentColor: '#00e5ff'
  },
  'ai-infrastructure': {
    Icon: FaDatabase,
    className: 'bento-card--infrastructure',
    accentColor: '#00e676'
  },
  'product-engineering': {
    Icon: FaCubes,
    className: 'bento-card--product',
    accentColor: '#ffc400'
  },
  'github-profile': {
    Icon: FaGithub,
    className: 'bento-card--github',
    accentColor: '#ff5722'
  },
  'tech-arsenal': {
    Icon: FaLayerGroup,
    className: 'bento-card--arsenal',
    accentColor: '#7c4dff'
  }
}

const tagVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 0.15 + index * 0.04, duration: 0.3 }
  })
}

const ToolGroupCard = ({ group, index }) => {
  const [showInfo, setShowInfo] = useState(false)
  const [activeLayerIndex, setActiveLayerIndex] = useState(0)
  const infoTimeoutRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [6, -6]), { stiffness: 260, damping: 22 })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), { stiffness: 260, damping: 22 })

  const visual = visuals[group.id] || visuals['llm-agents']
  const { Icon } = visual

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  const resetTilt = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const handleMouseEnterInfo = () => {
    if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current)
    setShowInfo(true)
  }

  const handleMouseLeaveInfo = () => {
    infoTimeoutRef.current = setTimeout(() => {
      setShowInfo(false)
    }, 180)
  }

  return (
    <motion.article
      className={`bento-card ${visual.className} bento-slot--${group.gridSlot || 'standard'}`}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
    >
      {/* Top Bar with Number, Badge & Question Info Popover */}
      <div className="bento-card-topbar">
        <div className="bento-meta-left">
          <span className="bento-index mono">0{index + 1}</span>
          {group.badge && <span className="bento-badge">{group.badge}</span>}
        </div>

        <div
          className="bento-info-wrapper"
          onMouseEnter={handleMouseEnterInfo}
          onMouseLeave={handleMouseLeaveInfo}
        >
          <button
            aria-expanded={showInfo}
            aria-label={`Details about ${group.title}`}
            className={`bento-info-trigger ${showInfo ? 'active' : ''}`}
            onClick={() => setShowInfo((prev) => !prev)}
            type="button"
          >
            <FiHelpCircle />
          </button>

          <AnimatePresence>
            {showInfo && group.explanation && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bento-info-popover"
                exit={{ opacity: 0, scale: 0.94, y: -6 }}
                initial={{ opacity: 0, scale: 0.94, y: -6 }}
                role="tooltip"
                transition={{ duration: 0.18 }}
              >
                <div className="bento-popover-header">
                  <FaInfoCircle className="popover-icon" />
                  <strong>{group.explanation.title}</strong>
                </div>
                <p className="bento-popover-desc">{group.explanation.purpose}</p>
                <ul className="bento-popover-list">
                  {group.explanation.highlights.map((item, i) => (
                    <li key={i}>
                      <FiCheck className="check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Render Specific Card Body Variant */}
      {group.type === 'github' ? (
        /* CARD 04: GitHub Profile Callout Card */
        <div className="bento-github-body">
          <div className="github-hero-row">
            <div className="bento-icon-box github-icon-box">
              <FaGithub />
            </div>
            <div className="github-user-info">
              <h3 className="github-handle mono">@{group.username}</h3>
              <span className="github-role-badge">Applied AI Open Source</span>
            </div>
          </div>

          <p className="bento-card-desc github-desc">{group.description}</p>

          <div className="github-links-row">
            <a
              className="github-btn primary"
              href={group.profileUrl}
              rel="noreferrer"
              target="_blank"
            >
              <FaCodeBranch /> View GitHub Profile <FaExternalLinkAlt className="external-ico" />
            </a>
            {group.huggingFaceUrl && (
              <a
                className="github-btn secondary"
                href={group.huggingFaceUrl}
                rel="noreferrer"
                target="_blank"
              >
                Hugging Face Models <FaExternalLinkAlt className="external-ico" />
              </a>
            )}
          </div>
        </div>
      ) : group.type === 'arsenal' ? (
        /* CARD 05: Tech Arsenal & Architecture Map (Right Span) */
        <div className="bento-arsenal-body">
          <div className="arsenal-header-row">
            <div className="bento-icon-box arsenal-icon-box">
              <FaNetworkWired />
            </div>
            <div>
              <h3 className="bento-card-title">{group.title}</h3>
              <p className="bento-card-desc">{group.description}</p>
            </div>
          </div>

          {/* Interactive Architecture Layers Route */}
          <div className="arsenal-layers-container">
            <div className="arsenal-tabs-bar" role="tablist">
              {group.layers.map((layer, lIdx) => (
                <button
                  key={layer.name}
                  className={`arsenal-tab-btn ${activeLayerIndex === lIdx ? 'active' : ''}`}
                  onClick={() => setActiveLayerIndex(lIdx)}
                  type="button"
                >
                  <span className="layer-step-num">{lIdx + 1}</span>
                  <span>{layer.name}</span>
                </button>
              ))}
            </div>

            <div className="arsenal-layer-details">
              <div className="layer-content-panel">
                <span className="layer-kicker mono">
                  Layer 0{activeLayerIndex + 1}: {group.layers[activeLayerIndex].name}
                </span>
                <div className="layer-items-grid">
                  {group.layers[activeLayerIndex].items.map((item, i) => (
                    <motion.div
                      key={item}
                      className="layer-item-pill"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="pill-dot" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Bento Card (Cards 01, 02, 03) */
        <div className="bento-card-main">
          <div className="bento-icon-container">
            <motion.div
              className="bento-icon-box"
              whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Icon aria-hidden="true" />
            </motion.div>
          </div>

          <div className="bento-card-text">
            <h3 className="bento-card-title">{group.title}</h3>
            <p className="bento-card-desc">{group.description}</p>
          </div>
        </div>
      )}

      {/* Bottom Area: Tool Tag Pills & Stat */}
      <div className="bento-card-footer">
        <motion.div className="bento-tags" initial="hidden" animate="visible">
          {group.tools.map((tool, toolIndex) => (
            <motion.span
              key={tool}
              className="bento-tag"
              custom={toolIndex}
              variants={tagVariants}
              whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2 }}
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>

        {group.stats && (
          <div className="bento-stat">
            <span className="stat-label mono">{group.stats.label}</span>
            <strong className="stat-value">{group.stats.value}</strong>
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default ToolGroupCard
