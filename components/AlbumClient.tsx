'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StickerWithStatus, getStatus, sectionCode, SECTION_GROUP } from '@/lib/types'
import StickerCard from './StickerCard'

interface Props {
  stickers: StickerWithStatus[]
  userName: string
}

type FilterType = 'all' | 'falta' | 'tengo' | 'repetida'
type ViewType   = 'pais' | 'grupo'

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']

function getFlagEmoji(section: string): string {
  const flags: Record<string, string> = {
    'Introducción':        '📖',
    'Alemania':            '🇩🇪',
    'Algeria':             '🇩🇿',
    'Arabia Saudita':      '🇸🇦',
    'Argentina':           '🇦🇷',
    'Australia':           '🇦🇺',
    'Austria':             '🇦🇹',
    'Bosnia y Herzegovina':'🇧🇦',
    'Brasil':              '🇧🇷',
    'Bélgica':             '🇧🇪',
    'Cabo Verde':          '🇨🇻',
    'Canadá':              '🇨🇦',
    'Chequia':             '🇨🇿',
    'Colombia':            '🇨🇴',
    'Congo DR':            '🇨🇩',
    'Corea del Sur':       '🇰🇷',
    'Costa de Marfil':     '🇨🇮',
    'Croacia':             '🇭🇷',
    'Curaçao':             '🇨🇼',
    'Ecuador':             '🇪🇨',
    'Egipto':              '🇪🇬',
    'Escocia':             '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'España':              '🇪🇸',
    'Estados Unidos':      '🇺🇸',
    'Francia':             '🇫🇷',
    'Ghana':               '🇬🇭',
    'Haití':               '🇭🇹',
    'Inglaterra':          '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Irak':                '🇮🇶',
    'Irán':                '🇮🇷',
    'Japón':               '🇯🇵',
    'Jordania':            '🇯🇴',
    'Marruecos':           '🇲🇦',
    'México':              '🇲🇽',
    'Noruega':             '🇳🇴',
    'Nueva Zelanda':       '🇳🇿',
    'Panamá':              '🇵🇦',
    'Paraguay':            '🇵🇾',
    'Países Bajos':        '🇳🇱',
    'Portugal':            '🇵🇹',
    'Qatar':               '🇶🇦',
    'Senegal':             '🇸🇳',
    'Sudáfrica':           '🇿🇦',
    'Suecia':              '🇸🇪',
    'Suiza':               '🇨🇭',
    'Turquía':             '🇹🇷',
    'Túnez':               '🇹🇳',
    'Uruguay':             '🇺🇾',
    'Uzbekistán':          '🇺🇿',
  }
  return flags[section] ?? '🏳️'
}

export default function AlbumClient({ stickers: initial, userName }: Props) {
  const [stickers, setStickers] = useState<StickerWithStatus[]>(initial)
  const [filter, setFilter] = useState<FilterType>('all')
  const [view,   setView]   = useState<ViewType>('pais')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  // Realtime — escucha cambios del álbum compartido
  useEffect(() => {
    const channel = supabase
      .channel('album_stickers_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'album_stickers' },
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
  }, [supabase])

  const handleToggle = useCallback(async (stickerId: number, currentCount: number) => {
    const newCount = (currentCount + 1) % 3

    // Optimistic update
    setStickers(prev =>
      prev.map(s => s.id === stickerId ? { ...s, count: newCount } : s)
    )

    await supabase.from('album_stickers').upsert(
      { sticker_id: stickerId, count: newCount },
      { onConflict: 'sticker_id' }
    )
  }, [supabase])

  // Filtrado por estado y búsqueda
  const filtered = stickers.filter(s => {
    const matchesFilter = filter === 'all' || getStatus(s.count) === filter
    const matchesSearch = search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      sectionCode(s.section).toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString().includes(search)
    return matchesFilter && matchesSearch
  })

  // Stats globales
  const total     = stickers.length
  const collected = stickers.filter(s => s.count > 0).length
  const pct       = total ? Math.round((collected / total) * 100) : 0

  // Secciones únicas en orden de aparición (por número global)
  const sections = Array.from(new Set(filtered.map(s => s.section)))

  // ── Render helpers ───────────────────────────────────────────────
  function renderSectionBlock(section: string) {
    const items = filtered.filter(s => s.section === section)
    if (items.length === 0) return null
    return (
      <div key={section}>
        <div className="section-header">
          <span>{getFlagEmoji(section)}</span>
          <span className="font-bold">{sectionCode(section)}</span>
          <span className="font-normal text-blue-200 text-xs ml-1">· {section}</span>
          <span className="ml-auto text-blue-300 font-normal text-xs">
            {items.filter(s => s.count > 0).length}/{items.length}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {items.map(sticker => (
            <StickerCard key={sticker.id} sticker={sticker} onToggle={handleToggle} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="bg-wc-blue text-white px-4 pt-12 pb-3 sticky top-0 z-20">
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

        {/* Barra de progreso */}
        <div className="h-1.5 bg-blue-800 rounded-full overflow-hidden">
          <div className="progress-bar-fill h-full" style={{ width: `${pct}%` }} />
        </div>

        {/* Búsqueda */}
        <input
          type="search"
          placeholder="Buscar jugador, código (ARG) o número…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mt-3 w-full bg-blue-900/50 text-white placeholder-blue-300
                     rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2
                     focus:ring-white/30"
        />

        {/* Vista + Filtro en la misma fila */}
        <div className="flex items-center gap-2 mt-2">
          {/* Toggle vista */}
          <div className="flex bg-blue-900/60 rounded-full p-0.5 shrink-0">
            {(['pais','grupo'] as ViewType[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                  view === v ? 'bg-white text-wc-blue' : 'text-blue-200'
                }`}
              >
                {v === 'pais' ? 'País' : 'Grupo'}
              </button>
            ))}
          </div>

          {/* Filtro estado */}
          <div className="flex gap-1.5 overflow-x-auto">
            {(['all','falta','tengo','repetida'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-white text-wc-blue' : 'bg-blue-900/50 text-blue-200'
                }`}
              >
                {f === 'all' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cuerpo ─────────────────────────────────────────────────── */}
      <div className="px-3 py-3 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Sin resultados</p>
        ) : view === 'pais' ? (
          /* ── Vista por país ──────────────────────────────────────── */
          sections.map(section => renderSectionBlock(section))
        ) : (
          /* ── Vista por grupo ─────────────────────────────────────── */
          <>
            {/* Introducción primero, sin grupo */}
            {renderSectionBlock('Introducción')}

            {GROUPS.map(group => {
              const groupSections = sections.filter(
                s => SECTION_GROUP[s] === group
              )
              if (groupSections.length === 0) return null

              const groupStickers = filtered.filter(s => SECTION_GROUP[s.section] === group)
              const groupCollected = groupStickers.filter(s => s.count > 0).length

              return (
                <div key={group}>
                  {/* Cabecera de grupo */}
                  <div className="flex items-center gap-2 mb-2 mt-1">
                    <div className="bg-wc-gold text-yellow-900 font-black text-sm
                                    w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                      {group}
                    </div>
                    <span className="font-bold text-gray-700 text-sm">Grupo {group}</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {groupCollected}/{groupStickers.length}
                    </span>
                  </div>

                  {/* Equipos del grupo */}
                  <div className="space-y-3 pl-1">
                    {groupSections.map(section => renderSectionBlock(section))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
