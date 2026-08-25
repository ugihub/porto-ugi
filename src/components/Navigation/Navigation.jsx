import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaPalette } from 'react-icons/fa'
import './Navigation.css'

const Navigation = ({ onOpenCustomizer }) => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')

    const navLinks = [
        { id: 'hero', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Work' },
        { id: 'playground', label: 'Playground' },
        { id: 'contact', label: 'Contact' }
    ]

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)

            const sections = navLinks.map(link => document.getElementById(link.id))
            const scrollPosition = window.scrollY + window.innerHeight / 3

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i]
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(navLinks[i].id)
                    break
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            <motion.nav
                className={`navigation ${isScrolled ? 'scrolled' : ''}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
            >
                <div className="nav-container">
                    {/* Logo */}
                    <motion.div className="logo" whileHover={{ scale: 1.02 }} data-magnetic>
                        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
                            <span className="logo-text">UGI<span className="logo-dot">.</span></span>
                        </a>
                    </motion.div>

                    {/* Desktop Nav */}
                    <div className="nav-links-desktop">
                        {navLinks.map((link, index) => (
                            <motion.button
                                key={link.id}
                                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                                onClick={() => scrollToSection(link.id)}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                            >
                                <span className="link-number mono">0{index + 1}</span>
                                <span className="link-text">{link.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="nav-actions">
                        <motion.button
                            className="customize-btn"
                            onClick={onOpenCustomizer}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-magnetic
                        >
                            <FaPalette />
                        </motion.button>

                        <motion.a
                            href="https://drive.google.com/file/d/1INKbJIG2jzJzQ4g0rr9rxVm2bw4xi3AX/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-cta mono"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            data-magnetic
                        >
                            RESUME
                        </motion.a>

                        <motion.button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.4, ease: [0.7, 0, 0.3, 1] }}
                    >
                        <div className="mobile-menu-content">
                            {navLinks.map((link, index) => (
                                <motion.button
                                    key={link.id}
                                    className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
                                    onClick={() => scrollToSection(link.id)}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.08 }}
                                >
                                    <span className="link-number mono">0{index + 1}</span>
                                    <span className="link-label">{link.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navigation
