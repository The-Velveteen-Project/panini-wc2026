import { createClient } from '@/lib/supabase/server'
import AlbumClient from '@/components/AlbumClient'

export default async function AlbumPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: stickers }, { data: userStickers }] = await Promise.all([
    supabase.from('stickers').select('*').order('section').order('number'),
    supabase.from('user_stickers').select('*').eq('user_id', user!.id),
  ])

  const countMap: Record<number, number> = {}
  for (const us of userStickers ?? []) {
    countMap[us.sticker_id] = us.count
  }

  const stickersWithStatus = (stickers ?? []).map(s => ({
    ...s,
    count: countMap[s.id] ?? 0,
  }))

  const userName = user!.email?.split('@')[0] ?? 'Usuario'
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1)

  return (
    <AlbumClient
      stickers={stickersWithStatus}
      userId={user!.id}
      userName={displayName}
    />
  )
}
