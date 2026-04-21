import { supabase } from '@/lib/supabase'
import FormEditarArrendatario from './FormEditarArrendatario'

export default async function EditarArrendatario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: arrendatario } = await supabase.from('arrendatarios').select('*').eq('id', id).single()

  if (!arrendatario) return <div className="p-8">Arrendatario no encontrado</div>

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar Arrendatario</h1>
      <FormEditarArrendatario arrendatario={arrendatario} />
    </div>
  )
}
