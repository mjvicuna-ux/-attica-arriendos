'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function LayoutContenido({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const esLogin = pathname === '/login'

  if (esLogin) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
