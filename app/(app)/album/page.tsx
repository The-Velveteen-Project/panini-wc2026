import { createClient } from '@/lib/supabase/server'
import AlbumClient from '@/components/AlbumClient'

export default async function AlbumPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: stickers }, { data: albumStickers }] = await Promise.all([
    supabase.from('stickers').select('*').order('number'),
    supabase.from('album_stickers').select('*'),
  ])

  const countMap: Record<number, number> = {}
  for (const as of albumStickers ?? []) {
    countMap[as.sticker_id] = as.count
  }

  const stickersWithStatus = (stickers ?? []).map(s => ({
    ...s,
    count: countMap[s.id] ?? 0,
  }))

  const rawName = user!.email?.split('@')[0] ?? 'Usuario'
  const userName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  return (
    <AlbumClient
      stickers={stickersWithStatus}
      userName={userName}
    />
  )
}
