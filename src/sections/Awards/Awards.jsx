import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaTrophy, FaMedal, FaAward, FaCertificate, FaStar } from 'react-icons/fa'
import './Awards.css'

const Awards = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

    const awards = [
        {
            id: 1,
            title: 'Best Web Design Award',
            organization: 'Awwwards',
            year: '2024',
            icon: <FaTrophy />,
            description: 'Recognized for outstanding web design and creativity',
            color: '#ffd700'
        },
        {
            id: 2,
            title: 'Developer of the Year',
            organization: 'Tech Excellence',
            year: '2023',
            icon: <FaMedal />,
            description: 'Top developer award for innovative solutions',
            color: '#c0c0c0'
        },
        {
            id: 3,
            title: 'UI/UX Excellence',
            organization: 'Design Awards',
            year: '2023',
            icon: <FaAward />,
            description: 'Excellence in user interface and experience design',
            color: '#cd7f32'
        },
        {
            id: 4,
            title: 'Google Developer Expert',
            organization: 'Google',
            year: '2022',
            icon: <FaCertificate />,
            description: 'Certified Google Developer Expert in Web Technologies',
            color: '#4285f4'
        },
        {
            id: 5,
            title: 'Innovation Award',
            organization: 'Startup Hub',
            year: '2022',
            icon: <FaStar />,
            description: 'Award for innovative approach to problem solving',
            color: '#ff6b6b'
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    }

    return (
        <section id="awards" className="awards section" ref={sectionRef}>
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <span className="section-tag">Recognition</span>
                    <h2>Awards & <span className="text-gradient">Achievements</span></h2>
                    <p>Honors and recognition received throughout my career</p>
                </motion.div>

                {/* Timeline */}
                <motion.div
                    className="awards-timeline"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {awards.map((award, index) => (
                        <motion.div
                            key={award.id}
                            className="award-item"
                            variants={itemVariants}
                            whileHover={{ x: 10 }}
                        >
                            <div className="award-timeline-dot" style={{ background: award.color }}>
                                <span className="award-icon" style={{ color: award.color }}>
                                    {award.icon}
                                </span>
                            </div>

                            <div className="award-content">
                                <div className="award-header">
                                    <div className="award-year">{award.year}</div>
                                    <div className="award-org">{award.organization}</div>
                                </div>
                                <h3 className="award-title">{award.title}</h3>
                                <p className="award-description">{award.description}</p>
                            </div>

                            {/* Decorative line */}
                            {index < awards.length - 1 && (
                                <div className="timeline-line" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="achievement-stats"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <motion.div
                        className="achievement-card"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaTrophy className="achievement-icon" />
                        <span className="achievement-number">15+</span>
                        <span className="achievement-label">Awards Won</span>
                    </motion.div>
                    <motion.div
                        className="achievement-card"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaCertificate className="achievement-icon" />
                        <span className="achievement-number">10+</span>
                        <span className="achievement-label">Certifications</span>
                    </motion.div>
                    <motion.div
                        className="achievement-card"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaStar className="achievement-icon" />
                        <span className="achievement-number">50+</span>
                        <span className="achievement-label">5-Star Reviews</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default Awards
