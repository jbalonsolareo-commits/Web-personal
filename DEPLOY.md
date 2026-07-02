# Deploy en Vercel — sitio + BUTI con IA

El proyecto ya está listo para Vercel:

- Páginas estáticas: `index.html`, `detail.html`, `zoppa.html`, `assets/`
- Backend de IA: `api/buti.js` (función serverless que llama a Claude)
- El widget (`assets/buti.js`) llama a `/api/buti` automáticamente cuando el sitio
  está publicado en un dominio. Si la API falla o abrís el archivo local,
  BUTI usa su motor de respuestas integrado (nunca se queda mudo).

## Pasos (una sola vez)

### 1. Conseguir la clave de la API de Claude
1. Entrá a https://console.anthropic.com
2. Creá una cuenta / iniciá sesión y cargá crédito (Billing).
3. En **API Keys** → **Create Key**. Copiá la clave (empieza con `sk-ant-`).

### 2. Subir el proyecto a Vercel

**Opción A — con la interfaz web (recomendada):**
1. Subí esta carpeta a un repositorio de GitHub.
2. Entrá a https://vercel.com → **Add New → Project** → importá el repo.
3. No hace falta configurar nada de build (es un sitio estático + `/api`).
4. Antes de deployar, en **Environment Variables** agregá:
   - Name: `ANTHROPIC_API_KEY`
   - Value: tu clave `sk-ant-...`
5. **Deploy**. Listo: tu sitio queda en `https://<tu-proyecto>.vercel.app`.

**Opción B — con la terminal:**
```
npm i -g vercel
cd "c:\Users\Sebastian\Desktop\web personal"
vercel login
vercel env add ANTHROPIC_API_KEY      # pegá la clave cuando la pida
vercel --prod
```

### 3. Probar
Abrí tu URL de Vercel, hacé clic en el botón 🤖 BUTI y preguntale cualquier
cosa — ahora responde con IA de verdad (entiende cualquier pregunta, con la
info de tu web y sin hablar mal de Bauti jamás).

## Notas
- **Modelo:** usa `claude-opus-4-8` (el más capaz). Si querés bajar el costo,
  cambiá el modelo en `api/buti.js` por `claude-haiku-4-5` (mucho más barato,
  más que suficiente para este uso).
- **Costos:** cada pregunta consume tokens de tu cuenta de Anthropic. El
  endpoint limita el historial (12 mensajes) y el largo de cada mensaje
  (1.200 caracteres) para contener el gasto.
- **Editar la personalidad o los datos:** todo el "cerebro" de BUTI está en la
  constante `SYSTEM` dentro de `api/buti.js`. Si cambiás la web, actualizá ahí.
- **Probar localmente con IA:** `vercel dev` en la carpeta del proyecto
  (después de `vercel login` y de configurar la variable de entorno).

> Conexion automatica GitHub -> Vercel activada el 2/7/2026. Cada push a main deploya solo.
