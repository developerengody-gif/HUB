export interface ProjectMetric {
  label: string
  value: string
  detail: string
  reportSection: string
  reportPage: number
}

export interface ReportSectionData {
  id: string
  number: string
  title: string
  description: string
  page: number
  topics: string[]
  projectLink?: string
}

export interface ProjectAsset {
  label: string
  kind: 'heatmap' | 'map' | 'hardware' | 'experiment'
  path: string | null
  description: string
  reportSection: string
}

export const reportPath = '/reports/finall_(2).pdf'

export const reportSections: ReportSectionData[] = [
  { id: 'abstract', number: '1', title: 'Abstract and Problem Definition', description: 'The report frames uneven indoor signal distribution, identifies dead zones and interference as the problem, and defines the project objectives.', page: 3, topics: ['Background and motivation', 'Problem statement', 'Research objectives'] },
  { id: 'literature', number: '2', title: 'Literature Review', description: 'A review of wide wireless LANs, repeater systems, distributed antenna systems, phased arrays, and the gaps the project addresses.', page: 5, topics: ['Coverage improvement', 'Repeater systems', 'Distributed antenna systems', 'Analog IC with phased array antenna'], projectLink: 'real-project' },
  { id: 'modeling', number: '3', title: 'Mathematical Modeling', description: 'The mathematical and computational model covers heat-map generation, node placement, node optimization, phased-array steering, and power consumption.', page: 12, topics: ['Heat Map', 'Node Placement', 'Node Optimization', 'Phased Antenna Array', 'Power consumption'], projectLink: 'real-project' },
  { id: 'experimental', number: '4', title: 'Experimental Results', description: 'MATLAB-based experiments evaluate a single-antenna baseline, placement and optimization, phased-array behavior, software prototypes, hardware, and RSSI calibration.', page: 19, topics: ['Single Antenna Baseline Model', 'Node Placement', 'Nodes Optimization', 'Phased Antenna Array Model', 'Software Prototype', 'Hardware Prototype', 'RSSI Sensitivity Calibration'], projectLink: 'results' },
  { id: 'final-results', number: '5', title: 'Final Results', description: 'The report consolidates the validated outcomes: power reduction, node density reduction, peak signal achieved, excellent coverage, and the power analysis.', page: 34, topics: ['Final results table', 'Number of elements', 'Power analysis'], projectLink: 'results' },
  { id: 'conclusion', number: '6', title: 'Conclusion and Future Work', description: 'The conclusion summarizes the MATLAB optimization structure and identifies the future path toward a web application and broader implementation.', page: 35, topics: ['Conclusion', 'Future work'], projectLink: 'journey' },
  { id: 'references', number: '7', title: 'References', description: 'The source material and research references used throughout the report.', page: 36, topics: ['Research sources', 'Technical references'] },
]

export const projectMetrics: ProjectMetric[] = [
  { label: 'Power reduction', value: '80%', detail: '5-element phased array compared with a single antenna at equivalent peak signal.', reportSection: '5 — Final Results', reportPage: 34 },
  { label: 'Node density reduction', value: '44.8%', detail: 'The optimized set reduced 29 initial candidate coordinates to 16 nodes.', reportSection: '4 — Experimental Results', reportPage: 24 },
  { label: 'Peak signal achieved', value: '19.0 dB', detail: 'Peak signal reported for the phased-array model.', reportSection: '5 — Final Results', reportPage: 34 },
  { label: 'Excellent coverage', value: '64%', detail: 'Area reported as excellent coverage in the final results.', reportSection: '5 — Final Results', reportPage: 34 },
]

export const projectParameters = [
  { label: 'Array elements', value: '5', reportSection: '4 — Experimental Results', page: 25 },
  { label: 'Element spacing', value: 'λ/2', reportSection: '4 — Experimental Results', page: 26 },
  { label: 'Scanning sector', value: '0° to 90°', reportSection: '4 — Experimental Results', page: 26 },
  { label: 'Angular resolution', value: '5°', reportSection: '4 — Experimental Results', page: 26 },
  { label: 'Initial candidates', value: '29', reportSection: '4 — Experimental Results', page: 24 },
  { label: 'Final nodes', value: '16', reportSection: '4 — Experimental Results', page: 24 },
]

