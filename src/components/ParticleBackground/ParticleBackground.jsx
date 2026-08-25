import { useEffect, useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import './ParticleBackground.css'

const ParticleBackground = () => {
    const canvasRef = useRef(null)
    const { theme } = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let animationId
        let particles = []
        let mouse = { x: null, y: null, radius: 150 }

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 2 + 0.5
                this.speedX = (Math.random() - 0.5) * 0.5
                this.speedY = (Math.random() - 0.5) * 0.5
                this.baseX = this.x
                this.baseY = this.y
                this.density = Math.random() * 30 + 1
                this.color = Math.random() > 0.5 ? theme.colors.primary : theme.colors.secondary
                this.opacity = Math.random() * 0.5 + 0.1
            }

            update() {
                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x
                    const dy = mouse.y - this.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius
                        const forceX = dx / distance * force * this.density * 0.5
                        const forceY = dy / distance * force * this.density * 0.5
                        this.x -= forceX
                        this.y -= forceY
                    }
                }

                // Return to base position
                const dx = this.baseX - this.x
                const dy = this.baseY - this.y
                this.x += dx * 0.02
                this.y += dy * 0.02

                // Slow drift
                this.baseX += this.speedX
                this.baseY += this.speedY

                // Boundary wrap
                if (this.baseX < 0) this.baseX = canvas.width
                if (this.baseX > canvas.width) this.baseX = 0
                if (this.baseY < 0) this.baseY = canvas.height
                if (this.baseY > canvas.height) this.baseY = 0
            }

            draw() {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.globalAlpha = this.opacity
                ctx.fill()
                ctx.globalAlpha = 1
            }
        }

        const createParticles = () => {
            particles = []
            const particleCount = Math.min((canvas.width * canvas.height) / 15000, 150)
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        const connectParticles = () => {
            const maxDistance = 120

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15
                        ctx.strokeStyle = theme.colors.primary
                        ctx.globalAlpha = opacity
                        ctx.lineWidth = 0.5
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                        ctx.globalAlpha = 1
                    }
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach(particle => {
                particle.update()
                particle.draw()
            })

            connectParticles()
            animationId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        const handleMouseLeave = () => {
            mouse.x = null
            mouse.y = null
        }

        resize()
        createParticles()
        animate()

        window.addEventListener('resize', () => {
            resize()
            createParticles()
        })
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [theme.colors.primary, theme.colors.secondary])

    return <canvas ref={canvasRef} className="particle-background" />
}

export default ParticleBackground
