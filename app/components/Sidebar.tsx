'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Edificios' },
  { href: '/arrendatarios', label: 'Arrendatarios' },
  { href: '/unidades', label: 'Unidades' },
  { href: '/contratos', label: 'Contratos' },
  { href: '/calendario', label: 'Calendario' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8">Attica Arriendos</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded ${
              pathname === link.href
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
