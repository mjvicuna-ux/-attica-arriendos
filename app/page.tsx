import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: edificios } = await supabase.from('edificios').select('*')

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Attica Arriendos</h1>
      <h2 className="text-xl font-semibold mb-4">Edificios</h2>
      <ul>
        {edificios?.map((e) => (
          <li key={e.id} className="border p-4 mb-2 rounded">
            <p className="font-bold">{e.nombre}</p>
            <p>{e.direccion}, {e.ciudad}</p>
            <p>{e.total_unidades} unidades</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
