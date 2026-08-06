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
        { id: "pg_curso", nombre: "Curso de agosto" },
        { id: "pg_sitio", nombre: "Sitio web" },
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

    paginas: () => leer().paginas,

    pagina(id) {
      return leer().paginas.find((p) => p.id === id) || null;
    },

    tareasDe(paginaId) {
      return leer().tareas.filter((t) => t.paginaId === paginaId);
    },

    agregarPagina(nombre) {
      const datos = leer();
      datos.paginas.push({ id: nuevoId("pg"), nombre });
      return escribir(datos);
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
  };
})();
