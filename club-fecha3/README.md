# Fecha 3 · FC NTLE (TikTok)

Video vertical (1080 × 1920, 46,7 s) para el TikTok de **@nadietelo.explico**: FC NTLE 6-2 Juventud Tsunami, de local, con 1.175 hinchas. El club sube al 4.º puesto y presenta la regla de las **bengalas**: cada compartido de los videos prende una bengala que suma 0,05 % de chance de ganar el próximo partido de local (la fecha 5, contra Agujero Negro), con un tope de 90 %. Cierra pidiendo que sigan la cuenta: cada seguidor nuevo es un hincha más. Usa los componentes de [club-hinchas](../club-hinchas) y sus dependencias.

- `entrega/fecha3-tiktok.mp4` (audio a −14 LUFS) y `entrega/portada-fecha3.jpg`.
- Las chances se calculan con `chanceLocalVs()`, la misma cuenta que `scripts/liga.mjs`.

```console
npx remotion render Fecha3 out/fecha3.mp4 --props='{"plataforma":"tiktok"}'
```
