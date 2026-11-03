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
| **Contadores** (webs entregadas, países, días…) | `content/site.ts` → `stats` |
| **Precios**, planes, qué incluye cada uno, plan destacado | `content/pricing.ts` → `plans` |
| Tabla comparativa | `content/pricing.ts` → `comparison` |
| Extras y mantenimiento | `content/pricing.ts` → `extras`, `maintenance` |
| **Proyectos del portafolio** | `content/projects.ts` |
| Menús de la demo interactiva (pizzería, hamburguesería, café) | `content/demo-menus.ts` |
| Preguntas frecuentes | `content/faq.ts` |
| Textos de la interfaz (títulos, botones, mensajes) | `content/i18n/es.ts` y `content/i18n/en.ts` |
| Colores de la paleta | `app/globals.css` (bloques `:root` = claro y `.dark` = oscuro) |

### Cambiar un precio
En `content/pricing.ts`, cambia `price: 380` por el valor nuevo. Se actualiza en las tarjetas, la tabla, el configurador, el formulario de contacto y los mensajes de WhatsApp.

### Agregar un proyecto al portafolio
1. Guarda las imágenes en `public/images/projects/` (ideal: 1200×900 px, JPG o WebP).
2. En `content/projects.ts`, copia un bloque `{ id: "...", ... }` completo, pégalo al final de la lista y cambia los datos.
3. En `url` pon el link del proyecto. Si lo dejas vacío (`""`), el botón muestra «Link disponible pronto».

### Cambiar un texto
Busca el texto en `content/i18n/es.ts`, cámbialo y haz lo mismo en `content/i18n/en.ts`. Si te olvidas de algún texto en inglés, TypeScript te avisa al compilar.

---

## ⚠️ Datos que debes reemplazar antes de publicar

En `content/site.ts`:
- `whatsapp`: tu número con código de país, **solo dígitos** (ej. `5491112345678`). Ahora tiene un número de prueba.
- `email`: tu email real.
- `instagram`: tu perfil (o `""` para ocultarlo).
- `url`: el dominio final (o configúralo en Vercel con la variable `NEXT_PUBLIC_SITE_URL`).

En `content/projects.ts`:
- `url` de **Mima Pizzería**, **ATHENEA Relojería** y **BALU Salón de Eventos**.

### Imágenes de reemplazo (fotos libres de Unsplash)

| Imagen | Qué poner |
|---|---|
| `public/images/projects/mima.jpg`, `mima-2.jpg` | Capturas reales de la web de Mima Pizzería |
| `public/images/projects/athenea.jpg`, `athenea-2.jpg` | Capturas reales de ATHENEA Relojería |
| `public/images/projects/balu.jpg`, `balu-2.jpg` | Capturas reales de BALU Salón de Eventos |
| `public/images/hero-restaurante.jpg` | Portada del celular del hero (puede quedar así) |
| `public/images/demo/*.jpg` | Platos de la demo (pueden quedar así: son de uso libre) |

Si cambias una imagen, mantén el **mismo nombre de archivo** o actualiza la ruta en el archivo de datos correspondiente.
Para las capturas, lo ideal es tomarlas desde el celular (o desde el modo celular del navegador) y recortarlas en formato 4:3.

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
