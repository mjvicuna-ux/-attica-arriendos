'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function EliminarArrendatario({ id }: { id: number }) {
  const router = useRouter()

  async function eliminar() {
    if (!confirm('¿Seguro que quieres eliminar este arrendatario?')) return
    await supabase.from('arrendatarios').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={eliminar} className="text-red-500 hover:underline text-sm">
      Eliminar
    </button>
  )
}
