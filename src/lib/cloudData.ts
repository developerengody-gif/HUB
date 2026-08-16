import { supabase, HUB_FILES_BUCKET } from './supabase'

export async function getSetting<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error || !data) return null
  return data.value as T
}

export async function saveSetting<T>(key: string, value: T): Promise<boolean> {
  const { error } = await supabase
    .from('app_settings')
    .upsert({ key, value }, { onConflict: 'key' })
  return !error
}

export async function uploadImage(
  file: File,
  prefix: string,
): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'png'
  const path = `images/${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase
    .storage
    .from(HUB_FILES_BUCKET)
    .upload(path, file, { upsert: true })

  if (error) return null

  const { data } = supabase
    .storage
    .from(HUB_FILES_BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}

export async function removeImage(url: string): Promise<void> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
    const prefix = `${supabaseUrl}/storage/v1/object/public/${HUB_FILES_BUCKET}/`
    if (!url.startsWith(prefix)) return
    const path = url.slice(prefix.length)
    await supabase.storage.from(HUB_FILES_BUCKET).remove([path])
  } catch {
    // best-effort
  }
}

export function dataUrlToFile(dataUrl: string, filename: string): File | null {
  try {
    const [meta, base64] = dataUrl.split(',')
    if (!base64) return null
    const mimeMatch = meta.match(/data:([^;]+)/)
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return new File([bytes], filename, { type: mime })
  } catch {
    return null
  }
}
