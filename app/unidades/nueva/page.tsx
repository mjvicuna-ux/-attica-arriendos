'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NuevaUnidad() {
  const router = useRouter()
  const [edificios, setEdificios] = useState<any[]>([])
  const [form, setForm] = useState({
    edificio_id: '',
    numero: '',
    tipo: 'departamento',
    piso: '',
    metros_cuadrados: '',
    estado: 'libre',
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    supabase.from('edificios').select('id, nombre').then(({ data }) => {
      if (data) setEdificios(data)
    })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const { error } = await supabase.from('unidades').insert({
      edificio_id: Number(form.edificio_id),
      numero: form.numero,
      tipo: form.tipo,
      piso: form.piso ? Number(form.piso) : null,
      metros_cuadrados: form.metros_cuadrados ? Number(form.metros_cuadrados) : null,
      estado: form.estado,
    })

    if (error) {
      setError(`Error: ${error.message}`)
    } else {
      router.push('/unidades')
    }
    setGuardando(false)
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Nueva Unidad</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-4">

        <div>
          <label className="block text-sm font-medium mb-1">Edificio</label>
          <select name="edificio_id" value={form.edificio_id} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Selecciona un edificio</option>
            {edificios.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Número</label>
          <input name="numero" value={form.numero} onChange={handleChange} placeholder="101, E-5, B-3..." className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="departamento">Departamento</option>
            <option value="estacionamiento">Estacionamiento</option>
            <option value="bodega">Bodega</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Piso</label>
          <input name="piso" type="number" value={form.piso} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Metros cuadrados</label>
          <input name="metros_cuadrados" type="number" value={form.metros_cuadrados} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="libre">Libre</option>
            <option value="arrendado">Arrendado</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 mt-2">
          <button type="submit" disabled={guardando} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={() => router.push('/unidades')} className="border px-6 py-2 rounded hover:bg-gray-100">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
