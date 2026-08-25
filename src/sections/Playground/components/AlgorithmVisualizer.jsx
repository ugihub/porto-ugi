import { useState, useRef, useEffect, useCallback } from 'react'
import { FaPlay, FaPause, FaRedo, FaRandom, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'

const ALGORITHMS = [
    { id: 'bubble', name: 'Bubble Sort', shortName: 'Bubble' },
    { id: 'selection', name: 'Selection Sort', shortName: 'Select' },
    { id: 'insertion', name: 'Insertion Sort', shortName: 'Insert' },
    { id: 'merge', name: 'Merge Sort', shortName: 'Merge' },
]

const DELAY = 30

const getArraySize = () => window.innerWidth <= 480 ? 20 : window.innerWidth <= 768 ? 25 : 40
const getMaxHeight = () => window.innerWidth <= 480 ? 120 : window.innerWidth <= 768 ? 150 : 280

const generateArray = (size) =>
    Array.from({ length: size || getArraySize() }, () => Math.floor(Math.random() * getMaxHeight()) + 20)

const AlgorithmVisualizer = () => {
    const [array, setArray] = useState(() => generateArray())
    const [algorithm, setAlgorithm] = useState('bubble')
    const [sorting, setSorting] = useState(false)
    const [comparing, setComparing] = useState([])
    const [swapping, setSwapping] = useState([])
    const [sorted, setSorted] = useState([])
    const [stats, setStats] = useState({ comparisons: 0, swaps: 0 })
    const [soundOn, setSoundOn] = useState(true)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const stopRef = useRef(false)
    const audioCtxRef = useRef(null)

    // Handle resize for mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Initialize AudioContext lazily
    const getAudioCtx = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }
        return audioCtxRef.current
    }

    // Play a tone based on bar value (height)
    const playTone = (value, duration = 30) => {
        if (!soundOn) return
        try {
            const ctx = getAudioCtx()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            // Map value (20-300) to frequency (200-800Hz)
            const freq = 200 + (value / 300) * 600
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, ctx.currentTime)
            gain.gain.setValueAtTime(0.06, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + duration / 1000)
        } catch {
            // Audio not supported
        }
    }

    const resetArray = () => {
        stopRef.current = true
        setSorting(false)
        setComparing([])
        setSwapping([])
        setSorted([])
        setStats({ comparisons: 0, swaps: 0 })
        setArray(generateArray())
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const updateCompare = async (arr, i, j, comps) => {
        if (stopRef.current) throw new Error('stopped')
        setComparing([i, j])
        setStats(prev => ({ ...prev, comparisons: comps }))
        playTone(arr[j], 25)
        await sleep(DELAY)
    }

    const updateSwap = async (arr, i, j, swaps) => {
        if (stopRef.current) throw new Error('stopped')
        setSwapping([i, j])
        setStats(prev => ({ ...prev, swaps }))
        playTone(arr[i], 40)
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
        setArray([...arr])
        await sleep(DELAY)
        setSwapping([])
    }

    const bubbleSort = async (arr) => {
        let comps = 0, swaps = 0
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                comps++
                await updateCompare(arr, j, j + 1, comps)
                if (arr[j] > arr[j + 1]) {
                    swaps++
                    await updateSwap(arr, j, j + 1, swaps)
                }
            }
            setSorted(prev => [...prev, arr.length - 1 - i])
        }
    }

    const selectionSort = async (arr) => {
        let comps = 0, swaps = 0
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i
            for (let j = i + 1; j < arr.length; j++) {
                comps++
                await updateCompare(arr, minIdx, j, comps)
                if (arr[j] < arr[minIdx]) minIdx = j
            }
            if (minIdx !== i) {
                swaps++
                await updateSwap(arr, i, minIdx, swaps)
            }
            setSorted(prev => [...prev, i])
        }
    }

    const insertionSort = async (arr) => {
        let comps = 0, swaps = 0
        for (let i = 1; i < arr.length; i++) {
            let j = i
            while (j > 0) {
                comps++
                await updateCompare(arr, j - 1, j, comps)
                if (arr[j - 1] > arr[j]) {
                    swaps++
                    await updateSwap(arr, j - 1, j, swaps)
                    j--
                } else break
            }
            setSorted(prev => [...prev, i])
        }
    }

    const mergeSort = async (arr) => {
        let comps = 0, swaps = 0

        const merge = async (start, mid, end) => {
            const left = arr.slice(start, mid + 1)
            const right = arr.slice(mid + 1, end + 1)
            let i = 0, j = 0, k = start

            while (i < left.length && j < right.length) {
                comps++
                await updateCompare(arr, start + i, mid + 1 + j, comps)
                if (left[i] <= right[j]) {
                    arr[k] = left[i]
                    i++
                } else {
                    arr[k] = right[j]
                    j++
                    swaps++
                    setStats(prev => ({ ...prev, swaps }))
                }
                setArray([...arr])
                k++
                await sleep(DELAY)
            }

            while (i < left.length) { arr[k] = left[i]; i++; k++; setArray([...arr]); await sleep(DELAY / 2) }
            while (j < right.length) { arr[k] = right[j]; j++; k++; setArray([...arr]); await sleep(DELAY / 2) }
        }

        const sort = async (start, end) => {
            if (stopRef.current) throw new Error('stopped')
            if (start >= end) return
            const mid = Math.floor((start + end) / 2)
            await sort(start, mid)
            await sort(mid + 1, end)
            await merge(start, mid, end)
        }

        await sort(0, arr.length - 1)
    }

    const startSort = useCallback(async () => {
        stopRef.current = false
        setSorting(true)
        setComparing([])
        setSwapping([])
        setSorted([])
        setStats({ comparisons: 0, swaps: 0 })

        const arr = [...array]

        try {
            switch (algorithm) {
                case 'bubble': await bubbleSort(arr); break
                case 'selection': await selectionSort(arr); break
                case 'insertion': await insertionSort(arr); break
                case 'merge': await mergeSort(arr); break
            }
            // Mark all as sorted
            setSorted(Array.from({ length: arr.length }, (_, i) => i))
        } catch {
            // Stopped
        }

        setComparing([])
        setSwapping([])
        setSorting(false)
    }, [array, algorithm])

    const getBarColor = (idx) => {
        if (swapping.includes(idx)) return '#f44336'
        if (comparing.includes(idx)) return '#ffeb3b'
        if (sorted.includes(idx)) return '#4caf50'
        return 'var(--color-primary)'
    }

    return (
        <div className="tool-card" style={{ '--tool-accent': '#ff9800' }}>
            <h3 className="tool-title">📊 Algorithm Visualizer</h3>
            <p className="tool-subtitle">Watch sorting algorithms in action</p>

            <div className="algo-controls">
                <div className="algo-selector">
                    {ALGORITHMS.map((a) => (
                        <button
                            key={a.id}
                            className={`algo-btn ${algorithm === a.id ? 'active' : ''}`}
                            onClick={() => { if (!sorting) setAlgorithm(a.id) }}
                            disabled={sorting}
                        >
                            {isMobile ? a.shortName : a.name}
                        </button>
                    ))}
                </div>
                <div className="algo-actions">
                    <button
                        className="run-btn"
                        onClick={sorting ? () => { stopRef.current = true } : startSort}
                    >
                        {sorting ? <><FaPause /> Stop</> : <><FaPlay /> Sort</>}
                    </button>
                    <button className="clear-btn" onClick={resetArray} disabled={sorting}>
                        <FaRandom /> Shuffle
                    </button>
                    <button
                        className={`sound-btn ${soundOn ? 'active' : ''}`}
                        onClick={() => setSoundOn(!soundOn)}
                        title={soundOn ? 'Mute' : 'Unmute'}
                    >
                        {soundOn ? <FaVolumeUp /> : <FaVolumeMute />}
                    </button>
                </div>
            </div>

            <div className="algo-stats">
                <span>Comparisons: <strong>{stats.comparisons}</strong></span>
                <span>Swaps: <strong>{stats.swaps}</strong></span>
            </div>

            <div className="algo-bars">
                {array.map((val, idx) => (
                    <div
                        key={idx}
                        className="algo-bar"
                        style={{
                            height: `${val}px`,
                            backgroundColor: getBarColor(idx),
                            transition: 'background-color 0.1s ease',
                        }}
                    />
                ))}
            </div>

            <div className="algo-legend">
                <span><span className="legend-dot" style={{ background: 'var(--color-primary)' }} /> Unsorted</span>
                <span><span className="legend-dot" style={{ background: '#ffeb3b' }} /> Comparing</span>
                <span><span className="legend-dot" style={{ background: '#f44336' }} /> Swapping</span>
                <span><span className="legend-dot" style={{ background: '#4caf50' }} /> Sorted</span>
            </div>
        </div>
    )
}

export default AlgorithmVisualizer
