import { AnimatePresence, motion } from 'framer-motion'

export interface PlayFeedbackToastState {
  title: string
  message?: string
  tone?: 'ok' | 'error'
}

interface PlayFeedbackToastProps {
  toast: PlayFeedbackToastState | null
  onDismiss: () => void
}

export function PlayFeedbackToast({ toast, onDismiss }: PlayFeedbackToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-[min(420px,92vw)] pointer-events-auto"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          role="status"
          aria-live="polite"
        >
          <div
            className={`rounded-lg border px-4 py-3 shadow-2xl backdrop-blur-xl ${
              toast.tone === 'error'
                ? 'border-amber/40 bg-void/95 text-amber-glow'
                : 'border-cyan/35 bg-void/95 text-text'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs text-cyan-glow">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-muted mt-1 line-clamp-3 whitespace-pre-wrap">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onDismiss}
                className="shrink-0 font-mono text-sm text-muted hover:text-text-bright px-1"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
