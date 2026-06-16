import { Component, type ErrorInfo, type ReactNode } from 'react'

interface CanvasErrorBoundaryProps {
  children: ReactNode
  title?: string
  onRetry?: () => void
}

interface CanvasErrorBoundaryState {
  hasError: boolean
  message: string
}

function DefaultCanvasFallback({
  title,
  message,
  onRetry,
}: {
  title: string
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-void/95 backdrop-blur-sm p-6">
      <div className="max-w-md rounded-xl border border-border/70 bg-surface/90 p-6 text-center shadow-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70 mb-2">3D district</p>
        <h3 className="font-display text-lg text-text-bright mb-2">{title}</h3>
        <p className="text-sm text-muted mb-4">
          The district view could not render. Textures or WebGL may have failed — simulation and 2D play still work.
        </p>
        {message && (
          <p className="font-mono text-[10px] text-amber-glow/80 mb-4 break-words">{message}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-mono text-xs px-4 py-2 rounded border border-cyan/35 text-cyan-glow bg-cyan/5 hover:bg-cyan/10"
            >
              Retry 3D
            </button>
          )}
          <a
            href="/play"
            className="font-mono text-xs px-4 py-2 rounded border border-border text-muted hover:text-cyan-glow"
          >
            Open 2D play
          </a>
        </div>
      </div>
    </div>
  )
}

/** Catches Canvas / R3F failures and shows branded fallback instead of a white crash screen. */
export class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  state: CanvasErrorBoundaryState = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): CanvasErrorBoundaryState {
    return { hasError: true, message: error.message || 'Unknown render error' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[Play3D Canvas]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: '' })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <DefaultCanvasFallback
          title={this.props.title ?? 'District view unavailable'}
          message={this.state.message}
          onRetry={this.handleRetry}
        />
      )
    }
    return this.props.children
  }
}

interface SceneErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface SceneErrorBoundaryState {
  hasError: boolean
}

/** Per-scene fallback (e.g. missing location texture → box building). */
export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn('[Play3D scene]', error.message)
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
