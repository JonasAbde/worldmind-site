import { motion } from 'framer-motion'
import { FINAL_CTA, PRODUCT } from '../../data/product'
import { Button } from '../ui/Button'
import { Section } from '../ui/Section'

export function FinalCta() {
  return (
    <Section className="bg-void overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan/3 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[300px] bg-amber/3 blur-3xl rounded-full" />
      </div>

      <div className="relative">
        {/* Key art bg */}
        <div className="relative rounded-2xl border border-cyan/15 overflow-hidden">
          <img
            src="/assets/optimized/worldmind-hero-key-art.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            onError={(e) => { e.currentTarget.src = '/assets/worldmind-hero-key-art.png' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/50 to-void/90" />
          <div className="absolute inset-0 grid-pattern opacity-30" />

          <div className="relative z-10 px-10 md:px-16 py-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan/50" />
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-cyan/60">
                  Final call
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan/50" />
              </div>

              <h2 className="font-display text-4xl md:text-6xl text-text-bright font-semibold mb-4 leading-tight">
                Enter{' '}
                <span className="text-gradient-amber">
                  New Aarhus
                </span>{' '}
                District 01
              </h2>

              <p className="text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed">
                A living AI simulation prototype. Play the vertical slice. Investigate. Branch timelines. See what the engine does.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href={PRODUCT.playInstructionsUrl} external>
                  {FINAL_CTA.primaryCta}
                </Button>
                <Button href="#simulation" variant="secondary">
                  {FINAL_CTA.secondaryCta}
                </Button>
                <Button href={PRODUCT.githubUrl} external variant="ghost">
                  {FINAL_CTA.tertiaryCta}
                </Button>
              </div>

              {/* Test count badge */}
              <motion.p
                className="mt-10 font-mono text-xs text-muted/60"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {PRODUCT.testCount} tests passing · {PRODUCT.version} · strict TypeScript runtime
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  )
}
