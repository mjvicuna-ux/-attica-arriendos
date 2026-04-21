import { supabase } from '@/lib/supabase'
import FormEditarEdificio from './FormEditarEdificio'

export default async function EditarEdificio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: edificio } = await supabase.from('edificios').select('*').eq('id', id).single()

  if (!edificio) return <div className="p-8">Edificio no encontrado</div>

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar Edificio</h1>
      <FormEditarEdificio edificio={edificio} />
    </div>
  )
}
