# Cómo seguir en un chat nuevo desde tu PC

Esta carpeta guarda todo lo del chat anterior:
- `CONTEXTO.md`: la memoria, con reglas, estilo, proyectos, la liga y los pendientes.
- `chat-completo.md`: la conversación entera.
- `herramientas/`: los scripts que usaba Claude para revisar los videos.

## 1 · Bajá el repo a tu PC

En una carpeta común (por ejemplo `Documentos\nadietelo-youtube`, que no esté adentro de `AppData`):

```console
git clone -b claude/reel-tormentas-electricas-7xdwvl https://github.com/saumelljuancruz-hash/ATHENEA.git
```

Si no tenés Git, en GitHub abrí la rama `claude/reel-tormentas-electricas-7xdwvl` y usá **Code → Download ZIP**.

## 2 · Prepará Remote Control

1. Actualizá la **app de escritorio de Claude** a la última versión: en Windows hace falta una versión nueva para compartir carpetas.
2. En la app, andá a **Configuración → Claude Code → Remote Control** y agregá la carpeta `ATHENEA` que bajaste.
3. Dejá la app abierta y la PC prendida. Tené **Google Chrome** instalado. Claude también va a necesitar **Node.js**: si no lo tenés, te pide permiso para instalarlo.

## 3 · Abrí el chat nuevo

Abrilo con Claude Code en esa carpeta: desde la app de escritorio, o en la nube conectando la carpeta por Remote Control. Claude lee solo el archivo `CLAUDE.md` del repo, que lo manda a `traspaso/CONTEXTO.md`. Para arrancar, podés escribirle:

> Leé traspaso/CONTEXTO.md. Quiero que subas y programes en YouTube Studio los 4 Shorts de youtube-canal/SUBIDAS.md desde mi Chrome. Si las fechas ya pasaron, correlas a los próximos días con los mismos horarios.

Cuando abra Chrome, **iniciá sesión en YouTube vos**: Claude nunca tiene que ver ni escribir tu contraseña.

Para seguir con el club:

> Leé traspaso/CONTEXTO.md. Vamos con la fecha 3 del FC NTLE para TikTok: hoy tenemos N seguidores. Dame el video y el carrusel con sus descripciones.
