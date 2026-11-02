# Episodio 1 · versión TikTok

Episodio 1 de la serie del club para TikTok (894 seguidores): la cancha de barrio de 1.000 lugares "casi llena". Es el mismo proyecto que [club-hinchas](../club-hinchas), con dos frases distintas en la voz en off y `node_modules` enlazado a esa carpeta.

- Archivo para subir: `entrega/episodio-01-tiktok.mp4` (48,3 s, audio a −14 LUFS) y su portada.
- Cambios en el guion (`voiceover/guion.json`): "La cancha tiene lugar para 1.000. Y ya está casi LLENA." y "Cuando se llena, nos MUDAMOS: primero a 10.000 lugares, y después a un estadio de 100.000."
- Los hinchas salen de `src/serie.json` (894) y el botón "Seguir" es rojo por defecto.

```console
npx remotion render Episodio1 out/episodio-01-tiktok.mp4
```
