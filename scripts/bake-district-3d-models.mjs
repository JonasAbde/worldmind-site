/**
 * Bake district location + humanoid GLB models into worldmind-core assets.
 *
 * Run from worldmind-site:
 *   npm run bake:3d-models
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// GLTFExporter expects browser APIs when embedding buffers.
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    Promise.resolve(blob.arrayBuffer()).then((buffer) => {
      this.result = buffer
      this.onloadend?.({ target: this })
    })
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const CORE_ROOT = join(__dirname, '../../Project Worldmind')
const OUT_LOCATIONS = join(CORE_ROOT, 'assets/models/locations')
const OUT_CHARACTERS = join(CORE_ROOT, 'assets/models/characters')

const THREE = await import('three')
const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')

const BRAND = {
  cyan: '#22d3ee',
  amber: '#f59e0b',
  civic: '#4ade80',
}

const LOCATION_PRESETS = {
  apartment: { style: 'residential', footprint: [3.2, 4.8, 2.6], wall: '#3d4f6a', trim: BRAND.cyan, emissive: '#fbbf24' },
  cafe: { style: 'cafe', footprint: [3.6, 2.4, 3.0], wall: '#5c3d2e', trim: BRAND.amber, emissive: '#fbbf24' },
  market: { style: 'market', footprint: [4.2, 2.2, 3.4], wall: '#1e4d4a', trim: BRAND.cyan, emissive: BRAND.cyan },
  workshop: { style: 'industrial', footprint: [3.8, 3.2, 3.2], wall: '#3f4654', trim: '#94a3b8', emissive: '#f97316' },
  district_square: { style: 'civic', footprint: [4.5, 1.6, 4.5], wall: '#1a3d2e', trim: BRAND.civic, emissive: BRAND.civic },
}

function stdMat(color, opts = {}) {
  const params = {
    color,
    roughness: opts.roughness ?? 0.78,
    metalness: opts.metalness ?? 0.12,
  }
  if (opts.emissive) {
    params.emissive = new THREE.Color(opts.emissive)
    params.emissiveIntensity = opts.emissiveIntensity ?? 0.4
  }
  return new THREE.MeshStandardMaterial(params)
}

function addDoor(group, w, h, d, trimColor) {
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.55, 0.14), stdMat('#1c1917', { roughness: 0.9 }))
  door.position.set(0, 0.78, d / 2 + 0.08)
  group.add(door)
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.75, 0.06), stdMat(trimColor, { emissive: trimColor, emissiveIntensity: 0.35 }))
  frame.position.set(0, 0.88, d / 2 + 0.04)
  group.add(frame)
}

function addResidential(group, p) {
  const [w, h, d] = p.footprint
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stdMat(p.wall))
  body.position.y = h / 2
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 0.35, d + 0.12), stdMat('#1e293b', { metalness: 0.35 }))
  roof.position.y = h + 0.175
  group.add(roof)
  for (const x of [-0.9, 0.9]) {
    for (const y of [0.45, 1.15]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.12), stdMat('#0f172a', { emissive: p.emissive, emissiveIntensity: 0.35 }))
      win.position.set(x, h * 0.35 + y, d / 2 + 0.06)
      group.add(win)
    }
  }
  const balcony = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, 0.08, 0.55), stdMat('#334155'))
  balcony.position.set(0, h * 0.72, d / 2 + 0.28)
  group.add(balcony)
  const strip = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.06, 0.08), stdMat(p.trim, { emissive: p.trim, emissiveIntensity: 1.1 }))
  strip.position.set(0, h * 0.25, d / 2 + 0.05)
  group.add(strip)
  addDoor(group, w, h, d, p.trim)
}

function addCafe(group, p) {
  const [w, h, d] = p.footprint
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stdMat(p.wall, { roughness: 0.85 }))
  body.position.y = h / 2
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)
  const awning = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.06, 1.4), stdMat(p.trim, { emissive: p.emissive, emissiveIntensity: 0.4 }))
  awning.position.set(0, h + 0.08, d / 2 + 0.35)
  awning.rotation.x = 0.15
  group.add(awning)
  const sign = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.28, 0.08), stdMat(p.emissive, { emissive: p.emissive, emissiveIntensity: 0.9 }))
  sign.position.set(0, h + 0.55, d / 2 + 0.12)
  group.add(sign)
  const display = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.1), stdMat('#0f172a', { emissive: '#fde68a', emissiveIntensity: 0.25 }))
  display.position.set(-0.9, h * 0.45, d / 2 + 0.08)
  group.add(display)
  for (const x of [-0.8, 0.8]) {
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.7, 8), stdMat('#44403c'))
    table.position.set(x, 0.35, d / 2 + 0.5)
    group.add(table)
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), stdMat('#57534e'))
    chair.position.set(x, 0.2, d / 2 + 0.95)
    group.add(chair)
  }
  addDoor(group, w, h, d, p.trim)
}

function addMarket(group, p) {
  const [w, h, d] = p.footprint
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(w + 1, d + 0.8), stdMat('#0f766e', { roughness: 0.9 }))
  pad.rotation.x = -Math.PI / 2
  pad.position.y = 0.05
  group.add(pad)
  for (const x of [-1.1, 0, 1.1]) {
    const stall = new THREE.Mesh(new THREE.BoxGeometry(0.9, h, 1.2), stdMat(p.wall))
    stall.position.set(x, h / 2, 0)
    stall.castShadow = true
    group.add(stall)
    const awning = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.05, 1.35), stdMat(x === 0 ? p.trim : '#115e59', { emissive: p.emissive, emissiveIntensity: 0.35 }))
    awning.position.set(x, h + 0.35, 0)
    group.add(awning)
  }
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.08, d), stdMat(p.trim, { emissive: p.emissive, emissiveIntensity: 0.55 }))
  canopy.position.y = h + 0.5
  group.add(canopy)
  for (const [x, z] of [[-1.4, 0.8], [1.3, -0.6], [0.2, 1.1]]) {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.45), stdMat('#78350f'))
    crate.position.set(x, 0.18, z)
    group.add(crate)
  }
}

function addIndustrial(group, p) {
  const [w, h, d] = p.footprint
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stdMat(p.wall, { metalness: 0.4, roughness: 0.65 }))
  body.position.y = h / 2
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)
  const garage = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, h * 0.55, 0.12), stdMat('#1e293b', { metalness: 0.55 }))
  garage.position.set(0, h * 0.32, d / 2 + 0.08)
  group.add(garage)
  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.6, 8), stdMat('#64748b', { metalness: 0.6 }))
  chimney.position.set(w / 2 - 0.2, h + 0.9, 0)
  group.add(chimney)
  const stack = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 6, 12), stdMat('#475569', { metalness: 0.7 }))
  stack.position.set(w / 2 - 0.2, h + 1.75, 0)
  stack.rotation.x = Math.PI / 2
  group.add(stack)
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.15), stdMat(p.emissive, { emissive: p.emissive, emissiveIntensity: 0.85 }))
  panel.position.set(-w / 3, h * 0.6, d / 2 + 0.1)
  group.add(panel)
  for (const z of [-0.6, 0.6]) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, w * 0.7, 6), stdMat('#64748b', { metalness: 0.5 }))
    pipe.rotation.z = Math.PI / 2
    pipe.position.set(0, h * 0.85, z)
    group.add(pipe)
  }
}

function addCivic(group, p) {
  const [w, h] = p.footprint
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(w / 2, 32), stdMat('#1f2937'))
  plaza.rotation.x = -Math.PI / 2
  plaza.position.y = 0.06
  group.add(plaza)
  const ring = new THREE.Mesh(new THREE.RingGeometry(w / 2 - 0.35, w / 2 - 0.15, 32), stdMat(p.trim, { emissive: p.emissive, emissiveIntensity: 0.35 }))
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.08
  group.add(ring)
  const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, h, 6), stdMat(p.trim, { emissive: p.emissive, emissiveIntensity: 0.45 }))
  obelisk.position.y = h / 2
  obelisk.castShadow = true
  group.add(obelisk)
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.35, 6), stdMat(p.emissive, { emissive: p.emissive, emissiveIntensity: 0.6 }))
  cap.position.y = h + 0.15
  group.add(cap)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.9, 6), stdMat('#334155'))
    pillar.position.set(Math.cos(angle) * (w / 2 - 0.55), 0.45, Math.sin(angle) * (w / 2 - 0.55))
    group.add(pillar)
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), stdMat(p.emissive, { emissive: p.emissive, emissiveIntensity: 0.7 }))
    lamp.position.set(pillar.position.x, 0.95, pillar.position.z)
    group.add(lamp)
  }
}

function buildLocationScene(id, preset) {
  const group = new THREE.Group()
  group.name = id
  const pad = new THREE.Mesh(
    new THREE.RingGeometry(Math.max(preset.footprint[0], 2) * 0.45, Math.max(preset.footprint[0], 2) * 0.62, 32),
    stdMat('#1f2937'),
  )
  pad.rotation.x = -Math.PI / 2
  pad.position.y = 0.03
  group.add(pad)
  switch (preset.style) {
    case 'cafe':
      addCafe(group, preset)
      break
    case 'market':
      addMarket(group, preset)
      break
    case 'industrial':
      addIndustrial(group, preset)
      break
    case 'civic':
      addCivic(group, preset)
      break
    default:
      addResidential(group, preset)
  }
  return group
}

function buildHumanoidScene() {
  const group = new THREE.Group()
  group.name = 'humanoid'
  const skin = stdMat('#e8c4a8')
  const jacket = stdMat('#334155')
  const pants = stdMat('#1e293b')
  const boots = stdMat('#0f172a')
  const hair = stdMat('#1c1917', { roughness: 0.85 })

  const leftLeg = new THREE.Group()
  leftLeg.position.set(-0.11, 0.48, 0)
  leftLeg.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.38, 4, 8), pants))
  leftLeg.children[0].position.y = -0.22
  leftLeg.add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.22), boots))
  leftLeg.children[1].position.set(0, -0.52, 0.02)
  group.add(leftLeg)

  const rightLeg = leftLeg.clone()
  rightLeg.position.x = 0.11
  group.add(rightLeg)

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.42, 6, 12), jacket)
  torso.position.y = 1.05
  group.add(torso)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), skin)
  head.position.y = 1.48
  group.add(head)

  const hairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.165, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair)
  hairMesh.position.set(0, 1.56, -0.02)
  group.add(hairMesh)

  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.34, 4, 8), jacket)
    arm.position.set(side * 0.26, 0.88, 0)
    arm.rotation.z = side * 0.12
    group.add(arm)
  }

  return group
}

async function exportGlb(scene, outPath) {
  mkdirSync(dirname(outPath), { recursive: true })
  const exporter = new GLTFExporter()
  const data = await exporter.parseAsync(scene, { binary: true })
  writeFileSync(outPath, Buffer.from(data))
  return outPath
}

async function main() {
  for (const [id, preset] of Object.entries(LOCATION_PRESETS)) {
    const scene = buildLocationScene(id, preset)
    const out = join(OUT_LOCATIONS, `${id}.glb`)
    await exportGlb(scene, out)
    console.log(`wrote ${out}`)
  }
  const humanoid = buildHumanoidScene()
  const humanoidOut = join(OUT_CHARACTERS, 'humanoid.glb')
  await exportGlb(humanoid, humanoidOut)
  console.log(`wrote ${humanoidOut}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
