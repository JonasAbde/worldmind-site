import { motion } from 'framer-motion'
import { PRODUCT_TRUTH } from '../../data/product'
import { Section, SectionHeader } from '../ui/Section'

function TruthRow({
  item,
  index,
  variant,
}: {
  item: string
  index: number
  variant: 'exists' | 'later'
}) {
  const isCyan = variant === 'exists'
  return (
    <motion.div
      className={`flex items-start gap-3 py-3 border-b last:border-0 ${
        isCyan ? 'border-cyan/8' : 'border-registry/8'
      }`}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: 'easeOut' }}
    >
      <span
        className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
          isCyan
            ? 'bg-cyan/15 border border-cyan/30 text-cyan-glow'
            : 'bg-registry/15 border border-registry/30 text-registry-glow'
        }`}
      >
        {isCyan ? '✓' : '→'}
      </span>
      <p className="text-sm text-text leading-relaxed">{item}</p>
    </motion.div>
  )
}

export function ProductTruthSection() {
  return (
    <Section id="product-truth" className="bg-surface">
      <SectionHeader
        eyebrow="Product truth"
        title="What exists today — what comes later"
        subtitle="Grounded in WorldMind v1.0-rc7. A living AI-world simulation prototype, not a finished commercial release."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Exists today */}
        <motion.div
          className="rounded-xl border border-cyan/20 overflow-hidden"
          style={{ background: 'rgba(10, 61, 74, 0.15)', backdropFilter: 'blur(16px)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-6 pt-5 pb-4 border-b border-cyan/15 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <h3 className="font-display text-lg font-semibold text-text-bright">What exists today</h3>
          </div>
          <div className="px-6 py-4">
            {PRODUCT_TRUTH.existsToday.map((item, i) => (
              <TruthRow key={item} item={item} index={i} variant="exists" />
            ))}
          </div>
        </motion.div>

        {/* Comes later */}
        <motion.div
          className="rounded-xl border border-registry/20 overflow-hidden"
          style={{ background: 'rgba(30, 58, 95, 0.12)', backdropFilter: 'blur(16px)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="px-6 pt-5 pb-4 border-b border-registry/15 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-registry animate-pulse" />
            <h3 className="font-display text-lg font-semibold text-text-bright">What comes later</h3>
          </div>
          <div className="px-6 py-4">
            {PRODUCT_TRUTH.comesLater.map((item, i) => (
              <TruthRow key={item} item={item} index={i} variant="later" />
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
