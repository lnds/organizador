// Adjuntos de una página: subirlos, listarlos y mostrar los que se pueden leer.
// Los markdown se ven renderizados; el resto se ofrece para descargar.

const Adjuntos = (() => {
  // Sobre este peso, localStorage empieza a quedar chico
  const LIMITE_BYTES = 1_000_000;

  const EXTENSIONES_TEXTO = [".md", ".markdown", ".txt", ".csv", ".json"];

  function esTexto(nombre) {
    const punto = nombre.lastIndexOf(".");
    const extension = punto === -1 ? "" : nombre.slice(punto).toLowerCase();
    return EXTENSIONES_TEXTO.includes(extension);
  }

  function esMarkdown(nombre) {
    return /\.(md|markdown)$/i.test(nombre);
  }

  function peso(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function leerArchivo(archivo) {
    return new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onerror = () => rechazar(lector.error);
      lector.onload = () =>
        resolver({
          nombre: archivo.name,
          tipo: esTexto(archivo.name) ? "texto" : "binario",
          contenido: lector.result,
        });

      if (esTexto(archivo.name)) lector.readAsText(archivo);
      else lector.readAsDataURL(archivo);
    });
  }

  function vista(adjunto, alCambiar) {
    const detalle = document.createElement("details");
    detalle.className = "adjunto";

    const resumen = document.createElement("summary");
    resumen.innerHTML = `<span class="adj-nombre">${adjunto.nombre}</span>`;

    const acciones = document.createElement("span");
    acciones.className = "adj-acciones";

    if (adjunto.tipo === "binario") {
      const bajar = document.createElement("a");
      bajar.href = adjunto.contenido;
      bajar.download = adjunto.nombre;
      bajar.className = "adj-boton";
      bajar.textContent = "Descargar";
      bajar.addEventListener("click", (e) => e.stopPropagation());
      acciones.append(bajar);
    }

    const borrar = document.createElement("button");
    borrar.type = "button";
    borrar.className = "adj-boton";
    borrar.textContent = "Quitar";
    borrar.addEventListener("click", (evento) => {
      evento.preventDefault();
      evento.stopPropagation();
      Almacen.borrarAdjunto(adjunto.id);
      alCambiar();
    });
    acciones.append(borrar);

    resumen.append(acciones);
    detalle.append(resumen);

    const cuerpo = document.createElement("div");
    cuerpo.className = "adj-cuerpo";

    if (esMarkdown(adjunto.nombre)) {
      cuerpo.classList.add("md");
      cuerpo.innerHTML = Markdown.aHtml(adjunto.contenido);
    } else if (adjunto.tipo === "texto") {
      const pre = document.createElement("pre");
      pre.textContent = adjunto.contenido;
      cuerpo.append(pre);
    } else {
      const aviso = document.createElement("p");
      aviso.className = "adj-aviso";
      aviso.textContent = "Este archivo no se puede mostrar aquí. Descárgalo para abrirlo.";
      cuerpo.append(aviso);
    }

    detalle.append(cuerpo);
    return detalle;
  }

  return {
    limite: LIMITE_BYTES,
    peso,

    async desdeArchivo(archivo) {
      if (archivo.size > LIMITE_BYTES) {
        throw new Error(
          `${archivo.name} pesa ${peso(archivo.size)} y el máximo son ${peso(LIMITE_BYTES)}.`
        );
      }
      return leerArchivo(archivo);
    },

    dibujar(contenedor, adjuntos, alCambiar) {
      contenedor.replaceChildren();
      if (adjuntos.length === 0) return;

      const titulo = document.createElement("p");
      titulo.className = "rotulo";
      titulo.textContent = `Adjuntos (${adjuntos.length})`;
      contenedor.append(titulo);

      adjuntos.forEach((adjunto) => contenedor.append(vista(adjunto, alCambiar)));
    },
  };
})();
