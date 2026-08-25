import { useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FaDownload } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'
import './About.css'

const About = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

    // 3D Tilt Effect
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 })
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 })

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15])
    const shineX = useTransform(mouseX, [-0.5, 0.5], [0, 100])
    const shineY = useTransform(mouseY, [-0.5, 0.5], [0, 100])

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height

        // Calculate mouse position relative to center of card (-0.5 to 0.5)
        const mouseXPos = (e.clientX - rect.left) / width - 0.5
        const mouseYPos = (e.clientY - rect.top) / height - 0.5

        x.set(mouseXPos)
        y.set(mouseYPos)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <section id="about" className="about section" ref={sectionRef}>
            <div className="container">
                <div className="about-layout">
                    {/* Left - 3D Card */}
                    <motion.div
                        className="card-container"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <motion.div
                            className="id-card-3d"
                            style={{
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d"
                            }}
                        >
                            <div className="card-face">
                                {/* Holographic Shine */}
                                <motion.div
                                    className="card-shine"
                                    style={{
                                        background: useTransform(
                                            [shineX, shineY],
                                            ([latestX, latestY]) =>
                                                `radial-gradient(circle at ${latestX}% ${latestY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
                                        )
                                    }}
                                />

                                {/* Card Content */}
                                <div className="card-top">
                                    <div className="chip"></div>
                                    <div className="signal-icon">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>

                                <div className="typo-avatar-3d">
                                    <span>U</span><span>G</span><span>I</span>
                                </div>

                                <div className="card-details">
                                    <div className="card-name">
                                        <span className="label">NAME</span>
                                        <h3>UGI SUGIMAN R</h3>
                                    </div>
                                    <div className="card-role">
                                        <span className="label">ROLE</span>
                                        <p>SOFTWARE & AI ENGINEER</p>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <span className="card-id mono">ID: 8842-9901-UGI</span>
                                    <div className="card-logo">
                                        <div className="logo-circle"></div>
                                        <div className="logo-circle"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right - Content */}
                    <motion.div
                        className="about-content"
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="section-tag">About Me</span>

                        <h2 className="about-title">
                            STUDENT<span className="dot">.</span><br />
                            <span className="text-stroke">DEVELOPER</span><span className="dot">.</span><br />
                            <span className="text-gradient">AI ENGINEER</span><span className="dot">.</span>
                        </h2>

                        <div className="about-bio">
                            <p>
                                A first-semester student at <strong>University of Logistics and
                                    International Business</strong>, passionate about software engineering
                                and AI development to build innovative solutions.
                            </p>
                            <p>
                                I explore various programming languages to build practical solutions,
                                combining my academic background with technical expertise.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="about-actions">
                            <motion.a
                                href="https://drive.google.com/file/d/1INKbJIG2jzJzQ4g0rr9rxVm2bw4xi3AX/view?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                data-magnetic
                            >
                                <FaDownload /> Download CV
                            </motion.a>
                            <motion.a
                                href="#contact"
                                className="btn btn-outline"
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                data-magnetic
                            >
                                Contact Me <HiArrowRight />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default About
