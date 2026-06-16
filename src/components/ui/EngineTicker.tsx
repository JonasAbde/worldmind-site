import { motion } from 'framer-motion'

const ITEMS = [
  'v1.0-rc8',
  '200/200 tests',
  '10 agents',
  '4 locations',
  '14 commands',
  'Event Log — source of truth',
  'Leno evidence guard',
  'Save Browser',
  'Branch Restore',
  'Snapshot Diff',
  '2D District View',
  'Phone UI — 8 tabs',
  'New Aarhus District 01',
  'The Missing Delivery',
]

export function EngineTicker() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="relative border-y border-border/40 bg-void/90 overflow-hidden py-3">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted/70"
          >
            <span className="w-1 h-1 rounded-full bg-cyan/50" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
