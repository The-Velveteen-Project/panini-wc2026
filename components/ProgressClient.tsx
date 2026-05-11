'use client'

interface UserStats {
  collected: number
  repeated: number
  missing: number
}

interface SectionStat {
  section: string
  total: number
  collected: number
}

interface Props {
  myStats: UserStats
  otherStats?: UserStats
  total: number
  myName: string
  otherName: string
  sectionStats: SectionStat[]
}

function StatCard({ label, value, sub, color }: {
  label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className={`flex-1 rounded-2xl p-4 ${color}`}>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-semibold mt-0.5 opacity-80">{label}</div>
      {sub && <div className="text-xs opacity-60 mt-0.5">{sub}</div>}
    </div>
  )
}

function UserProgress({ name, stats, total, emoji }: {
  name: string; stats: UserStats; total: number; emoji: string
}) {
  const pct = total ? Math.round((stats.collected / total) * 100) : 0
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className="font-bold text-gray-800">{name}</span>
        </div>
        <span className="text-2xl font-black text-wc-blue">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="progress-bar-fill h-full"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex gap-2">
        <StatCard
          label="Tengo"
          value={stats.collected}
          sub={`de ${total}`}
          color="bg-blue-50 text-wc-blue"
        />
        <StatCard
          label="Faltan"
          value={stats.missing}
          color="bg-red-50 text-wc-red"
        />
        <StatCard
          label="Repetidas"
          value={stats.repeated}
          color="bg-yellow-50 text-yellow-700"
        />
      </div>
    </div>
  )
}

export default function ProgressClient({
  myStats, otherStats, total, myName, otherName, sectionStats
}: Props) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-wc-blue to-blue-800 text-white px-4 pt-12 pb-5">
        <h1 className="text-xl font-black">Progreso 📊</h1>
        <p className="text-blue-200 text-xs mt-0.5">FIFA World Cup 2026</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* User cards */}
        <UserProgress name={myName} stats={myStats} total={total} emoji="🧑" />
        {otherStats && (
          <UserProgress name={otherName} stats={otherStats} total={total} emoji="👩" />
        )}

        {/* Section breakdown */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            Por sección
          </h2>
          <div className="space-y-2">
            {sectionStats.map(({ section, total: st, collected }) => {
              const pct = st ? Math.round((collected / st) * 100) : 0
              return (
                <div key={section} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{section}</span>
                    <span className="text-xs text-gray-500">{collected}/{st}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="progress-bar-fill h-full"
                      style={{ width: `${pct}%` }}
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
