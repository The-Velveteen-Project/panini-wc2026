import { createClient } from '@/lib/supabase/server'
import ProgressClient from '@/components/ProgressClient'

export default async function ProgressPage() {
  const supabase = await createClient()

  const [{ data: stickers }, { data: albumStickers }] = await Promise.all([
    supabase.from('stickers').select('*').order('number'),
    supabase.from('album_stickers').select('*'),
  ])

  const countMap: Record<number, number> = {}
  for (const as of albumStickers ?? []) {
    countMap[as.sticker_id] = as.count
  }

  const total     = stickers?.length ?? 0
  const collected = (albumStickers ?? []).filter(r => r.count > 0).length
  const repeated  = (albumStickers ?? []).filter(r => r.count >= 2).length
  const missing   = total - collected

  // Stats por sección
  const sections = Array.from(new Set((stickers ?? []).map(s => s.section)))
  const sectionStats = sections.map(section => {
    const items = (stickers ?? []).filter(s => s.section === section)
    const done  = items.filter(s => (countMap[s.id] ?? 0) > 0).length
    return { section, total: items.length, collected: done }
  })

  return (
    <ProgressClient
      total={total}
      collected={collected}
      repeated={repeated}
      missing={missing}
      sectionStats={sectionStats}
    />
  )
}
