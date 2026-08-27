import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaTimes } from 'react-icons/fa'

const ProjectModal = ({ project, onClose }) => (
  <motion.div
    className="modal-backdrop"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="modal-content"
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.96, opacity: 0 }}
      onClick={(event) => event.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${project.id}`}
    >
      <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close project details">
        <FaTimes />
      </button>
      <div className="modal-body">
        <span className="modal-subtitle mono">{project.category}</span>
        <h3 id={`project-${project.id}`}>{project.title}</h3>
        <p className="project-role">{project.role}</p>
        <h4>Problem</h4>
        <p className="modal-desc">{project.problem}</p>
        <h4>Approach</h4>
        <p className="modal-desc">{project.summary}</p>
        <h4>Evidence</h4>
        <ul className="modal-evidence">
          {project.evidence.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="tech-stack-modal">
          <span className="mono">TECH STACK</span>
          <div className="tech-tags">
            {project.tech.map((item) => <span key={item} className="tech-tag">{item}</span>)}
          </div>
        </div>
        {project.publicLinks.length > 0 && (
          <div className="project-links">
            {project.publicLinks.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                {link.label} <FaExternalLinkAlt />
              </a>
            ))}
          </div>
        )}
        {project.visibility === 'private' && (
          <p className="project-privacy-status">Technical brief available on request</p>
        )}
      </div>
    </motion.div>
  </motion.div>
)

export default ProjectModal
