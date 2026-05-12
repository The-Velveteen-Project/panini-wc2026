export type StickerType = 'player' | 'badge' | 'stadium' | 'special'

export interface Sticker {
  id: number
  section: string
  number: number // global 1-980; use localNumber() for display
  name: string
  type: StickerType
}

export interface StickerWithStatus extends Sticker {
  count: number // 0=falta, 1=tengo, 2+=repetida
}

export type StickerStatus = 'falta' | 'tengo' | 'repetida'

export function getStatus(count: number): StickerStatus {
  if (count === 0) return 'falta'
  if (count === 1) return 'tengo'
  return 'repetida'
}

// Local number within section (1-20)
export function localNumber(globalN: number): number {
  return ((globalN - 1) % 20) + 1
}

// Panini 3-letter code per section name
export const SECTION_CODE: Record<string, string> = {
  'Introducción':        'INT',
  'Algeria':             'ALG',
  'Argentina':           'ARG',
  'Australia':           'AUS',
  'Austria':             'AUT',
  'Bélgica':             'BEL',
  'Bosnia y Herzegovina':'BIH',
  'Brasil':              'BRA',
  'Canadá':              'CAN',
  'Costa de Marfil':     'CIV',
  'Congo DR':            'COD',
  'Colombia':            'COL',
  'Cabo Verde':          'CPV',
  'Croacia':             'CRO',
  'Curaçao':             'CUW',
  'Chequia':             'CZE',
  'Ecuador':             'ECU',
  'Egipto':              'EGY',
  'Inglaterra':          'ENG',
  'España':              'ESP',
  'Francia':             'FRA',
  'Alemania':            'GER',
  'Ghana':               'GHA',
  'Haití':               'HAI',
  'Irán':                'IRN',
  'Irak':                'IRQ',
  'Jordania':            'JOR',
  'Japón':               'JPN',
  'Corea del Sur':       'KOR',
  'Arabia Saudita':      'KSA',
  'Marruecos':           'MAR',
  'México':              'MEX',
  'Países Bajos':        'NED',
  'Noruega':             'NOR',
  'Nueva Zelanda':       'NZL',
  'Panamá':              'PAN',
  'Paraguay':            'PAR',
  'Portugal':            'POR',
  'Qatar':               'QAT',
  'Sudáfrica':           'RSA',
  'Escocia':             'SCO',
  'Senegal':             'SEN',
  'Suiza':               'SUI',
  'Suecia':              'SWE',
  'Túnez':               'TUN',
  'Turquía':             'TUR',
  'Uruguay':             'URU',
  'Estados Unidos':      'USA',
  'Uzbekistán':          'UZB',
}

export function sectionCode(section: string): string {
  return SECTION_CODE[section] ?? section.slice(0, 3).toUpperCase()
}

// Official FIFA WC2026 group (A-L) per section
export const SECTION_GROUP: Record<string, string> = {
  'Mexico':              'A', // placeholder kept for safety
  'México':              'A',
  'Corea del Sur':       'A',
  'Sudáfrica':           'A',
  'Chequia':             'A',
  'Canadá':              'B',
  'Suiza':               'B',
  'Qatar':               'B',
  'Bosnia y Herzegovina':'B',
  'Brasil':              'C',
  'Marruecos':           'C',
  'Escocia':             'C',
  'Haití':               'C',
  'Estados Unidos':      'D',
  'Paraguay':            'D',
  'Australia':           'D',
  'Turquía':             'D',
  'Alemania':            'E',
  'Ecuador':             'E',
  'Costa de Marfil':     'E',
  'Curaçao':             'E',
  'Países Bajos':        'F',
  'Japón':               'F',
  'Túnez':               'F',
  'Suecia':              'F',
  'Bélgica':             'G',
  'Irán':                'G',
  'Egipto':              'G',
  'Nueva Zelanda':       'G',
  'España':              'H',
  'Uruguay':             'H',
  'Arabia Saudita':      'H',
  'Cabo Verde':          'H',
  'Francia':             'I',
  'Senegal':             'I',
  'Noruega':             'I',
  'Irak':                'I',
  'Argentina':           'J',
  'Austria':             'J',
  'Algeria':             'J',
  'Jordania':            'J',
  'Portugal':            'K',
  'Colombia':            'K',
  'Uzbekistán':          'K',
  'Congo DR':            'K',
  'Inglaterra':          'L',
  'Croacia':             'L',
  'Ghana':               'L',
  'Panamá':              'L',
}
