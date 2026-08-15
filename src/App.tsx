import { Header } from './components/layout/Header'
import { HeroSection } from './components/layout/HeroSection'
import { Footer } from './components/layout/Footer'
import { CinematicIntro } from './components/intro/CinematicIntro'
import { DiscoverSparkSquadSection } from './components/discover/DiscoverSparkSquadSection'
import { SimulatorSection } from './components/simulator/SimulatorSection'
import { RealProjectSection } from './components/real-project/RealProjectSection'
import { ComparisonSection } from './components/comparison/ComparisonSection'
import { TeamSection } from './components/team/TeamSection'
import { JourneySection } from './components/journey/JourneySection'
import { BeforeAfterSection } from './components/before-after/BeforeAfterSection'
import { ResultsDashboardSection } from './components/results/ResultsDashboardSection'
import { ResearchBridgeSection } from './components/research-bridge/ResearchBridgeSection'
import { AcademySection } from './components/academy/AcademySection'
import { EvidenceSection } from './components/evidence/EvidenceSection'
import { ReportSection } from './components/report/ReportSection'

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950">
      <CinematicIntro />
      <Header />
      <main>
        <HeroSection />
        <DiscoverSparkSquadSection />
        <JourneySection />
        <ResearchBridgeSection />
        <SimulatorSection />
        <RealProjectSection />
        <BeforeAfterSection />
        <ResultsDashboardSection />
        <ComparisonSection />
        <AcademySection />
        <EvidenceSection />
        <ReportSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  )
}