export const projectAssets: ProjectAsset[] = [
  { label: 'Original / before heatmap', kind: 'heatmap', path: null, description: 'Add the validated single-antenna heatmap here when the source asset is available.', reportSection: '4 — Experimental Results, p. 21' },
  { label: 'Optimized / after heatmap', kind: 'heatmap', path: null, description: 'Add the validated phased-array or composite coverage heatmap here when the source asset is available.', reportSection: '4 — Experimental Results, p. 27' },
  { label: 'Building map', kind: 'map', path: null, description: 'Add the source building or campus map used by the model here.', reportSection: '4 — Experimental Results, p. 20' },
  { label: 'Node placement result', kind: 'map', path: null, description: 'Add the validated placement export here when it is available as a standalone asset.', reportSection: '4 — Experimental Results, p. 23-25' },
  { label: 'Hardware proof of concept', kind: 'hardware', path: null, description: 'Add the hardware prototype photography here when it is available.', reportSection: '4 — Experimental Results, p. 32' },
]

export const projectJourney = [
  { number: '01', title: 'Problem Definition', text: 'Identify uneven signal distribution, attenuation, reflections, and dead zones in complex environments.', reportId: 'abstract' },
  { number: '02', title: 'Mathematical Model', text: 'Model wave propagation with the time-harmonic Helmholtz equation and finite-difference methods.', reportId: 'modeling' },
  { number: '03', title: 'Heat Map', text: 'Convert the computed field and received power into a visual signal-strength map.', reportId: 'modeling' },
  { number: '04', title: 'Node Placement', text: 'Transform map information into target points and candidate locations for coverage.', reportId: 'modeling' },
  { number: '05', title: 'Node Optimization', text: 'Use integer linear programming, spatial filtering, and constraint satisfaction to refine placement.', reportId: 'modeling' },
  { number: '06', title: 'Phased Array', text: 'Steer a five-element array across a 90-degree sector and synthesize composite coverage.', reportId: 'modeling' },
  { number: '07', title: 'Experimental Results', text: 'Compare the baseline, optimized nodes, phased array, software prototype, and hardware proof of concept.', reportId: 'experimental' },
]

export const academyTopics = [
  { title: 'What is a dead zone?', description: 'A region where signal strength falls below the modeled or measured threshold, making reliable communication difficult.', reportId: 'abstract' },
  { title: 'Why buildings affect propagation', description: 'Walls and obstacles introduce attenuation, reflections, diffraction, and multipath interference in the modeled environment.', reportId: 'experimental' },
  { title: 'What a heat map represents', description: 'A spatial view of the calculated signal field or received power across the modeled area.', reportId: 'modeling' },
  { title: 'How node placement works', description: 'Candidate positions are selected from the map and evaluated against coverage, distance, and obstacle constraints.', reportId: 'modeling' },
  { title: 'Why optimization matters', description: 'The optimization stage seeks a smaller, useful deployment while preserving coverage constraints.', reportId: 'experimental' },
]

export const evidenceItems = [
  { title: 'Propagation model', proves: 'The project models signal behavior in an environment rather than treating coverage as uniform.', source: 'Report — Section 3, Mathematical Modeling', page: 12, reportId: 'modeling' },
  { title: 'Node optimization result', proves: 'The report documents the change from 29 initial coordinates to 16 final nodes.', source: 'Report — Section 4, Experimental Results', page: 24, reportId: 'experimental' },
  { title: 'Phased-array comparison', proves: 'The report compares the single antenna and phased-array configurations, including peak signal and power analysis.', source: 'Report — Section 5, Final Results', page: 34, reportId: 'final-results' },
  { title: 'Hardware proof of concept', proves: 'The research includes a hardware prototype and a smart beam-steering workflow.', source: 'Report — Section 4, Experimental Results', page: 32, reportId: 'experimental' },
]

export function getReportSection(id: string) {
  return reportSections.find((section) => section.id === id)
}

export function reportPageUrl(page: number) {
  return `${reportPath}#page=${page}`
}
