import { useCallback, useEffect, useState } from 'react'

interface StoredFile {
  key: string
  name: string
  type: string
  blob: Blob
  updatedAt: number
}

export interface PersistentFile {
  name: string
  type: string
  url: string
  updatedAt: number
}

const databaseName = 'signal-coverage-hub-files'
const storeName = 'uploads'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName, { keyPath: 'key' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function usePersistentFile(key: string, accept: string) {
  const [file, setFile] = useState<PersistentFile | null>(null)
  const [busy, setBusy] = useState(true)

  const load = useCallback(async () => {
    if (!('indexedDB' in window)) {
      setBusy(false)
      return
    }

    try {
      const database = await openDatabase()
      const request = database.transaction(storeName, 'readonly').objectStore(storeName).get(key)
      request.onsuccess = () => {
        const stored = request.result as StoredFile | undefined
        if (stored) {
          setFile({
            name: stored.name,
            type: stored.type,
            url: URL.createObjectURL(stored.blob),
            updatedAt: stored.updatedAt,
          })
        }
        setBusy(false)
      }
      request.onerror = () => setBusy(false)
    } catch {
      setBusy(false)
    }
  }, [key])

  useEffect(() => {
    void load()
    return () => {
      setFile((current) => {
        if (current) URL.revokeObjectURL(current.url)
        return current
      })
    }
  }, [load])

  const save = useCallback(async (selected: File) => {
    if (!selected.type.match(new RegExp(`^(${accept.replaceAll(',', '|')})`))) return

    setBusy(true)
    try {
      const database = await openDatabase()
      const stored: StoredFile = {
        key,
        name: selected.name,
        type: selected.type,
        blob: selected,
        updatedAt: Date.now(),
      }
      await new Promise<void>((resolve, reject) => {
        const request = database.transaction(storeName, 'readwrite').objectStore(storeName).put(stored)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
      setFile((current) => {
        if (current) URL.revokeObjectURL(current.url)
        return {
          name: selected.name,
          type: selected.type,
          url: URL.createObjectURL(selected),
          updatedAt: stored.updatedAt,
        }
      })
    } finally {
      setBusy(false)
    }
  }, [accept, key])

  return { file, busy, save }
}
