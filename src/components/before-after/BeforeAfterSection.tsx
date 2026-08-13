import { ArrowRight, ImageOff, Trash2, Upload } from 'lucide-react'
import { projectAssets } from '../../data/projectData'
import { usePersistentState } from '../../hooks/usePersistentState'

interface HeatmapImage {
  src: string
  name: string
}
type Heatmaps = {
  before: HeatmapImage | null
  after: HeatmapImage | null
}

function readImage(file: File, onLoad: (image: HeatmapImage) => void) {
  const reader = new FileReader()
  reader.onload = () => onLoad({ src: reader.result as string, name: file.name })
  reader.readAsDataURL(file)
}

export function BeforeAfterSection() {
  const [heatmaps, setHeatmaps] = usePersistentState<Heatmaps>('sch_heatmaps', {
    before: null,
    after: null,
  })

  const beforeAsset = projectAssets.find(
    (asset) => asset.label === 'Original / before heatmap',
  )
  const afterAsset = projectAssets.find(
    (asset) => asset.label === 'Optimized / after heatmap',
  )

  const upload = (side: 'before' | 'after', file?: File) => {
    if (!file) return
    readImage(file, (image) =>
      setHeatmaps((current) => ({ ...current, [side]: image })),
    )
  }

  const renderHeatmap = (
    side: 'before' | 'after',
    label: string,
    accent: 'cyan' | 'gold',
    asset: typeof beforeAsset,
  ) => {
    const image = heatmaps[side]
    return (
      <div className="card-surface p-5 flex-1">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                accent === 'cyan' ? 'bg-cyan-400' : 'bg-gold-400'
              }`}
            />
            <h3 className="font-semibold text-white">{label}</h3>
          </div>
          <label className="btn-ghost cursor-pointer">
            <Upload size={15} /> {image ? 'Replace' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => upload(side, event.target.files?.[0])}
            />
          </label>
        </div>
        {image ? (
          <>
            <div className="rounded-lg overflow-hidden border border-navy-700/50 bg-navy-950">
              <img
                src={image.src}
                alt={`${label} heatmap`}
                className="w-full h-auto"
              />
            </div>
            <div className="flex items-center justify-between gap-3 mt-3">
              <p className="text-xs text-slate-500 font-mono truncate">
                {image.name}
              </p>
              <button
                onClick={() =>
                  setHeatmaps((current) => ({ ...current, [side]: null }))
                }
                className="btn-ghost hover:text-red-400"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-navy-600 bg-navy-950/50 aspect-video flex flex-col items-center justify-center p-6 text-center">
            <ImageOff size={32} className="text-slate-600 mb-3" />
            <p className="text-sm text-slate-500 font-mono">
              Awaiting validated project data
            </p>
            <p className="text-xs text-slate-600 mt-1">{asset?.description}</p>
          </div>
        )}
        <p className="text-xs text-slate-600 mt-3 font-mono">
          {asset?.reportSection}
        </p>
      </div>
    )
  }

  return (
    <section id="before-after" className="py-20 px-4 md:px-8 relative grid-bg">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="section-label">
            <ArrowRight size={14} /> Before → After Optimization
          </span>
          <h2 className="section-title mt-2">Before → After Optimization</h2>
          <p className="text-slate-400 mt-3 max-w-3xl">
            Upload the original and optimized heatmaps to compare them side-by-side.
            Images are shown exactly as uploaded, with no recoloring or processing.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <label className="btn-primary cursor-pointer">
              <Upload size={16} /> Upload Before Heatmap
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => upload('before', event.target.files?.[0])}
              />
            </label>
            <label className="btn-gold cursor-pointer">
              <Upload size={16} /> Upload After Heatmap
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => upload('after', event.target.files?.[0])}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {renderHeatmap('before', 'Before Optimization', 'cyan', beforeAsset)}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-navy-850 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <ArrowRight
                size={20}
                className="text-cyan-400 rotate-90 md:rotate-0"
              />
            </div>
          </div>
          {renderHeatmap('after', 'After Optimization', 'gold', afterAsset)}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-navy-850/30 border border-navy-700/30">
          <p className="text-sm text-slate-500">
            <span className="text-gold-400 font-mono">Display note:</span> Red
            represents strong signal and blue represents weak signal or dead
            zones. Uploaded heatmaps are never recolored.
          </p>
        </div>
      </div>
    </section>
  )
}
