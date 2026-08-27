import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import {
  FaAward,
  FaBrain,
  FaCheck,
  FaCubes,
  FaGithub,
  FaInfoCircle,
  FaShieldAlt
} from 'react-icons/fa'
import { FiArrowRight, FiArrowUpRight, FiHelpCircle, FiMapPin } from 'react-icons/fi'

/* --------------------------------------------------------------------------
   Bento Shared Primitives
   -------------------------------------------------------------------------- */

const PillArrow = ({ label, href, external = false, tone = 'dark' }) => {
  return (
    <a
      className={`pill-arrow pill-arrow--${tone}`}
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <span className="pill-arrow-label">{label}</span>
      <span className="pill-arrow-disc">
        {external ? <FiArrowUpRight /> : <FiArrowRight />}
      </span>
    </a>
  )
}

const BadgeDisc = ({ icon: Icon = FaAward, text = 'SHIP', tone = 'dark' }) => {
  return (
    <div className={`badge-disc badge-disc--${tone}`} title={text}>
      <Icon className="badge-disc-icon" />
    </div>
  )
}

const InfoPopover = ({ explanation, accent = 'cyan', tone = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)
  const popoverRef = useRef(null)

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
      className="bento-info-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={popoverRef}
    >
      <button
        aria-expanded={isOpen}
        aria-label={`Details about ${explanation.title}`}
        className={`bento-info-trigger bento-info-trigger--${tone} ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <FiHelpCircle />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`bento-info-popover bento-popover--${accent}`}
            exit={{ opacity: 0, scale: 0.94, y: -6 }}
            initial={{ opacity: 0, scale: 0.94, y: -6 }}
            role="tooltip"
            transition={{ duration: 0.18 }}
          >
            <div className="bento-popover-header">
              <FaInfoCircle className="popover-icon" />
              <strong>{explanation.title}</strong>
            </div>
            <p className="bento-popover-desc">{explanation.purpose}</p>
            <ul className="bento-popover-list">
              {explanation.highlights.map((item, i) => (
                <li key={i}>
                  <FaCheck className="check-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* --------------------------------------------------------------------------
   5 Bento Card Variant Renderers
   -------------------------------------------------------------------------- */

/* CARD 01: Cyan Filled Poster Card (Top-Left) */
const BentoHeadlineCard = ({ group }) => {
  return (
    <div className="bento-inner bento-inner--headline">
      <div className="callout-dashed-box callout-dashed-box--cyan">
        <div className="bento-card-topbar">
          <BadgeDisc icon={FaBrain} text="MODEL" tone="cyan" />
          <InfoPopover accent={group.accent} explanation={group.explanation} tone="dark" />
        </div>

        <div className="bento-headline-body">
          <h3 className="poster-headline poster-headline--ink">
            <span className="poster-lead">{group.headline.lead}</span>{' '}
            <span className="poster-accent--inverted-cyan">
              {group.headline.accentWord}
            </span>
          </h3>
          <p className="bento-subtext bento-subtext--ink">{group.sub}</p>
        </div>

        <div className="bento-card-bottom-clean">
          <div className="bento-tags-mid">
            {group.tools.map((tool) => (
              <span className="bento-tag-item bento-tag-item--cyan mono" key={tool}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* CARD 02: Emerald Filled Stat Card (Top-Middle) */
const BentoStatCard = ({ group }) => {
  return (
    <div className="bento-inner bento-inner--stat">
      <div className="callout-dashed-box callout-dashed-box--emerald">
        <div className="bento-card-topbar">
          <BadgeDisc icon={FaShieldAlt} text="GUARD" tone="emerald" />
          <InfoPopover accent={group.accent} explanation={group.explanation} tone="dark" />
        </div>

        <div className="bento-stat-body">
          <div className="stat-giant-wrap">
            <span className="stat-giant-number stat-giant-number--ink">
              {group.stat.value}
            </span>
            <span className="stat-giant-unit stat-giant-unit--ink">{group.stat.unit}</span>
          </div>
          <p className="bento-stat-line bento-stat-line--ink">{group.line}</p>
        </div>

        <div className="bento-card-bottom-clean">
          <div className="bento-tags-mid">
            {group.tools.map((tool) => (
              <span className="bento-tag-item bento-tag-item--emerald mono" key={tool}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* CARD 03: Volt / Amber Full Filled Card (Bottom-Middle) */
const BentoVoltCard = ({ group }) => {
  return (
    <div className="bento-inner bento-inner--volt">
      <div className="callout-dashed-box callout-dashed-box--volt">
        <div className="bento-card-topbar">
          <BadgeDisc icon={FaCubes} text={group.badge?.text || 'SHIP'} tone="volt" />
          <InfoPopover accent="amber" explanation={group.explanation} tone="dark" />
        </div>

        <div className="bento-volt-body">
          <div className="poster-headline-block">
            <span className="poster-line-1">{group.headline.lead}</span>
            <span className="poster-line-2-badge">{group.headline.accentWord}</span>
          </div>
          <p className="bento-subtext bento-subtext--ink">{group.sub}</p>
        </div>

        <div className="bento-card-bottom-clean">
          <div className="bento-tags-mid">
            {group.tools.map((tool) => (
              <span className="bento-tag-item bento-tag-item--volt mono" key={tool}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* CARD 04: Coral Full Filled GitHub Card (Bottom-Left) */
const BentoCalloutCard = ({ group }) => {
  return (
    <div className="bento-inner bento-inner--callout">
      <div className="callout-dashed-box callout-dashed-box--coral">
        <div className="bento-card-topbar">
          <div className="github-handle-tag">
            <FaGithub className="github-tag-ico" />
            <span className="mono">{group.handle}</span>
          </div>
          <InfoPopover accent="coral" explanation={group.explanation} tone="light" />
        </div>

        <div className="bento-callout-body">
          <h3 className="poster-headline poster-headline--paper">
            <span className="poster-lead">{group.headline.lead}</span>{' '}
            <span className="poster-accent--volt">{group.headline.accentWord}</span>
          </h3>

          <div className="callout-metrics-grid">
            {group.stats.map((st) => (
              <div className="callout-stat-col" key={st.label}>
                <strong className="callout-stat-val mono">{st.value}</strong>
                <span className="callout-stat-lbl">{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card-bottom">
          <PillArrow
            external={group.cta.external}
            href={group.cta.href}
            label={group.cta.label}
            tone="light"
          />
        </div>
      </div>
    </div>
  )
}

/* CARD 05: Tech Arsenal Real Highway Road with Balanced Speech Bubble Message Cards */
const BentoArsenalCard = ({ group }) => {
  const [activeCategory, setActiveCategory] = useState(group.categories[0].id)

  return (
    <div className="bento-inner bento-inner--arsenal">
      {/* Background Highway Road Map SVG */}
      <svg
        aria-hidden="true"
        className="arsenal-map-svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 140"
      >
        <defs>
          <radialGradient id="mapDistrict1" cx="30%" cy="55%" r="40%">
            <stop offset="0%" stopColor="#7c4dff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7c4dff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mapDistrict2" cx="70%" cy="85%" r="45%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Topographic Gradient Backgrounds */}
        <circle cx="35" cy="65" fill="url(#mapDistrict1)" r="32" />
        <circle cx="68" cy="95" fill="url(#mapDistrict2)" r="38" />

        {/* City/Topographic Grid Lines */}
        <g className="map-grid-layer">
          <line className="map-grid-line" x1="10" x2="90" y1="38" y2="38" />
          <line className="map-grid-line" x1="10" x2="90" y1="64" y2="64" />
          <line className="map-grid-line" x1="10" x2="90" y1="90" y2="90" />
          <line className="map-grid-line" x1="10" x2="90" y1="116" y2="116" />
          <line className="map-grid-line" x1="20" x2="20" y1="30" y2="135" />
          <line className="map-grid-line" x1="50" x2="50" y1="30" y2="135" />
          <line className="map-grid-line" x1="80" x2="80" y1="30" y2="135" />
        </g>

        {/* Layer 1: Road Bed / Asphalt Border */}
        <polyline
          className="map-road-border"
          points="18,38 50,52 82,38 78,64 50,78 22,64 18,90 50,104 82,90 78,116 50,130 22,116"
        />

        {/* Layer 2: Asphalt Surface */}
        <polyline
          className="map-road-asphalt"
          points="18,38 50,52 82,38 78,64 50,78 22,64 18,90 50,104 82,90 78,116 50,130 22,116"
        />

        {/* Layer 3: Dashed Roadway Center Markings */}
        <polyline
          className="map-road-marking"
          points="18,38 50,52 82,38 78,64 50,78 22,64 18,90 50,104 82,90 78,116 50,130 22,116"
        />

        {/* Interactive Highway Waypoints with Balanced Speech Bubble Message Cards */}
        {group.categories.flatMap((cat) =>
          cat.waypoints.map((wp) => {
            const isCatActive = cat.id === activeCategory
            const placement = wp.placement || 'top'
            const textWidth = wp.label.length * 1.8 + 4
            const cardW = Math.max(textWidth, 12)
            const cardH = 5.2

            let bubblePath = ''
            let textX = 0
            let textY = 0

            if (placement === 'bottom') {
              // Bubble sits BELOW the checkpoint node (pointer tip at 0, 0)
              const bX = -cardW / 2
              const bY = 4
              bubblePath = `M 0,0 L 2.2,${bY} L ${bX + cardW - 1},${bY} Q ${bX + cardW},${bY} ${bX + cardW},${bY + 1} L ${bX + cardW},${bY + cardH - 1} Q ${bX + cardW},${bY + cardH} ${bX + cardW - 1},${bY + cardH} L ${bX + 1},${bY + cardH} Q ${bX},${bY + cardH} ${bX},${bY + cardH - 1} L ${bX},${bY + 1} Q ${bX},${bY} ${bX + 1},${bY} L -2.2,${bY} Z`
              textX = 0
              textY = bY + cardH / 2
            } else {
              // Bubble sits ABOVE the checkpoint node (pointer tip at 0, 0)
              const bX = -cardW / 2
              const bY = -cardH - 4
              bubblePath = `M 0,0 L -2.2,${bY + cardH} L ${bX + 1},${bY + cardH} Q ${bX},${bY + cardH} ${bX},${bY + cardH - 1} L ${bX},${bY + 1} Q ${bX},${bY} ${bX + 1},${bY} L ${bX + cardW - 1},${bY} Q ${bX + cardW},${bY} ${bX + cardW},${bY + 1} L ${bX + cardW},${bY + cardH - 1} Q ${bX + cardW},${bY + cardH} ${bX + cardW - 1},${bY + cardH} L 2.2,${bY + cardH} Z`
              textX = 0
              textY = bY + cardH / 2
            }

            return (
              <g
                className={`map-waypoint-group ${isCatActive ? 'active' : 'dimmed'}`}
                key={`${cat.id}-${wp.label}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveCategory(cat.id)
                }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  setActiveCategory(cat.id)
                }}
                style={{ cursor: 'pointer' }}
                transform={`translate(${wp.x}, ${wp.y})`}
              >
                {/* Large transparent click hit circle */}
                <circle cx="0" cy="0" fill="transparent" r="16" />

                {/* Radar Pulse on Active Checkpoint */}
                {isCatActive && (
                  <circle
                    className="map-checkpoint-radar"
                    r="6.5"
                  />
                )}

                {/* Outer Checkpoint Rim / Base */}
                <circle
                  className="map-checkpoint-rim"
                  cx="0"
                  cy="0"
                  r={isCatActive ? '4.2' : '3'}
                />

                {/* Core Colored Waypoint Dot */}
                <circle
                  className={`map-checkpoint-core dot--${cat.accent}`}
                  cx="0"
                  cy="0"
                  r={isCatActive ? '2.8' : '1.8'}
                />

                {/* Speech Bubble Pointer Message Card */}
                <g className="waypoint-speech-bubble">
                  {/* Pointing Bubble Body Path */}
                  <path
                    className={`speech-bubble-shape ${isCatActive ? 'active' : ''}`}
                    d={bubblePath}
                  />
                  {/* Label Text Centered in Bubble */}
                  <text
                    className={`speech-bubble-text ${isCatActive ? 'active' : ''}`}
                    dominantBaseline="central"
                    textAnchor="middle"
                    x={textX}
                    y={textY}
                  >
                    {wp.label}
                  </text>
                </g>
              </g>
            )
          })
        )}
      </svg>

      {/* Overlay Content */}
      <div className="arsenal-overlay-content">
        <div className="arsenal-top-section">
          <div className="bento-card-topbar">
            <div className="arsenal-header-tag">
              <FiMapPin className="map-pin-ico" />
              <span className="mono">{group.routeLine}</span>
            </div>
            <InfoPopover accent={group.accent} explanation={group.explanation} tone="light" />
          </div>

          {/* Category Selector Pills positioned securely above the roadmap canvas */}
          <div aria-label="Arsenal layers" className="arsenal-filter-pills" role="tablist">
            {group.categories.map((cat) => {
              const isActive = cat.id === activeCategory
              return (
                <button
                  aria-selected={isActive}
                  className={`category-filter-pill pill--${cat.accent} ${isActive ? 'active' : ''}`}
                  key={cat.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveCategory(cat.id)
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                  }}
                  role="tab"
                  type="button"
                >
                  <span className="cat-dot" />
                  <span className="mono">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Center Canvas Area: Open & Clean */}
        <div className="arsenal-map-center-space" />
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Master ToolGroupCard Component
   -------------------------------------------------------------------------- */

const ToolGroupCard = ({ group, index }) => {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), {
    stiffness: 260,
    damping: 24
  })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 260,
    damping: 24
  })

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

  const renderCardBody = () => {
    switch (group.variant) {
      case 'headline':
        return <BentoHeadlineCard group={group} />
      case 'stat':
        return <BentoStatCard group={group} />
      case 'volt':
        return <BentoVoltCard group={group} />
      case 'callout':
        return <BentoCalloutCard group={group} />
      case 'arsenal':
        return <BentoArsenalCard group={group} />
      default:
        return <BentoHeadlineCard group={group} />
    }
  }

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={`bento-card bento-card--${group.variant} bento-area--${group.area}`}
      initial={{ opacity: 0, y: 28 }}
      onPointerLeave={resetTilt}
      onPointerMove={handlePointerMove}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {renderCardBody()}
    </motion.article>
  )
}

export default ToolGroupCard
