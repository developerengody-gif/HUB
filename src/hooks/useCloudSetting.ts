import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getSetting, saveSetting } from '../lib/cloudData'
import { useAuth } from './useAuth'

interface CloudSettingRow {
  key: string
  value: unknown
}

export function useCloudSetting<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [loaded, setLoaded] = useState(false)
  const { isAdmin } = useAuth()
  const localStorageKey = `sch_${key}`

  const load = useCallback(async () => {
    const cloud = await getSetting<T>(key)
    if (cloud !== null) {
      setValue(cloud)
      setLoaded(true)
      return
    }

    try {
      const raw = localStorage.getItem(localStorageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as T
        setValue(parsed)
        setLoaded(true)
        if (isAdmin) {
          void saveSetting(key, parsed)
        }
      } else {
        setValue(initialValue)
        setLoaded(true)
      }
    } catch {
      setValue(initialValue)
      setLoaded(true)
    }
  }, [key, localStorageKey, initialValue, isAdmin])

  useEffect(() => {
    void load()
  }, [load])

  const update = useCallback(
    async (newValue: T) => {
      setValue(newValue)
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(newValue))
      } catch {
        // ignore
      }
      if (isAdmin) {
        await saveSetting(key, newValue)
      }
    },
    [key, localStorageKey, isAdmin],
  )

  useEffect(() => {
    const channel = supabase
      .channel(`app_settings:${key}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings', filter: `key=eq.${key}` },
        (payload) => {
          const row = payload.new as CloudSettingRow | null
          if (row && row.value) setValue(row.value as T)
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [key])

  return { value, setValue: update, loaded }
}
