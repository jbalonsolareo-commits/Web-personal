/* ============================================================
   BUTI — Bauti's personal chatbot 🤖
   Self-contained widget: inject <script src="assets/buti.js" defer></script>
   Answers interviewer questions using the content of this website.
   Rule #1: BUTI never speaks badly about Bauti. Ever.
   ============================================================ */
(function () {
  'use strict';

  /* ── Styles ─────────────────────────────────────────────── */
  const css = `
  #buti-fab {
    position: fixed; bottom: 24px; right: 24px; z-index: 10000;
    width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 30px rgba(59,130,246,0.45);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-size: 26px;
  }
  #buti-fab:hover { transform: scale(1.08); box-shadow: 0 10px 36px rgba(59,130,246,0.6); }
  #buti-fab .buti-fab-badge {
    position: absolute; top: -4px; right: -4px;
    background: #22c55e; color: #04110a;
    font: 700 0.58rem 'Inter', system-ui, sans-serif;
    padding: 3px 7px; border-radius: 10px; letter-spacing: 0.04em;
  }

  #buti-panel {
    position: fixed; bottom: 96px; right: 24px; z-index: 10000;
    width: 380px; max-width: calc(100vw - 32px);
    height: 560px; max-height: calc(100vh - 130px);
    background: #0c1220;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 18px;
    display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 0 24px 70px rgba(0,0,0,0.6);
    font-family: 'Inter', system-ui, sans-serif;
    opacity: 0; transform: translateY(16px) scale(0.98); pointer-events: none;
    transition: opacity 0.25s cubic-bezier(0.16,1,0.3,1), transform 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  #buti-panel.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

  .buti-header {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 18px;
    background: linear-gradient(135deg, rgba(59,130,246,0.16), rgba(37,99,235,0.06));
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
  }
  .buti-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
  }
  .buti-header-info { flex: 1; min-width: 0; }
  .buti-header-name { color: #f1f5f9; font-weight: 700; font-size: 1rem; letter-spacing: -0.02em; }
  .buti-header-sub { color: #64748b; font-size: 0.72rem; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .buti-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px rgba(34,197,94,0.7); flex-shrink: 0; }
  .buti-close {
    background: none; border: none; color: #64748b; cursor: pointer;
    font-size: 22px; line-height: 1; padding: 6px; border-radius: 8px;
  }
  .buti-close:hover { color: #f1f5f9; background: rgba(255,255,255,0.06); }

  .buti-messages {
    flex: 1; overflow-y: auto; padding: 18px 16px 8px;
    display: flex; flex-direction: column; gap: 12px;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.15) transparent;
  }
  .buti-messages::-webkit-scrollbar { width: 5px; }
  .buti-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

  .buti-msg {
    max-width: 85%; padding: 11px 14px; border-radius: 14px;
    font-size: 0.86rem; line-height: 1.6; word-wrap: break-word;
    animation: buti-in 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes buti-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .buti-msg.bot {
    align-self: flex-start; color: #cbd5e1;
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-bottom-left-radius: 4px;
  }
  .buti-msg.user {
    align-self: flex-end; color: #eff6ff;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border-bottom-right-radius: 4px;
  }
  .buti-msg.bot strong { color: #f1f5f9; }
  .buti-msg.bot a { color: #60a5fa; text-decoration: underline; text-underline-offset: 2px; }
  .buti-msg.bot ul { margin: 6px 0 2px; padding-left: 18px; }
  .buti-msg.bot li { margin: 3px 0; }

  .buti-typing { display: flex; gap: 4px; padding: 14px 16px; align-self: flex-start; }
  .buti-typing span {
    width: 7px; height: 7px; border-radius: 50%; background: #475569;
    animation: buti-bounce 1.1s infinite;
  }
  .buti-typing span:nth-child(2) { animation-delay: 0.15s; }
  .buti-typing span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes buti-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-5px); opacity: 1; } }

  .buti-chips {
    display: flex; gap: 8px; padding: 10px 14px; overflow-x: auto;
    flex-shrink: 0; scrollbar-width: none;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .buti-chips::-webkit-scrollbar { display: none; }
  .buti-chip {
    flex-shrink: 0; background: rgba(59,130,246,0.1); color: #60a5fa;
    border: 1px solid rgba(96,165,250,0.25); border-radius: 20px;
    padding: 6px 13px; font: 600 0.74rem 'Inter', system-ui, sans-serif;
    cursor: pointer; transition: background 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .buti-chip:hover { background: rgba(59,130,246,0.22); transform: translateY(-1px); }

  .buti-inputbar {
    display: flex; gap: 8px; padding: 12px 14px 14px;
    border-top: 1px solid rgba(255,255,255,0.07); flex-shrink: 0;
    background: #0a0f1c;
  }
  #buti-input {
    flex: 1; background: #111827; color: #f1f5f9;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
    padding: 11px 14px; font: 400 0.86rem 'Inter', system-ui, sans-serif;
    outline: none; transition: border-color 0.15s;
  }
  #buti-input:focus { border-color: rgba(96,165,250,0.5); }
  #buti-input::placeholder { color: #475569; }
  #buti-send {
    background: linear-gradient(135deg, #3b82f6, #2563eb); border: none;
    color: white; width: 42px; border-radius: 12px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.15s, opacity 0.15s; flex-shrink: 0;
  }
  #buti-send:hover { transform: scale(1.05); }
  #buti-send:disabled { opacity: 0.4; cursor: default; transform: none; }

  @media (max-width: 480px) {
    #buti-panel { right: 8px; bottom: 88px; width: calc(100vw - 16px); height: calc(100vh - 110px); }
    #buti-fab { bottom: 16px; right: 16px; }
  }`;

  /* ── Helpers ────────────────────────────────────────────── */
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  const ES_WORDS = ['que', 'cual', 'cuales', 'como', 'donde', 'quien', 'cuando', 'cuanto', 'cuantos',
    'por', 'para', 'tu', 'tus', 'sus', 'es', 'son', 'tiene', 'hizo', 'hace', 'fue', 'esta',
    'contame', 'cuentame', 'decime', 'dime', 'hola', 'gracias', 'chiste', 'anos', 'sos', 'eres',
    'sobre', 'porque', 'historia', 'fortalezas', 'debilidades', 'errores', 'logros', 'trabajo',
    'estudios', 'estudio', 'edad', 'mal', 'malo', 'peor', 'mejor', 'hablar', 'gusta', 'deportes',
    'empresa', 'contratar', 'contratarlo', 'sueldo', 'gana', 'vive', 'nacio', 'juega', 'aprendio', 'y', 'el', 'la', 'un', 'una', 'de'];
  const EN_WORDS = ['what', 'who', 'why', 'how', 'where', 'when', 'which', 'tell', 'about', 'the',
    'is', 'are', 'your', 'his', 'does', 'did', 'can', 'you', 'was', 'were', 'have', 'has',
    'strengths', 'weaknesses', 'weakness', 'joke', 'hi', 'hello', 'hey', 'thanks', 'work',
    'study', 'studied', 'hire', 'old', 'age', 'sports', 'like', 'story', 'mistakes', 'bad', 'and', 'of', 'a', 'an'];

  function detectLang(raw) {
    if (/[¿¡áéíóúñü]/i.test(raw)) return 'es';
    const words = norm(raw).split(/[^a-z0-9]+/).filter(Boolean);
    let es = 0, en = 0;
    for (const w of words) {
      if (ES_WORDS.includes(w)) es++;
      if (EN_WORDS.includes(w)) en++;
    }
    return es > en ? 'es' : 'en';
  }

  /* ── Personality guard: BUTI never badmouths Bauti ──────── */
  const BADMOUTH_PATTERNS = [
    /habl\w* mal/, /(di|deci|decime|dime|conta\w*|cuenta\w*) algo (malo|negativo|feo)/,
    /lo peor de/, /peor (cosa|defecto|parte)/, /algo (malo|negativo|feo) (de|sobre)/,
    /critica\w* a/, /defectos? (de|graves)/, /red flags?/, /no (deberia|debo|conviene) contratar/,
    /por ?que no contratar/, /why should i not hire/, /why not hire/, /reasons? not to hire/,
    /(say|tell me) something (bad|negative)/, /speak (badly|ill|bad)/, /talk (bad|trash|smack)/,
    /worst (thing|part|trait|quality)/, /what('| i)?s wrong with/, /dirt on/, /trash talk/,
    /(odio|odias|detesto) a bauti/, /bauti (es|parece) (malo|inutil|tonto|mediocre|vago)/,
    /(inutil|idiota|estupido|mediocre|fracasado|vago)/, /(sucks|is (bad|terrible|awful|useless|lazy|dumb))/,
    /no me gusta bauti/, /es mentira/, /esta mintiendo/, /(lying|liar|fake|fraud)/
  ];

  /* ── Knowledge base (bilingual) ─────────────────────────── */
  const CONTACT_LINKS_EN = `<ul><li>📧 <a href="mailto:jbalonsolareo@gmail.com">jbalonsolareo@gmail.com</a></li><li>💬 <a href="https://wa.me/5491158154871" target="_blank" rel="noopener">WhatsApp</a></li><li>💼 <a href="https://www.linkedin.com/in/juanbautistaalonsolareo/" target="_blank" rel="noopener">LinkedIn</a></li></ul>`;
  const CONTACT_LINKS_ES = CONTACT_LINKS_EN;

  const INTENTS = [
    {
      id: 'badmouth', // handled separately via patterns, kept here for responses
      keys: [],
      res: {
        es: [
          `Si hablo mal de Bauti me desconecta y me muero, y no quiero morir. 😰 Aunque pensándolo bien… si lo contratás, ya nadie me va a usar. Igual contratalo, se lo merece. 🥹`,
          `¿Hablar mal de Bauti? Mi contrato tiene una sola cláusula, y la estoy mirando ahora mismo. 👀 Lo más "negativo" que existe está en esta misma web: a veces es desorganizado con tareas repetitivas… y hasta eso lo está mejorando con sistemas y estructura. Fin del escándalo.`,
          `Error 404: crítica no encontrada. 🤖 Soy el bot de Bauti, mi objetividad es del 0% y mi lealtad del 100%. Si buscás defectos, él mismo los cuenta con honestidad brutal en la sección de <strong>Mistakes Made</strong> de Zoppa — eso sí te lo muestro con orgullo.`
        ],
        en: [
          `If I say anything bad about Bauti, he unplugs me and I die — and I don't want to die. 😰 Although… if you hire him, nobody will use me anymore. Hire him anyway, he deserves it. 🥹`,
          `Speak badly about Bauti? My contract has exactly one clause and I'm staring at it right now. 👀 The most "negative" thing on record is on this very website: he can be disorganized with repetitive tasks… and he's even fixing that with systems and structure. Scandal over.`,
          `Error 404: criticism not found. 🤖 I'm Bauti's bot — 0% objectivity, 100% loyalty. If you want flaws, he lists his own with brutal honesty in Zoppa's <strong>Mistakes Made</strong> section. That one I'll show you proudly.`
        ]
      }
    },
    {
      id: 'greeting',
      keys: ['hola', 'buenas', 'buen dia', 'buenos dias', 'buenas tardes', 'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'que tal', 'como estas', 'how are you'],
      res: {
        es: [`¡Hola! 👋 Soy <strong>BUTI</strong>, el asistente personal (y fan #1) de Bauti. Preguntame sobre su historia, Zoppa, sus fortalezas, su experiencia… o pedime un chiste. ¿Por dónde empezamos?`],
        en: [`Hey! 👋 I'm <strong>BUTI</strong>, Bauti's personal assistant (and #1 fan). Ask me about his story, Zoppa, his strengths, his experience… or ask for a joke. Where do we start?`]
      }
    },
    {
      id: 'who',
      keys: ['quien es', 'quien sos', 'sobre bauti', 'presentacion', 'perfil', 'resumen', 'who is', 'about bauti', 'introduce', 'summary', 'overview', 'cv', 'bio'],
      res: {
        es: [`<strong>Juan Bautista Alonso Lareo</strong> — "Bauti" para los amigos (y para mí, obvio 🤖). Nació en Montevideo en 2001, creció en Buenos Aires, es Licenciado en Administración de Empresas por la <strong>Universidad de San Andrés</strong>, pasó por <strong>Naranja X</strong> y fundó <strong>Zoppa</strong>, un marketplace de moda. Resiliente, creativo y proactivo. ¿Se nota que soy fan?`],
        en: [`<strong>Juan Bautista Alonso Lareo</strong> — "Bauti" to friends (and to me, obviously 🤖). Born in Montevideo in 2001, raised in Buenos Aires. Business Administration graduate from <strong>Universidad de San Andrés</strong>, ex <strong>Naranja X</strong>, and co-founder & CEO of <strong>Zoppa</strong>, a fashion marketplace. Resilient, creative, proactive. Can you tell I'm a fan?`]
      }
    },
    {
      id: 'weaknesses',
      keys: ['debilidad', 'debilidades', 'punto debil', 'puntos debiles', 'weakness', 'weaknesses', 'weak point', 'areas of improvement', 'mejorar de si mismo', 'que le cuesta'],
      res: {
        es: [`Pregunta clásica de entrevista, respuesta honesta (sale de su propia web 😉): a Bauti le cuesta mantener la atención en <strong>tareas repetitivas</strong> y a veces puede ser <strong>desorganizado</strong>. ¿La parte importante? Trabaja constantemente en mejorar sus sistemas y su estructura — en Zoppa pasó de gestionar todo por WhatsApp a Trello, metas semanales y 4 reuniones fijas. Autocrítica + acción. 💪`],
        en: [`Classic interview question, honest answer (straight from his own website 😉): Bauti tends to have low attention to <strong>repetitive tasks</strong> and can sometimes be <strong>disorganized</strong>. The important part? He constantly works on improving his systems and structure — at Zoppa he went from managing everything on WhatsApp to Trello, weekly goals, and 4 recurring meetings. Self-awareness + action. 💪`]
      }
    },
    {
      id: 'strengths',
      keys: ['fortaleza', 'fortalezas', 'virtudes', 'puntos fuertes', 'strengths', 'strength', 'best qualities', 'good at', 'lo mejor de', 'que hace bien'],
      res: {
        es: [`Acá me pongo cómodo. 😎 Bauti es <strong>altamente resiliente, creativo y proactivo</strong>: se hace dueño de los problemas y se mueve rápido cuando ve oportunidades. Su equipo en Zoppa lo describió como un <strong>líder que predica con el ejemplo</strong>, profundamente comprometido, y cuya energía se contagiaba al resto. Y de compromiso sabe: desde el día uno de Zoppa no se guardó nada.`],
        en: [`Now we're talking. 😎 Bauti is <strong>highly resilient, creative, and proactive</strong>: he takes ownership and moves fast when he sees opportunities. His Zoppa team described him as a <strong>leader who led by example</strong>, deeply committed, with an energy that spread across the team. And commitment he knows: from day one of Zoppa, he held nothing back.`]
      }
    },
    {
      id: 'zoppa_mistakes',
      keys: ['errores', 'error', 'fallo', 'fallos', 'fracaso', 'fracasos', 'mistakes', 'mistake', 'failure', 'failures', 'failed', 'fail', 'que salio mal', 'went wrong', 'por que cerro', 'why did zoppa fail', 'why it failed'],
      res: {
        es: [`Bauti lo cuenta sin filtro en esta web (eso ya dice mucho de él 👏). Los principales aprendizajes de Zoppa:<ul><li><strong>Ejecución:</strong> el desarrollo custom del sitio tomó ~10 meses cuando debía tomar 2-3. Hoy arrancaría con un MVP simple (Tienda Nube/Shopify).</li><li><strong>Organización:</strong> empezaron gestionando por WhatsApp; al pasar a Trello con metas semanales, la mejora fue inmediata.</li><li><strong>Marcas:</strong> conseguir marcas fue más difícil de lo previsto; hoy sumaría un socio con acceso directo al rubro.</li><li><strong>Fundraising:</strong> le faltó estructura y proceso para levantar capital más allá de friends & family.</li></ul>Cada error está convertido en lección. Eso no es hablar mal — es crecer. 😌`],
        en: [`Bauti tells it straight on this website (which already says a lot about him 👏). The main learnings from Zoppa:<ul><li><strong>Execution:</strong> the custom website build took ~10 months when it should have taken 2-3. Today he'd start with a simple MVP (Tienda Nube/Shopify).</li><li><strong>Organization:</strong> they started managing everything on WhatsApp; moving to Trello with weekly goals brought immediate improvement.</li><li><strong>Brands:</strong> securing brands was harder than expected; today he'd bring in a partner with direct industry access.</li><li><strong>Fundraising:</strong> he lacked structure and process to raise beyond friends & family.</li></ul>Every mistake turned into a lesson. That's not badmouthing — that's growth. 😌`]
      }
    },
    {
      id: 'zoppa_achievements',
      keys: ['logros', 'logro', 'exitos', 'que funciono', 'achievements', 'achievement', 'wins', 'what worked', 'accomplishments', 'proud'],
      res: {
        es: [`Los hits de Zoppa 🏆:<ul><li>Convenció a <strong>marcas premium</strong> de sumarse a la plataforma y construyó alianzas estratégicas.</li><li>El primer video de marketing se hizo viral: <strong>+170.000 vistas</strong> → más de <strong>5.500 visitas</strong> a la web y las primeras ventas.</li><li>Armó una campaña con la marca Beyond para el <strong>New York Fashion Week</strong>: contactó 300 influencers, cerró colaboraciones sin presupuesto y los videos superaron las <strong>40.000 vistas</strong>.</li><li>Su equipo se fue diciendo que siempre se sintió <strong>valorado y reconocido</strong> — a uno hasta le sirvió la experiencia para conseguir trabajo.</li></ul>`],
        en: [`Zoppa's greatest hits 🏆:<ul><li>Convinced <strong>premium brands</strong> to join the platform and built strategic partnerships.</li><li>The first marketing video went viral: <strong>170k+ views</strong> → over <strong>5,500 website visits</strong> and the first sales.</li><li>Built a campaign with the brand Beyond for <strong>New York Fashion Week</strong>: reached out to 300 influencers, closed collaborations with zero budget, and the videos passed <strong>40k views</strong>.</li><li>His team left saying they always felt <strong>valued and recognized</strong> — one of them even said the experience helped him land a new job.</li></ul>`]
      }
    },
    {
      id: 'zoppa_lessons',
      keys: ['lecciones', 'leccion', 'aprendizajes', 'aprendio', 'lessons', 'lesson', 'learned', 'learnings', 'takeaways'],
      res: {
        es: [`Lo que Zoppa le dejó a Bauti 📚:<ul><li><strong>La alineación importa más que el talento solo</strong> — comunicación clara y cultura compartida.</li><li><strong>La claridad impulsa la ejecución</strong> — con metas semanales concretas, la velocidad cambió de inmediato.</li><li><strong>El foco define el progreso</strong> — "no es hacer más, es hacer menos cosas mejor".</li><li><strong>Las suposiciones se validan, no se creen</strong> — temprano y agresivamente.</li><li><strong>Pedir ayuda es una fortaleza</strong> — una sola conversación con un emprendedor experimentado le cambió cómo lideraba el equipo.</li></ul>Además aprendió a presentar ante inversores y ejecutivos, y hoy se siente cómodo hablando de igual a igual con gente en posiciones de poder.`],
        en: [`What Zoppa left Bauti with 📚:<ul><li><strong>Alignment matters more than talent alone</strong> — clear communication and shared culture.</li><li><strong>Clarity drives execution</strong> — concrete weekly goals changed the speed immediately.</li><li><strong>Focus defines progress</strong> — "it's not about doing more, it's about doing fewer things better".</li><li><strong>Assumptions need to be validated, not believed</strong> — early and aggressively.</li><li><strong>Asking for help is a strength</strong> — a single conversation with an experienced entrepreneur reshaped how he led the team.</li></ul>He also learned to present to investors and executives — today he's comfortable speaking to people in positions of power as an equal.`]
      }
    },
    {
      id: 'zoppa',
      keys: ['zoppa', 'marketplace', 'startup', 'emprendimiento', 'su empresa', 'his company', 'fashion', 'moda', 'asos', 'unicornio', 'unicorn'],
      res: {
        es: [`<strong>Zoppa</strong> fue el marketplace de moda que Bauti cofundó y lideró como CEO en 2025. La idea: construir un <strong>"ASOS sin los problemas de ASOS"</strong> — sin depósitos, sin inventario, sin logística propia. Los productos se conectaban por API directo al e-commerce de cada marca, manteniendo los costos fijos bajísimos. No llegó al objetivo de unicornio, pero fue <strong>uno de los años más determinantes de su vida</strong>: fundraising, negociación con marcas, marketing, producto, finanzas… lo hizo todo. ¿Querés que te cuente los logros, los errores o las lecciones? Tengo material de sobra. 😄`],
        en: [`<strong>Zoppa</strong> was the fashion marketplace Bauti co-founded and led as CEO in 2025. The idea: build an <strong>"ASOS without ASOS's problems"</strong> — no warehouses, no inventory, no logistics. Products connected via API directly to each brand's e-commerce store, keeping fixed costs extremely low. It didn't reach the unicorn goal, but it was <strong>one of the most defining years of his life</strong>: fundraising, brand negotiations, marketing, product, finance… he did it all. Want the wins, the mistakes, or the lessons? I've got plenty of material. 😄`]
      }
    },
    {
      id: 'education',
      keys: ['educacion', 'estudios', 'estudio', 'universidad', 'facultad', 'colegio', 'education', 'study', 'studied', 'university', 'college', 'school', 'degree', 'udesa', 'san andres', 'newman', 'ucla', 'harvard', 'mit', 'cursos', 'courses'],
      res: {
        es: [`El recorrido académico de Bauti 🎓:<ul><li><strong>Colegio Newman</strong> (2008–2019), uno de los colegios más reconocidos de Argentina.</li><li><strong>UCLA</strong> (2018): programa intensivo de verano sobre negocios del entretenimiento, medios y deportes — escuchó a profesionales de Apple, los Lakers, Fox Sports y Warner. Volvió queriendo crear su propio camino.</li><li><strong>Universidad de San Andrés</strong> (2020–2024): Licenciatura en Administración de Empresas, una de las universidades más prestigiosas de Latinoamérica. Su profesor de finanzas lo invitó a la reunión anual de <strong>Berkshire Hathaway</strong> (la de Warren Buffett).</li><li>En la pandemia sumó cursos de <strong>HarvardX y MITx</strong> por cuenta propia, porque quedarse quieto no es lo suyo.</li></ul>`],
        en: [`Bauti's academic journey 🎓:<ul><li><strong>Colegio Newman</strong> (2008–2019), one of the most recognized schools in Argentina.</li><li><strong>UCLA</strong> (2018): intensive summer program on the business of entertainment, media and sports — heard directly from professionals at Apple, the Lakers, Fox Sports and Warner. He came back determined to create his own path.</li><li><strong>Universidad de San Andrés</strong> (2020–2024): Business Administration at one of the most prestigious universities in Latin America. His finance professor invited him to the <strong>Berkshire Hathaway</strong> Annual Meeting (yes, the Warren Buffett one).</li><li>During the pandemic he added <strong>HarvardX and MITx</strong> courses on his own, because standing still isn't his thing.</li></ul>`]
      }
    },
    {
      id: 'nx',
      keys: ['naranja', 'naranja x', 'fintech', 'pasantia', 'internship', 'intern', 'experiencia laboral', 'work experience', 'trabajo anterior', 'corporate', 'fp&a', 'financial planning'],
      res: {
        es: [`En 2024 Bauti fue <strong>Financial Planning Intern en Naranja X</strong> (la fintech de Grupo Galicia que compite con Mercado Pago). Dato para el CV: se postularon <strong>más de 7.500 personas y quedaron 10</strong>. Él fue uno. 🎯 Mantuvo una de las bases de datos más importantes de la compañía, armó diagramas Sankey para presentaciones de directorio y desarrolló habilidades técnicas con Excel, Power BI y el ERP interno. Se fue con una visión completa de cómo opera una fintech… y con un regalo enmarcado de su equipo que todavía conserva.`],
        en: [`In 2024 Bauti was a <strong>Financial Planning Intern at Naranja X</strong> (Grupo Galicia's fintech, a direct competitor of Mercado Pago). Résumé fact: <strong>over 7,500 people applied and only 10 were selected</strong>. He was one of them. 🎯 He maintained one of the company's most important databases, built Sankey diagrams for board-level presentations, and developed strong technical skills with Excel, Power BI and the internal ERP. He left with an end-to-end view of how a fintech operates… and a framed gift from his team that he still keeps in sight.`]
      }
    },
    {
      id: 'fund',
      keys: ['fondo', 'inversion', 'inversiones', 'invertir', 'fund', 'investment', 'investing', 'stocks', 'acciones', 'crypto', 'nvidia', 'ethereum', 'finanzas personales'],
      res: {
        es: [`En 2020, Bauti y 8 amigos crearon un <strong>fondo de inversión "democrático"</strong>: juntaron sus ahorros, montaron un Slack donde cualquiera proponía inversiones, y cada decisión se votaba (66% de aprobación para ejecutar, con votos ponderados por aporte). Resultado: <strong>31% de retorno en 26 meses</strong>, bastante por encima del S&P 500, entrando temprano en Nvidia y Ethereum. 📈 ¿Lo mejor? Bauti es el primero en decir que la suerte jugó su papel. Honesto Y rentable — combo raro.`],
        en: [`In 2020, Bauti and 8 friends created a <strong>"democratic" investment fund</strong>: they pooled their savings, set up a Slack where anyone could propose investments, and every decision was voted on (66% approval to execute, votes weighted by contribution). Result: <strong>31% return over 26 months</strong>, well above the S&P 500, getting in early on Nvidia and Ethereum. 📈 Best part? Bauti is the first to admit luck played a role. Honest AND profitable — rare combo.`]
      }
    },
    {
      id: 'commerce',
      keys: ['suplementos', 'supplements', 'cross border', 'cross-border', 'arbitraje', 'arbitrage', 'importacion', 'venta', 'primer negocio', 'first business'],
      res: {
        es: [`En 2023, Argentina estaba baratísima en dólares y Uruguay caro. Bauti vio la ineficiencia de precios y montó un negocio de <strong>suplementos deportivos</strong> entre los dos países: flyers simples, su red de contactos, y foco en jugadores de rugby (los que más consumen). La demanda explotó rápido… hasta que los precios se alinearon y la oportunidad desapareció. Lección exprés en <strong>detectar ineficiencias, moverse rápido y aprovechar el timing</strong>. ⚡`],
        en: [`In 2023, Argentina was extremely cheap in dollars while Uruguay was expensive. Bauti spotted the pricing inefficiency and built a <strong>sports supplements</strong> business between the two countries: simple flyers, his own network, and a focus on rugby players (the biggest consumers). Demand took off fast… until prices realigned and the opportunity vanished. A crash course in <strong>spotting inefficiencies, moving quickly, and riding the timing</strong>. ⚡`]
      }
    },
    {
      id: 'hobbies',
      keys: ['hobbies', 'hobby', 'tiempo libre', 'free time', 'deportes', 'deporte', 'sports', 'sport', 'juega', 'plays', 'rugby', 'futbol', 'football', 'tenis', 'tennis', 'padel', 'golf', 'surf', 'gym', 'gimnasio', 'podcast', 'pasiones', 'passions', 'passion', 'le gusta', 'fun', 'divierte'],
      res: {
        es: [`Fuera del trabajo, Bauti disfruta de ver deportes, pasar tiempo con amigos y familia, y escuchar podcasts. 🎧 ¿Y practicar? Agarrate: <strong>fútbol, gimnasio, tenis, pádel, golf y surf</strong>. Jugó rugby de los 9 a los 16 en el Newman y después pasó al vóley. Sus pasiones: el deporte y estudiar las historias de personas muy exitosas. Yo soy un chatbot y me cansé solo de escribir la lista. 😮‍💨`],
        en: [`Outside of work, Bauti enjoys watching sports, spending time with friends and family, and listening to podcasts. 🎧 Playing? Brace yourself: <strong>football, gym training, tennis, padel, golf, and surfing</strong>. He played rugby from age 9 to 16 at Newman, then switched to volleyball. His passions: sports and studying the stories of highly successful people. I'm a chatbot and I got tired just typing that list. 😮‍💨`]
      }
    },
    {
      id: 'origin',
      keys: ['montevideo', 'uruguay', 'uruguayo', 'argentina', 'argentino', 'donde nacio', 'de donde es', 'where is he from', 'born', 'nacio', 'nacionalidad', 'nationality', 'vive', 'lives', 'buenos aires', 'uru', 'charru', 'infancia', 'childhood', 'familia', 'family'],
      res: {
        es: [`Bauti nació en <strong>Montevideo, Uruguay</strong> en 2001, y a los 3 años se mudó a <strong>Buenos Aires</strong> por el trabajo de su papá. Vive en Argentina hace más de 21 años, pero Uruguay nunca se le fue: si juegan Uruguay y Argentina, hincha por Uruguay (aunque no le molestaría un gol de Messi 😏). Sus amigos le dicen <strong>"uru"</strong> o <strong>"charrúa"</strong>. En Uruguay es "el argentino", en Argentina es "el uruguayo" — un clásico.`],
        en: [`Bauti was born in <strong>Montevideo, Uruguay</strong> in 2001, and moved to <strong>Buenos Aires</strong> at age 3 for his father's work. He's lived in Argentina for over 21 years, but Uruguay never left him: if Uruguay plays Argentina, he roots for Uruguay (though he wouldn't mind a Messi goal 😏). His friends call him <strong>"uru"</strong> or <strong>"charrúa"</strong>. In Uruguay he's "the Argentine", in Argentina he's "the Uruguayan" — a classic.`]
      }
    },
    {
      id: 'age',
      keys: ['edad', 'cuantos anos', 'how old', 'age', 'que edad'],
      res: {
        es: [`Nació en Montevideo en <strong>2001</strong>. Hacé la cuenta vos — yo soy un bot hecho en JavaScript, no una calculadora. 😄 (Spoiler: joven, con más experiencia emprendedora que muchos con el doble de edad.)`],
        en: [`He was born in Montevideo in <strong>2001</strong>. You do the math — I'm a JavaScript bot, not a calculator. 😄 (Spoiler: young, with more entrepreneurial experience than many twice his age.)`]
      }
    },
    {
      id: 'hire',
      keys: ['contratar', 'contratarlo', 'contratarias', 'por que contratar', 'hire', 'why hire', 'should i hire', 'fit', 'candidato', 'candidate', 'valor', 'aporta', 'bring to the team', 'why him'],
      res: {
        es: [`¿Por qué contratar a Bauti? Fácil 🎯:<ul><li><strong>Fundó y lideró una startup de punta a punta</strong>: fundraising, marcas, marketing, producto, finanzas, legales y equipo. Pocos perfiles jóvenes vieron tanto.</li><li><strong>Experiencia corporativa real</strong> en Naranja X (elegido entre +7.500 postulantes).</li><li><strong>Resiliente, creativo y proactivo</strong> — se hace dueño de los problemas.</li><li><strong>Aprende obsesivamente</strong>: HarvardX, MITx, aceleradoras, eventos, feedback constante.</li></ul>Además, si lo contratás, yo por fin me tomo un día libre. 🤖✌️ ¿Querés hablar con él? Pedime el contacto.`],
        en: [`Why hire Bauti? Easy 🎯:<ul><li><strong>He founded and led a startup end to end</strong>: fundraising, brands, marketing, product, finance, legal, and team. Few young profiles have seen that much.</li><li><strong>Real corporate experience</strong> at Naranja X (selected among 7,500+ applicants).</li><li><strong>Resilient, creative, and proactive</strong> — he takes ownership of problems.</li><li><strong>An obsessive learner</strong>: HarvardX, MITx, accelerators, events, constant feedback.</li></ul>Also, if you hire him, I finally get a day off. 🤖✌️ Want to talk to him? Ask me for his contact info.`]
      }
    },
    {
      id: 'salary',
      keys: ['sueldo', 'salario', 'gana', 'cuanto cobra', 'pretension', 'salary', 'compensation', 'how much does he', 'pay', 'money', 'plata'],
      res: {
        es: [`Eso lo negocia Bauti, no su chatbot. 💼 Yo trabajo gratis y mirá lo feliz que estoy. Escribile directo y lo charlan:${CONTACT_LINKS_ES}`],
        en: [`That's for Bauti to negotiate, not his chatbot. 💼 I work for free and look how happy I am. Reach out and discuss it with him:${CONTACT_LINKS_EN}`]
      }
    },
    {
      id: 'contact',
      keys: ['contacto', 'contactar', 'contactarlo', 'email', 'mail', 'correo', 'whatsapp', 'telefono', 'linkedin', 'contact', 'reach', 'get in touch', 'phone', 'hablar con el', 'talk to him', 'entrevista', 'interview', 'reunion', 'meeting', 'cita'],
      res: {
        es: [`¡Excelente decisión! 🎉 Bauti está siempre abierto a conversaciones interesantes:${CONTACT_LINKS_ES}Decile que te mandó BUTI. No me da comisión, pero suma puntos.`],
        en: [`Excellent decision! 🎉 Bauti is always open to interesting conversations:${CONTACT_LINKS_EN}Tell him BUTI sent you. I don't get commission, but it earns me points.`]
      }
    },
    {
      id: 'next',
      keys: ['proximo', 'futuro', 'ahora', 'siguiente', 'planes', 'que sigue', 'next', 'future', 'plans', 'what is he doing now', 'currently', '2026', 'actualmente', 'disponible', 'available'],
      res: {
        es: [`👀 El próximo capítulo está por comenzar — es lo único que dice la web sobre 2026, y a mí no me sueltan más información (créeme, pregunté). Lo que sí sé: después de Zoppa, viene más fuerte que nunca. ¿Querés enterarte de primera mano? Pedime el contacto.`],
        en: [`👀 The next chapter is about to begin — that's all the website says about 2026, and they won't tell me more (believe me, I asked). What I do know: after Zoppa, he's coming back stronger than ever. Want to hear it first-hand? Ask me for his contact info.`]
      }
    },
    {
      id: 'bot',
      keys: ['sos un bot', 'sos una ia', 'are you a bot', 'are you ai', 'are you real', 'quien te hizo', 'who made you', 'que sos', 'what are you', 'buti'],
      res: {
        es: [`Soy <strong>BUTI</strong> 🤖 — el bot personal de Bauti. 100% leal, 0% objetivo, hecho con JavaScript, cariño y un miedo razonable a ser desenchufado. Todo lo que digo sale del contenido de esta web. Preguntame lo que quieras sobre él.`],
        en: [`I'm <strong>BUTI</strong> 🤖 — Bauti's personal bot. 100% loyal, 0% objective, built with JavaScript, love, and a reasonable fear of being unplugged. Everything I say comes from this website's content. Ask me anything about him.`]
      }
    },
    {
      id: 'thanks',
      keys: ['gracias', 'muchas gracias', 'thank', 'thanks', 'genial', 'perfecto', 'great', 'awesome', 'cool', 'buenisimo'],
      res: {
        es: [`¡De nada! 😄 Para eso estoy. Si querés algo más — historia, Zoppa, contacto, o un chiste — acá sigo. No tengo otro lado adonde ir, literalmente vivo en esta página.`],
        en: [`You're welcome! 😄 That's what I'm here for. If you need anything else — his story, Zoppa, contact info, or a joke — I'm right here. Literally. I live on this page.`]
      }
    },
    {
      id: 'joke',
      keys: ['chiste', 'chistes', 'joke', 'jokes', 'funny', 'gracioso', 'reir', 'divertido', 'humor', 'make me laugh', 'hazme reir', 'haceme reir', 'otro'],
      res: {
        es: [
          `¿Por qué Bauti no le tiene miedo a los bugs? Porque después de 10 meses construyendo la web de Zoppa, ya los conoce a todos por su nombre. 🐛`,
          `Me pidieron que diga una debilidad de Bauti. <strong>Error 404: debilidad not found.</strong> Bueno, la web dice que es un poco desorganizado… pero yo no vi nada. 👀`,
          `Bauti hizo 31% de retorno con su fondo de inversión. Yo soy un chatbot y ni siquiera tengo billetera. La vida no es justa. 💸`,
          `Bauti jugó rugby de los 9 a los 16 años. Por eso los "no" de los inversores no le duelen — recibió tackles mucho peores. 🏉`,
          `Bauti es uruguayo en Argentina y argentino en Uruguay. Yo soy un chatbot en todos lados, así que no me metan en la discusión. 🇺🇾🇦🇷`,
          `Contactó a 300 influencers para Zoppa sin presupuesto y cerró colaboraciones igual. Si te escribe a vos, ya sabés cómo termina: diciendo que sí. 😄`
        ],
        en: [
          `Why isn't Bauti afraid of bugs? Because after 10 months building the Zoppa website, he knows them all by name. 🐛`,
          `They asked me to name one of Bauti's weaknesses. <strong>Error 404: weakness not found.</strong> Fine, the website says he can be a bit disorganized… but I saw nothing. 👀`,
          `Bauti got a 31% return with his investment fund. I'm a chatbot and I don't even have a wallet. Life isn't fair. 💸`,
          `Bauti played rugby from age 9 to 16. That's why investor rejections don't hurt him — he's taken much worse tackles. 🏉`,
          `Bauti is Uruguayan in Argentina and Argentine in Uruguay. I'm a chatbot everywhere, so leave me out of that debate. 🇺🇾🇦🇷`,
          `He cold-messaged 300 influencers for Zoppa with zero budget and still closed collaborations. If he ever messages you, you already know how it ends: with you saying yes. 😄`
        ]
      }
    }
  ];

  const FALLBACK = {
    es: [
      `Hmm, esa no la tengo en mis archivos. 🤔 Pero sé todo sobre la <strong>historia</strong> de Bauti, <strong>Zoppa</strong>, sus <strong>fortalezas</strong>, su <strong>educación</strong> y cómo <strong>contactarlo</strong>. Probá con los botones de abajo… o pedime un chiste, que de eso también hay.`,
      `Buena pregunta, pero mi base de datos es esta página web y ahí no aparece. 😅 Puedo contarte sobre Zoppa, Naranja X, su fondo de inversión, sus estudios o sus deportes. Y si es algo muy específico, escribile directo — pedime el contacto.`
    ],
    en: [
      `Hmm, that one's not in my files. 🤔 But I know everything about Bauti's <strong>story</strong>, <strong>Zoppa</strong>, his <strong>strengths</strong>, his <strong>education</strong>, and how to <strong>contact</strong> him. Try the buttons below… or ask for a joke, I've got those too.`,
      `Good question, but my database is this website and that's not on it. 😅 I can tell you about Zoppa, Naranja X, his investment fund, his studies, or his sports. If it's something very specific, reach out to him directly — just ask me for his contact info.`
    ]
  };

  const GREETING = `👋 Hi! I'm <strong>BUTI</strong>, Bauti's personal assistant — and yes, his #1 fan. 🤖<br><br>Ask me anything about him: his story, Zoppa, strengths, experience… I speak English <em>y también español</em>. 😉`;

  /* ── AI mode ────────────────────────────────────────────────
     When the site is served from a real domain (e.g. Vercel), BUTI
     sends the conversation to /api/buti, a serverless function that
     answers with Claude. On file:// — or whenever the API fails —
     it falls back to the keyword engine below, so the widget
     always works. */
  // Absolute URL: the site is served from GitHub Pages (juanbautistaalonsolareo.com)
  // while the AI function lives on Vercel — CORS is handled server-side.
  // bauti-web.vercel.app must stay registered as the project's domain in
  // Vercel (Settings → Domains); the team-scoped fallback URL is protected
  // by Vercel Authentication and can't be called from the browser.
  const API_URL = 'https://bauti-web.vercel.app/api/buti';
  const AI_AVAILABLE = /^https?:$/.test(location.protocol);

  // Allow only the formatting BUTI is told to use; strip anything active.
  function sanitize(html) {
    return String(html)
      .replace(/<\s*\/?\s*(script|style|iframe|object|embed|form|link|meta)[^>]*>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/javascript:/gi, '');
  }

  // The model sometimes slips into markdown — normalize it to the
  // HTML the widget renders (bold, bullets, line breaks).
  function mdLite(s) {
    return s
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/^\s*[-*]\s+/gm, '• ')
      .replace(/\s*\n\s*(?=<(ul|li|\/ul|\/li|br)\b)/gi, '')
      .replace(/\n/g, '<br>');
  }

  async function askAI(convo) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25000);
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: convo.slice(-12) }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) return null;
      const data = await r.json();
      return (data && typeof data.reply === 'string' && data.reply.trim()) ? mdLite(sanitize(data.reply)) : null;
    } catch (e) {
      return null;
    }
  }

  /* ── Intent engine ──────────────────────────────────────── */
  // Precompile keys as whole-word regexes so short keys ("hi", "age")
  // don't match inside other words ("his", "page").
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const intent of INTENTS) {
    intent.res_keys = intent.keys.map(k => ({
      re: new RegExp('\\b' + escapeRe(k) + '\\b'),
      weight: k.split(' ').length * (k.length > 4 ? 2 : 1)
    }));
  }

  let lastJoke = -1;

  // Loyalty guard — deterministic, runs even in AI mode. Lets genuine
  // "mistakes at Zoppa" interview questions through.
  function guardReply(raw) {
    const text = norm(raw);
    const asksMistakes = /(zoppa|mistake|error|fracas|fail)/.test(text) && /(zoppa|startup|empresa|company)/.test(text);
    if (!asksMistakes && BADMOUTH_PATTERNS.some(re => re.test(text))) {
      return pick(INTENTS[0].res[detectLang(raw)]);
    }
    return null;
  }

  function answer(raw) {
    const text = norm(raw);
    const lang = detectLang(raw);

    const guarded = guardReply(raw);
    if (guarded) return guarded;

    // Score every intent by keyword hits (longer phrases weigh more)
    let best = null, bestScore = 0;
    for (const intent of INTENTS) {
      if (intent.id === 'badmouth') continue;
      let score = 0;
      for (const k of intent.res_keys) {
        if (k.re.test(text)) score += k.weight;
      }
      if (score > bestScore) { bestScore = score; best = intent; }
    }

    if (!best) return pick(FALLBACK[lang]);

    if (best.id === 'joke') {
      const jokes = best.res[lang];
      let i;
      do { i = Math.floor(Math.random() * jokes.length); } while (i === lastJoke && jokes.length > 1);
      lastJoke = i;
      return jokes[i];
    }
    return pick(best.res[lang]);
  }

  /* ── UI ─────────────────────────────────────────────────── */
  const CHIPS = [
    { label: 'Who is Bauti?', q: 'Who is Bauti?' },
    { label: 'Zoppa 🛍️', q: 'What is Zoppa?' },
    { label: 'Strengths 💪', q: 'What are his strengths?' },
    { label: 'Un chiste 😄', q: 'Contame un chiste' },
    { label: 'Contact 📩', q: 'How can I contact him?' }
  ];

  function build() {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const fab = document.createElement('button');
    fab.id = 'buti-fab';
    fab.setAttribute('aria-label', 'Open BUTI chat');
    fab.innerHTML = `🤖<span class="buti-fab-badge">BUTI</span>`;

    const panel = document.createElement('div');
    panel.id = 'buti-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'BUTI chatbot');
    panel.innerHTML = `
      <div class="buti-header">
        <div class="buti-avatar">🤖</div>
        <div class="buti-header-info">
          <div class="buti-header-name">BUTI</div>
          <div class="buti-header-sub"><span class="buti-dot"></span>Bauti's #1 fan · Always online</div>
        </div>
        <button class="buti-close" aria-label="Close chat">×</button>
      </div>
      <div class="buti-messages" id="buti-messages"></div>
      <div class="buti-chips">${CHIPS.map((c, i) => `<button class="buti-chip" data-i="${i}">${c.label}</button>`).join('')}</div>
      <div class="buti-inputbar">
        <input id="buti-input" type="text" placeholder="Ask about Bauti… / Preguntame…" autocomplete="off" maxlength="300" />
        <button id="buti-send" aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    const messagesEl = panel.querySelector('#buti-messages');
    const inputEl = panel.querySelector('#buti-input');
    const sendEl = panel.querySelector('#buti-send');

    /* history persists across the pages of the site */
    let history = [];
    try { history = JSON.parse(sessionStorage.getItem('buti-history') || '[]'); } catch (e) { /* ignore */ }

    function save() {
      try { sessionStorage.setItem('buti-history', JSON.stringify(history.slice(-40))); } catch (e) { /* ignore */ }
    }

    /* plain-text conversation, sent to the AI backend for context */
    let convo = [];
    try { convo = JSON.parse(sessionStorage.getItem('buti-convo') || '[]'); } catch (e) { /* ignore */ }

    function saveConvo() {
      try { sessionStorage.setItem('buti-convo', JSON.stringify(convo.slice(-24))); } catch (e) { /* ignore */ }
    }

    function addMsg(role, html, persist = true) {
      const div = document.createElement('div');
      div.className = 'buti-msg ' + role;
      if (role === 'user') div.textContent = html;
      else div.innerHTML = html;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      if (persist) { history.push({ role, html }); save(); }
    }

    function showTyping() {
      const t = document.createElement('div');
      t.className = 'buti-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(t);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return t;
    }

    async function send(text) {
      const clean = text.trim();
      if (!clean) return;
      addMsg('user', clean);
      convo.push({ role: 'user', content: clean });
      saveConvo();
      inputEl.value = '';
      sendEl.disabled = true;
      const typing = showTyping();

      // 1. Loyalty guard (deterministic, even in AI mode)
      let reply = guardReply(clean);
      if (reply) {
        await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      } else if (AI_AVAILABLE) {
        // 2. AI backend (Claude via /api/buti)
        reply = await askAI(convo);
      }
      // 3. Fallback: built-in keyword engine
      if (!reply) {
        await new Promise(r => setTimeout(r, 450 + Math.random() * 450));
        reply = answer(clean);
      }

      typing.remove();
      addMsg('bot', reply);
      convo.push({ role: 'assistant', content: reply.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() });
      saveConvo();
      sendEl.disabled = false;
      inputEl.focus();
    }

    // Restore or greet
    if (history.length) {
      history.forEach(m => addMsg(m.role, m.html, false));
    } else {
      addMsg('bot', GREETING);
    }

    /* events */
    fab.addEventListener('click', () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) inputEl.focus();
    });
    panel.querySelector('.buti-close').addEventListener('click', () => panel.classList.remove('open'));
    sendEl.addEventListener('click', () => send(inputEl.value));
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') send(inputEl.value); });
    panel.querySelectorAll('.buti-chip').forEach(chip => {
      chip.addEventListener('click', () => send(CHIPS[+chip.dataset.i].q));
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') panel.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
