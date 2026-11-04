# Fecha 2 · FC NTLE (TikTok)

Video vertical (1080 × 1920, 32,5 s) para el TikTok de **@nadietelo.explico**: Big Bang 6-3 FC NTLE de visitante, el club baja al 6.º puesto, la tribuna llega a 1.131 hinchas y mañana juega de local contra Juventud Tsunami (54 % de chance de ganar con los hinchas de hoy). Usa los componentes de [club-hinchas](../club-hinchas) y sus dependencias (`node_modules` es un enlace).

- `entrega/fecha2-tiktok.mp4` (audio a −14 LUFS) y `entrega/portada-fecha2.jpg`.
- Los datos salen de `src/liga/` (copia de `club-hinchas/src/liga` después de jugar la fecha 2). Las chances se calculan con la misma cuenta que `scripts/liga.mjs`.
- En `src/timeline.json` se corrió a mano el comienzo de "COMPARTILO" a 27,22 s: el alineador lo había pegado al silencio anterior.

```console
npx remotion render Fecha2 out/fecha2.mp4 --props='{"plataforma":"tiktok"}'
```
