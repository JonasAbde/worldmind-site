import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const NODES = [
  { id: 'sara', label: 'Sara', role: 'café owner', x: 16, y: 58, color: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
  { id: 'malik', label: 'Malik', role: 'delivery', x: 40, y: 35, color: '#22d3ee', glow: 'rgba(34,211,238,0.5)' },
  { id: 'nadia', label: 'Nadia', role: 'rumor source', x: 70, y: 44, color: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
  { id: 'rune', label: 'Rune', role: 'witness', x: 55, y: 70, color: '#22d3ee', glow: 'rgba(34,211,238,0.4)' },
  { id: 'player', label: 'You', role: 'investigator', x: 28, y: 75, color: '#67e8f9', glow: 'rgba(103,232,249,0.6)' },
  { id: 'registry', label: 'Registry', role: 'authority', x: 82, y: 25, color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
]

const EDGES = [
  { from: 'sara', to: 'malik', label: 'supply_shortage' },
  { from: 'malik', to: 'nadia', label: 'refused_delivery' },
  { from: 'nadia', to: 'registry', label: 'false_claim' },
  { from: 'nadia', to: 'rune', label: 'rumor' },
  { from: 'rune', to: 'player', label: 'witnessed' },
  { from: 'sara', to: 'player', label: 'asked_for_help' },
]

const FLOATING_TAGS = [
  { text: 'memory.recall', x: 60, y: 18, delay: 0 },
  { text: 'event_log.write', x: 8, y: 30, delay: 1.2 },
  { text: 'rumor.spreading', x: 75, y: 62, delay: 2.4 },
  { text: 'trust–14', x: 45, y: 82, delay: 0.8 },
  { text: 'permission_check', x: 88, y: 50, delay: 1.8 },
  { text: 'world_engine.tick', x: 20, y: 14, delay: 3.0 },
]

function useFlickerState(interval = 4000) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const cycle = () => {
      const idx = Math.floor(Math.random() * EDGES.length)
      setActive(`${EDGES[idx].from}-${EDGES[idx].to}`)
      setTimeout(() => setActive(null), 900)
    }
    const id = setInterval(cycle, interval)
    return () => clearInterval(id)
  }, [interval])
  return active
}

export function SimulationOverlay() {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]))
  const activeEdge = useFlickerState(3200)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Edge lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="edgeCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="edgeAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {EDGES.map(({ from, to }) => {
          const a = nodeMap[from]
          const b = nodeMap[to]
          const isActive = activeEdge === `${from}-${to}`
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke={isActive ? 'url(#edgeAmber)' : 'url(#edgeCyan)'}
              strokeWidth={isActive ? '0.3' : '0.12'}
              strokeDasharray="1 2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isActive ? 0.9 : 0.35 }}
              transition={{ duration: isActive ? 0.3 : 2.5, ease: 'easeOut' }}
            />
          )
        })}
      </svg>

      {/* Node dots */}
      {NODES.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full pulse-ring"
            style={{ background: node.glow, width: 10, height: 10, margin: 'auto' }}
          />
          {/* Core dot */}
          <motion.div
            className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full relative z-10"
            style={{ backgroundColor: node.color, boxShadow: `0 0 10px ${node.glow}` }}
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
          {/* Label */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
            <span className="block font-mono text-[9px] md:text-[11px] text-text-bright/70 whitespace-nowrap">
              {node.label}
            </span>
            <span className="block font-mono text-[7px] md:text-[9px] text-muted/60 whitespace-nowrap">
              {node.role}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Floating data tags */}
      {FLOATING_TAGS.map((tag) => (
        <motion.div
          key={tag.text}
          className="absolute font-mono text-[8px] md:text-[10px] text-cyan/40 whitespace-nowrap"
          style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: tag.delay, repeatDelay: 3 }}
        >
          {tag.text}
        </motion.div>
      ))}

      {/* Background orbit rings */}
      <motion.div
        className="absolute rounded-full border border-cyan/8"
        style={{ width: 380, height: 380, top: '20%', left: '30%', transform: 'translate(-50%,-50%)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border border-amber/6"
        style={{ width: 260, height: 260, bottom: '25%', right: '22%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
