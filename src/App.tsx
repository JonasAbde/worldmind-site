import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { District } from './components/sections/District'
import { EngineProof } from './components/sections/EngineProof'
import { FinalCta } from './components/sections/FinalCta'
import { Hero } from './components/sections/Hero'
import { HowSimulationWorks } from './components/sections/HowSimulationWorks'
import { LenoCompanion } from './components/sections/LenoCompanion'
import { MissingDelivery } from './components/sections/MissingDelivery'
import { ProductTruthSection } from './components/sections/ProductTruth'
import { TimelineBranches } from './components/sections/TimelineBranches'
import { WhatYouCanPlay } from './components/sections/WhatYouCanPlay'
import { AmbientCursor } from './components/ui/AmbientCursor'
import { EngineTicker } from './components/ui/EngineTicker'
import { IntroSequence } from './components/ui/IntroSequence'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { SectionDivider } from './components/ui/SectionDivider'

function App() {
  return (
    <div className="bg-void text-text relative">
      {/* Full-page edge vignette */}
      <div className="pointer-events-none fixed inset-0 z-[55] vignette" aria-hidden />
      <IntroSequence />
      <ScrollProgress />
      <AmbientCursor />
      <Header />
      <main>
        <Hero />
        <EngineTicker />
        <SectionDivider label="vertical slice" />
        <WhatYouCanPlay />
        <SectionDivider label="missing delivery" />
        <MissingDelivery />
        <SectionDivider label="engine" />
        <HowSimulationWorks />
        <SectionDivider label="companion" />
        <LenoCompanion />
        <SectionDivider label="persistence" />
        <TimelineBranches />
        <SectionDivider label="proof" />
        <EngineProof />
        <SectionDivider label="product truth" />
        <ProductTruthSection />
        <SectionDivider label="world setting" />
        <District />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}

export default App
