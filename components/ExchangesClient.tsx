'use client'

import { useState } from 'react'

interface ExchangeSticker {
  id: number
  section: string
  number: number
  name: string
  myCount: number
  theirCount: number
}

interface Props {
  iGiveToThem: ExchangeSticker[]
  theyGiveToMe: ExchangeSticker[]
  myName: string
  theirName: string
}

export default function ExchangesClient({ iGiveToThem, theyGiveToMe, myName, theirName }: Props) {
  const [tab, setTab] = useState<'give' | 'receive'>('receive')

  const current = tab === 'receive' ? theyGiveToMe : iGiveToThem

  const bySection: Record<string, typeof current> = {}
  for (const s of current) {
    if (!bySection[s.section]) bySection[s.section] = []
    bySection[s.section].push(s)
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-wc-red text-white px-4 pt-12 pb-4">
        <h1 className="text-xl font-black">Intercambios 🔄</h1>
        <p className="text-red-200 text-xs mt-0.5">
          {myName} ↔ {theirName}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setTab('receive')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === 'receive'
                ? 'bg-white text-wc-red'
                : 'bg-red-700/50 text-red-100'
            }`}
          >
            {theirName} me da ({theyGiveToMe.length})
          </button>
          <button
            onClick={() => setTab('give')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === 'give'
                ? 'bg-white text-wc-red'
                : 'bg-red-700/50 text-red-100'
            }`}
          >
            Yo le doy ({iGiveToThem.length})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-3">
        {current.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <span className="text-5xl mb-3">🎉</span>
            <p className="text-sm font-medium">
              {tab === 'receive'
                ? `${theirName} no tiene repetidas que te falten`
                : `No tienes repetidas que le falten a ${theirName}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(bySection).map(([section, items]) => (
              <div key={section}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {section}
                </h3>
                <div className="space-y-1.5">
                  {items.map(s => (
                    <div
                      key={s.id}
                      className="flex items-center bg-white rounded-xl px-4 py-3
                                 border border-gray-100 shadow-sm"
                    >
                      <span className="text-sm font-black text-gray-300 w-8 shrink-0">
                        #{s.number}
                      </span>
                      <span className="flex-1 text-sm font-medium text-gray-700 truncate">
                        {s.name}
                      </span>
                      <div className="flex gap-2 ml-2 shrink-0">
                        <span className="text-xs bg-wc-gold/20 text-yellow-700 font-semibold
                                         px-2 py-0.5 rounded-full">
                          ×{tab === 'receive' ? s.theirCount : s.myCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
