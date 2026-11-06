# Fecha 4 · FC NTLE (TikTok)

Video vertical (1080 × 1920, 55,5 s) para el TikTok de **@nadietelo.explico**: Atlético Gravedad 3-0 FC NTLE, de visitante, con 1.307 hinchas. El club baja al 7.º puesto, y el video cuenta que los 421 compartidos del video de la fecha 3 son **421 bengalas** para la fecha 5, de local contra Agujero Negro: la chance pasa de 45 % a 66 %, y faltan 484 para el tope de 90 %. Lleva suspenso (pregunta en el primer segundo y barra de "LA RESPUESTA") y cierra pidiendo compartir y seguir. Usa los componentes de [club-hinchas](../club-hinchas) y sus dependencias.

- `entrega/fecha4-tiktok.mp4` (audio a −14 LUFS) y `entrega/portada-fecha4.jpg`.
- Guion y fuentes de cada dato: [GUION.md](GUION.md).
- Las bengalas salen de `src/liga/redes.json` (`bengalas.acumuladas`); las chances, de `chanceLocalVs()`, `chanceVisitanteVs()` y `bengalasParaTope()`, la misma cuenta que `scripts/liga.mjs`.

```console
npx remotion render Fecha4 out/fecha4-tiktok.mp4 --props='{"plataforma":"tiktok"}'
```
