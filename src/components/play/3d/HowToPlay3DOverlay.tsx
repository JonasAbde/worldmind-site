import { AnimatePresence, motion } from 'framer-motion'

const STORAGE_KEY = 'worldmind-play-3d-howto-dismissed'

const STEPS = [
  {
    title: 'Move',
    detail: 'WASD or arrows to walk. Hold Shift to sprint. Drag to look around. Press E at a building entrance to enter, or click buildings on the map.',
    icon: '⌨',
  },
  {
    title: 'Inspect',
    detail: 'Click amber hotspot markers to inspect clues at your location.',
    icon: '◎',
  },
  {
    title: 'Characters',
    detail: 'NPCs are embodied 3D figures with portrait faces. Walk up and click them to talk, ask, pay, or consult Leno.',
    icon: '◉',
  },
] as const

export function readHowToPlayDismissed(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

export function dismissHowToPlay(): void {
  window.localStorage.setItem(STORAGE_KEY, '1')
}

interface HowToPlay3DOverlayProps {
  open: boolean
  onDismiss: () => void
}

export function HowToPlay3DOverlay({ open, onDismiss }: HowToPlay3DOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center bg-void/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-full max-w-md rounded-xl border border-cyan/30 bg-void/95 shadow-2xl p-5"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-labelledby="howto-play-title"
          >
            <p className="font-mono text-[10px] text-cyan/70 uppercase tracking-[0.2em] mb-1">How to play</p>
            <h2 id="howto-play-title" className="font-display text-lg text-text-bright mb-4">
              3D district controls
            </h2>
            <ol className="space-y-3 mb-5">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-3 items-start">
                  <span className="shrink-0 w-7 h-7 rounded-full border border-cyan/35 bg-cyan/10 font-mono text-xs flex items-center justify-center text-cyan-glow">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm text-text-bright font-medium">
                      <span className="font-mono text-cyan-glow mr-1.5">{step.icon}</span>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted leading-relaxed mt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={onDismiss}
              className="w-full font-mono text-xs px-4 py-2.5 rounded-md border border-cyan/40 text-cyan-glow bg-cyan/10 hover:bg-cyan/15 transition-colors"
            >
              Got it — start exploring
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
