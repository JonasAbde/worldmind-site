/** Scene overlay positions (% of image). Pack may supply overlayPosition; else fallback. */
export interface HotspotOverlayPosition {
  x: number
  y: number
}

const FALLBACK_BY_LOCATION: Record<string, Record<string, HotspotOverlayPosition>> = {
  cafe: {
    cafe_delivery_crate: { x: 22, y: 68 },
    cafe_stock_shelf: { x: 78, y: 32 },
  },
  market: {
    market_rumor_corner: { x: 58, y: 48 },
  },
  workshop: {
    workshop_repair_bench: { x: 32, y: 58 },
    courier_route_marker: { x: 70, y: 40 },
  },
  apartment: {
    registry_kiosk: { x: 52, y: 50 },
  },
  district_square: {
    district_square_mediator_spot: { x: 50, y: 55 },
  },
}

const DEFAULT_GRID: HotspotOverlayPosition[] = [
  { x: 25, y: 35 },
  { x: 50, y: 50 },
  { x: 75, y: 65 },
  { x: 40, y: 72 },
  { x: 65, y: 28 },
]

export function resolveHotspotPosition(
  locationId: string | null | undefined,
  hotspotId: string,
  index: number,
  fromPack?: HotspotOverlayPosition | null,
): HotspotOverlayPosition {
  if (fromPack && Number.isFinite(fromPack.x) && Number.isFinite(fromPack.y)) {
    return fromPack
  }
  const loc = locationId ? FALLBACK_BY_LOCATION[locationId] : undefined
  if (loc?.[hotspotId]) return loc[hotspotId]
  return DEFAULT_GRID[index % DEFAULT_GRID.length]
}
