# Organizador

Organizador de trabajo que corre entero en el navegador: páginas, tabla y
tablero. Sin servidor, sin cuentas y sin instalación.

Se usa en el curso **IA aplicada al trabajo profesional con Claude**, en la
sesión sobre Claude Code: es el proyecto preparado sobre el que se construye una
funcionalidad nueva en vivo.

## Cómo se abre

Clona o descarga el repositorio y abre `index.html` con doble clic. No hace
falta nada más.

Si prefieres servirlo:

```sh
python3 -m http.server 8000
```

Y luego visita `http://localhost:8000`.

## Qué hace hoy

- **Páginas** en la barra lateral, para separar ámbitos de trabajo
- **Tabla** con el estado y la fecha de vencimiento de cada tarea
- **Tablero** con una columna por estado
- **Texto** libre en cada página, para anotar de qué se trata
- **Adjuntos** por página, con los markdown renderizados en pantalla
- **Archivar y borrar** páginas
- **Equipo**: una lista de personas definida en los datos

Todo se guarda en el navegador, así que sigue ahí al recargar. Cada navegador
tiene sus propios datos.

## Cómo está organizado

```
index.html        La página
css/estilo.css    El estilo
js/almacen.js     Guarda y recupera los datos
js/tabla.js       Vista de tabla
js/kanban.js      Vista de tablero
js/app.js         Barra lateral y navegación
CLAUDE.md         Instrucciones para el agente
```

`CLAUDE.md` es el archivo que lee Claude Code antes de trabajar en el proyecto.
Ahí están el modelo de datos, cómo se separan las responsabilidades, cómo se
prueba un cambio y qué no se debe hacer.
