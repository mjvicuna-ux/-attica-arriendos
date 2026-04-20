import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Arrendatarios() {
  const { data: arrendatarios } = await supabase.from('arrendatarios').select('*')

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Arrendatarios</h1>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">Nombre</th>
            <th className="text-left p-4">RUT</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Teléfono</th>
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
              <td className="p-4">{a.nombre} {a.apellido}</td>
              <td className="p-4">{a.rut}</td>
              <td className="p-4">{a.email}</td>
              <td className="p-4">{a.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
