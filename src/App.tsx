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

function App() {
  return (
    <div className="bg-void text-text">
      <Header />
      <main>
        <Hero />
        <WhatYouCanPlay />
        <MissingDelivery />
        <HowSimulationWorks />
        <LenoCompanion />
        <TimelineBranches />
        <EngineProof />
        <ProductTruthSection />
        <District />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}

export default App
