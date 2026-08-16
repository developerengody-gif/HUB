import { useState } from 'react'
import {
  Radio,
  Building2,
  Signal,
  MapPin,
  Network,
  Gauge,
  Target,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  FileText,
  Plus,
} from 'lucide-react'
import { useCloudSetting } from '../../hooks/useCloudSetting'
import {
  ProjectDataModal,
  type ProjectDataItem,
} from './ProjectDataModal'

const realResults = [
  { label: 'Power Reduction', value: '80%', detail: 'Saved via 5-element phased array vs single antenna', source: 'Report: Final Results' },
  { label: 'Node Density Reduction', value: '44.8%', detail: 'From 29 initial candidates to 16 optimized nodes', source: 'Report: Final Results' },
  { label: 'Peak Signal Achieved', value: '19.0 dB', detail: '5-element array at +5 dB per element', source: 'Report: Final Results' },
  { label: 'Excellent Coverage', value: '64%', detail: 'Of the deployment area rated excellent', source: 'Report: Final Results' },
]

const realParams = [
  { label: 'Array Elements', value: '5', detail: 'Optimal efficiency point — +14 dB boost from 1 to 5' },
  { label: 'Element Spacing', value: 'lambda/2', detail: 'Prevents grating lobes, maximizes directivity' },
  { label: 'Scan Sector', value: '0 to 90 deg', detail: 'Electronic beam steering across target area' },
  { label: 'Angular Resolution', value: '5 deg', detail: 'Precise beamwidth for targeted illumination' },
  { label: 'Distance Threshold', value: '50', detail: 'Spatial filter constraint for node pruning' },
  { label: 'MinDistPruning Buffer', value: '70', detail: 'Enforces interference-free spatial separation' },
]

const powerComparison = [
  { config: 'Single Antenna', source: '+10 dB', peak: '10 dB' },
  { config: 'Phased Array (5 elements)', source: '5 x (+5 dB)', peak: '19 dB' },
  { config: 'Single (to match 19 dB)', source: '~+19 dB (79.4 units)', peak: '19 dB' },
]

const dataAreas = [
  { icon: MapPin, title: 'Real Heatmap', status: 'placeholder', description: 'The composite heatmap generated from MATLAB simulation showing signal strength distribution across the deployment area.' },
  { icon: Radio, title: 'Main Antenna', status: 'data', description: '5-element phased array antenna with lambda/2 element spacing, electronically steered across a 90 degree sector with 5 degree angular resolution.' },
  { icon: Building2, title: 'Building Layout', status: 'placeholder', description: 'The physical environment model used for signal propagation — walls, obstacles, and floor plan that cause attenuation and reflections.' },
  { icon: Signal, title: 'Signal Strength', status: 'data', description: 'Peak signal of 19.0 dB achieved with the phased array. Single antenna baseline measured at 10 dB. 64% of the area rated excellent coverage.' },
  { icon: Target, title: 'Dead Zones', status: 'placeholder', description: 'Areas identified as signal-deficient through the Helmholtz equation modeling and RSSI sensitivity calibration.' },
  { icon: Network, title: 'Node Placement', status: 'data', description: 'Initial extraction identified 29 candidate coordinates. After spatial optimization with greedy algorithm and CSP, refined to 16 optimal nodes.' },
  { icon: Gauge, title: 'Optimization', status: 'data', description: 'Greedy algorithm with constraint satisfaction pruned nodes using distance threshold of 50, RF sector stability filter, and 70 unit decorrelation buffer.' },
  { icon: Zap, title: 'Coverage Results', status: 'data', description: '80% power reduction, 44.8% node density reduction, 19.0 dB peak signal, and 64% excellent coverage across the deployment area.' },
]

const initialProjectData: ProjectDataItem[] = [
  ...realResults.map((item, index) => ({
    id: `result-${index}`,
    category: 'Validated result' as const,
    label: item.label,
    value: item.value,
    detail: item.detail,
    source: item.source,
  })),
  ...realParams.map((item, index) => ({
    id: `parameter-${index}`,
    category: 'Technical parameter' as const,
    label: item.label,
    value: item.value,
    detail: item.detail,
    source: 'Project report',
  })),
]

