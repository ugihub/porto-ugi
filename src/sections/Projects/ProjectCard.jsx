import { motion } from 'framer-motion'

const ProjectCard = ({ project, onSelect }) => (
  <motion.button
    type="button"
    className="project-card"
    onClick={() => onSelect(project.id)}
    whileHover={{ y: -6 }}
  >
    <span className="card-content">
      <span className="card-meta">
        <span className="mono">{project.category}</span>
        <span className="project-archive-label">{project.visibility === 'private' ? 'PRIVATE' : 'PUBLIC'}</span>
      </span>
      <span className="project-title">{project.title}</span>
      <span className="project-role">{project.role}</span>
      <span className="project-summary">{project.summary}</span>
      <span className="project-evidence">
        {project.evidence.map((item) => <span key={item}>{item}</span>)}
      </span>
      <span className="tech-tags">
        {project.tech.map((item) => <span key={item} className="tech-tag">{item}</span>)}
      </span>
      {project.visibility === 'private' && (
        <span className="project-privacy-status">Technical brief available on request</span>
      )}
      <span className="click-hint mono">View case study</span>
    </span>
  </motion.button>
)

export default ProjectCard
