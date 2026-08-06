# Organizador

Una lista de tareas que corre entera en el navegador. Sin servidor, sin cuentas
y sin instalación: se abre `index.html` y funciona.

Este archivo es lo primero que lee el agente. Lo que esté escrito aquí no hay
que repetirlo en cada conversación.

## Para quién es

Una persona que quiere anotar lo que tiene que hacer y verlo ordenado. No hay
usuarios, ni permisos, ni trabajo en equipo. Si una funcionalidad requiere
cuentas o servidor, queda fuera del alcance de este proyecto.

## Dónde va cada cosa

| Archivo | Qué contiene |
| --- | --- |
| `index.html` | La estructura de la página. Solo marcado, sin lógica. |
| `css/estilo.css` | Todo el estilo. Los colores salen de las variables de `:root`. |
| `js/almacen.js` | Lo único que sabe cómo se guardan los datos. |
| `js/app.js` | Dibuja la lista y traduce los clics en llamadas al almacén. |

Esa separación es la regla más importante del proyecto. `app.js` nunca toca
`localStorage` directamente, y `almacen.js` nunca toca el DOM.

## Cómo se trabaja aquí

- El idioma del código es el español, incluidos nombres de variables y funciones.
- Sin dependencias ni herramientas de compilación. JavaScript de navegador, a secas.
- Sin módulos ES: los archivos se cargan con `<script>` para que `index.html`
  funcione abierto directamente desde el disco.
- Cada tarea es un objeto con `id`, `titulo` y `hecha`. Un campo nuevo se agrega
  primero en `almacen.js`.
- El orden de la lista se decide en la función `ordenar` de `app.js`, en un solo
  lugar.
- Los comentarios explican por qué se hizo algo, no qué hace la línea siguiente.

## Cómo se prueba que algo quedó bien

No hay pruebas automatizadas. Se comprueba a mano, en este orden:

1. Abrir `index.html` en el navegador.
2. Agregar dos tareas y confirmar que aparecen.
3. Marcar una como hecha y confirmar que se ve tachada y baja el contador.
4. Recargar la página y confirmar que todo sigue ahí.
5. Borrar una tarea y confirmar que desaparece y el contador se ajusta.

Si un cambio toca el almacén, hay que repetir el paso 4 sin excepción: es el que
detecta los datos que se pierden al recargar.

## Qué no hacer

- No agregar bibliotecas ni frameworks.
- No cambiar la clave `organizador.tareas` del almacén: rompe los datos de quien
  ya venía usando la aplicación.
- No mover la lógica de guardado fuera de `almacen.js`.
