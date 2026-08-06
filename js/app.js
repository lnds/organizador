// Arma la barra lateral, recuerda qué página y qué vista están activas, y le
// pide a Tabla o a Kanban que dibujen el panel.

const panel = document.getElementById("panel");
const listaPaginas = document.getElementById("lista-paginas");
const listaPersonas = document.getElementById("lista-personas");
const tituloPagina = document.getElementById("titulo-pagina");
const formPagina = document.getElementById("form-pagina");
const nombrePagina = document.getElementById("nombre-pagina");
const formTarea = document.getElementById("form-tarea");
const tituloTarea = document.getElementById("titulo-tarea");
const botonTabla = document.getElementById("vista-tabla");
const botonKanban = document.getElementById("vista-kanban");

let paginaActiva = null;
let vistaActiva = "tabla";

function pintarPaginas() {
  const paginas = Almacen.paginas();

  listaPaginas.replaceChildren(
    ...paginas.map((pagina) => {
      const item = document.createElement("li");
      const boton = document.createElement("button");
      boton.type = "button";
      boton.textContent = pagina.nombre;
      boton.className = pagina.id === paginaActiva ? "activa" : "";
      boton.addEventListener("click", () => {
        paginaActiva = pagina.id;
        pintar();
      });
      item.append(boton);
      return item;
    })
  );
}

function pintarPersonas() {
  listaPersonas.replaceChildren(
    ...Almacen.personas().map((persona) => {
      const item = document.createElement("li");
      item.className = "persona";
      item.innerHTML = `<span class="inicial">${persona.nombre[0]}</span>${persona.nombre}`;
      return item;
    })
  );
}

function pintarPanel() {
  const tareas = Almacen.tareasDe(paginaActiva);
  const vista = vistaActiva === "tabla" ? Tabla : Kanban;
  vista.dibujar(panel, tareas, pintar);
}

function pintar() {
  const paginas = Almacen.paginas();
  if (!paginas.some((p) => p.id === paginaActiva)) {
    paginaActiva = paginas.length ? paginas[0].id : null;
  }

  const pagina = Almacen.pagina(paginaActiva);
  tituloPagina.textContent = pagina ? pagina.nombre : "Sin páginas";
  formTarea.style.display = pagina ? "flex" : "none";

  botonTabla.classList.toggle("activa", vistaActiva === "tabla");
  botonKanban.classList.toggle("activa", vistaActiva === "kanban");

  pintarPaginas();
  pintarPersonas();

  if (pagina) pintarPanel();
  else panel.replaceChildren();
}

botonTabla.addEventListener("click", () => {
  vistaActiva = "tabla";
  pintar();
});

botonKanban.addEventListener("click", () => {
  vistaActiva = "kanban";
  pintar();
});

formPagina.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nombre = nombrePagina.value.trim();
  if (!nombre) return;

  Almacen.agregarPagina(nombre);
  nombrePagina.value = "";
  pintar();
});

formTarea.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const titulo = tituloTarea.value.trim();
  if (!titulo || !paginaActiva) return;

  Almacen.agregarTarea(paginaActiva, titulo);
  tituloTarea.value = "";
  tituloTarea.focus();
  pintar();
});

pintar();
