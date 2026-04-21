'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function FormEditarArrendatario({ arrendatario }: { arrendatario: any }) {
  const router = useRouter()
  const [tipo, setTipo] = useState(arrendatario.tipo ?? 'sociedad')
  const [form, setForm] = useState({
    razon_social: arrendatario.razon_social ?? '',
    rut: arrendatario.rut ?? '',
    nombre_contacto: arrendatario.nombre_contacto ?? '',
    email_contacto: arrendatario.email_contacto ?? '',
    telefono_contacto: arrendatario.telefono_contacto ?? '',
    nombre: arrendatario.nombre ?? '',
    apellido: arrendatario.apellido ?? '',
    email: arrendatario.email ?? '',
    telefono: arrendatario.telefono ?? '',
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)

    const datos = tipo === 'sociedad'
      ? { tipo, razon_social: form.razon_social, rut: form.rut, nombre_contacto: form.nombre_contacto, email_contacto: form.email_contacto, telefono_contacto: form.telefono_contacto }
      : { tipo, nombre: form.nombre, apellido: form.apellido, rut: form.rut, email: form.email, telefono: form.telefono }

    const { error } = await supabase.from('arrendatarios').update(datos).eq('id', arrendatario.id)

    if (error) {
      setError(`Error: ${error.message}`)
    } else {
      router.push('/arrendatarios')
    }
    setGuardando(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border p-2 rounded">
          <option value="sociedad">Sociedad / Empresa</option>
          <option value="persona">Persona Natural</option>
        </select>
      </div>

      {tipo === 'sociedad' ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Razón Social</label>
            <input name="razon_social" value={form.razon_social} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RUT Empresa</label>
            <input name="rut" value={form.rut} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <hr />
          <p className="text-sm font-semibold text-gray-500">Persona de Contacto</p>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Contacto</label>
            <input name="nombre_contacto" value={form.nombre_contacto} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Contacto</label>
            <input name="email_contacto" type="email" value={form.email_contacto} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono Contacto</label>
            <input name="telefono_contacto" value={form.telefono_contacto} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input name="apellido" value={form.apellido} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RUT</label>
            <input name="rut" value={form.rut} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 mt-2">
        <button type="submit" disabled={guardando} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={() => router.push('/arrendatarios')} className="border px-6 py-2 rounded hover:bg-gray-100">
          Cancelar
        </button>
      </div>
    </form>
  )
}
