'use client'

import { StickerWithStatus, getStatus, sectionCode, localNumber } from '@/lib/types'

interface Props {
  sticker: StickerWithStatus
  onToggle: (id: number, currentCount: number) => void
}

const STATUS_STYLES: Record<string, { card: string; badge: string; label: string }> = {
  falta:    { card: 'sticker-falta',    badge: 'text-gray-300',                    label: '—'  },
  tengo:    { card: 'sticker-tengo',    badge: 'bg-wc-blue text-white',            label: '✓'  },
  repetida: { card: 'sticker-repetida', badge: 'bg-wc-gold text-yellow-900',       label: '✓✓' },
}

export default function StickerCard({ sticker, onToggle }: Props) {
  const status = getStatus(sticker.count)
  const styles = STATUS_STYLES[status]
  const code   = sectionCode(sticker.section)
  const num    = localNumber(sticker.number)

  return (
    <button
      onClick={() => onToggle(sticker.id, sticker.count)}
      className={`sticker-card ${styles.card} relative`}
      title={`${code} ${num} · ${sticker.name}`}
    >
      {/* Código de país */}
      <span className={`text-[9px] font-black tracking-tight leading-none ${
        status === 'falta' ? 'text-gray-300' : 'opacity-60'
      }`}>
        {code}
      </span>

      {/* Número local (1-20) */}
      <span className={`text-base font-black leading-none ${
        status === 'falta' ? 'text-gray-300' : ''
      }`}>
        {num.toString().padStart(2, '0')}
      </span>

      {/* Indicador de estado */}
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${styles.badge}`}>
        {styles.label}
      </span>

      {/* Nombre (truncado) */}
      <span className="text-[8px] leading-tight mt-0.5 line-clamp-2 opacity-60 px-0.5 text-center">
        {sticker.name}
      </span>

      {/* Badge de repetidas */}
      {sticker.count >= 2 && (
        <span className="absolute -top-1 -right-1 bg-wc-red text-white text-[9px]
                          font-black w-4 h-4 rounded-full flex items-center justify-center">
          {sticker.count}
        </span>
      )}
    </button>
  )
}
