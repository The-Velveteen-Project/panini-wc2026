import { createClient } from '@/lib/supabase/server'
import ExchangesClient from '@/components/ExchangesClient'

export default async function ExchangesPage() {
  const supabase = await createClient()

  const [{ data: stickers }, { data: albumStickers }] = await Promise.all([
    supabase.from('stickers').select('*').order('number'),
    supabase.from('album_stickers').select('*').gte('count', 2),
  ])

  const countMap: Record<number, number> = {}
  for (const as of albumStickers ?? []) {
    countMap[as.sticker_id] = as.count
  }

  // Láminas repetidas (tenemos para intercambiar con OTROS coleccionistas)
  const repetidas = (stickers ?? [])
    .filter(s => (countMap[s.id] ?? 0) >= 2)
    .map(s => ({ ...s, count: countMap[s.id] }))

  return <ExchangesClient repetidas={repetidas} />
}
