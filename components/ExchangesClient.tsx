'use client'

import { sectionCode, localNumber } from '@/lib/types'

interface RepeatedSticker {
  id: number
  section: string
  number: number
  name: string
  count: number
}

interface Props {
  repetidas: RepeatedSticker[]
}

function getFlagEmoji(section: string): string {
  const flags: Record<string, string> = {
    'Introducción':'📖','Alemania':'🇩🇪','Algeria':'🇩🇿','Arabia Saudita':'🇸🇦',
    'Argentina':'🇦🇷','Australia':'🇦🇺','Austria':'🇦🇹','Bosnia y Herzegovina':'🇧🇦',
    'Brasil':'🇧🇷','Bélgica':'🇧🇪','Cabo Verde':'🇨🇻','Canadá':'🇨🇦','Chequia':'🇨🇿',
    'Colombia':'🇨🇴','Congo DR':'🇨🇩','Corea del Sur':'🇰🇷','Costa de Marfil':'🇨🇮',
    'Croacia':'🇭🇷','Curaçao':'🇨🇼','Ecuador':'🇪🇨','Egipto':'🇪🇬','Escocia':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'España':'🇪🇸','Estados Unidos':'🇺🇸','Francia':'🇫🇷','Ghana':'🇬🇭','Haití':'🇭🇹',
    'Inglaterra':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Irak':'🇮🇶','Irán':'🇮🇷','Japón':'🇯🇵','Jordania':'🇯🇴',
    'Marruecos':'🇲🇦','México':'🇲🇽','Noruega':'🇳🇴','Nueva Zelanda':'🇳🇿','Panamá':'🇵🇦',
    'Paraguay':'🇵🇾','Países Bajos':'🇳🇱','Portugal':'🇵🇹','Qatar':'🇶🇦','Senegal':'🇸🇳',
    'Sudáfrica':'🇿🇦','Suecia':'🇸🇪','Suiza':'🇨🇭','Turquía':'🇹🇷','Túnez':'🇹🇳',
    'Uruguay':'🇺🇾','Uzbekistán':'🇺🇿',
  }
  return flags[section] ?? '🏳️'
}

export default function ExchangesClient({ repetidas }: Props) {
  // Agrupar por sección
  const bySection: Record<string, RepeatedSticker[]> = {}
  for (const s of repetidas) {
    if (!bySection[s.section]) bySection[s.section] = []
    bySection[s.section].push(s)
  }

  const totalExtras = repetidas.reduce((sum, s) => sum + (s.count - 1), 0)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-wc-red text-white px-4 pt-12 pb-4">
        <h1 className="text-xl font-black">Repetidas 🔄</h1>
        <p className="text-red-200 text-xs mt-0.5">
          {repetidas.length} láminas · {totalExtras} sobran para cambiar
        </p>
      </div>

      {/* Lista */}
      <div className="px-4 py-3">
        {repetidas.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <span className="text-5xl mb-3">✨</span>
            <p className="text-sm font-medium">Sin repetidas por ahora</p>
            <p className="text-xs mt-1 text-gray-300">¡Sigan abriendo sobres!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(bySection).map(([section, items]) => (
              <div key={section}>
                {/* Cabecera sección */}
                <div className="flex items-center gap-2 mb-2">
                  <span>{getFlagEmoji(section)}</span>
                  <span className="text-xs font-black text-gray-600 uppercase tracking-wider">
                    {sectionCode(section)}
                  </span>
                  <span className="text-xs text-gray-400">· {section}</span>
                  <span className="ml-auto text-xs bg-wc-red/10 text-wc-red
                                   font-semibold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>

                {/* Láminas */}
                <div className="space-y-1.5">
                  {items.map(s => {
                    const num = localNumber(s.number)
                    return (
                      <div
                        key={s.id}
                        className="flex items-center bg-white rounded-xl px-4 py-2.5
                                   border border-gray-100 shadow-sm"
                      >
                        {/* Código + número */}
                        <span className="text-sm font-black text-gray-400 w-12 shrink-0">
                          {sectionCode(s.section)}{num.toString().padStart(2,'0')}
                        </span>
                        {/* Nombre */}
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {s.name}
                        </span>
                        {/* Cuántas sobran */}
                        <span className="shrink-0 ml-2 text-xs bg-wc-gold/20 text-yellow-700
                                         font-bold px-2 py-0.5 rounded-full">
                          ×{s.count - 1} extra{s.count - 1 > 1 ? 's' : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
