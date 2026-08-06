# Organizador

Un organizador de trabajo que corre entero en el navegador. Páginas, tabla y
tablero. Sin servidor, sin cuentas y sin instalación: se abre `index.html` y
funciona.

Este archivo es lo primero que lee el agente. Lo que esté escrito aquí no hay
que repetirlo en cada conversación.

## Para quién es

Una persona o un equipo chico que organiza su trabajo en páginas, y dentro de
cada página lleva sus tareas. No hay autenticación: el equipo es una lista de
personas en los datos, no un sistema de cuentas.

## Dónde va cada cosa

| Archivo | Qué contiene |
| --- | --- |
| `index.html` | La estructura de la página. Solo marcado, sin lógica. |
| `css/estilo.css` | Todo el estilo. Los colores salen de las variables de `:root`. |
| `js/almacen.js` | Lo único que sabe cómo se guardan los datos. |
| `js/tabla.js` | Dibuja la vista de tabla. |
| `js/kanban.js` | Dibuja la vista de tablero. |
| `js/app.js` | Barra lateral, qué página y qué vista están activas. |

Esa separación es la regla más importante del proyecto. Las vistas nunca tocan
`localStorage` directamente: piden y modifican los datos a través de `Almacen`.

## El modelo de datos

Todo cuelga de un solo objeto guardado bajo la clave `organizador.datos`.

```
personas: [{ id, nombre }]
paginas:  [{ id, nombre }]
tareas:   [{ id, paginaId, titulo, estado, vence }]
```

- **`personas`** es el equipo. Está definido y disponible en `Almacen.personas()`.
- **`estado`** es uno de los identificadores de `Almacen.estados()`: `por-hacer`,
  `haciendo` o `lista`. Ese orden es el de las columnas del tablero.
- **`vence`** es una fecha `AAAA-MM-DD`, o cadena vacía cuando no tiene plazo.

Un campo nuevo en una tarea se agrega primero en `almacen.js`, incluyendo la
semilla, y recién después se usa en las vistas.

## Cómo se trabaja aquí

- El idioma del código es el español, incluidos nombres de variables y funciones.
- Sin dependencias ni herramientas de compilación. JavaScript de navegador, a secas.
- Sin módulos ES: los archivos se cargan con `<script>` para que `index.html`
  funcione abierto directamente desde el disco.
- Cada vista expone una función `dibujar(contenedor, tareas, alCambiar)` y llama
  a `alCambiar()` después de modificar datos, para que la pantalla se redibuje.
- Los comentarios explican por qué se hizo algo, no qué hace la línea siguiente.

## Cómo se prueba que algo quedó bien

No hay pruebas automatizadas. Se comprueba a mano, en este orden:

1. Abrir `index.html` en el navegador.
2. Cambiar de página en la barra lateral y confirmar que las tareas cambian.
3. En la tabla, cambiar el estado de una tarea.
4. Pasar a la vista de tablero y confirmar que esa tarea quedó en la columna nueva.
5. Recargar la página y confirmar que todo sigue ahí.
6. Agregar una tarea y confirmar que aparece en las dos vistas.

Si un cambio toca el almacén, el paso 5 no se salta nunca: es el que detecta los
datos que se pierden al recargar.

## Qué no hacer

- No agregar bibliotecas ni frameworks.
- No cambiar la clave `organizador.datos`: rompe los datos de quien ya venía
  usando la aplicación.
- No mover la lógica de guardado fuera de `almacen.js`.
- No agregar autenticación ni servidor. Si algo lo necesita, queda fuera de
  alcance.
