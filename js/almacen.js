// Único lugar del proyecto que sabe cómo se guardan y recuperan los datos.
// El resto trabaja con los objetos que devuelve, sin tocar localStorage.

const Almacen = (() => {
  const CLAVE = "organizador.datos";

  // Estados de una tarea. El orden es el que usan las columnas del tablero.
  const ESTADOS = [
    { id: "por-hacer", nombre: "Por hacer" },
    { id: "haciendo", nombre: "Haciendo" },
    { id: "lista", nombre: "Lista" },
  ];

  // Con qué arranca alguien que abre la aplicación por primera vez
  function semilla() {
    return {
      personas: [
        { id: "p_ana", nombre: "Ana Pérez" },
        { id: "p_luis", nombre: "Luis Rojas" },
        { id: "p_cata", nombre: "Catalina Soto" },
        { id: "p_marco", nombre: "Marco Díaz" },
      ],
      paginas: [
        {
          id: "pg_curso",
          nombre: "Curso de agosto",
          texto:
            "Segunda edición, del 11 al 20 de agosto. Cuatro sesiones, martes y jueves de 19:00 a 20:30.\n\nCada sesión necesita sus láminas listas el día anterior y la demostración ensayada.",
          archivada: false,
        },
        {
          id: "pg_sitio",
          nombre: "Sitio web",
          texto: "Todo lo que hay que mover en el sitio antes de que abran las inscripciones.",
          archivada: false,
        },
        {
          id: "pg_julio",
          nombre: "Curso de julio",
          texto: "Primera edición, ya cerrada.",
          archivada: true,
        },
      ],
      tareas: [
        { id: "t_1", paginaId: "pg_curso", titulo: "Preparar las láminas de la sesión 4", estado: "haciendo", vence: "2026-08-18" },
        { id: "t_2", paginaId: "pg_curso", titulo: "Grabar la demostración de respaldo", estado: "por-hacer", vence: "2026-08-19" },
        { id: "t_3", paginaId: "pg_curso", titulo: "Confirmar la sala de Zoom", estado: "lista", vence: "2026-08-11" },
        { id: "t_4", paginaId: "pg_curso", titulo: "Revisar el material de apoyo", estado: "por-hacer", vence: "" },
        { id: "t_5", paginaId: "pg_sitio", titulo: "Actualizar los cupos disponibles", estado: "lista", vence: "2026-08-05" },
        { id: "t_6", paginaId: "pg_sitio", titulo: "Regenerar la tarjeta de compartir", estado: "por-hacer", vence: "2026-08-20" },
        { id: "t_7", paginaId: "pg_sitio", titulo: "Revisar los textos de la portada", estado: "haciendo", vence: "" },
      ],
      adjuntos: [
        {
          id: "adj_guion",
          paginaId: "pg_curso",
          nombre: "guion-sesion-4.md",
          tipo: "texto",
          contenido:
            "# Guion de la sesión 4\n\n## Bloques\n\n1. **Bienvenida** y el arco de la personalización\n2. Vibe coding, lanzando el encargo en segundo plano\n3. Lo que salió y su *techo*\n4. El primer arnés: permisos y Git\n5. El proyecto preparado\n6. Demostración en vivo\n7. Cierre del curso\n\n## Recordatorios\n\n- Tener el respaldo abierto en otra pestaña\n- Guardar el punto de retorno antes de empezar\n- Repetir en voz alta que `nadie tiene que leer el código`\n",
        },
      ],
    };
  }

  function leer() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      return crudo ? JSON.parse(crudo) : semilla();
    } catch {
      // Datos corruptos no deben dejar la aplicación en blanco
      return semilla();
    }
  }

  function escribir(datos) {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
    return datos;
  }

  function nuevoId(prefijo) {
    return `${prefijo}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  return {
    estados: () => ESTADOS,

    nombreEstado(id) {
      const estado = ESTADOS.find((e) => e.id === id);
      return estado ? estado.nombre : id;
    },

    datos: () => leer(),

    personas: () => leer().personas,

    persona(id) {
      return leer().personas.find((p) => p.id === id) || null;
    },

    /** Páginas activas. Las archivadas se piden aparte. */
    paginas: () => leer().paginas.filter((p) => !p.archivada),

    paginasArchivadas: () => leer().paginas.filter((p) => p.archivada),

    pagina(id) {
      return leer().paginas.find((p) => p.id === id) || null;
    },

    agregarPagina(nombre) {
      const datos = leer();
      datos.paginas.push({ id: nuevoId("pg"), nombre, texto: "", archivada: false });
      return escribir(datos);
    },

    cambiarNombrePagina(paginaId, nombre) {
      const datos = leer();
      datos.paginas = datos.paginas.map((p) =>
        p.id === paginaId ? { ...p, nombre } : p
      );
      return escribir(datos);
    },

    cambiarTexto(paginaId, texto) {
      const datos = leer();
      datos.paginas = datos.paginas.map((p) =>
        p.id === paginaId ? { ...p, texto } : p
      );
      return escribir(datos);
    },

    archivarPagina(paginaId, archivada = true) {
      const datos = leer();
      datos.paginas = datos.paginas.map((p) =>
        p.id === paginaId ? { ...p, archivada } : p
      );
      return escribir(datos);
    },

    /** Borra la página junto con sus tareas y sus adjuntos. */
    borrarPagina(paginaId) {
      const datos = leer();
      datos.paginas = datos.paginas.filter((p) => p.id !== paginaId);
      datos.tareas = datos.tareas.filter((t) => t.paginaId !== paginaId);
      datos.adjuntos = datos.adjuntos.filter((a) => a.paginaId !== paginaId);
      return escribir(datos);
    },

    tareasDe(paginaId) {
      return leer().tareas.filter((t) => t.paginaId === paginaId);
    },

    agregarTarea(paginaId, titulo) {
      const datos = leer();
      datos.tareas.push({
        id: nuevoId("t"),
        paginaId,
        titulo,
        estado: "por-hacer",
        vence: "",
      });
      return escribir(datos);
    },

    cambiarEstado(tareaId, estado) {
      const datos = leer();
      datos.tareas = datos.tareas.map((t) =>
        t.id === tareaId ? { ...t, estado } : t
      );
      return escribir(datos);
    },

    cambiarVencimiento(tareaId, vence) {
      const datos = leer();
      datos.tareas = datos.tareas.map((t) =>
        t.id === tareaId ? { ...t, vence } : t
      );
      return escribir(datos);
    },

    borrarTarea(tareaId) {
      const datos = leer();
      datos.tareas = datos.tareas.filter((t) => t.id !== tareaId);
      return escribir(datos);
    },

    adjuntosDe(paginaId) {
      return leer().adjuntos.filter((a) => a.paginaId === paginaId);
    },

    /**
     * `tipo` es "texto" para lo que se puede leer en pantalla (markdown y texto
     * plano) y "binario" para el resto, que solo se ofrece para descargar.
     */
    agregarAdjunto(paginaId, { nombre, tipo, contenido }) {
      const datos = leer();
      datos.adjuntos.push({ id: nuevoId("adj"), paginaId, nombre, tipo, contenido });
      return escribir(datos);
    },

    borrarAdjunto(adjuntoId) {
      const datos = leer();
      datos.adjuntos = datos.adjuntos.filter((a) => a.id !== adjuntoId);
      return escribir(datos);
    },
  };
})();
