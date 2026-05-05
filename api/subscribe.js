export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const API_KEY = process.env.BREVO_API_KEY;
  const headers = {
    'api-key': API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    // 1. Agregar contacto a Brevo
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        listIds: [2],
        updateEnabled: true,
        attributes: { SOURCE: 'lead-magnet-web' }
      })
    });

    // 2. Enviar email de bienvenida con link a la guía
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sender: { name: 'AZLOOM', email: 'hello@azloom.tech' },
        to: [{ email }],
        subject: 'Tu guía de automatización con IA está lista 🚀',
        htmlContent: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0F0F1A;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F1A;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#14141F;border:1px solid rgba(124,92,252,0.2);border-radius:20px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,rgba(124,92,252,0.2),rgba(124,92,252,0.05));padding:40px 48px 32px;text-align:center;border-bottom:1px solid rgba(124,92,252,0.15);">
            <div style="font-size:20px;font-weight:700;letter-spacing:3px;color:#F8F8FF;margin-bottom:8px;">
              AZL<span style="color:#7C5CFC;">OO</span>M
            </div>
            <div style="font-size:12px;color:rgba(248,248,255,0.4);letter-spacing:1px;text-transform:uppercase;">automatización · ia · crecimiento</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:48px 48px 40px;">
            <h1 style="font-size:26px;font-weight:700;color:#F8F8FF;margin:0 0 16px;line-height:1.3;">
              Tu guía está lista 🚀
            </h1>
            <p style="font-size:16px;color:rgba(248,248,255,0.6);line-height:1.7;margin:0 0 28px;">
              Gracias por tu interés. Aquí tenés la guía completa con los <strong style="color:#F8F8FF;">5 procesos que podés automatizar con IA esta semana</strong> — con herramientas, tiempos de implementación y ROI estimado para cada uno.
            </p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
              <tr>
                <td style="background:#7C5CFC;border-radius:10px;">
                  <a href="https://www.azloom.tech/guia-automatizacion/" style="display:inline-block;padding:16px 36px;color:#F8F8FF;font-size:16px;font-weight:600;text-decoration:none;letter-spacing:0.2px;">
                    Ver guía completa →
                  </a>
                </td>
              </tr>
            </table>

            <!-- What's inside -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(124,92,252,0.07);border:1px solid rgba(124,92,252,0.15);border-radius:12px;margin-bottom:32px;">
              <tr><td style="padding:24px 28px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7C5CFC;margin-bottom:14px;">Qué encontrás en la guía</div>
                <div style="font-size:14px;color:rgba(248,248,255,0.65);line-height:1.9;">
                  ✓ &nbsp;WhatsApp automático con IA (responde 24/7)<br>
                  ✓ &nbsp;Seguimiento automático de leads<br>
                  ✓ &nbsp;Onboarding de clientes sin trabajo manual<br>
                  ✓ &nbsp;Reportes automáticos sin Excel<br>
                  ✓ &nbsp;Asistente IA interno para tu equipo<br>
                  ✓ &nbsp;Checklist de implementación en 7 días
                </div>
              </td></tr>
            </table>

            <p style="font-size:15px;color:rgba(248,248,255,0.55);line-height:1.7;margin:0 0 28px;">
              Si querés implementar alguno de estos procesos en tu empresa y preferís no hacerlo solo, agendá un diagnóstico gratuito de 30 minutos. Sin costo, sin compromiso.
            </p>

            <!-- Secondary CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="border:1px solid rgba(124,92,252,0.3);border-radius:8px;">
                  <a href="https://www.azloom.tech/#contacto" style="display:inline-block;padding:12px 28px;color:#C4B5FD;font-size:14px;font-weight:500;text-decoration:none;">
                    Solicitar diagnóstico gratuito
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 48px;border-top:1px solid rgba(124,92,252,0.1);text-align:center;">
            <p style="font-size:12px;color:rgba(248,248,255,0.25);margin:0 0 6px;">
              © 2026 AZLOOM · San José, Costa Rica
            </p>
            <p style="font-size:12px;color:rgba(248,248,255,0.2);margin:0;">
              Recibiste este email porque descargaste nuestra guía en azloom.tech
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
      })
    });

    if (!emailRes.ok) {
      const err = await emailRes.json();
      console.error('Brevo error:', err);
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
