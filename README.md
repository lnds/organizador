# Organizador

Lista de tareas que corre entera en el navegador. Sin servidor, sin cuentas y
sin instalación.

Se usa para el curso **IA aplicada al trabajo profesional con Claude**, en la
sesión sobre Claude Code: es el proyecto preparado sobre el que se construye una
funcionalidad nueva en vivo.

## Cómo se abre

Descarga o clona el repositorio y abre `index.html` con doble clic. No hace
falta nada más.

Si prefieres servirlo:

```sh
python3 -m http.server 8000
```

Y luego visita `http://localhost:8000`.

## Qué hace hoy

- Agregar tareas
- Marcarlas como hechas
- Borrarlas
- Contar cuántas quedan pendientes

Las tareas se guardan en el navegador, así que siguen ahí al recargar. Cada
navegador tiene su propia lista.

## Cómo está organizado

```
index.html        La página
css/estilo.css    El estilo
js/almacen.js     Guarda y recupera las tareas
js/app.js         Dibuja la lista y atiende los clics
CLAUDE.md         Instrucciones para el agente
```

`CLAUDE.md` es el archivo que lee Claude Code antes de trabajar en el proyecto.
Ahí están las reglas de la casa: cómo se separan las responsabilidades, cómo se
prueba un cambio y qué no se debe hacer.
