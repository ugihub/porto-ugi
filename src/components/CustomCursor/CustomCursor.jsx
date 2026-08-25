import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import './CustomCursor.css'

const CustomCursor = () => {
    const cursorRef = useRef(null)
    const cursorOuterRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)
    const [cursorState, setCursorState] = useState('default') // default, hover, click, text, magnetic
    const [cursorText, setCursorText] = useState('')
    const [magneticTarget, setMagneticTarget] = useState(null)

    // Smooth motion values
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    // Spring configs for smooth following
    const springConfig = { damping: 25, stiffness: 400 }
    const smoothX = useSpring(cursorX, springConfig)
    const smoothY = useSpring(cursorY, springConfig)

    // Outer ring (slower follow)
    const outerSpringConfig = { damping: 20, stiffness: 150 }
    const smoothOuterX = useSpring(cursorX, outerSpringConfig)
    const smoothOuterY = useSpring(cursorY, outerSpringConfig)

    const moveCursor = useCallback((e) => {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
    }, [cursorX, cursorY])

    useEffect(() => {
        // Check for touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        if (isTouchDevice) return

        const handleMouseMove = (e) => {
            setIsVisible(true)
            moveCursor(e)

            // Check for magnetic elements
            const magneticEl = e.target.closest('[data-magnetic]')
            if (magneticEl) {
                const rect = magneticEl.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const deltaX = (e.clientX - centerX) * 0.3
                const deltaY = (e.clientY - centerY) * 0.3

                magneticEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`
                setMagneticTarget(magneticEl)
                setCursorState('magnetic')
            } else if (magneticTarget) {
                magneticTarget.style.transform = ''
                setMagneticTarget(null)
            }
        }

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        const handleMouseDown = () => setCursorState(prev => prev === 'default' ? 'click' : prev)
        const handleMouseUp = () => setCursorState(prev => prev === 'click' ? 'default' : prev)

        // Element hover detection
        const handleElementHover = (e) => {
            const target = e.target

            // Cards, buttons, links
            if (target.closest('.skill-card, .project-item, .award-card, .stat-card, .contact-item, .preset-btn, .service-card')) {
                setCursorState('hover')
                setCursorText('VIEW')
                return
            }

            if (target.closest('a, button, [role="button"]')) {
                setCursorState('hover')
                setCursorText('')
                return
            }

            if (target.closest('input, textarea')) {
                setCursorState('text')
                setCursorText('')
                return
            }

            if (target.closest('h1, h2, h3, p')) {
                setCursorState('text')
                setCursorText('')
                return
            }

            // Reset if not on special element
            if (!target.closest('[data-magnetic]')) {
                setCursorState('default')
                setCursorText('')
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseenter', handleMouseEnter)
        window.addEventListener('mouseleave', handleMouseLeave)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseover', handleElementHover)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseenter', handleMouseEnter)
            window.removeEventListener('mouseleave', handleMouseLeave)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseover', handleElementHover)
        }
    }, [moveCursor, magneticTarget])

    // Cursor size based on state
    const getCursorSize = () => {
        switch (cursorState) {
            case 'hover': return { inner: 8, outer: 80 }
            case 'click': return { inner: 6, outer: 40 }
            case 'text': return { inner: 2, outer: 30 }
            case 'magnetic': return { inner: 10, outer: 100 }
            default: return { inner: 8, outer: 40 }
        }
    }

    const sizes = getCursorSize()

    // Don't render on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return null
    }

    return (
        <>
            {/* Inner dot */}
            <motion.div
                ref={cursorRef}
                className={`cursor-dot ${cursorState}`}
                style={{
                    x: smoothX,
                    y: smoothY,
                    width: sizes.inner,
                    height: sizes.inner,
                }}
                animate={{
                    width: sizes.inner,
                    height: sizes.inner,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
            />

            {/* Outer ring */}
            <motion.div
                ref={cursorOuterRef}
                className={`cursor-ring ${cursorState}`}
                style={{
                    x: smoothOuterX,
                    y: smoothOuterY,
                }}
                animate={{
                    width: sizes.outer,
                    height: sizes.outer,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
            >
                {/* Cursor text */}
                <AnimatePresence>
                    {cursorText && cursorState === 'hover' && (
                        <motion.span
                            className="cursor-text"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            {cursorText}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Spotlight effect */}
            <motion.div
                className="cursor-spotlight"
                style={{
                    x: smoothOuterX,
                    y: smoothOuterY,
                }}
                animate={{
                    opacity: cursorState === 'hover' || cursorState === 'magnetic' ? 0.15 : 0,
                    scale: cursorState === 'hover' || cursorState === 'magnetic' ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Trail effect */}
            <CursorTrail x={smoothX} y={smoothY} isVisible={isVisible && cursorState === 'default'} />
        </>
    )
}

// Cursor trail component
const CursorTrail = ({ x, y, isVisible }) => {
    const trails = Array.from({ length: 5 }, (_, i) => i)

    return (
        <>
            {trails.map((i) => (
                <CursorTrailDot
                    key={i}
                    index={i}
                    isVisible={isVisible}
                    x={x}
                    y={y}
                />
            ))}
        </>
    )
}

const CursorTrailDot = ({ index, isVisible, x, y }) => {
    const trailX = useSpring(x, { damping: 30 - index * 3, stiffness: 200 - index * 20 })
    const trailY = useSpring(y, { damping: 30 - index * 3, stiffness: 200 - index * 20 })

    return (
        <motion.div
            className="cursor-trail"
            style={{
                x: trailX,
                y: trailY,
            }}
            animate={{
                opacity: isVisible ? 0.3 - index * 0.05 : 0,
                scale: 1 - index * 0.15,
            }}
        />
    )
}

export default CustomCursor
