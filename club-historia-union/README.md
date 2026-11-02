# Historia · Juntamos los dos clubes

Historia vertical (1080 × 1920, 16,5 s) para Instagram y TikTok de **@nadietelo.explico**: anuncia que el club de la serie junta a los seguidores de las dos redes. Usa los componentes de [club-hinchas](../club-hinchas) y sus dependencias (`node_modules` es un enlace a esa carpeta).

- Archivo para subir: `entrega/historia-union.mp4` (audio a −14 LUFS).
- Los seguidores de cada red salen de `src/serie.json` (`{ "instagram": 8, "tiktok": 21 }`). Si cambian, se edita y se vuelve a renderizar: la voz no dice los números.

```console
npx remotion render HistoriaUnion out/historia-union.mp4
```

**Voz en off (Fernando Martínez, ElevenLabs):** "¡Atención, hinchada! Juntamos los dos clubes. El de Instagram y el de TikTok ahora son uno solo. Me sigas donde me sigas, sumás un hincha a la misma cancha. Y si me seguís en las dos, valés doble. Mañana juega la Fecha 1, con todos."
