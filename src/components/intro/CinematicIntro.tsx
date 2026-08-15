import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Building2, Wifi, Flame, Ban, CircleDot, GitBranch, Play, Cpu, Sparkles, X } from 'lucide-react'

const steps = [
  { icon: Radio, label: 'RF Waves', color: '#22d3ee' },
  { icon: Building2, label: 'Building', color: '#38bdf8' },
  { icon: Wifi, label: 'Signal Propagation', color: '#22d3ee' },
  { icon: Flame, label: 'Heatmap', color: '#f59e0b' },
  { icon: Ban, label: 'Dead Zones', color: '#ef4444' },
  { icon: CircleDot, label: 'Nodes', color: '#22d3ee' },
  { icon: GitBranch, label: 'Optimization', color: '#38bdf8' },
  { icon: Play, label: 'Simulation', color: '#22d3ee' },
  { icon: Cpu, label: 'Real Project', color: '#f59e0b' },
  { icon: Sparkles, label: 'Spark Squad', color: '#22d3ee' },
]

const STORAGE_KEY = 'signal-coverage-hub-intro-seen'

export function CinematicIntro() {
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return
    if (index >= steps.length) {
      const timer = setTimeout(() => finish(), 700)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), 520)
    return () => clearTimeout(timer)
  }, [visible, index])

  const finish = () => {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  const skip = () => finish()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-navy-950 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

          <button
            onClick={skip}
            className="absolute top-5 right-5 z-10 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-300 border border-navy-700 hover:border-cyan-500/40 transition-all"
          >
            <X size={14} /> Skip Intro
          </button>

          <div className="relative flex flex-col items-center gap-8 px-4">
            <img
              src="/spark-squad-logo.png"
              alt="Spark Squad logo"
              className="w-20 h-20 object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]"
            />

            <div className="h-16 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {index < steps.length && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-3"
                  >
                    {(() => {
                      const Step = steps[index]
                      const Icon = Step.icon
                      return (
                        <>
                          <Icon size={28} style={{ color: Step.color }} />
                          <span className="text-xl md:text-2xl font-bold text-white tracking-tight">{Step.label}</span>
                        </>
                      )
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i <= index ? 'w-8 bg-cyan-400' : 'w-4 bg-navy-700'
                  }`}
                />
              ))}
            </div>

            {index >= steps.length && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-mono uppercase tracking-widest text-cyan-400/80"
              >
                Welcome to Signal Coverage Hub
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
