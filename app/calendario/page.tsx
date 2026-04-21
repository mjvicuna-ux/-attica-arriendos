import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function diasRestantes(fecha: string) {
  const hoy = new Date()
  const termino = new Date(fecha)
  const diff = termino.getTime() - hoy.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function colorAlerta(dias: number) {
  if (dias < 0) return 'bg-red-100 text-red-700 border-red-200'
  if (dias <= 30) return 'bg-red-50 text-red-600 border-red-100'
  if (dias <= 60) return 'bg-yellow-50 text-yellow-700 border-yellow-100'
  return 'bg-green-50 text-green-700 border-green-100'
}

function etiqueta(dias: number) {
  if (dias < 0) return `Vencido hace ${Math.abs(dias)} días`
  if (dias === 0) return 'Vence hoy'
  if (dias <= 30) return `Vence en ${dias} días`
  if (dias <= 60) return `Vence en ${dias} días`
  return `Vence en ${dias} días`
}

export default async function Calendario() {
  const { data: contratos } = await supabase
    .from('contratos')
    .select('*, unidades(numero, tipo), arrendatarios(nombre, apellido, razon_social, tipo)')
    .order('fecha_termino', { ascending: true })

  const vencidos = contratos?.filter(c => diasRestantes(c.fecha_termino) < 0) ?? []
  const en30 = contratos?.filter(c => { const d = diasRestantes(c.fecha_termino); return d >= 0 && d <= 30 }) ?? []
  const en60 = contratos?.filter(c => { const d = diasRestantes(c.fecha_termino); return d > 30 && d <= 60 }) ?? []
  const en90 = contratos?.filter(c => { const d = diasRestantes(c.fecha_termino); return d > 60 && d <= 90 }) ?? []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Calendario de Vencimientos</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-red-100 rounded p-4 text-center">
          <p className="text-3xl font-bold text-red-700">{vencidos.length}</p>
          <p className="text-red-600 text-sm mt-1">Vencidos</p>
        </div>
        <div className="bg-red-50 rounded p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{en30.length}</p>
          <p className="text-red-500 text-sm mt-1">Vencen en 30 días</p>
        </div>
        <div className="bg-yellow-50 rounded p-4 text-center">
          <p className="text-3xl font-bold text-yellow-700">{en60.length}</p>
          <p className="text-yellow-600 text-sm mt-1">Vencen en 60 días</p>
        </div>
        <div className="bg-green-50 rounded p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{en90.length}</p>
          <p className="text-green-600 text-sm mt-1">Vencen en 90 días</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {contratos?.length === 0 && (
          <p className="text-gray-500 text-center py-8">No hay contratos registrados</p>
        )}
        {contratos?.map((c) => {
          const dias = diasRestantes(c.fecha_termino)
          return (
            <div key={c.id} className={`border rounded p-4 flex justify-between items-center ${colorAlerta(dias)}`}>
              <div>
                <p className="font-semibold">
                {c.arrendatarios?.tipo === 'sociedad'
                  ? c.arrendatarios?.razon_social
                  : `${c.arrendatarios?.nombre} ${c.arrendatarios?.apellido}`}
              </p>
              <p className="text-sm">{c.unidades?.tipo} {c.unidades?.numero}</p>
                <p className="text-sm">Término: {new Date(c.fecha_termino).toLocaleDateString('es-CL')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{etiqueta(dias)}</p>
                <p className="text-sm">${c.monto_mensual?.toLocaleString('es-CL')}/mes</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
