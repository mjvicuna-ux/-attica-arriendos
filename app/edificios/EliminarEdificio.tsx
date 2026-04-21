'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function EliminarEdificio({ id }: { id: number }) {
  const router = useRouter()

  async function eliminar() {
    if (!confirm('¿Seguro que quieres eliminar este edificio?')) return
    await supabase.from('edificios').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={eliminar} className="text-red-500 hover:underline text-sm">
      Eliminar
    </button>
  )
}
