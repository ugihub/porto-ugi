import { useRef } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { featuredProjects, toolGroups, verifiedCredentials } from '../../data/portfolioContent.js'
import { clearSelectedProject, selectProject, setActiveTab } from '../../features/portfolio/portfolioSlice.js'
import ProjectCard from './ProjectCard.jsx'
import ProjectModal from './ProjectModal.jsx'
import ToolGroupCard from './ToolGroupCard.jsx'
import './Projects.css'

const tabs = [
  { id: 'ai', label: 'AI SYSTEMS' },
  { id: 'tools', label: 'TOOLS & SYSTEMS' },
  { id: 'credentials', label: 'CREDENTIALS' }
]

const Projects = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const dispatch = useDispatch()
  const { activeTab, selectedProjectId } = useSelector((state) => state.portfolio)
  const selectedProject = featuredProjects.find((project) => project.id === selectedProjectId)

  return (
    <section className="projects section" id="projects" ref={sectionRef}>
      {/* Background Watermark & Ambient Elements matching original design */}
      <div className="projects-bg-text" aria-hidden="true">FOLIO</div>
      <div className="projects-ambient-glow" aria-hidden="true" />

      <div className="container">
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="projects-header"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-left">
            <span className="section-tag">Portfolio</span>
            <h2 className="projects-title">
              <span className="title-row-white">AI</span>
              <span className="title-row-gradient text-gradient">SYSTEMS</span>
            </h2>
          </div>

          <div className="header-center-deco" aria-hidden="true">
            <span className="header-glow-ring" />
            <span className="header-constellation-dot dot-orange" />
            <span className="header-constellation-dot dot-cyan" />
          </div>

          <div aria-label="Portfolio categories" className="tab-toggle" role="tablist">
            {tabs.map((tab) => (
              <button
                aria-selected={activeTab === tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                key={tab.id}
                onClick={() => dispatch(setActiveTab(tab.id))}
                role="tab"
                type="button"
              >
                <span className="mono">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="projects-content">
          <AnimatePresence mode="wait">
            {activeTab === 'ai' && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="projects-grid"
                exit={{ opacity: 0, y: -20 }}
                initial={{ opacity: 0, y: 20 }}
                key="ai"
              >
                {featuredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    onSelect={(id) => dispatch(selectProject(id))}
                    project={project}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'tools' && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="bento-wrapper"
                exit={{ opacity: 0, y: -20 }}
                initial={{ opacity: 0, y: 20 }}
                key="tools"
              >
                {/* 5-Card Bento Grid */}
                <div className="bento-grid">
                  {toolGroups.map((group, index) => (
                    <ToolGroupCard group={group} index={index} key={group.id} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'credentials' && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="credentials-grid"
                exit={{ opacity: 0, y: -20 }}
                initial={{ opacity: 0, y: 20 }}
                key="credentials"
              >
                {verifiedCredentials.map((credential) => (
                  <a
                    className="credential-card"
                    href={credential.credentialUrl}
                    key={credential.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="credential-img-wrapper">
                      <img alt={credential.title} src={credential.image} />
                    </div>
                    <div className="credential-content">
                      <div className="credential-heading-group">
                        <div className="credential-title-row">
                          <FaCertificate aria-hidden="true" className="credential-icon" />
                          <strong className="credential-title">{credential.title}</strong>
                        </div>
                        <small className="credential-meta mono">
                          {credential.organization} <span className="meta-sep">|</span> {credential.year}
                        </small>
                      </div>
                      <p className="credential-desc">{credential.description}</p>
                      <em className="credential-link-cta">
                        View credential <FaExternalLinkAlt />
                      </em>
                    </div>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            onClose={() => dispatch(clearSelectedProject())}
            project={selectedProject}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
