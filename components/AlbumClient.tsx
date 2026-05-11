'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StickerWithStatus, getStatus } from '@/lib/types'
import StickerCard from './StickerCard'

interface Props {
  stickers: StickerWithStatus[]
  userId: string
  userName: string
}

export default function AlbumClient({ stickers: initial, userId, userName }: Props) {
  const [stickers, setStickers] = useState<StickerWithStatus[]>(initial)
  const [filter, setFilter] = useState<'all' | 'falta' | 'tengo' | 'repetida'>('all')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('user_stickers_album')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stickers',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          const updated = payload.new as { sticker_id: number; count: number }
          setStickers(prev =>
            prev.map(s =>
              s.id === updated.sticker_id ? { ...s, count: updated.count } : s
            )
          )
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase, userId])

  const handleToggle = useCallback(async (stickerId: number, currentCount: number) => {
    // Cycle: 0 → 1 → 2 → 0
    const newCount = (currentCount + 1) % 3

    setStickers(prev =>
      prev.map(s => s.id === stickerId ? { ...s, count: newCount } : s)
    )

    await supabase.from('user_stickers').upsert(
      { user_id: userId, sticker_id: stickerId, count: newCount },
      { onConflict: 'user_id,sticker_id' }
    )
  }, [supabase, userId])

  const filtered = stickers.filter(s => {
    const matchesFilter = filter === 'all' || getStatus(s.count) === filter
    const matchesSearch = search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString().includes(search)
    return matchesFilter && matchesSearch
  })

  const sections = Array.from(new Set(filtered.map(s => s.section)))

  const total = stickers.length
  const collected = stickers.filter(s => s.count > 0).length
  const pct = total ? Math.round((collected / total) * 100) : 0

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-wc-blue text-white px-4 pt-12 pb-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-black leading-tight">Panini WC2026</h1>
            <p className="text-blue-200 text-xs">Hola, {userName} 👋</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-wc-gold">{pct}%</div>
            <div className="text-blue-200 text-xs">{collected}/{total}</div>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="h-1.5 bg-blue-800 rounded-full overflow-hidden">
          <div
            className="progress-bar-fill h-full"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Buscar jugador o número..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mt-3 w-full bg-blue-900/50 text-white placeholder-blue-300
                     rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2
                     focus:ring-white/30"
        />

        {/* Filter pills */}
        <div className="flex gap-2 mt-2">
          {(['all', 'falta', 'tengo', 'repetida'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                filter === f
                  ? 'bg-white text-wc-blue'
                  : 'bg-blue-900/50 text-blue-200'
              }`}
            >
              {f === 'all' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Album sections */}
      <div className="px-3 py-3 space-y-4">
        {sections.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Sin resultados</p>
        ) : (
          sections.map(section => {
            const sectionStickers = filtered.filter(s => s.section === section)
            return (
              <div key={section}>
                <div className="section-header">
                  <span>{getFlagEmoji(section)}</span>
                  <span>{section}</span>
                  <span className="ml-auto text-blue-300 font-normal text-xs">
                    {sectionStickers.filter(s => s.count > 0).length}/{sectionStickers.length}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {sectionStickers.map(sticker => (
                    <StickerCard
                      key={sticker.id}
                      sticker={sticker}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function getFlagEmoji(section: string): string {
  const flags: Record<string, string> = {
    'Introducción': '📖',
    'Alemania': '🇩🇪',
    'Algeria': '🇩🇿',
    'Arabia Saudita': '🇸🇦',
    'Argentina': '🇦🇷',
    'Australia': '🇦🇺',
    'Austria': '🇦🇹',
    'Bosnia y Herzegovina': '🇧🇦',
    'Brasil': '🇧🇷',
    'Bélgica': '🇧🇪',
    'Cabo Verde': '🇨🇻',
    'Canadá': '🇨🇦',
    'Chequia': '🇨🇿',
    'Colombia': '🇨🇴',
    'Congo DR': '🇨🇩',
    'Corea del Sur': '🇰🇷',
    'Costa de Marfil': '🇨🇮',
    'Croacia': '🇭🇷',
    'Curaçao': '🇨🇼',
    'Ecuador': '🇪🇨',
    'Egipto': '🇪🇬',
    'Escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'España': '🇪🇸',
    'Estados Unidos': '🇺🇸',
    'Francia': '🇫🇷',
    'Ghana': '🇬🇭',
    'Haití': '🇭🇹',
    'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Irak': '🇮🇶',
    'Irán': '🇮🇷',
    'Japón': '🇯🇵',
    'Jordania': '🇯🇴',
    'Marruecos': '🇲🇦',
    'México': '🇲🇽',
    'Noruega': '🇳🇴',
    'Nueva Zelanda': '🇳🇿',
    'Panamá': '🇵🇦',
    'Paraguay': '🇵🇾',
    'Países Bajos': '🇳🇱',
    'Portugal': '🇵🇹',
    'Qatar': '🇶🇦',
    'Senegal': '🇸🇳',
    'Sudáfrica': '🇿🇦',
    'Suecia': '🇸🇪',
    'Suiza': '🇨🇭',
    'Turquía': '🇹🇷',
    'Túnez': '🇹🇳',
    'Uruguay': '🇺🇾',
    'Uzbekistán': '🇺🇿',
  }
  return flags[section] ?? '🏳️'
}
