import { supabase } from '@/lib/supabase'
import FormEditarContrato from './FormEditarContrato'

export default async function EditarContrato({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: contrato } = await supabase.from('contratos').select('*').eq('id', id).single()
  const { data: unidades } = await supabase.from('unidades').select('id, numero, tipo')
  const { data: arrendatarios } = await supabase.from('arrendatarios').select('id, nombre, apellido, razon_social, tipo')

  if (!contrato) return <div className="p-8">Contrato no encontrado</div>

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar Contrato</h1>
      <FormEditarContrato contrato={contrato} unidades={unidades ?? []} arrendatarios={arrendatarios ?? []} />
    </div>
  )
}