export function RealProjectSection() {
  const { value: projectData, setValue: setProjectData } = useCloudSetting<ProjectDataItem[]>(
    'project_data',
    initialProjectData,
  )
  const [modalOpen, setModalOpen] = useState(false)

  const imageEntries = projectData.filter(
    (item) =>
      item.category === 'Project image' || item.category === 'Engineering diagram',
  )

  return (
    <section id="real-project" className="py-20 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="section-label">
            <Cpu size={14} /> Engineering Work
          </span>
          <h2 className="section-title mt-2">Explore the Real Project</h2>
          <p className="text-slate-400 mt-3 max-w-3xl">
            The simulator is an interactive representation of the same engineering problem studied in
            this real project. Below is the actual research — mathematical modeling, simulation
            results, and hardware prototyping — that the game is based on.
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mt-5">
            <Plus size={16} /> Add Project Data
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {realResults.map((r) => (
            <div key={r.label} className="card-surface-hover p-5">
              <p className="stat-label mb-2">{r.label}</p>
              <p className="stat-value">{r.value}</p>
              <p className="text-sm text-slate-400 mt-2">{r.detail}</p>
              <p className="text-xs text-slate-600 mt-1 font-mono">Source: {r.source}</p>
            </div>
          ))}
        </div>

        {imageEntries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {imageEntries.map((item) => (
              <div key={item.id} className="card-surface-hover p-5">
                <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider">
                  {item.category}
                </p>
                <h3 className="font-semibold text-white mt-2">
                  {item.label || 'Untitled project asset'}
                </h3>
                {item.file && (
                  <img
                    src={item.file}
                    alt={item.label}
                    className="w-full max-h-64 object-contain rounded-lg bg-navy-950 mt-4"
                  />
                )}
                <p className="text-sm text-slate-400 mt-3">{item.detail}</p>
                {item.source && (
                  <p className="text-xs text-slate-600 mt-2 font-mono">
                    Source: {item.source}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {dataAreas.map((area) => (
            <div key={area.title} className="card-surface-hover p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-850 border border-navy-600 flex items-center justify-center flex-shrink-0">
                  <area.icon size={22} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{area.title}</h3>
                    {area.status === 'placeholder' ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 font-mono">
                        EDITABLE CONTENT
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                        REPORT DATA
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{area.description}</p>
                  {area.status === 'placeholder' && (
                    <div className="mt-3 p-3 rounded-lg border border-dashed border-navy-600 bg-navy-950/50">
                      <p className="text-xs text-slate-500 font-mono">
                        REAL PROJECT DATA WILL BE INSERTED HERE
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-surface p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Layers size={18} className="text-cyan-400" />
            <h3 className="font-semibold text-white">Technical Parameters</h3>
            <span className="text-xs text-slate-500 font-mono ml-2">From report</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {realParams.map((p) => (
              <div key={p.label} className="p-4 rounded-lg bg-navy-850/50 border border-navy-700/40">
                <p className="stat-label mb-1">{p.label}</p>
                <p className="text-xl font-bold font-mono text-cyan-300">{p.value}</p>
                <p className="text-xs text-slate-500 mt-1.5">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={18} className="text-gold-400" />
            <h3 className="font-semibold text-white">Power Analysis</h3>
            <span className="text-xs text-slate-500 font-mono ml-2">From report</span>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700/50">
                  <th className="text-left py-3 px-4 text-slate-400 font-mono uppercase text-xs tracking-wider">Configuration</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-mono uppercase text-xs tracking-wider">Source Power</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-mono uppercase text-xs tracking-wider">Peak Achieved</th>
                </tr>
              </thead>
              <tbody>
                {powerComparison.map((row) => (
                  <tr key={row.config} className="border-b border-navy-800/40 last:border-0">
                    <td className="py-3 px-4 text-slate-200">{row.config}</td>
                    <td className="py-3 px-4 text-cyan-300 font-mono">{row.source}</td>
                    <td className="py-3 px-4 text-cyan-300 font-mono">{row.peak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-navy-850/50 border border-navy-700/40">
            <p className="text-sm text-slate-400">
              <span className="text-gold-400 font-mono">Mathematical proof:</span>{' '}
              Single antenna to match 19 dB requires 79.4 power units. 5-element array total: 15.8 units.
              Ratio: 15.8 / 79.4 = 20% — meaning 80% power is saved.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 p-4 rounded-lg bg-navy-850/30 border border-navy-700/30">
          <FileText size={18} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-500">
            All quantitative values shown here are sourced directly from the project's engineering report.
            Areas marked <span className="text-gold-400 font-mono">EDITABLE CONTENT</span> are structurally
            ready for additional real project data (heatmaps, diagrams, building layouts) to be inserted later.
          </p>
        </div>
      </div>
      {modalOpen && (
        <ProjectDataModal
          items={projectData}
          onSave={setProjectData}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  )
}
