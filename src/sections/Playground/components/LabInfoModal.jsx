import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiHelpCircle, FiInfo } from 'react-icons/fi'
import { getLabTab } from '../../../data/appliedAiLabContent.js'
import { MOTION_PRESETS } from '../playgroundTokens.js'

const LabInfoModal = ({ tabId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)
  const popoverRef = useRef(null)
  const tab = getLabTab(tabId)
  const explanation = tab?.explanation

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 180)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('pointerdown', handleClickOutside)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handleClickOutside)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isOpen])

  if (!explanation) return null

  return (
    <div
      className="lab-info-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={popoverRef}
    >
      <button
        aria-describedby={`popover-${tabId}`}
        aria-expanded={isOpen}
        aria-label={`Inspect ${tab.label} technical details`}
        className={`lab-info-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        type="button"
      >
        <FiHelpCircle className="info-icon" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="lab-popover"
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            id={`popover-${tabId}`}
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            role="tooltip"
            transition={MOTION_PRESETS.micro}
          >
            <div className="popover-header">
              <span className="popover-badge">{explanation.badge}</span>
              <h4 className="popover-title">{explanation.title}</h4>
            </div>

            <div className="popover-body">
              <div className="popover-section">
                <span className="popover-section-label">
                  <FiInfo className="sec-icon" /> Purpose
                </span>
                <p className="popover-text">{explanation.purpose}</p>
              </div>

              <div className="popover-section">
                <span className="popover-section-label">Pipeline Steps</span>
                <ul className="popover-steps-list">
                  {explanation.workflow.map((item, index) => {
                    const [heading, ...rest] = item.split(': ')
                    return (
                      <li key={index}>
                        <strong>{heading}:</strong> {rest.join(': ')}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="popover-takeaway">
                <span className="takeaway-tag">
                  <FiCheck /> Core Takeaway
                </span>
                <p className="takeaway-p">{explanation.takeaway}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LabInfoModal
