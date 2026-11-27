//importo datos (serieGaleria) desde el archivo datos_obras.js 
import { seriesGaleria } from "./datos_obras.js";

//Elementos del DOM y carrusel / venobox
const contenedorFiltros = document.querySelector("#contenedor-filtros");
const galeriaContenedor = document.querySelector("#contenedor-galeria");
const estadoVista = document.querySelector("#estado-vista");

const panelCarrusel = document.querySelector("#panel-carrusel");
const tituloSerieCarrusel = document.querySelector("#titulo-serie-carrusel");
const contadorCarrusel = document.querySelector("#contador-carrusel");
const btnCerrarCarrusel = document.querySelector("#btn-cerrar-carrusel");
const marcoCarrusel = document.querySelector("#marco-carrusel");
const imagenCarrusel = document.querySelector("#imagen-carrusel");
const fichaCarrusel = document.querySelector("#ficha-carrusel");
const tituloObraCarrusel = document.querySelector("#titulo-obra-carrusel");
const metaObraCarrusel = document.querySelector("#meta-obra-carrusel");
const descripcionObraCarrusel = document.querySelector("#descripcion-obra-carrusel");
const btnAnteriorObra = document.querySelector("#btn-anterior-obra");
const btnSiguienteObra = document.querySelector("#btn-siguiente-obra");
const btnToggleDescripcion = document.querySelector("#btn-toggle-descripcion");
const enlaceVenoBox = document.querySelector("#enlace-venobox");

//Variables de estado
let serieActiva = null;
let indiceActual = 0;

//Función para inicializar venobox
function iniciarVenoBox(selector = ".venobox-obra") {
    if (typeof VenoBox !== "function") return;
    new VenoBox({
        selector,
        numeration: true,
        infinigall: true
    });
}

//Función para mostrar/ocultar obras según el filtro activo
function activarFiltros(filtroActivo = "todas") {
    contenedorFiltros.innerHTML = "";

    //creo botones de filtros para todas las series
    const btnTodas = document.createElement("button");
    btnTodas.type = "button";
    btnTodas.textContent = "Todas las series";
    btnTodas.setAttribute("aria-pressed", String(filtroActivo === "todas"));
    btnTodas.addEventListener("click", () => {
        activarFiltros("todas");
        actualizarCaratulas();
    });
    contenedorFiltros.appendChild(btnTodas);

    seriesGaleria.forEach((serie) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = serie.nombre;
        btn.setAttribute("aria-pressed", String(filtroActivo === serie.id));
        btn.addEventListener("click", () => {
            cerrarCarrusel();
            activarFiltros(serie.id);
            actualizarObras(serie);
        });
        contenedorFiltros.appendChild(btn);
    });
}


function actualizarCaratulas() {
    galeriaContenedor.innerHTML = "";
    estadoVista.textContent = "Mostrando las 6 series. Hacé clic en una para abrir su carrusel.";

    seriesGaleria.forEach((serie) => {
        const caratula = serie.obras.find((o) => o.id === serie.caratulaId) || serie.obras[0];

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-galeria";
        tarjeta.innerHTML = `
          <button type="button" class="btn-abrir-serie">
            <img src="${caratula.imagen}" alt="Carátula de ${serie.nombre}: ${caratula.titulo}" />
            <h2 class="titulo-galeria">${serie.nombre}</h2>
            <p class="texto-galeria">${caratula.titulo} (${caratula.anio}) — ${serie.obras.length} obras</p>
          </button>
        `;

        tarjeta.querySelector(".btn-abrir-serie").addEventListener("click", () => {
            abrirCarrusel(serie, 0);
        });

        galeriaContenedor.appendChild(tarjeta);
    });
}

function actualizarObras(serie) {
    galeriaContenedor.innerHTML = "";
    estadoVista.textContent = `${serie.nombre}: ${serie.obras.length} obras seleccionadas.`;

    serie.obras.forEach((obra, indice) => {
        const item = document.createElement("article");
        item.className = "tarjeta-galeria";
        item.innerHTML = `
          <a
            class="venobox-obra"
            data-gall="filtro-${serie.id}"
            data-title="${obra.titulo} (${obra.anio}) — ${obra.descripcion}"
            href="${obra.imagen}">

            <img src="${obra.imagen}" alt="${obra.titulo}" />
          </a>
          <h2 class="titulo-galeria">${obra.titulo}</h2>
          <p class="texto-galeria">${obra.autora} (${obra.anio})</p>
          <p class="texto-galeria">${obra.descripcion}</p>
          <button type="button" class="btn-ir-carrusel">Abrir en carrusel</button>
        `;

        item.querySelector(".btn-ir-carrusel").addEventListener("click", () => {
            abrirCarrusel(serie, indice);
        });

        galeriaContenedor.appendChild(item);
    });

    iniciarVenoBox(".venobox-obra");
}

function abrirCarrusel(serie, indice = 0) {
    serieActiva = serie;
    indiceActual = indice;
    fichaCarrusel.hidden = true;
    panelCarrusel.hidden = false;
    actualizarCarrusel();
    panelCarrusel.scrollIntoView();
}

function cerrarCarrusel() {
    panelCarrusel.hidden = true;
    fichaCarrusel.hidden = true;
    serieActiva = null;
}

function actualizarCarrusel() {
    if (!serieActiva) return;
    const obra = serieActiva.obras[indiceActual];
    const total = serieActiva.obras.length;

    tituloSerieCarrusel.textContent = serieActiva.nombre;
    contadorCarrusel.textContent = `Obra ${indiceActual + 1} de ${total}`;

    imagenCarrusel.src = obra.imagen;
    imagenCarrusel.alt = obra.titulo;

    tituloObraCarrusel.textContent = obra.titulo;
    metaObraCarrusel.textContent = `${obra.autora} · ${obra.anio}`;
    descripcionObraCarrusel.textContent = obra.descripcion;

    enlaceVenoBox.href = obra.imagen;
    enlaceVenoBox.dataset.title = `${obra.titulo} (${obra.anio}) — ${obra.descripcion}`;
    iniciarVenoBox(".venobox-carrusel");
}

function alternarDescripcion() {
    fichaCarrusel.hidden = !fichaCarrusel.hidden;
}

btnAnteriorObra?.addEventListener("click", () => {
    if (!serieActiva) return;
    const total = serieActiva.obras.length;
    indiceActual = (indiceActual - 1 + total) % total;
    actualizarCarrusel();
});

btnSiguienteObra?.addEventListener("click", () => {
    if (!serieActiva) return;
    const total = serieActiva.obras.length;
    indiceActual = (indiceActual + 1) % total;
    actualizarCarrusel();
});

btnCerrarCarrusel?.addEventListener("click", cerrarCarrusel);
btnToggleDescripcion?.addEventListener("click", alternarDescripcion);

marcoCarrusel?.addEventListener("mouseenter", () => {
    fichaCarrusel.hidden = false;
});
marcoCarrusel?.addEventListener("mouseleave", () => {
    fichaCarrusel.hidden = true;
});
imagenCarrusel?.addEventListener("click", alternarDescripcion);

activarFiltros("todas");
actualizarCaratulas();