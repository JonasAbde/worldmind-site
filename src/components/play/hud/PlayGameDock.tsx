import { motion, AnimatePresence } from 'framer-motion'
import {
  CaseBoardPanel,
  NpcCardsPanel,
  QuestProgressPanel,
  RumorTrailPanel,
} from '../InvestigationPanels'
import { FounderPanel } from '../FounderPanel'
import { ProgressionPanel } from '../ProgressionPanel'
import { LenoPanel } from '../LenoPanel'
import type { GameShell, NpcCard } from '../../../lib/play-api'

export type DockTab = 'quest' | 'case' | 'rumors' | 'npcs' | 'leno' | 'founder' | 'stats'

interface PlayGameDockProps {
  open: boolean
  tab: DockTab
  onTabChange: (tab: DockTab) => void
  onClose: () => void
  shell: GameShell | null
  founderUnlocked: boolean
  busy: boolean
  isWalking: boolean
  onCommand: (cmd: string) => void
  onSelectNpc: (npc: NpcCard) => void
}

const TABS: { id: DockTab; label: string; locked?: boolean }[] = [
  { id: 'quest', label: 'Quest' },
  { id: 'case', label: 'Case' },
  { id: 'rumors', label: 'Rumors' },
  { id: 'npcs', label: 'NPCs' },
  { id: 'leno', label: 'Leno' },
  { id: 'founder', label: 'Founder', locked: true },
  { id: 'stats', label: 'Stats' },
]

export function PlayGameDock({
  open,
  tab,
  onTabChange,
  onClose,
  shell,
  founderUnlocked,
  busy,
  isWalking,
  onCommand,
  onSelectNpc,
}: PlayGameDockProps) {
  const locked = busy || isWalking

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 right-0 bottom-0 z-[55] w-[min(320px,88vw)] flex flex-col pointer-events-auto border-l border-cyan/20 bg-void/96 backdrop-blur-xl shadow-[-12px_0_48px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-1 px-2 py-2 border-b border-border/50 shrink-0 overflow-x-auto">
            {TABS.map((t) => {
              const isFounderLocked = t.id === 'founder' && !founderUnlocked
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange(t.id)}
                  className={`shrink-0 font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${
                    active
                      ? 'border-cyan/45 text-cyan-glow bg-cyan/10'
                      : 'border-transparent text-muted hover:text-cyan-glow'
                  }`}
                >
                  {t.label}
                  {isFounderLocked ? ' 🔒' : ''}
                </button>
              )
            })}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto shrink-0 font-mono text-sm text-muted hover:text-cyan-glow px-2"
              aria-label="Close data panel"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {tab === 'quest' && <QuestProgressPanel quest={shell?.questProgress} />}
            {tab === 'case' && (
              <CaseBoardPanel
                caseBoard={shell?.caseBoard}
                assets={shell?.assets}
                busy={locked}
                onCommand={onCommand}
              />
            )}
            {tab === 'rumors' && (
              <RumorTrailPanel
                trail={shell?.rumorTrail}
                rumorIcon={shell?.assets?.rumorIcon}
                busy={locked}
                onCommand={onCommand}
              />
            )}
            {tab === 'npcs' && (
              <NpcCardsPanel
                npcs={shell?.npcCards}
                busy={locked}
                onSelectNpc={onSelectNpc}
              />
            )}
            {tab === 'leno' && (
              <LenoPanel shell={shell} busy={locked} onCommand={onCommand} />
            )}
            {tab === 'founder' && (
              <FounderPanel
                founder={shell?.founder ?? { unlocked: false, contracts: [] }}
                assets={shell?.assets}
                busy={locked}
                compact
                onCommand={onCommand}
              />
            )}
            {tab === 'stats' && shell?.progression && (
              <ProgressionPanel progression={shell.progression} />
            )}
            {tab === 'stats' && !shell?.progression && (
              <p className="text-sm text-muted">No progression data yet.</p>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
