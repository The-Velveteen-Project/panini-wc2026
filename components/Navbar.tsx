'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/album', label: 'Álbum', icon: '📗' },
  { href: '/exchanges', label: 'Cambios', icon: '🔄' },
  { href: '/progress', label: 'Progreso', icon: '📊' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200
                    safe-area-bottom z-50 max-w-md mx-auto">
      <div className="flex items-stretch">
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item flex-1 ${
                active ? 'text-wc-blue' : 'text-gray-400'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="nav-item flex-1 text-gray-400 hover:text-wc-red"
        >
          <span className="text-xl leading-none">🚪</span>
          <span>Salir</span>
        </button>
      </div>
    </nav>
  )
}
