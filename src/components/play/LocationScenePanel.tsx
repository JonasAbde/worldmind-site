import { useState } from 'react'
import { nodeLabel } from '../../lib/district-walk-utils'
import { resolveHotspotPosition } from '../../lib/hotspot-positions'
import type { DistrictNode, GameShellHotspot, GameShellLocation } from '../../lib/play-api'

interface LocationScenePanelProps {
  location: GameShellLocation
  sceneSrc: string | null
  busy: boolean
  onCommand: (cmd: string) => void
  districtNodes?: DistrictNode[]
  playerLocationId?: string | null
  onTravel?: (nodeId: string) => void
}

function riskTone(risk?: number) {
  if ((risk ?? 1) >= 3) return 'border-amber/50 text-amber-glow bg-amber/10'
  if ((risk ?? 1) >= 2) return 'border-registry/40 text-registry-glow bg-registry/10'
  return 'border-cyan/40 text-cyan-glow bg-cyan/10'
}

export function LocationScenePanel({
  location,
  sceneSrc,
  busy,
  onCommand,
  districtNodes,
  playerLocationId,
  onTravel,
}: LocationScenePanelProps) {
  const hotspots = location.hotspots ?? []
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = hotspots.find((h) => h.id === selectedId) ?? null
  const travelNodes = districtNodes ?? []

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display font-medium text-text-bright text-lg">{location.name ?? location.id ?? 'Location'}</h2>
        {location.mood && <p className="text-sm text-muted mt-0.5">{location.mood}</p>}
      </div>

      {travelNodes.length > 0 && onTravel && (
        <div className="mb-4">
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">District locations</p>
          <ul className="flex flex-wrap gap-2" role="list">
            {travelNodes.map((node) => {
              const isHere = node.id === playerLocationId
              return (
                <li key={node.id}>
                  <button
                    type="button"
                    disabled={busy || isHere}
                    title={isHere ? 'You are here' : `Travel to ${nodeLabel(node)}`}
                    onClick={() => onTravel(node.id)}
                    className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors disabled:opacity-60 ${
                      isHere
                        ? 'border-amber/45 text-amber-glow bg-amber/10 cursor-default'
                        : 'border-cyan/35 text-cyan-glow bg-cyan/5 hover:bg-cyan/12'
                    }`}
                  >
                    {nodeLabel(node)}
                    {isHere ? ' · here' : ''}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="relative rounded-lg border border-border/40 overflow-hidden mb-4 bg-elevated/20">
        {sceneSrc ? (
          <img
            src={sceneSrc}
            alt={location.name ?? 'Location scene'}
            className="w-full max-h-64 object-cover"
          />
        ) : (
          <div className="h-48 grid-pattern flex items-center justify-center text-muted text-sm font-mono">
            {location.id ?? 'scene'}
          </div>
        )}

        {hotspots.length > 0 && (
          <div className="absolute inset-0" aria-hidden={false}>
            {hotspots.map((spot, index) => {
              const pos = resolveHotspotPosition(
                location.id,
                spot.id,
                index,
                spot.overlayPosition,
              )
              const active = selectedId === spot.id
              return (
                <button
                  key={spot.id}
                  type="button"
                  disabled={busy}
                  title={spot.label}
                  aria-label={`${spot.label}${spot.risk != null ? `, risk ${spot.risk}` : ''}`}
                  onClick={() => setSelectedId(active ? null : spot.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 font-mono text-xs flex items-center justify-center transition-all shadow-[0_0_16px_rgba(34,211,238,0.25)] disabled:opacity-40 ${
                    active
                      ? 'border-amber-glow bg-amber/25 text-amber-glow scale-110 z-10'
                      : 'border-cyan-glow/80 bg-void/80 text-cyan-glow hover:scale-105 hover:bg-cyan/15'
                  }`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  ◎
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selected && (
        <HotspotDetail
          spot={selected}
          busy={busy}
          onRun={(cmd) => {
            onCommand(cmd)
            setSelectedId(null)
          }}
          onClose={() => setSelectedId(null)}
        />
      )}

      <div>
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Hotspots</p>
        {hotspots.length === 0 ? (
          <p className="text-sm text-muted italic">No hotspots at this location.</p>
        ) : (
          <ul className="space-y-2" role="list">
            {hotspots.map((spot) => (
              <li
                key={spot.id}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-colors ${
                  selectedId === spot.id
                    ? 'border-cyan/40 bg-cyan/8'
                    : 'border-border/70 bg-elevated/40'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm text-text-bright">{spot.label}</p>
                  {(spot.preview || spot.description) && (
                    <p className="text-xs text-muted truncate">{spot.preview ?? spot.description}</p>
                  )}
                  {spot.risk != null && (
                    <p className="text-[10px] font-mono text-muted mt-0.5">Risk {spot.risk}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void onCommand(spot.command)}
                  className="shrink-0 font-mono text-xs px-3 py-1.5 rounded-md border border-cyan/35 text-cyan-glow bg-cyan/5 hover:bg-cyan/12 disabled:opacity-50 transition-colors"
                >
                  Inspect
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function HotspotDetail({
  spot,
  busy,
  onRun,
  onClose,
}: {
  spot: GameShellHotspot
  busy: boolean
  onRun: (cmd: string) => void
  onClose: () => void
}) {
  return (
    <div className="mb-4 rounded-lg border border-cyan/30 bg-cyan/5 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-mono text-[10px] text-cyan/70 uppercase tracking-widest">Hotspot</p>
          <p className="text-sm font-medium text-text-bright">{spot.label}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-xs text-muted hover:text-text-bright"
          aria-label="Close hotspot detail"
        >
          ✕
        </button>
      </div>
      {(spot.description || spot.preview) && (
        <p className="text-xs text-muted leading-relaxed mb-3">{spot.description ?? spot.preview}</p>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {spot.risk != null && (
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${riskTone(spot.risk)}`}>
            Risk {spot.risk}
          </span>
        )}
        <span className="font-mono text-[10px] text-muted">{spot.command}</span>
      </div>
      {spot.possibleEvidence && spot.possibleEvidence.length > 0 && (
        <p className="text-[10px] font-mono text-amber-glow/80 mb-3">
          May reveal: {spot.possibleEvidence.join(', ')}
        </p>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => onRun(spot.command)}
        className="font-mono text-xs px-4 py-2 rounded-md border border-amber/40 text-amber-glow bg-amber/10 hover:bg-amber/20 disabled:opacity-50 transition-colors"
      >
        Inspect / Run
      </button>
    </div>
  )
}
