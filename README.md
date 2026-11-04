# Juan Cruz Web Studio

Sitio profesional para vender diseño de páginas web a restaurantes y negocios gastronómicos.
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · ES/EN · modo claro/oscuro.

## Probarlo en tu computadora

```bash
npm install
npm run dev      # abre http://localhost:3000
npm run build    # comprueba que todo compile antes de publicar
```

---

## Cómo editar el contenido (sin tocar componentes)

Todo el contenido está en la carpeta **`content/`**. Los textos que aparecen en los dos idiomas se escriben así: `{ es: "Hola", en: "Hello" }`.

| Quiero cambiar… | Archivo |
|---|---|
| Nombre de la marca, **WhatsApp**, email, Instagram, URL del sitio | `content/site.ts` |
| **Beneficios** debajo del hero (entrega en días, 0% comisiones…) | `content/site.ts` → `benefits` |
| **Precios**, planes, qué incluye cada uno, plan destacado | `content/pricing.ts` → `plans` |
| Tabla comparativa | `content/pricing.ts` → `comparison` |
| Extras y mantenimiento | `content/pricing.ts` → `extras`, `maintenance` |
| **Diseños conceptuales** y menús de la demo interactiva (pizzería, hamburguesería, café) | `content/demo-menus.ts` |
| Preguntas frecuentes | `content/faq.ts` |
| Textos de la interfaz (títulos, botones, mensajes) | `content/i18n/es.ts` y `content/i18n/en.ts` |
| Colores de la paleta | `app/globals.css` (bloques `:root` = claro y `.dark` = oscuro) |

### Cambiar un precio
En `content/pricing.ts`, cambia `price: 250` por el valor nuevo. Se actualiza en las tarjetas, la tabla, el configurador, el formulario de contacto y los mensajes de WhatsApp.

### Diseños conceptuales (ex portafolio)
La sección muestra los 3 restaurantes ficticios de `content/demo-menus.ts` (Forno Rosso, Smash Club y Café Alba), con una etiqueta visible de «Diseño de ejemplo». El botón «Ver demo» abre la demo interactiva con ese estilo ya elegido. Para cambiar el texto de una tarjeta, edita el campo `concept` de cada restaurante.

Cuando tengas clientes reales, puedes volver a sumar una sección de proyectos.

### Cambiar un texto
Busca el texto en `content/i18n/es.ts`, cámbialo y haz lo mismo en `content/i18n/en.ts`. Si te olvidas de algún texto en inglés, TypeScript te avisa al compilar.

---

## Datos de contacto

En `content/site.ts`:
- `whatsapp`: `5492291525151` (formato de wa.me, solo dígitos). Lo usan todos los botones y mensajes de WhatsApp.
- `whatsappDisplay`: `+54 9 2291 525151` (cómo se muestra escrito en contacto y footer).
- `email`: `juancruzwebstudio@gmail.com`.
- `instagram`: tu perfil (o `""` para ocultarlo).
- `url`: el dominio final (o configúralo en Vercel con la variable `NEXT_PUBLIC_SITE_URL`).

### Imágenes
Las fotos de platos (`public/images/demo/`) y la portada del hero (`public/images/hero-restaurante.jpg`) son de Unsplash, de uso libre. Si cambias una, mantén el mismo nombre de archivo o actualiza la ruta en `content/demo-menus.ts`.

El logo es un monograma generado con la inicial de la marca (`components/layout/Logo.tsx`). El ícono de la pestaña está en `app/icon.svg`.

---

## Publicar en Vercel

1. Sube este repositorio a GitHub (ya está en `saumelljuancruz-hash/ATHENEA`).
2. Entra a [vercel.com](https://vercel.com), inicia sesión con GitHub y haz clic en **Add New → Project**.
3. Elige el repositorio. Vercel detecta Next.js solo: no hace falta configurar nada más.
4. (Opcional) En **Environment Variables**, agrega `NEXT_PUBLIC_SITE_URL` con tu dominio, por ejemplo `https://juancruzwebstudio.com`.
5. Haz clic en **Deploy**. En 1 o 2 minutos tendrás tu link `.vercel.app`.
6. Para usar tu dominio: **Project → Settings → Domains → Add**, y sigue las instrucciones de DNS que te muestra Vercel.

Cada vez que hagas cambios y los subas a la rama principal, Vercel publica la versión nueva automáticamente. Las demás ramas generan un link de vista previa.

---

## Estructura

```
app/            layout (fuentes, SEO, tema), página, sitemap, robots, imagen Open Graph, ícono
components/
  layout/       Navbar, Footer, botón flotante de WhatsApp, Logo, Providers
  sections/     Hero, Demo, Compare, Portfolio, Pricing, Configurator, Process, Faq, Contact
  demo/         La mini web de restaurante dentro del celular
  ui/           Botones, íconos, Reveal (animación al hacer scroll), Modal, PhoneFrame…
content/        ← todo lo editable
lib/            idioma (ES/EN), estado del presupuesto, formatos
public/images/  fotos
```

## Notas técnicas
- **Idioma**: el sitio carga en español y el botón ES/EN cambia todo al instante. La elección queda guardada. También funciona `?lang=en` en el link, para compartir la versión en inglés.
- **Tema**: arranca en oscuro; el visitante puede cambiarlo y la elección queda guardada.
- **Accesibilidad**: se puede navegar con teclado, hay foco visible, textos alternativos, contraste AA y se respeta `prefers-reduced-motion`.
- **Rendimiento**: la página es 100% estática. Las animaciones se cargan aparte y cada sección se activa por partes.
