# GATITOOLS

Tienda editorial para gatos, construida con React, TypeScript y Vite. Incluye un catalogo de demostracion, carrito local, checkout contra entrega, wiki felina y noticias.

## Desarrollo

```sh
npm install
npm run dev
```

## Calidad

```sh
npm run lint
npm run build
```

## Alcance de esta version

- El catalogo y los articulos de `src/data.ts` son contenido de ejemplo; precios en COP y fotografias de Unsplash.
- El carrito se guarda en `localStorage` en este dispositivo.
- El checkout recopila datos solo en el navegador y no transmite pedidos. Antes de publicar, debe conectarse a un backend o sistema de ventas, definir cobertura y tarifas de envio, y completar las politicas comerciales y de privacidad.
- El video usa una pieza de stock de Pexels. Confirma los terminos de licencia para el uso comercial previsto.