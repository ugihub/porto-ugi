import { useState, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { FaEnvelope, FaGithub, FaLinkedin, FaPaperPlane, FaCheck, FaInstagram } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import './Contact.css'

const Contact = () => {
    const sectionRef = useRef(null)
    const formRef = useRef()
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    const bgY = useTransform(scrollYProgress, [0, 1], [0, -100])

    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        // REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
        // Get them from https://dashboard.emailjs.com/
        const SERVICE_ID = 'service_vm9k7tv'
        const TEMPLATE_ID = 'template_cfyh1ps'
        const PUBLIC_KEY = 'CZzfNy_lMhjH9Job1'

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then((result) => {
                setIsSubmitting(false)
                setIsSubmitted(true)
                setFormData({ name: '', email: '', message: '' })
                setTimeout(() => {
                    setIsSubmitted(false)
                }, 3000)
            }, (error) => {
                console.log(error.text)
                setIsSubmitting(false)
                setError('Failed to send message. Please try again.')
            })
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.6, 0, 0.1, 1] }
        }
    }

    const slideInLeft = {
        hidden: { opacity: 0, x: -80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.6, 0, 0.1, 1] }
        }
    }

    const slideInRight = {
        hidden: { opacity: 0, x: 80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.6, 0, 0.1, 1] }
        }
    }

    return (
        <section id="contact" className="contact section" ref={sectionRef}>
            <div className="container">
                <motion.div
                    className="contact-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Left - Info */}
                    <motion.div className="contact-info" variants={slideInLeft}>
                        <motion.span
                            className="section-tag"
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.2 }}
                        >
                            Contact
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            LET'S WORK<br />
                            <span className="text-gradient">TOGETHER</span>
                        </motion.h2>

                        <motion.p
                            className="contact-description"
                            variants={fadeInUp}
                        >
                            Have a project in mind or want to collaborate? I'm always open
                            to discussing new opportunities and ideas.
                        </motion.p>

                        <motion.div className="contact-links" variants={fadeInUp}>
                            <motion.a
                                href="mailto:ugisugiman6@gmail.com"
                                className="contact-link"
                                whileHover={{ x: 10, borderColor: 'var(--color-primary)' }}
                            >
                                <FaEnvelope />
                                <span>ugisugiman6@gmail.com</span>
                            </motion.a>
                        </motion.div>

                        <motion.div className="contact-socials" variants={fadeInUp}>
                            <span className="mono">FOLLOW ME</span>
                            <div className="social-line"></div>
                            <div className="social-icons">
                                <motion.a
                                    href="https://github.com/ugihub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, scale: 1.1, backgroundColor: 'var(--color-primary)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaGithub />
                                </motion.a>
                                <motion.a
                                    href="https://www.linkedin.com/in/ugisugimanr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, scale: 1.1, backgroundColor: 'var(--color-primary)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaLinkedin />
                                </motion.a>
                                <motion.a
                                    href="https://www.instagram.com/ugisr_/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, scale: 1.1, backgroundColor: 'var(--color-primary)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaInstagram />
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right - Form */}
                    <motion.form
                        className="contact-form"
                        ref={formRef}
                        onSubmit={handleSubmit}
                        variants={slideInRight}
                    >
                        {['name', 'email', 'message'].map((field, index) => (
                            <motion.div
                                key={field}
                                className="form-group"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                            >
                                <label className="mono">{field.toUpperCase()}</label>
                                {field === 'message' ? (
                                    <motion.textarea
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        placeholder={field === 'name' ? 'Your name' : field === 'email' ? 'your@email.com' : 'Tell me about your project...'}
                                        rows="5"
                                        required
                                        whileFocus={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(255, 61, 0, 0.1)' }}
                                    />
                                ) : (
                                    <motion.input
                                        type={field === 'email' ? 'email' : 'text'}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        placeholder={field === 'name' ? 'Your name' : 'your@email.com'}
                                        required
                                        whileFocus={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(255, 61, 0, 0.1)' }}
                                    />
                                )}
                            </motion.div>
                        ))}

                        {error && (
                            <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '10px' }}>{error}</p>
                        )}

                        <motion.button
                            type="submit"
                            className={`submit-btn ${isSubmitting ? 'submitting' : ''} ${isSubmitted ? 'submitted' : ''}`}
                            disabled={isSubmitting || isSubmitted}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            whileHover={{ scale: 1.02, y: -3, boxShadow: '0 10px 30px rgba(255, 61, 0, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitted ? (
                                <><FaCheck /> MESSAGE SENT</>
                            ) : isSubmitting ? (
                                <><span className="spinner"></span> SENDING...</>
                            ) : (
                                <>SEND MESSAGE <FaPaperPlane /></>
                            )}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </div>

            <motion.div className="bg-number" style={{ y: bgY }}>04</motion.div>
        </section>
    )
}

export default Contact
