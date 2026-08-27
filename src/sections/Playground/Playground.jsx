import { useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useInView } from 'framer-motion'
import { FiActivity, FiDatabase, FiDollarSign, FiInfo, FiShield } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getLabTab, labTabs } from '../../data/appliedAiLabContent.js'
import { setActiveLab } from '../../features/lab/labSlice.js'
import { MOTION_PRESETS } from './playgroundTokens.js'
import AgentReliabilityGate from './components/AgentReliabilityGate.jsx'
import RagRetrievalInspector from './components/RagRetrievalInspector.jsx'
import TokenCostEstimator from './components/TokenCostEstimator.jsx'
import WarehouseToolCallConsole from './components/WarehouseToolCallConsole.jsx'
import './Playground.css'

const tabIcons = {
  warehouse: FiActivity,
  retrieval: FiDatabase,
  reliability: FiShield,
  estimator: FiDollarSign
}

const Playground = () => {
  const sectionRef = useRef(null)
  const tabListRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const dispatch = useDispatch()
  const activeLab = useSelector((state) => state.lab.activeLab)
  const activeTab = getLabTab(activeLab)
  const [showPremiseMobile, setShowPremiseMobile] = useState(false)

  const content = {
    warehouse: <WarehouseToolCallConsole />,
    retrieval: <RagRetrievalInspector />,
    reliability: <AgentReliabilityGate />,
    estimator: <TokenCostEstimator />
  }[activeTab.id]

  const handleKeyDown = (event, currentIndex) => {
    let nextIndex = null
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % labTabs.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + labTabs.length) % labTabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = labTabs.length - 1
    }

    if (nextIndex !== null) {
      event.preventDefault()
      const targetTab = labTabs[nextIndex]
      dispatch(setActiveLab(targetTab.id))
      const buttons = tabListRef.current?.querySelectorAll('[role="tab"]')
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].focus()
        buttons[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }

  return (
    <section className="playground section" id="playground" ref={sectionRef}>
      <div className="container">
        <motion.header
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="playground-header"
          initial={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <span className="section-tag">Applied AI</span>
            <h2>AI<br /><span className="text-gradient">LAB</span></h2>
          </div>
          <div className="playground-header-info">
            <p className="playground-desc mono">
              Inspectable, local-first demonstrations of tool calling, retrieval, reliability, and cost planning.
            </p>
            {activeTab.premise && (
              <div className="playground-premise-chip desktop-only">
                <span className="premise-dot" />
                <span>Technical Premise: <strong>{activeTab.premise}</strong></span>
              </div>
            )}
          </div>
        </motion.header>

        <div className="playground-tab-scroll" tabIndex={0} aria-label="Scrollable lab navigation">
          <motion.nav
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            aria-label="Applied AI labs"
            className="playground-tabs"
            initial={{ opacity: 0, y: 20 }}
            ref={tabListRef}
            role="tablist"
            transition={{ delay: 0.12, duration: 0.45 }}
          >
            {labTabs.map((tab, index) => {
              const Icon = tabIcons[tab.id]
              const isActive = activeLab === tab.id
              return (
                <button
                  aria-controls={`lab-panel-${tab.id}`}
                  aria-selected={isActive}
                  className={`playground-tab ${isActive ? 'active' : ''}`}
                  id={`lab-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => dispatch(setActiveLab(tab.id))}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  {isActive && (
                    <motion.span
                      className="playground-tab-pill"
                      layoutId="activeTabBadge"
                      transition={MOTION_PRESETS.micro}
                    />
                  )}
                  <Icon className="tab-icon" />
                  <span className="tab-label">{tab.label}</span>
                </button>
              )
            })}
          </motion.nav>
        </div>

        {/* Mobile Technical Premise Accordion */}
        <div className="mobile-premise-toggle mobile-only">
          <button
            aria-expanded={showPremiseMobile}
            className="premise-btn"
            onClick={() => setShowPremiseMobile((prev) => !prev)}
            type="button"
          >
            <FiInfo />
            <span>Premise: <strong>{activeTab.premise}</strong></span>
          </button>
        </div>

        <MotionConfig reducedMotion="user">
          <div
            aria-labelledby={`lab-tab-${activeTab.id}`}
            className="playground-content"
            id={`lab-panel-${activeTab.id}`}
            role="tabpanel"
          >
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: 10 }}
                key={activeTab.id}
                transition={MOTION_PRESETS.card}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </MotionConfig>
      </div>
    </section>
  )
}

export default Playground
