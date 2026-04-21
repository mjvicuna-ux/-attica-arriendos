import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import EliminarEdificio from './edificios/EliminarEdificio'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: edificios } = await supabase.from('edificios').select('*')

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Attica Arriendos</h1>
        <Link href="/edificios/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Edificio
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-4">Edificios</h2>
      <ul>
        {edificios?.map((e) => (
          <li key={e.id} className="border p-4 mb-2 rounded bg-white flex justify-between items-center">
            <div>
              <p className="font-bold">{e.nombre}</p>
              <p className="text-sm text-gray-600">{e.direccion}, {e.ciudad}</p>
              <p className="text-sm text-gray-600">{e.total_unidades} unidades</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/edificios/${e.id}/editar`} className="text-blue-600 hover:underline text-sm">Editar</Link>
              <EliminarEdificio id={e.id} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
