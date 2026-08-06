// Vista de tabla: una fila por tarea, con sus propiedades editables.

const Tabla = (() => {
  function celdaEstado(tarea, alCambiar) {
    const select = document.createElement("select");
    select.className = "sel-estado";

    Almacen.estados().forEach((estado) => {
      const opcion = document.createElement("option");
      opcion.value = estado.id;
      opcion.textContent = estado.nombre;
      opcion.selected = estado.id === tarea.estado;
      select.append(opcion);
    });

    select.addEventListener("change", () => {
      Almacen.cambiarEstado(tarea.id, select.value);
      alCambiar();
    });

    return select;
  }

  function celdaVence(tarea, alCambiar) {
    const campo = document.createElement("input");
    campo.type = "date";
    campo.className = "campo-fecha";
    campo.value = tarea.vence || "";

    campo.addEventListener("change", () => {
      Almacen.cambiarVencimiento(tarea.id, campo.value);
      alCambiar();
    });

    return campo;
  }

  function fila(tarea, alCambiar) {
    const tr = document.createElement("tr");

    const tdTitulo = document.createElement("td");
    tdTitulo.textContent = tarea.titulo;

    const tdEstado = document.createElement("td");
    tdEstado.append(celdaEstado(tarea, alCambiar));

    const tdVence = document.createElement("td");
    tdVence.append(celdaVence(tarea, alCambiar));

    const tdAcciones = document.createElement("td");
    tdAcciones.className = "acciones";
    const borrar = document.createElement("button");
    borrar.className = "borrar";
    borrar.textContent = "Borrar";
    borrar.addEventListener("click", () => {
      Almacen.borrarTarea(tarea.id);
      alCambiar();
    });
    tdAcciones.append(borrar);

    tr.append(tdTitulo, tdEstado, tdVence, tdAcciones);
    return tr;
  }

  return {
    dibujar(contenedor, tareas, alCambiar) {
      contenedor.replaceChildren();

      if (tareas.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "vacio";
        vacio.textContent = "Esta página todavía no tiene tareas.";
        contenedor.append(vacio);
        return;
      }

      const tabla = document.createElement("table");
      tabla.className = "tabla";

      const thead = document.createElement("thead");
      thead.innerHTML =
        "<tr><th>Tarea</th><th>Estado</th><th>Vence</th><th></th></tr>";

      const tbody = document.createElement("tbody");
      tareas.forEach((tarea) => tbody.append(fila(tarea, alCambiar)));

      tabla.append(thead, tbody);
      contenedor.append(tabla);
    },
  };
})();
