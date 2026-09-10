/* ============================================================================
   AZLOOM · i18n compartido (nav, footer, modales legales, formulario).
   Cada página hace:
     window.AZLOOM_I18N = {
       es: Object.assign({}, AZLOOM_CHROME_I18N.es, { ...claves de página }),
       en: Object.assign({}, AZLOOM_CHROME_I18N.en, { ...claves de página })
     };
   ...y luego carga scripts/azloom.js
   ========================================================================== */
window.AZLOOM_CHROME_I18N = {
  es: {
    'a11y.skip': 'Saltar al contenido',
    'nav.home': 'Inicio',
    'nav.systems': 'Sistemas', 'nav.work': 'Proyectos', 'nav.about': 'Nosotros',
    'nav.faq': 'FAQ', 'nav.cta': 'Iniciar un proyecto',

    'footer.tagline': 'Sistemas hechos para evolucionar. Tecnología diseñada para personas, por personas.',
    'footer.c1': 'Navegación', 'footer.c2': 'Contacto', 'footer.c3': 'Legal',
    'footer.home': 'Inicio',

    'contact.locv': 'San José, Costa Rica',

    'legal.privacy': 'Política de privacidad', 'legal.cookies': 'Política de cookies', 'legal.notice': 'Aviso legal',
    'pv.intro': 'En AZLOOM respetamos su privacidad y protegemos la información personal que comparte a través de este sitio. Al usarlo, acepta los términos de esta política.',
    'pv.1t': '1. Información que recopilamos', 'pv.1d': 'Recopilamos los datos que envía de forma voluntaria por el formulario de contacto: nombre, correo electrónico, empresa, teléfono e información sobre su necesidad. También datos técnicos básicos (IP, navegador, páginas visitadas) para mejorar el sitio.',
    'pv.2t': '2. Uso de la información', 'pv.2d': 'Usamos la información únicamente para responder consultas, dar información sobre nuestros servicios y mejorar el sitio. No la usamos para otros fines.',
    'pv.3t': '3. Compartición', 'pv.3d': 'No vendemos, alquilamos ni compartimos datos personales con terceros, salvo obligación legal. El envío de formularios se procesa mediante FormSubmit y el seguimiento de contactos mediante Brevo.',
    'pv.4t': '4. Sus derechos', 'pv.4d': 'Conforme a la Ley de Protección de Datos Personales de Costa Rica (N.º 8968), puede acceder a sus datos, corregirlos o solicitar su eliminación escribiendo a hello@azloom.tech.',
    'pv.5t': '5. Cambios', 'pv.5d': 'Podemos actualizar esta política en cualquier momento. Los cambios se publican en esta misma página.',
    'ck.intro': 'Usamos cookies para mejorar su experiencia en www.azloom.tech y entender cómo se usa el sitio.',
    'ck.1t': '1. Qué son', 'ck.1d': 'Pequeños archivos de texto que se guardan en su dispositivo y permiten recordar preferencias y analizar la interacción con el sitio.',
    'ck.2t': '2. Cuáles usamos', 'ck.2d': 'Cookies técnicas necesarias para el funcionamiento del sitio y cookies analíticas (Google Analytics). Estas últimas solo se activan si usted da su consentimiento en el aviso de cookies que aparece al ingresar al sitio.',
    'ck.3t': '3. Control', 'ck.3d': 'Puede configurar su navegador para rechazar o eliminar cookies en cualquier momento. Deshabilitarlas puede afectar el funcionamiento del sitio.',
    'lg.intro': 'Este aviso regula el acceso y uso del sitio www.azloom.tech. El acceso al sitio implica la aceptación de estas condiciones.',
    'lg.1t': '1. Información general', 'lg.1d': 'AZLOOM es una empresa con base en San José, Costa Rica, enfocada en el diseño y la construcción de sistemas para empresas: automatización, agentes de IA, software a medida y datos. Contacto: hello@azloom.tech.',
    'lg.2t': '2. Propiedad intelectual', 'lg.2d': 'Los contenidos del sitio —textos, diseño, logotipo, estructura, gráficos e identidad visual— son propiedad de AZLOOM o cuentan con autorización para su uso. No se permite su reproducción sin autorización previa.',
    'lg.3t': '3. Uso de la información', 'lg.3d': 'La información del sitio tiene fines informativos y no constituye asesoramiento profesional específico. Las decisiones tomadas a partir de ella son responsabilidad del usuario.',
    'lg.4t': '4. Legislación aplicable', 'lg.4d': 'Estas condiciones se rigen por la legislación vigente en Costa Rica.',

    'form.name': 'Nombre completo', 'form.phone': 'Teléfono', 'form.email': 'Email corporativo',
    'form.company': 'Empresa', 'form.message': '¿Qué quiere resolver?',
    'form.consent': 'Acepto la <a href="#" data-modal="privacy">política de privacidad</a>.',
    'form.submit': 'Enviar mensaje',
    'form.ok.k': 'Recibido', 'form.ok.t': 'Gracias, ya lo tenemos.', 'form.ok.d': 'Le respondemos pronto desde hello@azloom.tech.',

    'cookie.text': 'Usamos cookies técnicas necesarias para el sitio y, con su consentimiento, cookies analíticas (Google Analytics) para entender cómo se usa.',
    'cookie.accept': 'Aceptar', 'cookie.reject': 'Rechazar'
  },
  en: {
    'a11y.skip': 'Skip to content',
    'nav.home': 'Home',
    'nav.systems': 'Systems', 'nav.work': 'Projects', 'nav.about': 'About',
    'nav.faq': 'FAQ', 'nav.cta': 'Start a project',

    'footer.tagline': 'Systems built to evolve. Technology designed for people, by people.',
    'footer.c1': 'Navigation', 'footer.c2': 'Contact', 'footer.c3': 'Legal',
    'footer.home': 'Home',

    'contact.locv': 'San José, Costa Rica',

    'legal.privacy': 'Privacy policy', 'legal.cookies': 'Cookie policy', 'legal.notice': 'Legal notice',
    'pv.intro': 'At AZLOOM we respect your privacy and protect the personal information you share through this site. By using it, you accept the terms of this policy.',
    'pv.1t': '1. Information we collect', 'pv.1d': 'We collect the data you voluntarily submit through the contact form: name, email, company, phone and information about your need. We also collect basic technical data (IP, browser, pages visited) to improve the site.',
    'pv.2t': '2. Use of the information', 'pv.2d': 'We use the information only to respond to inquiries, provide information about our services and improve the site. We do not use it for other purposes.',
    'pv.3t': '3. Sharing', 'pv.3d': 'We do not sell, rent or share personal data with third parties, except by legal obligation. Form submissions are processed via FormSubmit and contact follow-up via Brevo.',
    'pv.4t': '4. Your rights', 'pv.4d': 'Under Costa Rica’s Personal Data Protection Law (No. 8968), you can access, correct or request deletion of your data by writing to hello@azloom.tech.',
    'pv.5t': '5. Changes', 'pv.5d': 'We may update this policy at any time. Changes are published on this page.',
    'ck.intro': 'We use cookies to improve your experience on www.azloom.tech and to understand how the site is used.',
    'ck.1t': '1. What they are', 'ck.1d': 'Small text files stored on your device that let us remember preferences and analyze interaction with the site.',
    'ck.2t': '2. Which we use', 'ck.2d': 'Technical cookies necessary for the site to work and analytics cookies (Google Analytics). The latter are only activated if you give your consent in the cookie notice shown when you enter the site.',
    'ck.3t': '3. Control', 'ck.3d': 'You can set your browser to reject or delete cookies at any time. Disabling them may affect how the site works.',
    'lg.intro': 'This notice governs access to and use of the site www.azloom.tech. Accessing the site implies acceptance of these conditions.',
    'lg.1t': '1. General information', 'lg.1d': 'AZLOOM is a company based in San José, Costa Rica, focused on designing and building systems for companies: automation, AI agents, custom software and data. Contact: hello@azloom.tech.',
    'lg.2t': '2. Intellectual property', 'lg.2d': 'The site’s content —text, design, logo, structure, graphics and visual identity— is owned by AZLOOM or used with authorization. Reproduction without prior authorization is not permitted.',
    'lg.3t': '3. Use of the information', 'lg.3d': 'The site’s information is for informational purposes and does not constitute specific professional advice. Decisions made from it are the user’s responsibility.',
    'lg.4t': '4. Applicable law', 'lg.4d': 'These conditions are governed by the laws of Costa Rica.',

    'form.name': 'Full name', 'form.phone': 'Phone', 'form.email': 'Work email',
    'form.company': 'Company', 'form.message': 'What do you want to solve?',
    'form.consent': 'I accept the <a href="#" data-modal="privacy">privacy policy</a>.',
    'form.submit': 'Send message',
    'form.ok.k': 'Received', 'form.ok.t': 'Thanks, we’ve got it.', 'form.ok.d': 'We’ll reply soon from hello@azloom.tech.',

    'cookie.text': 'We use technical cookies necessary for the site and, with your consent, analytics cookies (Google Analytics) to understand how it is used.',
    'cookie.accept': 'Accept', 'cookie.reject': 'Reject'
  }
};
