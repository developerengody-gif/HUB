import { useState } from 'react'
import {
  BookOpen,
  Download,
  FileText,
  Maximize2,
  Play,
  Upload,
  Video,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { usePersistentFile } from '../../hooks/usePersistentFile'

export function DiscoverSparkSquadSection() {
  const guide = usePersistentFile('spark-squad-guide', 'application/pdf')
  const demo = usePersistentFile('spark-squad-demo', 'video/')
  const [guideZoom, setGuideZoom] = useState(100)

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
    save: (file: File) => Promise<void>,
  ) => {
    const selected = event.target.files?.[0]
    if (selected) await save(selected)
    event.target.value = ''
  }

  return (
    <section id="discover-spark-squad" className="py-20 px-4 md:px-8 relative grid-bg-fine">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 max-w-3xl">
          <span className="section-label"><span className="text-base">⌕</span> Discover Spark Squad</span>
          <h2 className="section-title mt-2">Explore the team behind the signal</h2>
          <p className="text-slate-400 mt-3 leading-relaxed">
            Explore the project through a simple guide and a practical demo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card-surface-hover overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <BookOpen size={20} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Spark Squad Guide</h3>
                  <p className="text-xs text-slate-500 mt-1">Upload and browse the project guide</p>
                </div>
              </div>
              <FileText size={18} className="text-slate-600" />
            </div>

            <div className="mx-5 rounded-lg border border-navy-700/60 bg-navy-950/70 overflow-hidden" style={{ height: 330 }}>
              {guide.file ? (
                <iframe
                  key={`${guide.file.url}-${guideZoom}`}
                  src={`${guide.file.url}#view=FitH`}
                  title="Spark Squad Guide PDF"
                  className="w-full h-full border-0"
                  style={{ transform: `scale(${guideZoom / 100})`, transformOrigin: 'top center' }}
                />
              ) : (
                <EmptyPreview icon={<FileText size={32} />} label="Your guide PDF will appear here" />
              )}
            </div>

            <div className="p-5 flex flex-wrap items-center gap-2">
              <label className="btn-primary cursor-pointer">
                <Upload size={16} /> Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(event) => void handleFile(event, guide.save)}
                />
              </label>
              {guide.file && (
                <>
                  <button onClick={() => setGuideZoom(Math.max(50, guideZoom - 25))} className="btn-ghost" title="Zoom out"><ZoomOut size={16} /></button>
                  <span className="text-xs text-slate-500 font-mono">{guideZoom}%</span>
                  <button onClick={() => setGuideZoom(Math.min(200, guideZoom + 25))} className="btn-ghost" title="Zoom in"><ZoomIn size={16} /></button>
                  <a href={guide.file.url} target="_blank" rel="noopener noreferrer" className="btn-ghost" title="Open fullscreen"><Maximize2 size={16} /></a>
                  <a href={guide.file.url} download={guide.file.name} className="btn-ghost" title="Download guide"><Download size={16} /></a>
                </>
              )}
            </div>
            {guide.file && <p className="px-5 pb-4 text-xs text-slate-600 font-mono truncate">{guide.file.name} · saved in this browser</p>}
          </div>

          <div className="card-surface-hover overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Video size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Spark Squad Demo</h3>
                  <p className="text-xs text-slate-500 mt-1">Upload and play the project demo</p>
                </div>
              </div>
              <Play size={18} className="text-slate-600" />
            </div>

            <div className="mx-5 rounded-lg border border-navy-700/60 bg-navy-950/70 overflow-hidden flex items-center justify-center" style={{ height: 330 }}>
              {demo.file ? (
                <video key={demo.file.url} src={demo.file.url} controls className="w-full h-full object-contain" preload="metadata">
                  Your browser does not support embedded video playback.
                </video>
              ) : (
                <EmptyPreview icon={<Video size={32} />} label="Your demo video will appear here" />
              )}
            </div>

            <div className="p-5 flex flex-wrap items-center gap-2">
              <label className="btn-primary cursor-pointer">
                <Upload size={16} /> Upload Video
                <input
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={(event) => void handleFile(event, demo.save)}
                />
              </label>
              {demo.file && <span className="text-xs text-slate-600 font-mono truncate max-w-[220px]">{demo.file.name} · saved in this browser</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EmptyPreview({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-600">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  )
}
