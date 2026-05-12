'use client'

import { sectionCode } from '@/lib/types'

interface SectionStat {
  section: string
  total: number
  collected: number
}

interface Props {
  total: number
  collected: number
  repeated: number
  missing: number
  sectionStats: SectionStat[]
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex-1 rounded-2xl p-4 flex flex-col items-center ${color}`}>
      <span className="text-2xl font-black">{value}</span>
      <span className="text-xs font-semibold mt-0.5 opacity-80 text-center">{label}</span>
    </div>
  )
}

export default function ProgressClient({ total, collected, repeated, missing, sectionStats }: Props) {
  const pct = total ? Math.round((collected / total) * 100) : 0

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-wc-blue to-blue-800 text-white px-4 pt-12 pb-5">
        <h1 className="text-xl font-black">Progreso 📊</h1>
        <p className="text-blue-200 text-xs mt-0.5">Álbum compartido · FIFA WC 2026</p>

        {/* Porcentaje grande */}
        <div className="mt-4 flex items-end gap-3">
          <span className="text-6xl font-black text-wc-gold leading-none">{pct}%</span>
          <span className="text-blue-200 text-sm mb-1">{collected} / {total}</span>
        </div>

        {/* Barra de progreso */}
        <div className="mt-3 h-3 bg-blue-900 rounded-full overflow-hidden">
          <div className="progress-bar-fill h-full transition-all duration-500"
               style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Stat boxes */}
        <div className="flex gap-3">
          <StatBox label="Tengo"     value={collected} color="bg-blue-50 text-wc-blue" />
          <StatBox label="Faltan"    value={missing}   color="bg-red-50 text-wc-red" />
          <StatBox label="Repetidas" value={repeated}  color="bg-yellow-50 text-yellow-700" />
        </div>

        {/* Breakdown por sección */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            Por selección
          </h2>
          <div className="space-y-2">
            {sectionStats.map(({ section, total: st, collected: col }) => {
              const p = st ? Math.round((col / st) * 100) : 0
              const code = sectionCode(section)
              return (
                <div key={section} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-500 w-8">{code}</span>
                      <span className="text-sm text-gray-600">{section}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{col}/{st}</span>
                      <span className={`text-xs font-bold w-9 text-right ${
                        p === 100 ? 'text-green-600' : p >= 50 ? 'text-wc-blue' : 'text-gray-400'
                      }`}>{p}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        p === 100
                          ? 'bg-green-500'
                          : 'progress-bar-fill'
                      }`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
