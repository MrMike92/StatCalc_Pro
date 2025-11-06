// Funciones generales y validaciones.

export function parseLista(txt) {
  return txt.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
}

export function baseResultado() {
  return "bg-gray-100 border border-gray-300 rounded-lg p-4 mt-6 text-center text-slate-700 font-semibold whitespace-pre-wrap overflow-auto";
}

export function validarGruposPorMetodo(metodo, n) {
  switch (metodo) {
    case "media": case "mediana": case "moda": case "varianza": case "desviacion":
      if (n > 1) return "Solo puede manejar 1 grupo de datos.";
      break;
    case "anova": if (n < 2) return "ANOVA requiere al menos 2 grupos."; break;
    case "chi2": if (n < 2) return "Chi-cuadrado requiere al menos 2 filas."; break;
    case "correlacion": if (n !== 2) return "La correlación requiere exactamente 2 grupos."; break;
    case "pca": if (n < 2) return "PCA requiere al menos 2 componentes."; break;
  }
  return null;
}
