// Dibuja la lista y traduce los clics en llamadas al almacén.

const lista = document.getElementById("lista");
const vacio = document.getElementById("vacio");
const resumen = document.getElementById("resumen");
const form = document.getElementById("form-tarea");
const campoTitulo = document.getElementById("titulo");

// El orden de la lista se decide aquí, en un solo lugar
function ordenar(tareas) {
  return [...tareas];
}

function dibujarTarea(tarea) {
  const item = document.createElement("li");
  item.className = tarea.hecha ? "tarea hecha" : "tarea";
  item.dataset.id = tarea.id;

  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = tarea.hecha;
  check.addEventListener("change", () => pintar(Almacen.alternarHecha(tarea.id)));

  const titulo = document.createElement("span");
  titulo.className = "titulo";
  titulo.textContent = tarea.titulo;

  const borrar = document.createElement("button");
  borrar.className = "borrar";
  borrar.textContent = "Borrar";
  borrar.addEventListener("click", () => pintar(Almacen.borrar(tarea.id)));

  item.append(check, titulo, borrar);
  return item;
}

function pintar(tareas) {
  lista.replaceChildren(...ordenar(tareas).map(dibujarTarea));

  vacio.style.display = tareas.length === 0 ? "block" : "none";

  const pendientes = tareas.filter((tarea) => !tarea.hecha).length;
  resumen.textContent =
    tareas.length === 0
      ? ""
      : `${pendientes} ${pendientes === 1 ? "pendiente" : "pendientes"} de ${tareas.length}`;
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const titulo = campoTitulo.value.trim();
  if (!titulo) return;

  pintar(Almacen.agregar(titulo));
  campoTitulo.value = "";
  campoTitulo.focus();
});

pintar(Almacen.listar());
