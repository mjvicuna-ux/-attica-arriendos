'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function FormEditarContrato({ contrato, unidades, arrendatarios }: { contrato: any, unidades: any[], arrendatarios: any[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    unidad_id: String(contrato.unidad_id ?? ''),
    arrendatario_id: String(contrato.arrendatario_id ?? ''),
    fecha_inicio: contrato.fecha_inicio ?? '',
    fecha_termino: contrato.fecha_termino ?? '',
    monto_mensual: String(contrato.monto_mensual ?? ''),
    estado: contrato.estado ?? 'vigente',
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    const { error } = await supabase.from('contratos').update({
      unidad_id: Number(form.unidad_id),
      arrendatario_id: Number(form.arrendatario_id),
      fecha_inicio: form.fecha_inicio,
      fecha_termino: form.fecha_termino,
      monto_mensual: Number(form.monto_mensual),
      estado: form.estado,
    }).eq('id', contrato.id)

    if (error) {
      setError(`Error: ${error.message}`)
    } else {
      router.push('/contratos')
    }
    setGuardando(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Arrendatario</label>
        <select name="arrendatario_id" value={form.arrendatario_id} onChange={handleChange} className="w-full border p-2 rounded">
          {arrendatarios.map((a) => (
            <option key={a.id} value={a.id}>
              {a.tipo === 'sociedad' ? a.razon_social : `${a.nombre} ${a.apellido}`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Unidad</label>
        <select name="unidad_id" value={form.unidad_id} onChange={handleChange} className="w-full border p-2 rounded">
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>{u.tipo} {u.numero}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
        <input name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fecha de término</label>
        <input name="fecha_termino" type="date" value={form.fecha_termino} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Monto mensual (CLP)</label>
        <input name="monto_mensual" type="number" value={form.monto_mensual} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <select name="estado" value={form.estado} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="vigente">Vigente</option>
          <option value="por vencer">Por vencer</option>
          <option value="vencido">Vencido</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 mt-2">
        <button type="submit" disabled={guardando} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={() => router.push('/contratos')} className="border px-6 py-2 rounded hover:bg-gray-100">
          Cancelar
        </button>
      </div>
    </form>
  )
}
