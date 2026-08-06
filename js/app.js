// Arma la barra lateral, recuerda qué página y qué vista están activas, y le
// pide a Tabla o a Kanban que dibujen el panel.

const panel = document.getElementById("panel");
const listaPaginas = document.getElementById("lista-paginas");
const listaArchivadas = document.getElementById("lista-archivadas");
const verArchivadas = document.getElementById("ver-archivadas");
const zonaArchivadas = document.getElementById("zona-archivadas");
const listaPersonas = document.getElementById("lista-personas");
const tituloPagina = document.getElementById("titulo-pagina");
const formPagina = document.getElementById("form-pagina");
const nombrePagina = document.getElementById("nombre-pagina");
const formTarea = document.getElementById("form-tarea");
const tituloTarea = document.getElementById("titulo-tarea");
const textoPagina = document.getElementById("texto-pagina");
const campoAdjunto = document.getElementById("campo-adjunto");
const errorAdjunto = document.getElementById("error-adjunto");
const zonaAdjuntos = document.getElementById("adjuntos");

let paginaActiva = null;
let vistaActiva = "tabla";
let archivadasVisibles = false;

function botonPagina(pagina, activa) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "nombre-pagina" + (activa ? " activa" : "");
  boton.textContent = pagina.nombre;
  boton.addEventListener("click", () => {
    paginaActiva = pagina.id;
    pintar();
  });
  return boton;
}

function accionPagina(texto, titulo, alHacerClic) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "accion-pagina";
  boton.textContent = texto;
  boton.title = titulo;
  boton.addEventListener("click", (evento) => {
    evento.stopPropagation();
    alHacerClic();
  });
  return boton;
}

function pintarPaginas() {
  listaPaginas.replaceChildren(
    ...Almacen.paginas().map((pagina) => {
      const item = document.createElement("li");
      item.className = "item-pagina";
      item.append(
        botonPagina(pagina, pagina.id === paginaActiva),
        accionPagina("Archivar", `Archivar ${pagina.nombre}`, () => {
          Almacen.archivarPagina(pagina.id, true);
          pintar();
        })
      );
      return item;
    })
  );
}

function pintarArchivadas() {
  const archivadas = Almacen.paginasArchivadas();

  zonaArchivadas.hidden = archivadas.length === 0;
  verArchivadas.textContent = archivadasVisibles
    ? "Ocultar archivadas"
    : `Archivadas (${archivadas.length})`;
  listaArchivadas.hidden = !archivadasVisibles;

  listaArchivadas.replaceChildren(
    ...archivadas.map((pagina) => {
      const item = document.createElement("li");
      item.className = "item-pagina archivada";

      const nombre = document.createElement("span");
      nombre.className = "nombre-pagina";
      nombre.textContent = pagina.nombre;

      item.append(
        nombre,
        accionPagina("Restaurar", `Restaurar ${pagina.nombre}`, () => {
          Almacen.archivarPagina(pagina.id, false);
          pintar();
        }),
        accionPagina("Borrar", `Borrar ${pagina.nombre} y sus tareas`, () => {
          const seguro = confirm(
            `¿Borrar «${pagina.nombre}»? Se van con ella sus tareas y sus adjuntos.`
          );
          if (!seguro) return;
          Almacen.borrarPagina(pagina.id);
          pintar();
        })
      );
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

// El textarea crece con su contenido en vez de mostrar una barra de scroll
function ajustarAltoTexto() {
  textoPagina.style.height = "auto";
  textoPagina.style.height = `${textoPagina.scrollHeight}px`;
}

function pintar() {
  const activas = Almacen.paginas();
  if (!activas.some((p) => p.id === paginaActiva)) {
    paginaActiva = activas.length ? activas[0].id : null;
  }

  const pagina = Almacen.pagina(paginaActiva);
  const hayPagina = Boolean(pagina);

  tituloPagina.disabled = !hayPagina;
  // Igual que el texto: no se reescribe mientras alguien está editando
  if (hayPagina && tituloPagina.dataset.pagina !== pagina.id) {
    tituloPagina.value = pagina.nombre;
    tituloPagina.dataset.pagina = pagina.id;
  } else if (!hayPagina) {
    tituloPagina.value = "Sin páginas activas";
    delete tituloPagina.dataset.pagina;
  }
  formTarea.style.display = hayPagina ? "flex" : "none";
  textoPagina.style.display = hayPagina ? "block" : "none";
  document.querySelector(".barra-adjuntar").style.display = hayPagina ? "flex" : "none";

  // Solo se reescribe al cambiar de página: hacerlo siempre movería el cursor
  // al final mientras alguien escribe.
  if (hayPagina && textoPagina.dataset.pagina !== pagina.id) {
    textoPagina.value = pagina.texto || "";
    textoPagina.dataset.pagina = pagina.id;
  }
  ajustarAltoTexto();

  botonTabla.classList.toggle("activa", vistaActiva === "tabla");
  botonKanban.classList.toggle("activa", vistaActiva === "kanban");

  pintarPaginas();
  pintarArchivadas();
  pintarPersonas();

  if (hayPagina) {
    Adjuntos.dibujar(zonaAdjuntos, Almacen.adjuntosDe(paginaActiva), pintar);
    const vista = vistaActiva === "tabla" ? Tabla : Kanban;
    vista.dibujar(panel, Almacen.tareasDe(paginaActiva), pintar);
  } else {
    zonaAdjuntos.replaceChildren();
    panel.replaceChildren();
  }
}

const botonTabla = document.getElementById("vista-tabla");
const botonKanban = document.getElementById("vista-kanban");

botonTabla.addEventListener("click", () => {
  vistaActiva = "tabla";
  pintar();
});

botonKanban.addEventListener("click", () => {
  vistaActiva = "kanban";
  pintar();
});

verArchivadas.addEventListener("click", () => {
  archivadasVisibles = !archivadasVisibles;
  pintar();
});

tituloPagina.addEventListener("input", () => {
  if (!paginaActiva) return;
  Almacen.cambiarNombrePagina(paginaActiva, tituloPagina.value.trim() || "Sin nombre");
  pintarPaginas();
});

textoPagina.addEventListener("input", () => {
  ajustarAltoTexto();
  if (paginaActiva) Almacen.cambiarTexto(paginaActiva, textoPagina.value);
});

campoAdjunto.addEventListener("change", async () => {
  errorAdjunto.textContent = "";
  const archivos = [...campoAdjunto.files];

  for (const archivo of archivos) {
    try {
      const leido = await Adjuntos.desdeArchivo(archivo);
      Almacen.agregarAdjunto(paginaActiva, leido);
    } catch (error) {
      errorAdjunto.textContent = error.message;
    }
  }

  campoAdjunto.value = "";
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
