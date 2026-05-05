export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const API_KEY = process.env.BREVO_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'BREVO_API_KEY no configurada' });
  }

  const headers = {
    'api-key': API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    // 1. Agregar contacto a Brevo
    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        listIds: [2],
        updateEnabled: true,
        attributes: { SOURCE: 'lead-magnet-web' }
      })
    });

    // 2. Enviar email de bienvenida al lead
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: [{ email }],
        templateId: 1
      })
    });

    if (!emailRes.ok) {
      const err = await emailRes.json();
      return res.status(500).json({ error: 'Brevo email error', detail: err });
    }

    // 3. Notificación interna a hello@azloom.tech
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sender: { name: 'AZLOOM Web', email: 'hello@azloom.tech' },
        to: [{ email: 'hello@azloom.tech' }],
        subject: `Nuevo lead: ${email}`,
        htmlContent: `<p>Nuevo lead registrado desde el formulario de la guía:</p><p><strong>${email}</strong></p><p>Ya recibió el email de bienvenida automáticamente.</p>`
      })
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
