// Convierte markdown a HTML. Cubre lo que aparece en notas de trabajo:
// encabezados, listas, negrita, cursiva, código, citas y enlaces.
//
// Se escribe a mano porque el proyecto no usa dependencias. Todo texto pasa
// primero por escapar(), así que un adjunto con HTML adentro se muestra como
// texto y no se ejecuta.

const Markdown = (() => {
  function escapar(texto) {
    return texto
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Se aplica dentro de una línea ya escapada
  function enLinea(texto) {
    return texto
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  }

  return {
    aHtml(fuente) {
      const lineas = escapar(fuente).split("\n");
      const salida = [];

      let enLista = false;
      let enCodigo = false;

      const cerrarLista = () => {
        if (enLista) {
          salida.push("</ul>");
          enLista = false;
        }
      };

      lineas.forEach((linea) => {
        // Bloque de código delimitado por ```
        if (/^```/.test(linea)) {
          cerrarLista();
          salida.push(enCodigo ? "</code></pre>" : "<pre><code>");
          enCodigo = !enCodigo;
          return;
        }

        if (enCodigo) {
          salida.push(linea);
          return;
        }

        if (linea.trim() === "") {
          cerrarLista();
          return;
        }

        const encabezado = linea.match(/^(#{1,4})\s+(.*)$/);
        if (encabezado) {
          cerrarLista();
          const nivel = encabezado[1].length;
          salida.push(`<h${nivel}>${enLinea(encabezado[2])}</h${nivel}>`);
          return;
        }

        if (/^&gt;\s?/.test(linea)) {
          cerrarLista();
          salida.push(`<blockquote>${enLinea(linea.replace(/^&gt;\s?/, ""))}</blockquote>`);
          return;
        }

        // Viñetas y numeradas se dibujan igual: la numeración no aporta aquí
        const item = linea.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);
        if (item) {
          if (!enLista) {
            salida.push("<ul>");
            enLista = true;
          }
          salida.push(`<li>${enLinea(item[1])}</li>`);
          return;
        }

        cerrarLista();
        salida.push(`<p>${enLinea(linea)}</p>`);
      });

      cerrarLista();
      if (enCodigo) salida.push("</code></pre>");

      return salida.join("\n");
    },
  };
})();
