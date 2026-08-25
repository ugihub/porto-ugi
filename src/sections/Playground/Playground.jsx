import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FaTerminal, FaChartBar, FaKeyboard, FaPalette, FaComments } from 'react-icons/fa'
import LiveCodeEditor from './components/LiveCodeEditor'
import AlgorithmVisualizer from './components/AlgorithmVisualizer'
import CodeTypingTest from './components/CodeTypingTest'
import AIColorPalette from './components/AIColorPalette'
import RoomChat from './components/RoomChat'
import './Playground.css'

const TABS = [
    { id: 'editor', label: 'Code Editor', icon: <FaTerminal />, color: '#00bcd4' },
    { id: 'visualizer', label: 'Algo Visualizer', icon: <FaChartBar />, color: '#ff9800' },
    { id: 'typing', label: 'Typing Test', icon: <FaKeyboard />, color: '#e91e63' },
    { id: 'palette', label: 'Color Palette', icon: <FaPalette />, color: '#7c4dff' },
    { id: 'chat', label: 'Room Chat', icon: <FaComments />, color: '#4caf50' },
]

const Playground = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
    const [activeTab, setActiveTab] = useState('editor')

    const renderContent = () => {
        switch (activeTab) {
            case 'editor': return <LiveCodeEditor />
            case 'visualizer': return <AlgorithmVisualizer />
            case 'typing': return <CodeTypingTest />
            case 'palette': return <AIColorPalette />
            case 'chat': return <RoomChat />
            default: return null
        }
    }

    return (
        <section id="playground" className="playground section" ref={sectionRef}>
            <div className="container">
                {/* Header */}
                <motion.div
                    className="playground-header"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <div className="header-left">
                        <span className="section-tag">Interactive</span>
                        <h2>
                            AI<br />
                            <span className="text-gradient">PLAYGROUND</span>
                        </h2>
                    </div>
                    <p className="playground-desc mono">
                        Tools &amp; games powered by AI — explore, build, and have fun.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    className="playground-tabs"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`playground-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ '--tab-color': tab.color }}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </motion.div>

                {/* Content */}
                <motion.div
                    className="playground-content"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Background Text */}
            <div className="playground-bg-text">PLAY</div>
        </section>
    )
}

export default Playground
