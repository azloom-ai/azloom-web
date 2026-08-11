export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, q1, q2, q3 } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (!q1 || !q2 || !q3) {
    return res.status(400).json({ error: 'Faltan respuestas' });
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

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  try {
    // 1. Agregar/actualizar contacto en Brevo con las respuestas como atributos
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        listIds: [2],
        updateEnabled: true,
        attributes: {
          SOURCE: 'quiz-diagnostico-web',
          QUIZ_Q1: q1,
          QUIZ_Q2: q2,
          QUIZ_Q3: q3
        }
      })
    });

    // 2. Notificación interna a hello@azloom.tech con las respuestas
    const notifyRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sender: { name: 'AZLOOM Web', email: 'hello@azloom.tech' },
        to: [{ email: 'hello@azloom.tech' }],
        subject: `Nueva respuesta al cuestionario: ${email}`,
        htmlContent: `
          <p>Nuevo lead completó el cuestionario de diagnóstico en la web:</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <p><strong>1. Dolor de cabeza a eliminar:</strong><br>${esc(q1)}</p>
          <p><strong>2. Tarea a automatizar:</strong><br>${esc(q2)}</p>
          <p><strong>3. Proceso que más frustra:</strong><br>${esc(q3)}</p>
        `
      })
    });

    if (!notifyRes.ok) {
      const err = await notifyRes.json();
      return res.status(500).json({ error: 'Brevo email error', detail: err });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('quiz-lead error:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
