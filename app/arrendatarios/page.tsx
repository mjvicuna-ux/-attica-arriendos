import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EliminarArrendatario from './EliminarArrendatario'

export const dynamic = 'force-dynamic'

export default async function Arrendatarios() {
  const { data: arrendatarios } = await supabase.from('arrendatarios').select('*')

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Arrendatarios</h1>
        <Link href="/arrendatarios/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Arrendatario
        </Link>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">Nombre</th>
            <th className="text-left p-4">RUT</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Teléfono</th>
            <th className="text-left p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {arrendatarios?.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No hay arrendatarios registrados
              </td>
            </tr>
          )}
          {arrendatarios?.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-4">
                {a.tipo === 'sociedad' ? a.razon_social : `${a.nombre} ${a.apellido}`}
                <span className="ml-2 text-xs text-gray-400">{a.tipo === 'sociedad' ? 'Empresa' : 'Persona'}</span>
              </td>
              <td className="p-4">{a.rut}</td>
              <td className="p-4">{a.tipo === 'sociedad' ? a.email_contacto : a.email}</td>
              <td className="p-4">{a.tipo === 'sociedad' ? a.telefono_contacto : a.telefono}</td>
              <td className="p-4 flex gap-2">
                <Link href={`/arrendatarios/${a.id}/editar`} className="text-blue-600 hover:underline text-sm">Editar</Link>
                <EliminarArrendatario id={a.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
