'use client'

import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ImportarUnidades() {
  const router = useRouter()
  const [edificios, setEdificios] = useState<any[]>([])
  const [filas, setFilas] = useState<any[]>([])
  const [importando, setImportando] = useState(false)
  const [resultado, setResultado] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('edificios').select('id, nombre').then(({ data }) => {
      if (data) setEdificios(data)
    })
  }, [])

  function leerExcel(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const data = ev.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const hoja = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(hoja)
      setFilas(json as any[])
    }
    reader.readAsBinaryString(archivo)
  }

  async function importar() {
    setImportando(true)
    setError('')
    setResultado('')
    let exitosos = 0
    let errores = 0

    for (const fila of filas) {
      try {
        const edificio = edificios.find(e =>
          e.nombre.toLowerCase().trim() === String(fila.edificio || '').toLowerCase().trim()
        )

        let arrendatario_id = null
        if (fila.arrendatario) {
          const { data: arrExistente } = await supabase
            .from('arrendatarios')
            .select('id')
            .eq('rut', String(fila.rut || ''))
            .single()

          if (arrExistente) {
            arrendatario_id = arrExistente.id
          } else {
            const { data: nuevoArr } = await supabase
              .from('arrendatarios')
              .insert({
                tipo: 'sociedad',
                razon_social: String(fila.arrendatario || ''),
                rut: String(fila.rut || ''),
                email_contacto: String(fila.email || ''),
                telefono_contacto: String(fila.telefono || ''),
              })
              .select('id')
              .single()
            arrendatario_id = nuevoArr?.id
          }
        }

        const { data: unidad } = await supabase
          .from('unidades')
          .insert({
            edificio_id: edificio?.id ?? null,
            numero: String(fila.unidad || ''),
            tipo: String(fila.tipo || ''),
            categoria: String(fila.categoria || ''),
            rol: String(fila.rol || ''),
            metros_cuadrados: fila.mts2 ? Number(fila.mts2) : null,
            estado: 'libre',
          })
          .select('id')
          .single()

        if (arrendatario_id && unidad && fila.inicio) {
          await supabase.from('contratos').insert({
            unidad_id: unidad.id,
            arrendatario_id,
            fecha_inicio: fila.inicio,
            fecha_termino: fila.termino,
            monto_mensual: fila.facturacion ? Number(fila.facturacion) : null,
            tipo_contrato: String(fila.tipoContrato || ''),
            nota: String(fila.nota || ''),
            estado: 'vigente',
            pdf_url: fila.urlPdf ? String(fila.urlPdf) : null,
          })
        }

        exitosos++
      } catch {
        errores++
      }
    }

    setResultado(`Importación completa: ${exitosos} filas importadas, ${errores} errores.`)
    setImportando(false)
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Importar desde Excel</h1>
      <p className="text-gray-500 mb-6 text-sm">
        El archivo debe tener estas columnas: edificio, tipo, categoria, arrendatario, rut, email, telefono, unidad, rol, mts2, tipoContrato, facturacion, nota, inicio, termino, urlPdf
      </p>

      <div className="bg-white rounded shadow p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Selecciona tu archivo Excel</label>
          <input type="file" accept=".xlsx,.xls" onChange={leerExcel} className="w-full border p-2 rounded" />
        </div>

        {filas.length > 0 && (
          <>
            <p className="text-green-600 text-sm">{filas.length} filas detectadas. Vista previa de las primeras 3:</p>
            <div className="overflow-x-auto">
              <table className="text-xs w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(filas[0]).map(col => (
                      <th key={col} className="p-2 border text-left">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filas.slice(0, 3).map((fila, i) => (
                    <tr key={i} className="border-t">
                      {Object.values(fila).map((val: any, j) => (
                        <td key={j} className="p-2 border">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={importar}
              disabled={importando}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-fit"
            >
              {importando ? 'Importando...' : `Importar ${filas.length} filas`}
            </button>
          </>
        )}

        {resultado && <p className="text-green-600 font-medium">{resultado}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <button onClick={() => router.push('/unidades')} className="text-gray-500 hover:underline text-sm w-fit">
          ← Volver a Unidades
        </button>
      </div>
    </div>
  )
}
