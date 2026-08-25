import { useRef } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { archiveProjects, featuredProjects, getProjectsForTab, verifiedCredentials } from '../../data/portfolioContent.js'
import { clearSelectedProject, selectProject, setActiveTab } from '../../features/portfolio/portfolioSlice.js'
import ProjectCard from './ProjectCard.jsx'
import ProjectModal from './ProjectModal.jsx'
import './Projects.css'

const tabs = [
  { id: 'ai', label: 'AI SYSTEMS' },
  { id: 'archive', label: 'ARCHIVE' },
  { id: 'credentials', label: 'CREDENTIALS' }
]

const Projects = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const dispatch = useDispatch()
  const { activeTab, selectedProjectId } = useSelector((state) => state.portfolio)
  const selectedProject = [...featuredProjects, ...archiveProjects].find((project) => project.id === selectedProjectId)
  const projects = activeTab === 'credentials' ? [] : getProjectsForTab(activeTab)

  return (
    <section id="projects" className="projects section" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-left">
            <span className="section-tag">Portfolio</span>
            <h2>AI<br /><span className="text-gradient">SYSTEMS</span></h2>
          </div>
          <div className="tab-toggle" role="tablist" aria-label="Portfolio categories">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab(tab.id))}
              >
                <span className="mono">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="projects-content">
          <AnimatePresence mode="wait">
            {activeTab !== 'credentials' && (
              <motion.div
                key={activeTab}
                className="projects-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onSelect={(id) => dispatch(selectProject(id))} />
                ))}
              </motion.div>
            )}
            {activeTab === 'credentials' && (
              <motion.div
                key="credentials"
                className="credentials-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {verifiedCredentials.map((credential) => (
                  <a key={credential.id} className="credential-card" href={credential.credentialUrl} target="_blank" rel="noreferrer">
                    <img src={credential.image} alt="" />
                    <span>
                      <FaCertificate aria-hidden="true" />
                      <strong>{credential.title}</strong>
                      <small>{credential.organization} | {credential.year}</small>
                      <p>{credential.description}</p>
                      <em>View credential <FaExternalLinkAlt /></em>
                    </span>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => dispatch(clearSelectedProject())} />}
      </AnimatePresence>
    </section>
  )
}

export default Projects
