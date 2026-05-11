import { createClient } from '@/lib/supabase/server'
import ExchangesClient from '@/components/ExchangesClient'

export default async function ExchangesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const myId = user!.id

  // Get all stickers and both users' status
  const [{ data: stickers }, { data: allUserStickers }, { data: profiles }] = await Promise.all([
    supabase.from('stickers').select('*').order('section').order('number'),
    supabase.from('user_stickers').select('*'),
    supabase.from('profiles').select('id, display_name'),
  ])

  // Find the other user
  const otherProfile = (profiles ?? []).find(p => p.id !== myId)
  const otherId = otherProfile?.id

  const myMap: Record<number, number> = {}
  const theirMap: Record<number, number> = {}

  for (const us of allUserStickers ?? []) {
    if (us.user_id === myId) myMap[us.sticker_id] = us.count
    else if (us.user_id === otherId) theirMap[us.sticker_id] = us.count
  }

  // I have repeated, they need it
  const iGiveToThem = (stickers ?? [])
    .filter(s => myMap[s.id] >= 2 && (theirMap[s.id] ?? 0) === 0)
    .map(s => ({ ...s, myCount: myMap[s.id], theirCount: theirMap[s.id] ?? 0 }))

  // They have repeated, I need it
  const theyGiveToMe = (stickers ?? [])
    .filter(s => theirMap[s.id] >= 2 && (myMap[s.id] ?? 0) === 0)
    .map(s => ({ ...s, myCount: myMap[s.id] ?? 0, theirCount: theirMap[s.id] }))

  const myName = user!.email?.split('@')[0] ?? 'Yo'
  const theirName = otherProfile?.display_name ?? otherId?.slice(0, 8) ?? 'Otro'

  return (
    <ExchangesClient
      iGiveToThem={iGiveToThem}
      theyGiveToMe={theyGiveToMe}
      myName={myName.charAt(0).toUpperCase() + myName.slice(1)}
      theirName={theirName}
    />
  )
}
