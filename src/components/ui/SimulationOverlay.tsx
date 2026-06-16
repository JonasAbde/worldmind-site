import { motion } from 'framer-motion'

const NODES = [
  { id: 'sara', label: 'Sara', x: 18, y: 55, color: '#f59e0b' },
  { id: 'malik', label: 'Malik', x: 42, y: 38, color: '#22d3ee' },
  { id: 'nadia', label: 'Nadia', x: 68, y: 48, color: '#3b82f6' },
  { id: 'rune', label: 'Rune', x: 52, y: 68, color: '#22d3ee' },
  { id: 'player', label: 'You', x: 32, y: 72, color: '#67e8f9' },
]

const EDGES = [
  ['sara', 'malik'],
  ['malik', 'nadia'],
  ['nadia', 'rune'],
  ['rune', 'player'],
  ['sara', 'player'],
]

export function SimulationOverlay() {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        {EDGES.map(([a, b], i) => {
          const from = nodeMap[a]
          const to = nodeMap[b]
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#lineGrad)"
              strokeWidth="0.15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatType: 'reverse', repeatDelay: 4 }}
            />
          )
        })}
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {NODES.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
        >
          <motion.div
            className="w-2 h-2 md:w-3 md:h-3 rounded-full"
            style={{ backgroundColor: node.color, boxShadow: `0 0 12px ${node.color}` }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
          />
          <span className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] text-text/50 whitespace-nowrap">
            {node.label}
          </span>
        </motion.div>
      ))}

      <motion.div
        className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border border-cyan/10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/5 w-32 h-32 rounded-full border border-amber/10"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </div>
  )
}
