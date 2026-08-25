import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { FaGithub, FaLinkedin, FaFileDownload, FaInstagram } from 'react-icons/fa'
import { HiArrowDown } from 'react-icons/hi'
import './Hero.css'

const Hero = () => {
    const titleRef = useRef(null)
    const containerRef = useRef(null)
    const [typedText, setTypedText] = useState('')
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0)

    const roles = ['Software Engineer', 'AI Engineer', 'Developer', 'Student']

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [0, 200])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

    // Typewriter effect
    useEffect(() => {
        const currentRole = roles[currentRoleIndex]
        let charIndex = 0
        let isDeleting = false
        let timeout

        const type = () => {
            if (!isDeleting) {
                if (charIndex <= currentRole.length) {
                    setTypedText(currentRole.substring(0, charIndex))
                    charIndex++
                    timeout = setTimeout(type, 100)
                } else {
                    timeout = setTimeout(() => {
                        isDeleting = true
                        type()
                    }, 2000)
                }
            } else {
                if (charIndex > 0) {
                    charIndex--
                    setTypedText(currentRole.substring(0, charIndex))
                    timeout = setTimeout(type, 50)
                } else {
                    isDeleting = false
                    setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
                }
            }
        }

        type()
        return () => clearTimeout(timeout)
    }, [currentRoleIndex])

    useEffect(() => {
        const title = titleRef.current
        if (!title) return

        const lines = title.querySelectorAll('.title-line')

        gsap.fromTo(
            lines,
            { y: 120, opacity: 0, skewY: 7 },
            {
                y: 0,
                opacity: 1,
                skewY: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out',
                delay: 0.3
            }
        )
    }, [])

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section id="hero" className="hero" ref={containerRef}>
            <div className="hero-grid-bg"></div>

            <motion.div className="corner-label top-left" style={{ opacity }}>
                <span className="mono">UGI SUGIMAN R</span>
            </motion.div>
            <motion.div className="corner-label top-right" style={{ opacity }}>
                <span className="mono">PORTFOLIO 2025</span>
            </motion.div>

            <motion.div className="hero-content container" style={{ y, opacity, scale }}>
                {/* Role Tag with Typewriter */}
                <motion.div
                    className="role-tag"
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <span className="tag-line"></span>
                    <span className="mono typewriter">
                        {typedText}<span className="cursor-blink">|</span>
                    </span>
                </motion.div>

                {/* Main Title */}
                <h1 ref={titleRef} className="hero-title">
                    <div className="title-line">
                        <span className="title-word">Software &</span>
                    </div>
                    <div className="title-line">
                        <span className="title-word text-stroke">Artificial</span>
                    </div>
                    <div className="title-line">
                        <span className="title-word text-stroke">Intelligence</span>
                    </div>
                    <div className="title-line">
                        <span className="title-word"><span className="text-gradient">Engineer</span></span>
                    </div>
                </h1>

                {/* Description */}
                <motion.div
                    className="hero-info"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <p className="hero-description">
                        student at <strong>University of Logistics & International Business</strong>.
                        Passionate about software engineering, AI development, and building practical solutions.
                    </p>

                    <div className="hero-meta">
                        <div className="meta-item">
                            <span className="meta-label mono">LOCATION</span>
                            <span className="meta-value">Indonesia</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label mono">STATUS</span>
                            <span className="meta-value status-available">
                                <span className="status-dot"></span>
                                Available for work
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="hero-cta"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <motion.a
                        href="#projects"
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        data-magnetic
                    >
                        View Projects
                    </motion.a>
                    <motion.a
                        href="https://drive.google.com/file/d/1INKbJIG2jzJzQ4g0rr9rxVm2bw4xi3AX/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        data-magnetic
                    >
                        <FaFileDownload /> Download CV
                    </motion.a>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    className="hero-socials"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                >
                    <span className="mono">CONNECT</span>
                    <div className="social-line"></div>
                    <div className="social-links">
                        <motion.a
                            href="https://github.com/ugihub"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -5, scale: 1.1 }}
                            data-magnetic
                        >
                            <FaGithub />
                        </motion.a>
                        <motion.a
                            href="https://www.linkedin.com/in/ugisugimanr"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -5, scale: 1.1 }}
                            data-magnetic
                        >
                            <FaLinkedin />
                        </motion.a>
                        <motion.a
                            href="https://www.instagram.com/ugisr_/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -5, scale: 1.1 }}
                            data-magnetic
                        >
                            <FaInstagram />
                        </motion.a>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.button
                className="scroll-indicator"
                onClick={scrollToAbout}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                style={{ opacity }}
            >
                <span className="mono">SCROLL</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <HiArrowDown />
                </motion.div>
            </motion.button>

            <motion.div
                className="bg-number"
                style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
            >
                01
            </motion.div>
        </section>
    )
}

export default Hero
