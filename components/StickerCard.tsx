'use client'

import { StickerWithStatus, getStatus } from '@/lib/types'

interface Props {
  sticker: StickerWithStatus
  onToggle: (id: number, currentCount: number) => void
}

const STATUS_LABELS: Record<string, string> = {
  falta: '✗',
  tengo: '✓',
  repetida: '✓✓',
}

const STATUS_BADGE: Record<string, string> = {
  falta: '',
  tengo: 'bg-wc-blue text-white',
  repetida: 'bg-wc-gold text-yellow-900',
}

export default function StickerCard({ sticker, onToggle }: Props) {
  const status = getStatus(sticker.count)

  return (
    <button
      onClick={() => onToggle(sticker.id, sticker.count)}
      className={`sticker-card sticker-${status}`}
      title={`${sticker.number} - ${sticker.name}`}
    >
      {/* Number badge */}
      <span className={`text-[10px] font-black leading-none mb-0.5 ${
        status === 'falta' ? 'text-gray-300' : ''
      }`}>
        #{sticker.number}
      </span>

      {/* Status indicator */}
      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
        STATUS_BADGE[status] || 'text-gray-300'
      }`}>
        {STATUS_LABELS[status]}
      </span>

      {/* Name (truncated) */}
      <span className="text-[9px] leading-tight mt-0.5 line-clamp-2 opacity-70 px-0.5">
        {sticker.name}
      </span>

      {/* Repeated count badge */}
      {sticker.count >= 2 && (
        <span className="absolute -top-1 -right-1 bg-wc-red text-white text-[9px]
                          font-black w-4 h-4 rounded-full flex items-center justify-center">
          {sticker.count}
        </span>
      )}
    </button>
  )
}
