import { supabase } from '@/lib/supabase'
import FormEditarUnidad from './FormEditarUnidad'

export default async function EditarUnidad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: unidad } = await supabase.from('unidades').select('*').eq('id', id).single()
  const { data: edificios } = await supabase.from('edificios').select('id, nombre')

  if (!unidad) return <div className="p-8">Unidad no encontrada</div>

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar Unidad</h1>
      <FormEditarUnidad unidad={unidad} edificios={edificios ?? []} />
    </div>
  )
}
