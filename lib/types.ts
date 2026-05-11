export type StickerType = 'player' | 'badge' | 'stadium' | 'special'

export interface Sticker {
  id: number
  section: string
  number: number
  name: string
  type: StickerType
}

export interface UserSticker {
  user_id: string
  sticker_id: number
  count: number
}

export interface StickerWithStatus extends Sticker {
  count: number // 0=falta, 1=tengo, 2+=repetida
}

export interface ExchangeItem {
  sticker: Sticker
  myCount: number
  theirCount: number
}

export type StickerStatus = 'falta' | 'tengo' | 'repetida'

export function getStatus(count: number): StickerStatus {
  if (count === 0) return 'falta'
  if (count === 1) return 'tengo'
  return 'repetida'
}
