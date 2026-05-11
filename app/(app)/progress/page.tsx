import { createClient } from '@/lib/supabase/server'
import ProgressClient from '@/components/ProgressClient'

export default async function ProgressPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const myId = user!.id

  const [{ data: stickers }, { data: allUserStickers }, { data: profiles }] = await Promise.all([
    supabase.from('stickers').select('*').order('section').order('number'),
    supabase.from('user_stickers').select('*'),
    supabase.from('profiles').select('id, display_name'),
  ])

  const total = stickers?.length ?? 0

  // Build per-user stats
  const userStats: Record<string, { collected: number; repeated: number; missing: number }> = {}

  const userIds = Array.from(new Set((allUserStickers ?? []).map(us => us.user_id)))
  for (const uid of userIds) {
    const userRows = (allUserStickers ?? []).filter(us => us.user_id === uid)
    const collected = userRows.filter(r => r.count > 0).length
    const repeated = userRows.filter(r => r.count >= 2).length
    const missing = total - collected
    userStats[uid] = { collected, repeated, missing }
  }

  // Sections completion
  const sections = Array.from(new Set((stickers ?? []).map(s => s.section)))
  const myMap: Record<number, number> = {}
  for (const us of allUserStickers ?? []) {
    if (us.user_id === myId) myMap[us.sticker_id] = us.count
  }

  const sectionStats = sections.map(section => {
    const sectionStickers = (stickers ?? []).filter(s => s.section === section)
    const collected = sectionStickers.filter(s => myMap[s.id] > 0).length
    return { section, total: sectionStickers.length, collected }
  })

  const myName = user!.email?.split('@')[0] ?? 'Yo'
  const otherProfile = (profiles ?? []).find(p => p.id !== myId)
  const otherStats = otherProfile ? userStats[otherProfile.id] : undefined

  return (
    <ProgressClient
      myStats={userStats[myId] ?? { collected: 0, repeated: 0, missing: total }}
      otherStats={otherStats}
      total={total}
      myName={myName.charAt(0).toUpperCase() + myName.slice(1)}
      otherName={otherProfile?.display_name ?? 'Otro jugador'}
      sectionStats={sectionStats}
    />
  )
}
