import { useState, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { FaExternalLinkAlt, FaGithub, FaTimes, FaTrophy, FaMedal, FaAward, FaCertificate, FaHtml5, FaCss3Alt, FaJs, FaPhp, FaReact, FaNodeJs, FaJava, FaDownload } from 'react-icons/fa'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { SiGreensock, SiFramer, SiSolana } from 'react-icons/si'
import Sertifikat1 from '../../assets/Sertifikat1.jpg'
import Sertifikat2 from '../../assets/Sertifikat2.png'
import Sertifikat3 from '../../assets/Sertifikat3.png'
import './Projects.css'

const Projects = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
    const [activeTab, setActiveTab] = useState('projects')
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedCertificate, setSelectedCertificate] = useState(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    const bgY = useTransform(scrollYProgress, [0, 1], [0, -150])

    // Data - Projects
    const projects = [
        { id: 1, title: 'UIPiece', subtitle: 'Web Development', description: 'A responsive website built with HTML, CSS, and PHP.', tech: ['HTML', 'CSS', 'PHP'], githubUrl: 'https://github.com/ugihub/uipiece', liveUrl: null, year: '2024', featured: true },
        { id: 2, title: 'InfinitySnake', subtitle: 'Game Development', description: 'Classic Snake game reimagined with infinite gameplay mechanics.', tech: ['Java', 'Greenfoot'], githubUrl: 'https://github.com/ugihub/InfinitySnake', liveUrl: null, year: '2024', featured: true },
        { id: 3, title: 'Portfolio AI', subtitle: 'Web Development', description: 'A responsive portfolio website with modern animations.', tech: ['HTML', 'CSS', 'JavaScript'], githubUrl: 'https://github.com/ugihub/portofolioAI', liveUrl: null, year: '2024', featured: false },
        { id: 4, title: 'Finance Web', subtitle: 'Web Application', description: 'Personal finance tracker to record expenses.', tech: ['HTML', 'CSS', 'JavaScript'], githubUrl: 'https://github.com/ugihub/financeWeb', liveUrl: null, year: '2024', featured: true },
        { id: 5, title: 'Maze Game', subtitle: 'Game Development', description: '3D maze exploration game built with Alice3.', tech: ['Alice3', 'Java'], githubUrl: 'https://github.com/ugihub/MazeGameAlice3', liveUrl: null, year: '2024', featured: false },
        { id: 6, title: 'ToDo App', subtitle: 'Web Application', description: 'Activity tracker and task management app.', tech: ['HTML', 'CSS', 'JavaScript'], githubUrl: 'https://github.com/ugihub/ToDoApp', liveUrl: null, year: '2024', featured: false },
        { id: 7, title: 'Kinkoffie', subtitle: 'Commercial Website', description: 'Professional website for Kinkoffie coffee shop.', tech: ['HTML', 'CSS', 'JavaScript'], githubUrl: null, liveUrl: 'https://kinkoffie.netlify.app', year: '2024', featured: true },
        { id: 8, title: 'Solana dApp', subtitle: 'Blockchain Development', description: 'Decentralized app using Solana blockchain.', tech: ['Solana', 'JavaScript', 'Web3'], githubUrl: 'https://github.com/ugihub/dapps-transaction-solana', liveUrl: null, year: '2024', featured: true }
    ]

    // Data - Awards/Certificates
    const awards = [
        { id: 1, title: 'Head of Secretary', organization: 'Scout SMAN 6 Cirebon', year: '2023 - 2024', icon: <FaTrophy />, description: 'Head of secretary in SMAN 6 Cirebon Scout Organization.', credentialUrl: 'https://drive.google.com/file/d/1lXprDQZuU9R50iefhy3Atx8yFBibd6fT/view?usp=sharing', image: Sertifikat1 },
        { id: 2, title: 'Java Fundamentals', organization: 'Oracle Academy', year: '2024', icon: <FaMedal />, description: 'Learning all Java Fundamentals in Fundamentals course.', credentialUrl: 'https://drive.google.com/file/d/1XQG1mabRbhcvmVsBrUSWpNH_9rhqbrF2/view?usp=sharing', image: Sertifikat2 },
        { id: 3, title: 'IT Webinar', organization: 'Berkemah ID', year: '2024', icon: <FaAward />, description: 'Webinar of IT profesional career in an era of massive technological progress.', credentialUrl: 'https://drive.google.com/file/d/1IP_WyTstkMl29-Jr-10E-LlmU8HbZywW/view?usp=sharing', image: Sertifikat3 }
    ]

    // Data - Tech Stack (Expanded)
    const skills = [
        { name: 'HTML', icon: <FaHtml5 />, level: 90 },
        { name: 'CSS', icon: <FaCss3Alt />, level: 85 },
        { name: 'JavaScript', icon: <FaJs />, level: 80 },
        { name: 'PHP', icon: <FaPhp />, level: 75 },
        { name: 'React', icon: <FaReact />, level: 70 },
        { name: 'Node.js', icon: <FaNodeJs />, level: 65 },
        { name: 'Java', icon: <FaJava />, level: 70 },
        { name: 'Solana', icon: <SiSolana />, level: 50 },
        { name: 'Framer', icon: <SiFramer />, level: 80 },
        { name: 'GSAP', icon: <SiGreensock />, level: 75 },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    return (
        <section id="projects" className="projects section" ref={sectionRef}>
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="projects-header"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <div className="header-left">
                        <span className="section-tag">Portfolio</span>
                        <h2>
                            SELECTED<br />
                            <span className="text-gradient">WORKS</span>
                        </h2>
                    </div>

                    {/* Tab Navigation */}
                    <div className="tab-toggle">
                        <button
                            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                            onClick={() => setActiveTab('projects')}
                        >
                            <span className="tab-count">{projects.length}</span>
                            <span className="mono">PROJECTS</span>
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tools')}
                        >
                            <span className="tab-count">{skills.length}</span>
                            <span className="mono">TOOLS</span>
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
                            onClick={() => setActiveTab('certificates')}
                        >
                            <span className="tab-count">{awards.length}</span>
                            <span className="mono">CERTIFICATES</span>
                        </button>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="projects-content">
                    <AnimatePresence mode="wait">
                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                className="projects-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {projects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        className="project-card"
                                        variants={itemVariants}
                                        whileHover={{ y: -10 }}
                                        onClick={() => setSelectedProject(project)}
                                        layoutId={`card-${project.id}`}
                                    >
                                        <div className="card-inner">
                                            <div className="card-content">
                                                <div className="card-meta">
                                                    <span className="mono">{project.subtitle}</span>
                                                    <span className="card-year">{project.year}</span>
                                                </div>
                                                <motion.h3 layoutId={`title-${project.id}`}>{project.title}</motion.h3>
                                                <p>{project.description}</p>
                                                <div className="tech-tags">
                                                    {project.tech.map(t => (
                                                        <span key={t} className="tech-tag">{t}</span>
                                                    ))}
                                                </div>
                                                <p className="click-hint mono">Click for details</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'tools' && (
                            <motion.div
                                key="tools"
                                className="skills-grid-b"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {skills.map((skill) => (
                                    <motion.div
                                        key={skill.name}
                                        className="skill-card-b"
                                        variants={itemVariants}
                                        whileHover={{ y: -5, borderColor: 'var(--color-primary)' }}
                                    >
                                        <div className="skill-icon-b">{skill.icon}</div>
                                        <div className="skill-info">
                                            <h4>{skill.name}</h4>
                                            <div className="skill-progress-bg">
                                                <motion.div
                                                    className="skill-progress-fill"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.level}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'certificates' && (
                            <motion.div
                                key="certificates"
                                className="awards-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {awards.map((award) => (
                                    <motion.div
                                        key={award.id}
                                        className="award-card"
                                        variants={itemVariants}
                                        whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        onClick={() => setSelectedCertificate(award)}
                                        layoutId={`cert-${award.id}`}
                                    >
                                        <div className="award-icon">{award.icon}</div>
                                        <div className="award-content">
                                            <motion.h4 layoutId={`cert-title-${award.id}`}>{award.title}</motion.h4>
                                            <p className="award-org">{award.organization} • {award.year}</p>
                                            <p className="award-desc">{award.description}</p>
                                        </div>
                                        <div className="award-arrow"><HiArrowNarrowRight /></div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            className="modal-content"
                            layoutId={`card-${selectedProject.id}`}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <button className="close-modal-btn" onClick={() => setSelectedProject(null)}>
                                <FaTimes />
                            </button>

                            <div className="modal-image-placeholder" style={{
                                height: '250px',
                                background: 'linear-gradient(135deg, var(--color-surface), var(--color-bg))',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid var(--color-glass-border)'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0.1,
                                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}></div>
                                <span style={{ fontSize: '5rem', opacity: 0.2, color: 'var(--color-primary)' }}>
                                    <FaGithub />
                                </span>
                            </div>

                            <div className="modal-body">
                                <span className="modal-subtitle mono">{selectedProject.subtitle} • {selectedProject.year}</span>
                                <motion.h3 layoutId={`title-${selectedProject.id}`}>{selectedProject.title}</motion.h3>

                                <p className="modal-desc">
                                    {selectedProject.description}
                                    <br /><br />
                                    This project demonstrates advanced concepts in {selectedProject.tech[0]} development.
                                    Features include responsive design, interactive UI components, and optimized performance.
                                </p>

                                <div className="tech-stack-modal">
                                    <span className="mono" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '15px' }}>// TECH STACK</span>
                                    <div className="tech-tags">
                                        {selectedProject.tech.map(t => (
                                            <span key={t} className="tech-tag" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-primary)' }}>{t}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-links">
                                    {selectedProject.githubUrl && (
                                        <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                                            <FaGithub /> GitHub Repo
                                        </a>
                                    )}
                                    {selectedProject.liveUrl && (
                                        <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                                            <FaExternalLinkAlt /> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Certificate Modal */}
            <AnimatePresence>
                {selectedCertificate && (
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedCertificate(null)}
                    >
                        <motion.div
                            className="modal-content"
                            layoutId={`cert-${selectedCertificate.id}`}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ maxWidth: '600px' }}
                        >
                            <button className="close-modal-btn" onClick={() => setSelectedCertificate(null)}>
                                <FaTimes />
                            </button>

                            <div className="modal-image-placeholder cert-image" style={{
                                height: '300px',
                                background: '#111',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid var(--color-glass-border)',
                                overflow: 'hidden'
                            }}>
                                {selectedCertificate.image !== 'placeholder' ? (
                                    <img
                                        src={selectedCertificate.image}
                                        alt={selectedCertificate.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <>
                                        <span style={{ fontSize: '5rem', opacity: 0.5, color: '#333' }}>
                                            <FaCertificate />
                                        </span>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '20px',
                                            right: '20px',
                                            padding: '5px 10px',
                                            background: 'rgba(0,0,0,0.5)',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            color: '#aaa'
                                        }}>
                                            PREVIEW
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="modal-body">
                                <span className="modal-subtitle mono" style={{ color: 'var(--color-primary)' }}>
                                    {selectedCertificate.year} • {selectedCertificate.organization}
                                </span>
                                <motion.h3 layoutId={`cert-title-${selectedCertificate.id}`} style={{ fontSize: '1.8rem' }}>
                                    {selectedCertificate.title}
                                </motion.h3>

                                <p className="modal-desc" style={{ marginBottom: '20px' }}>
                                    {selectedCertificate.description}
                                    <br /><br />
                                    Successfully completed the requirements for the {selectedCertificate.title} certification,
                                    demonstrating proficiency in the relevant subject matter.
                                </p>

                                <div className="modal-links">
                                    <a href={selectedCertificate.credentialUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        <FaDownload /> Download Certificate
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Parallax */}
            <motion.div className="projects-bg-text" style={{ y: bgY }}>
                PORTFOLIO
            </motion.div>
        </section>
    )
}

export default Projects
