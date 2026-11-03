# Resumen del día 1 · FC NTLE

Video vertical (1080 × 1920, 42 s) para Instagram y TikTok de **@nadietelo.explico**: el club ya tiene nombre (FC NTLE, propuesto por J.P) y escudo (de Rami), la hinchada pasó los 1.000 y se mudó al estadio, y ganó 2-0 su debut. Cierra pidiendo que lo compartan y sigan la cuenta. Usa los componentes de [club-hinchas](../club-hinchas) y sus dependencias (`node_modules` es un enlace).

- `entrega/resumen-dia1-tiktok.mp4` y `entrega/resumen-dia1-instagram.mp4`: lo único que cambia es el color del botón "Seguir". Audio a −14 LUFS.
- Los datos salen de `src/liga/` (copia de `club-hinchas/src/liga` después de jugar la fecha 1): `fecha.json` con el resultado y la tabla, y `redes.json` con los seguidores de cada red y los comentarios ganadores.

```console
npx remotion render ResumenDia1 out/resumen-dia1-tiktok.mp4 --props='{"plataforma":"tiktok"}'
npx remotion render ResumenDia1 out/resumen-dia1-instagram.mp4 --props='{"plataforma":"instagram"}'
```
