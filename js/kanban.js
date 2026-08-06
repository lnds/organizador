// Vista de tablero: una columna por estado, una tarjeta por tarea.

const Kanban = (() => {
  function tarjeta(tarea, alCambiar) {
    const div = document.createElement("article");
    div.className = "tarjeta";

    const titulo = document.createElement("p");
    titulo.className = "tarjeta-titulo";
    titulo.textContent = tarea.titulo;
    div.append(titulo);

    if (tarea.vence) {
      const vence = document.createElement("p");
      vence.className = "tarjeta-vence";
      vence.textContent = `Vence el ${formatoFecha(tarea.vence)}`;
      div.append(vence);
    }

    div.append(mover(tarea, alCambiar));
    return div;
  }

  // Sin arrastrar: el estado se cambia con el selector de la propia tarjeta
  function mover(tarea, alCambiar) {
    const select = document.createElement("select");
    select.className = "tarjeta-mover";

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

  function formatoFecha(iso) {
    const [anio, mes, dia] = iso.split("-");
    return `${dia}-${mes}-${anio}`;
  }

  function columna(estado, tareas, alCambiar) {
    const div = document.createElement("section");
    div.className = "columna";

    const cabecera = document.createElement("header");
    cabecera.className = "columna-cabecera";
    cabecera.innerHTML = `<span>${estado.nombre}</span><span class="cuenta">${tareas.length}</span>`;
    div.append(cabecera);

    if (tareas.length === 0) {
      const vacia = document.createElement("p");
      vacia.className = "columna-vacia";
      vacia.textContent = "Nada por aquí";
      div.append(vacia);
    } else {
      tareas.forEach((tarea) => div.append(tarjeta(tarea, alCambiar)));
    }

    return div;
  }

  return {
    dibujar(contenedor, tareas, alCambiar) {
      contenedor.replaceChildren();

      const tablero = document.createElement("div");
      tablero.className = "tablero";

      Almacen.estados().forEach((estado) => {
        const deEsteEstado = tareas.filter((t) => t.estado === estado.id);
        tablero.append(columna(estado, deEsteEstado, alCambiar));
      });

      contenedor.append(tablero);
    },
  };
})();
