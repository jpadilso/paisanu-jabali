(function () {
  "use strict";

  /* ---------- utilidades ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- pestañas (con historial para el botón Atrás) ---------- */
  var PANTALLAS = ["inicio", "ficha", "mapa", "sonidos", "convivir", "fotos"];
  function mostrar() {
    var id = (location.hash || "#inicio").slice(1);
    if (PANTALLAS.indexOf(id) < 0) id = "inicio";
    $$("section.pantalla").forEach(function (s) { s.classList.toggle("activa", s.id === "p-" + id); });
    $$(".tab").forEach(function (t) { t.setAttribute("aria-selected", t.getAttribute("data-ir") === id ? "true" : "false"); });
    if (id !== "sonidos") pararAudios();
    window.scrollTo(0, 0);
  }
  $$(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      var id = t.getAttribute("data-ir");
      if (location.hash !== "#" + id) location.hash = id; else mostrar();
    });
  });
  window.addEventListener("hashchange", mostrar);

  /* ---------- tema día / noche ---------- */
  function aplicarTema(t) {
    document.documentElement.setAttribute("data-theme", t);
    $("#tema-ico").src = t === "dark" ? "img/luna.png" : "img/sol.png";
  }
  var guardado = leer("tema");
  var oscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  aplicarTema(guardado || (oscuro ? "dark" : "light"));
  $("#tema").addEventListener("click", function () {
    var nuevo = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    aplicarTema(nuevo); guardar("tema", nuevo);
  });

  /* ---------- datos curiosos (todos salen de las fuentes de la app) ---------- */
  var DATOS = [
    "Las hembras pueden quedar preñadas en su primer o segundo año de vida, a partir de unos 30 kg.",
    "La gestación dura unos 120 días, así que los celos de otoño dan camadas de enero a abril.",
    "Los rayones tienen el pelaje pardo claro con líneas oscuras a lo largo del cuerpo hasta los 4-5 meses.",
    "En un estudio en Álava se estimó que el 30,8 % de las crías muere durante su primer año.",
    "Los machos adultos suelen ir solos; solo se unen a los grupos de hembras durante el celo.",
    "En Extremadura se vio que los machos jóvenes pueden alejarse hasta 50 km del grupo donde nacieron.",
    "Según la ficha de la Universitat de València, un macho puede recorrer un área de 12.000-15.000 ha al año.",
    "En la temporada 2024-25 se cazaron 13.666 jabalíes en Asturias; más de la mitad (7.494) en la zona intermedia.",
    "Los jabalíes están detrás del 43 % de los accidentes de tráfico con animales en España, según la DGT.",
    "Hay indicios de jabalíes en pastos subalpinos por encima de los 2.400 metros.",
    "Su dieta es sobre todo vegetal: bellotas, hayucos, raíces, hongos y productos agrícolas.",
    "En Álava hubo un pico de atropellos a principios de otoño, cuando el celo hace que se muevan más."
  ];
  var ultimo = -1;
  function otroDato() {
    var i;
    do { i = Math.floor(Math.random() * DATOS.length); } while (i === ultimo && DATOS.length > 1);
    ultimo = i;
    $("#dato-texto").textContent = DATOS[i];
  }
  $("#otro-dato").addEventListener("click", otroDato);
  otroDato();

  /* ---------- audios ---------- */
  var actual = null;
  function pararAudios() {
    $$("[data-audio]").forEach(function (c) {
      if (c._audio) { c._audio.pause(); c._audio.currentTime = 0; }
      c.classList.remove("sonando");
      var b = $("[data-play]", c); if (b) b.textContent = "Escuchar";
      var i = $(".barra i", c); if (i) i.style.width = "0";
    });
    actual = null;
  }
  window.paisanuPausa = pararAudios;
  $$("[data-audio]").forEach(function (c) {
    var btn = $("[data-play]", c), barra = $(".barra i", c);
    btn.addEventListener("click", function () {
      if (actual === c) { pararAudios(); return; }
      pararAudios();
      if (!c._audio) {
        c._audio = new Audio(c.getAttribute("data-audio"));
        c._audio.preload = "auto";
        c._audio.addEventListener("timeupdate", function () {
          if (c._audio.duration) barra.style.width = (100 * c._audio.currentTime / c._audio.duration) + "%";
        });
        c._audio.addEventListener("ended", function () {
          c.classList.remove("sonando"); btn.textContent = "Escuchar"; barra.style.width = "0"; actual = null;
        });
      }
      var p = c._audio.play();
      if (p && p.catch) p.catch(function () { btn.textContent = "Error"; });
      c.classList.add("sonando"); btn.textContent = "Parar"; actual = c;
    });
  });
  document.addEventListener("visibilitychange", function () { if (document.hidden) pararAudios(); });

  /* ---------- visor de imágenes ---------- */
  var visor = $("#visor");
  function abrirVisor(src, pie, opciones) {
    opciones = opciones || {};
    $("#visor-img").src = src;
    $("#visor-pie").textContent = pie || "";
    visor.classList.toggle("ancho", !!opciones.ancho);
    visor.classList.toggle("suave", !!opciones.suave);
    visor.classList.add("abierto");
    history.pushState({ visor: 1 }, "");
  }
  function cerrarVisor(desdeHistorial) {
    if (!visor.classList.contains("abierto")) return;
    visor.classList.remove("abierto");
    if (!desdeHistorial && history.state && history.state.visor) history.back();
  }
  $("#visor-cerrar").addEventListener("click", function () { cerrarVisor(false); });
  visor.addEventListener("click", function (e) { if (e.target === visor) cerrarVisor(false); });
  window.addEventListener("popstate", function () { cerrarVisor(true); });

  var mapaFig = $("#mapa-fig");
  function abrirMapa() { abrirVisor("img/mapa-asturias.png", "Mapa esquemático de Asturias. Desplázalo con el dedo.", { ancho: true }); }
  mapaFig.addEventListener("click", abrirMapa);
  mapaFig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrirMapa(); } });

  /* ---------- galería ---------- */
  var ITEMS = [
    { src: "img/retrato.webp", pie: "Retrato de jabalí. Foto aportada por el usuario.", tipo: "tuya", circ: true },
    { src: "img/escena_hayedo.png", pie: "Hayedo de otoño: bellotas, setas y castañas en el suelo. Ilustración pixel art.", tipo: "pixel" },
    { src: "img/escena_horreo.png", pie: "Amanecer con hórreo asturiano. Ilustración pixel art.", tipo: "pixel" },
    { src: "img/escena_celo.png", pie: "Noche de celo. Ilustración pixel art.", tipo: "pixel" }
  ];
  (window.FOTOS || []).forEach(function (f) {
    var pie = f.pie || "Foto";
    if (f.autor) pie += " · " + f.autor;
    if (f.fecha) pie += " (" + f.fecha + ")";
    ITEMS.push({ src: f.src, pie: pie, tipo: "tuya" });
  });
  var gal = $("#galeria");
  ITEMS.forEach(function (it) {
    var b = document.createElement("button");
    b.className = "foto" + (it.circ ? " circ" : "");
    b.type = "button";
    var img = document.createElement("img");
    img.src = it.src; img.alt = it.pie; img.loading = "lazy";
    var span = document.createElement("span");
    var chip = document.createElement("b");
    chip.className = "chip" + (it.tipo === "tuya" ? " tuya" : "");
    chip.textContent = it.tipo === "tuya" ? "Foto" : "Pixel art";
    span.appendChild(chip); span.appendChild(document.createTextNode(it.pie));
    b.appendChild(img); b.appendChild(span);
    b.addEventListener("click", function () { abrirVisor(it.src, it.pie, { suave: it.tipo === "tuya" }); });
    gal.appendChild(b);
  });

  /* ---------- arranque ---------- */
  mostrar();
})();
