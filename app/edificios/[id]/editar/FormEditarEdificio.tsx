'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function FormEditarEdificio({ edificio }: { edificio: any }) {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: edificio.nombre ?? '',
    direccion: edificio.direccion ?? '',
    ciudad: edificio.ciudad ?? '',
    total_unidades: String(edificio.total_unidades ?? ''),
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    const { error } = await supabase.from('edificios').update({
      nombre: form.nombre,
      direccion: form.direccion,
      ciudad: form.ciudad,
      total_unidades: form.total_unidades ? Number(form.total_unidades) : null,
    }).eq('id', edificio.id)

    if (error) {
      setError(`Error: ${error.message}`)
    } else {
      router.push('/')
    }
    setGuardando(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input name="direccion" value={form.direccion} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ciudad</label>
        <input name="ciudad" value={form.ciudad} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Total de unidades</label>
        <input name="total_unidades" type="number" value={form.total_unidades} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 mt-2">
        <button type="submit" disabled={guardando} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={() => router.push('/')} className="border px-6 py-2 rounded hover:bg-gray-100">
          Cancelar
        </button>
      </div>
    </form>
  )
}
