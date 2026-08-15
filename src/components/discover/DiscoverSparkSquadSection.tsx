import { useEffect, useState, useCallback } from 'react'
import { BookOpen, Download, FileText, Maximize2, Play, Trash2, Upload, Video, ZoomIn, ZoomOut, Loader as Loader2 } from 'lucide-react'
import { supabase, HUB_FILES_BUCKET, type HubFile } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export function DiscoverSparkSquadSection() {
  const { isAdmin } = useAuth()
  const [guide, setGuide] = useState<HubFile | null>(null)
  const [demo, setDemo] = useState<HubFile | null>(null)
  const [guideUrl, setGuideUrl] = useState<string | null>(null)
  const [demoUrl, setDemoUrl] = useState<string | null>(null)
  const [guideZoom, setGuideZoom] = useState(100)
  const [uploading, setUploading] = useState<'guide' | 'demo' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadFile = useCallback(async (kind: 'guide' | 'demo') => {
    const { data, error: err } = await supabase
      .from('hub_files')
      .select('*')
      .eq('kind', kind)
      .maybeSingle()

    if (err) return null
    if (!data) {
      if (kind === 'guide') { setGuide(null); setGuideUrl(null) }
      else { setDemo(null); setDemoUrl(null) }
      return null
    }

    const file = data as HubFile
    const { data: urlData } = supabase
      .storage
      .from(HUB_FILES_BUCKET)
      .getPublicUrl(file.storage_path)

    if (kind === 'guide') { setGuide(file); setGuideUrl(urlData.publicUrl) }
    else { setDemo(file); setDemoUrl(urlData.publicUrl) }
    return file
  }, [])

  const loadAll = useCallback(async () => {
    await Promise.all([loadFile('guide'), loadFile('demo')])
  }, [loadFile])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const uploadFile = async (kind: 'guide' | 'demo', selected: File) => {
    setError(null)
    setUploading(kind)

    try {
      const ext = selected.name.split('.').pop() || 'bin'
      const path = `${kind}-${Date.now()}.${ext}`

      const { error: upErr } = await supabase
        .storage
        .from(HUB_FILES_BUCKET)
        .upload(path, selected, { upsert: true })

      if (upErr) throw upErr

      const existing = kind === 'guide' ? guide : demo
      if (existing) {
        await supabase.storage.from(HUB_FILES_BUCKET).remove([existing.storage_path])
      }

      const row = {
        kind,
        file_name: selected.name,
        storage_path: path,
        mime_type: selected.type || 'application/octet-stream',
        size_bytes: selected.size,
      }

      if (existing) {
        const { error: updErr } = await supabase
          .from('hub_files')
          .update(row)
          .eq('id', existing.id)
        if (updErr) throw updErr
      } else {
        const { error: insErr } = await supabase
          .from('hub_files')
          .insert(row)
        if (insErr) throw insErr
      }

      await loadFile(kind)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Make sure you are signed in as admin.')
    } finally {
      setUploading(null)
    }
  }

  const deleteFile = async (kind: 'guide' | 'demo') => {
    setError(null)
    const file = kind === 'guide' ? guide : demo
    if (!file) return

    try {
      await supabase.storage.from(HUB_FILES_BUCKET).remove([file.storage_path])
      await supabase.from('hub_files').delete().eq('id', file.id)
      if (kind === 'guide') { setGuide(null); setGuideUrl(null) }
      else { setDemo(null); setDemoUrl(null) }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.')
    }
  }

  const handleFileInput = (kind: 'guide' | 'demo', e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) void uploadFile(kind, selected)
    e.target.value = ''
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

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Guide PDF card */}
          <div className="card-surface-hover overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <BookOpen size={20} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Spark Squad Guide</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {guide ? guide.file_name : 'No guide uploaded yet'}
                  </p>
                </div>
              </div>
              <FileText size={18} className="text-slate-600" />
            </div>

            <div className="mx-5 rounded-lg border border-navy-700/60 bg-navy-950/70 overflow-hidden" style={{ height: 330 }}>
              {guideUrl ? (
                <iframe
                  key={`${guideUrl}-${guideZoom}`}
                  src={`${guideUrl}#view=FitH`}
                  title="Spark Squad Guide PDF"
                  className="w-full h-full border-0"
                  style={{ transform: `scale(${guideZoom / 100})`, transformOrigin: 'top center' }}
                />
              ) : (
                <EmptyPreview icon={<FileText size={32} />} label="The guide PDF will appear here once uploaded" />
              )}
            </div>

            <div className="p-5 flex flex-wrap items-center gap-2">
              {isAdmin && (
                <label className="btn-primary cursor-pointer">
                  <Upload size={16} /> {guide ? 'Replace PDF' : 'Upload PDF'}
                  <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => handleFileInput('guide', e)} disabled={uploading === 'guide'} />
                </label>
              )}
              {uploading === 'guide' && <Loader2 size={16} className="animate-spin text-cyan-400" />}
              {guideUrl && (
                <>
                  <button onClick={() => setGuideZoom(Math.max(50, guideZoom - 25))} className="btn-ghost" title="Zoom out"><ZoomOut size={16} /></button>
                  <span className="text-xs text-slate-500 font-mono">{guideZoom}%</span>
                  <button onClick={() => setGuideZoom(Math.min(200, guideZoom + 25))} className="btn-ghost" title="Zoom in"><ZoomIn size={16} /></button>
                  <a href={guideUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" title="Open fullscreen"><Maximize2 size={16} /></a>
                  <a href={guideUrl} download={guide?.file_name} className="btn-ghost" title="Download guide"><Download size={16} /></a>
                  {isAdmin && guide && (
                    <button onClick={() => void deleteFile('guide')} className="btn-ghost text-red-400 hover:text-red-300" title="Delete guide"><Trash2 size={16} /></button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Demo video card */}
          <div className="card-surface-hover overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Video size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Spark Squad Demo</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {demo ? demo.file_name : 'No demo uploaded yet'}
                  </p>
                </div>
              </div>
              <Play size={18} className="text-slate-600" />
            </div>

            <div className="mx-5 rounded-lg border border-navy-700/60 bg-navy-950/70 overflow-hidden flex items-center justify-center" style={{ height: 330 }}>
              {demoUrl ? (
                <video key={demoUrl} src={demoUrl} controls className="w-full h-full object-contain" preload="metadata">
                  Your browser does not support embedded video playback.
                </video>
              ) : (
                <EmptyPreview icon={<Video size={32} />} label="The demo video will appear here once uploaded" />
              )}
            </div>

            <div className="p-5 flex flex-wrap items-center gap-2">
              {isAdmin && (
                <label className="btn-primary cursor-pointer">
                  <Upload size={16} /> {demo ? 'Replace Video' : 'Upload Video'}
                  <input type="file" accept="video/*" className="sr-only" onChange={(e) => handleFileInput('demo', e)} disabled={uploading === 'demo'} />
                </label>
              )}
              {uploading === 'demo' && <Loader2 size={16} className="animate-spin text-cyan-400" />}
              {demoUrl && (
                <>
                  <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" title="Open fullscreen"><Maximize2 size={16} /></a>
                  <a href={demoUrl} download={demo?.file_name} className="btn-ghost" title="Download demo"><Download size={16} /></a>
                  {isAdmin && demo && (
                    <button onClick={() => void deleteFile('demo')} className="btn-ghost text-red-400 hover:text-red-300" title="Delete demo"><Trash2 size={16} /></button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {!isAdmin && !guide && !demo && (
          <p className="text-center text-xs text-slate-600 font-mono mt-6">
            The admin can sign in to upload the Guide and Demo.
          </p>
        )}
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
