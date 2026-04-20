import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Unidades() {
  const { data: unidades } = await supabase
    .from('unidades')
    .select('*, edificios(nombre)')

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Unidades</h1>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">Número</th>
            <th className="text-left p-4">Edificio</th>
            <th className="text-left p-4">Tipo</th>
            <th className="text-left p-4">Piso</th>
            <th className="text-left p-4">m²</th>
            <th className="text-left p-4">Estado</th>
          </tr>
        </thead>
        <tbody>
          {unidades?.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No hay unidades registradas
              </td>
            </tr>
          )}
          {unidades?.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-4">{u.numero}</td>
              <td className="p-4">{u.edificios?.nombre}</td>
              <td className="p-4">{u.tipo}</td>
              <td className="p-4">{u.piso}</td>
              <td className="p-4">{u.metros_cuadrados}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  u.estado === 'libre' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {u.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
