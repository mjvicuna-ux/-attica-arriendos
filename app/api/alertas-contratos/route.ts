import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hoy = new Date()
  const en60dias = new Date()
  en60dias.setDate(hoy.getDate() + 60)

  const { data: contratos, error } = await supabase
    .from('contratos')
    .select(`
      id,
      fecha_termino,
      monto_mensual,
      unidades (numero, edificio_id),
      arrendatarios (razon_social, nombre, apellido)
    `)
    .eq('estado', 'vigente')
    .lte('fecha_termino', en60dias.toISOString().split('T')[0])
    .gte('fecha_termino', hoy.toISOString().split('T')[0])
    .order('fecha_termino')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!contratos || contratos.length === 0) {
    return NextResponse.json({ message: 'Sin contratos por vencer' })
  }

  const edificioIds = [...new Set(contratos.map((c: any) => c.unidades?.edificio_id).filter(Boolean))]
  const { data: edificios } = await supabase.from('edificios').select('id, nombre').in('id', edificioIds)
  const edificioMap = Object.fromEntries((edificios ?? []).map((e: any) => [e.id, e.nombre]))

  const filas = contratos.map((c: any) => {
    const termino = new Date(c.fecha_termino)
    const dias = Math.ceil((termino.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    const arrendatario = c.arrendatarios?.razon_social || `${c.arrendatarios?.nombre} ${c.arrendatarios?.apellido}`
    const nombreEdificio = edificioMap[c.unidades?.edificio_id] ?? ''
    const unidad = `${nombreEdificio} - Unidad ${c.unidades?.numero}`
    return `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${arrendatario}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${unidad}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${c.fecha_termino}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;color:${dias <= 30 ? '#dc2626' : '#d97706'};font-weight:bold">${dias} días</td>
    </tr>`
  }).join('')

  const html = `
    <div style="font-family:sans-serif;max-width:700px;margin:0 auto">
      <h2 style="color:#1e40af">Contratos por vencer — Attica Arriendos</h2>
      <p>Hoy es <strong>${hoy.toLocaleDateString('es-CL')}</strong>. Los siguientes contratos vencen en los próximos 60 días:</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead>
          <tr style="background:#f1f5f9">
            <th style="padding:8px;text-align:left">Arrendatario</th>
            <th style="padding:8px;text-align:left">Unidad</th>
            <th style="padding:8px;text-align:left">Vence</th>
            <th style="padding:8px;text-align:left">Días restantes</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
      <p style="margin-top:24px;font-size:13px;color:#6b7280">
        Ver plataforma: <a href="https://attica-arriendos.vercel.app/calendario">Calendario de vencimientos</a>
      </p>
    </div>
  `

  await resend.emails.send({
    from: 'Attica Arriendos <onboarding@resend.dev>',
    to: 'mjvicuna@attica.cl',
    subject: `⚠️ ${contratos.length} contrato${contratos.length > 1 ? 's' : ''} por vencer en los próximos 60 días`,
    html,
  })

  return NextResponse.json({ enviado: true, contratos: contratos.length })
}
