// Control principal y eventos.

import { validarGruposPorMetodo, baseResultado, parseLista } from "./utils.js";
import { media, mediana, moda, varianza, desviacion, anova, chiCuadrado, correlacion, pca } from "./calculos.js";
import { graficarBasico, graficarVarianza, graficarDesviacion, graficarAnova, graficarChi2, graficarCorrelacion, graficarPCA } from "./graficas.js";
import { cargarEjemplo } from "./ejemplos.js";

let grafica;

document.getElementById("btnCalcular").addEventListener("click", calcular);
document.getElementById("btnDescargarResultados").addEventListener("click", descargarResultados);
document.getElementById("btnDescargarGrafica").addEventListener("click", descargarGrafica);

window.cargarEjemplo = cargarEjemplo; // necesario para los botones HTML

function calcular() {
  const entrada = document.getElementById("datos").value.trim();
  const metodo = document.getElementById("metodo").value;
  const salida = document.getElementById("resultado");

  if (!entrada) {
    salida.textContent = "Por favor, introduce los datos.";
    salida.className = baseResultado() + " text-red-700 bg-red-100 border-red-300";
    return;
  }

  salida.className = baseResultado();
  if (grafica) grafica.destroy?.();

  document.getElementById("grafica3d").style.display = "none";
  document.getElementById("grafica").style.display = "block";

  const grupos = entrada.split(";").map(parseLista);
  const error = validarGruposPorMetodo(metodo, grupos.length);

  if (error) {
    salida.textContent = "⚠️ " + error;
    salida.className = baseResultado() + " text-yellow-800 bg-yellow-100 border-yellow-300";
    return;
  }

  let res = "—";
  try {
    switch (metodo) {
      case "media": res = media(grupos[0]); graficarBasico(grupos[0], "Media"); break;
      case "mediana": res = mediana(grupos[0]); graficarBasico(grupos[0], "Mediana"); break;
      case "moda": res = moda(grupos[0]); graficarBasico(grupos[0], "Moda"); break;
      case "varianza": res = varianza(grupos[0]); graficarVarianza(grupos[0]); break;
      case "desviacion": res = desviacion(grupos[0]); graficarDesviacion(grupos[0]); break;
      case "anova": res = anova(entrada); graficarAnova(entrada); break;
      case "chi2": res = chiCuadrado(entrada); graficarChi2(entrada); break;
      case "correlacion": res = correlacion(entrada); graficarCorrelacion(entrada); break;
      case "pca": res = pca(entrada); graficarPCA(entrada); break;
    }
  } catch (e) {
    console.error(e);
    res = "Error: formato de datos no válido.";
    salida.className = baseResultado() + " text-red-700 bg-red-100 border-red-300";
  }

  salida.textContent = "Resultado:\n" + res;
}

function descargarResultados() {
  const texto = document.getElementById("resultado").innerText;
  if (!texto || texto.trim() === "Resultado: —") {
    alert("No hay resultados para descargar. Calcula primero.");
    return;
  }
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "resultados_estadisticos.txt";
  enlace.click();
}

function descargarGrafica() {
  const canvas2d = document.getElementById("grafica");
  const graf3d = document.getElementById("grafica3d");

  if (canvas2d.style.display !== "none") {
    const enlace = document.createElement("a");
    enlace.download = "grafica_estadistica.png";
    enlace.href = canvas2d.toDataURL("image/png");
    enlace.click();
  } else if (graf3d.style.display !== "none") {
    Plotly.downloadImage(graf3d, {
      format: "png",
      filename: "grafica_estadistica_3D",
      width: 1000,
      height: 800
    });
  } else {
    alert("No hay gráfica disponible para descargar.");
  }
}
