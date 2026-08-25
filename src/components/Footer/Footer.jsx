import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaHeart, FaInstagram } from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'
import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>UGI SUGIMAN R</h3>
                        <p>Software & AI Engineer based in Indonesia.</p>
                    </div>

                    <div className="footer-links">
                        <a href="#hero">Home</a>
                        <a href="#about">About</a>
                        <a href="#projects">Projects</a>
                        <a href="#contact">Contact</a>
                    </div>

                    <div className="footer-socials">
                        <motion.a
                            href="https://github.com/ugihub"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3 }}
                        >
                            <FaGithub />
                        </motion.a>
                        <motion.a
                            href="https://www.linkedin.com/in/ugisugimanr"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3 }}
                        >
                            <FaLinkedin />
                        </motion.a>
                        <motion.a
                            href="https://www.instagram.com/ugisr_/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3 }}
                        >
                            <FaInstagram />
                        </motion.a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="mono">
                        © {currentYear} UGI SUGIMAN R. ALL RIGHTS RESERVED.
                    </p>
                    <p className="made-with">
                        Made with <FaHeart className="heart" /> in Indonesia
                    </p>
                </div>
            </div>

            {/* Floating Back to Top Button */}
            <motion.button
                className="back-to-top"
                onClick={scrollToTop}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                data-magnetic
            >
                <HiArrowUp />
            </motion.button>
        </footer>
    )
}

export default Footer
