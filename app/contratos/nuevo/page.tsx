'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NuevoContrato() {
  const router = useRouter()
  const [unidades, setUnidades] = useState<any[]>([])
  const [arrendatarios, setArrendatarios] = useState<any[]>([])
  const [pdf, setPdf] = useState<File | null>(null)
  const [form, setForm] = useState({
    unidad_id: '',
    arrendatario_id: '',
    fecha_inicio: '',
    fecha_termino: '',
    monto_mensual: '',
    estado: 'vigente',
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    supabase.from('unidades').select('id, numero, tipo').then(({ data }) => {
      if (data) setUnidades(data)
    })
    supabase.from('arrendatarios').select('id, nombre, apellido, razon_social, tipo').then(({ data }) => {
      if (data) setArrendatarios(data)
    })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError('')

    let pdf_url = null

    if (pdf) {
      const nombreArchivo = `${Date.now()}_${pdf.name}`
      const { error: uploadError } = await supabase.storage
        .from('contratos')
        .upload(nombreArchivo, pdf)

      if (uploadError) {
        setError(`Error subiendo PDF: ${uploadError.message}`)
        setGuardando(false)
        return
      }

      const { data: urlData } = supabase.storage.from('contratos').getPublicUrl(nombreArchivo)
      pdf_url = urlData.publicUrl
    }

    const { error } = await supabase.from('contratos').insert({
      unidad_id: Number(form.unidad_id),
      arrendatario_id: Number(form.arrendatario_id),
      fecha_inicio: form.fecha_inicio,
      fecha_termino: form.fecha_termino,
      monto_mensual: Number(form.monto_mensual),
      estado: form.estado,
      pdf_url,
    })

    if (error) {
      setError(`Error: ${error.message}`)
    } else {
      router.push('/contratos')
    }
    setGuardando(false)
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Nuevo Contrato</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Arrendatario</label>
          <select name="arrendatario_id" value={form.arrendatario_id} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Selecciona un arrendatario</option>
            {arrendatarios.map((a) => (
              <option key={a.id} value={a.id}>
                {a.tipo === 'sociedad' ? a.razon_social : `${a.nombre} ${a.apellido}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unidad</label>
          <select name="unidad_id" value={form.unidad_id} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Selecciona una unidad</option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>{u.tipo} {u.numero}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
          <input name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha de término</label>
          <input name="fecha_termino" type="date" value={form.fecha_termino} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Monto mensual (CLP)</label>
          <input name="monto_mensual" type="number" value={form.monto_mensual} onChange={handleChange} placeholder="500000" className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="vigente">Vigente</option>
            <option value="por vencer">Por vencer</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">PDF del contrato (opcional)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
            className="w-full border p-2 rounded"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 mt-2">
          <button type="submit" disabled={guardando} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={() => router.push('/contratos')} className="border px-6 py-2 rounded hover:bg-gray-100">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
