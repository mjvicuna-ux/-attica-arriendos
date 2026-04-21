import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EliminarContrato from './EliminarContrato'

export const dynamic = 'force-dynamic'

export default async function Contratos() {
  const { data: contratos } = await supabase
    .from('contratos')
    .select('*, unidades(numero, tipo), arrendatarios(nombre, apellido, razon_social, tipo)')

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contratos</h1>
        <Link href="/contratos/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Contrato
        </Link>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">Arrendatario</th>
            <th className="text-left p-4">Unidad</th>
            <th className="text-left p-4">Inicio</th>
            <th className="text-left p-4">Término</th>
            <th className="text-left p-4">Monto</th>
            <th className="text-left p-4">Estado</th>
            <th className="text-left p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contratos?.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                No hay contratos registrados
              </td>
            </tr>
          )}
          {contratos?.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-4">
                {c.arrendatarios?.tipo === 'sociedad'
                  ? c.arrendatarios?.razon_social
                  : `${c.arrendatarios?.nombre} ${c.arrendatarios?.apellido}`}
              </td>
              <td className="p-4">{c.unidades?.tipo} {c.unidades?.numero}</td>
              <td className="p-4">{c.fecha_inicio}</td>
              <td className="p-4">{c.fecha_termino}</td>
              <td className="p-4">${c.monto_mensual?.toLocaleString('es-CL')}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  c.estado === 'vigente' ? 'bg-green-100 text-green-700' :
                  c.estado === 'por vencer' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {c.estado}
                </span>
              </td>
              <td className="p-4 flex gap-2">
                <Link href={`/contratos/${c.id}/editar`} className="text-blue-600 hover:underline text-sm">Editar</Link>
                <EliminarContrato id={c.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
