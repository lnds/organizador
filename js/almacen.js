// Guarda las tareas en el navegador. Es la única parte del proyecto que sabe
// cómo se persisten los datos: el resto trabaja con el arreglo que devuelve.

const Almacen = (() => {
  const CLAVE = "organizador.tareas";

  function leer() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      return crudo ? JSON.parse(crudo) : [];
    } catch {
      // Un localStorage corrupto no debe dejar la aplicación en blanco
      return [];
    }
  }

  function escribir(tareas) {
    localStorage.setItem(CLAVE, JSON.stringify(tareas));
  }

  function nuevoId() {
    return `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  return {
    listar() {
      return leer();
    },

    agregar(titulo) {
      const tareas = leer();
      tareas.push({ id: nuevoId(), titulo, hecha: false });
      escribir(tareas);
      return tareas;
    },

    alternarHecha(id) {
      const tareas = leer().map((tarea) =>
        tarea.id === id ? { ...tarea, hecha: !tarea.hecha } : tarea
      );
      escribir(tareas);
      return tareas;
    },

    borrar(id) {
      const tareas = leer().filter((tarea) => tarea.id !== id);
      escribir(tareas);
      return tareas;
    },
  };
})();
