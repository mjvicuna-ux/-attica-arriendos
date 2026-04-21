'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function EliminarUnidad({ id }: { id: number }) {
  const router = useRouter()

  async function eliminar() {
    if (!confirm('¿Seguro que quieres eliminar esta unidad?')) return
    await supabase.from('unidades').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={eliminar} className="text-red-500 hover:underline text-sm">
      Eliminar
    </button>
  )
}
