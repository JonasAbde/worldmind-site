import { FINAL_CTA, PRODUCT } from '../../data/product'
import { Button } from '../ui/Button'
import { Section } from '../ui/Section'

export function FinalCta() {
  return (
    <Section className="bg-surface">
      <div className="relative rounded-2xl border border-cyan/20 bg-gradient-to-br from-deep via-void to-surface p-10 md:p-14 text-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative z-10">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan/80 mb-4">
            Final call
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-text-bright font-semibold mb-8">
            {FINAL_CTA.headline}
          </h2>
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
        </div>
      </div>
    </Section>
  )
}
