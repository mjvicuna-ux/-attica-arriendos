'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NuevoEdificio() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    total_unidades: '',
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const { error } = await supabase.from('edificios').insert({
      nombre: form.nombre,
      direccion: form.direccion,
      ciudad: form.ciudad,
      total_unidades: form.total_unidades ? Number(form.total_unidades) : null,
    })

    if (error) {
      setError(`Error: ${error.message}`)
    } else {
      router.push('/')
    }
    setGuardando(false)
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Nuevo Edificio</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Torre I" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Av. Providencia 1234" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ciudad</label>
          <input name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Santiago" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total de unidades</label>
          <input name="total_unidades" type="number" value={form.total_unidades} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 mt-2">
          <button type="submit" disabled={guardando} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={() => router.push('/')} className="border px-6 py-2 rounded hover:bg-gray-100">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
