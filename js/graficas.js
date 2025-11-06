// Funciones de Chart.js y Plotly.

import { parseLista } from "./utils.js";

let grafica = null;

export function graficarBasico(datos, titulo) {
  const ctx = document.getElementById("grafica").getContext("2d");
  if (grafica) grafica.destroy();

  const nombre = titulo.toLowerCase();
  let lineaReferencia = null;
  let etiqueta = "";

  if (nombre.includes("media") && !nombre.includes("mediana")) {
    const mean = datos.reduce((a, b) => a + b, 0) / datos.length;
    lineaReferencia = mean;
    etiqueta = `Media = ${mean.toFixed(2)}`;
  } else if (nombre.includes("mediana")) {
    const sorted = [...datos].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
    lineaReferencia = median;
    etiqueta = `Mediana = ${median.toFixed(2)}`;
  } else if (nombre.includes("moda")) {
    const frec = {};
    datos.forEach(x => frec[x] = (frec[x] || 0) + 1);
    const max = Math.max(...Object.values(frec));
    const moda = Object.keys(frec).filter(k => frec[k] === max)[0];
    lineaReferencia = parseFloat(moda);
    etiqueta = `Moda = ${moda}`;
  }

  const datasets = [
    {
      label: "Datos",
      data: datos,
      backgroundColor: "#1dd89aff",
    },
  ];

  if (lineaReferencia !== null) {
    datasets.push({
      label: etiqueta,
      data: new Array(datos.length).fill(lineaReferencia),
      type: "line",
      borderColor: "#e11d48",
      borderWidth: 2,
      pointRadius: 0,
      borderDash: [6, 4],
    });
  }

  grafica = new Chart(ctx, {
    type: "bar",
    data: {
      labels: datos.map((_, i) => `Dato ${i + 1}`),
      datasets: datasets,
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { labels: { color: "#1e293b" } } },
    },
  });
}

export function graficarVarianza(datos) {
  const ctx = document.getElementById("grafica").getContext("2d");
  if (grafica) grafica.destroy();

  const mean = datos.reduce((a, b) => a + b, 0) / datos.length;

  // Crear dataset de puntos individuales
  const puntos = datos.map((y, i) => ({ x: i + 1, y }));

  // Crear dataset de líneas verticales (distancia a la media)
  const desviaciones = datos.flatMap((y, i) => ([
    { x: i + 1, y },
    { x: i + 1, y: mean },
    { x: null, y: null } // separador de segmentos
  ]));

  // Crear datasets para Chart.js
  const datasets = [
    {
      label: "Datos",
      data: puntos,
      type: "scatter",
      backgroundColor: "#000000ff",
      borderColor: "#000000ff",
      pointRadius: 5,
      pointStyle: "cross",
      showLine: false,
    },
    {
      label: "Desviaciones respecto a la media",
      data: desviaciones,
      type: "line",
      borderColor: "rgba(47, 0, 255, 1)",
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
    },
    {
      label: `Media = ${mean.toFixed(2)}`,
      data: [
        { x: 0, y: mean },
        { x: datos.length + 1, y: mean },
      ],
      type: "line",
      borderColor: "#dc2626",
      borderWidth: 2,
      borderDash: [6, 4],
      pointRadius: 0,
    },
  ];

  grafica = new Chart(ctx, {
    data: { datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#1e293b" } },
      },
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Índice de observación" },
          ticks: { stepSize: 1 },
          grid: { color: "rgba(0,0,0,0.1)" },
        },
        y: {
          title: { display: true, text: "Valor" },
          beginAtZero: false,
          grid: { color: "rgba(0,0,0,0.1)" },
        },
      },
    },
  });
}

export function graficarDesviacion(datos) {
  const ctx = document.getElementById("grafica").getContext("2d");
  if (grafica) grafica.destroy();

  // Calcular media y desviación estándar
  const mean = datos.reduce((a, b) => a + b, 0) / datos.length;
  const variance = datos.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / datos.length;
  const std = Math.sqrt(variance);

  // Rango de ±1 desviación estándar
  const lower = mean - std;
  const upper = mean + std;

  // Dataset: puntos de datos
  const puntos = datos.map((y, i) => ({ x: i + 1, y }));

  // Línea horizontal de la media
  const lineaMedia = [
    { x: 0, y: mean },
    { x: datos.length + 1, y: mean },
  ];

  // Límites superior e inferior de la banda
  const limiteInferior = [
    { x: 0, y: lower },
    { x: datos.length + 1, y: lower },
  ];
  const limiteSuperior = [
    { x: 0, y: upper },
    { x: datos.length + 1, y: upper },
  ];

  grafica = new Chart(ctx, {
    data: {
      datasets: [
        // Puntos de los datos
        {
          label: "Datos",
          data: puntos,
          type: "scatter",
          backgroundColor: "#000",
          borderColor: "#000",
          pointRadius: 5,
          pointStyle: "cross",
        },

        // Línea superior de la banda
        {
          label: "Límite superior",
          data: limiteSuperior,
          type: "line",
          borderColor: "rgba(24, 131, 12, 1)",
          backgroundColor: "rgba(255, 200, 100, 0.3)", // color del relleno
          borderWidth: 1,
          fill: "-1", // se rellena la parte inferior
          pointRadius: 0,
        },

        // Línea inferior de la banda
        {
          label: "Límite inferior",
          data: limiteInferior,
          type: "line",
          borderColor: "rgba(0, 0, 0, 1)",
          backgroundColor: "rgba(255, 200, 100, 0.3)",
          borderWidth: 1,
          fill: "1", // se rellena la parte superior
          pointRadius: 0,
        },

        // Línea de la media
        {
          label: `Media = ${mean.toFixed(2)}`,
          data: lineaMedia,
          type: "line",
          borderColor: "#dc2626", // rojo
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#1e293b" } },
      },
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Índice de observación" },
          ticks: { stepSize: 1 },
          grid: { color: "rgba(0,0,0,0.1)" },
        },
        y: {
          title: { display: true, text: "Valor" },
          grid: { color: "rgba(0,0,0,0.1)" },
        },
      },
    },
  });
}

export function graficarAnova(txt) {
  const grupos = txt.split(";").map(parseLista);
  const graf2d = document.getElementById("grafica");
  const graf3d = document.getElementById("grafica3d");

  graf2d.style.display = "none";
  graf3d.style.display = "block";
  graf3d.innerHTML = "";

  const traces = grupos.map((g, i) => ({
    y: g,
    type: "box",
    name: `Grupo ${i + 1}`,
    boxpoints: "all",
    jitter: 0.5,
    fillcolor: "rgba(56,189,248,0.5)",
    marker: { size: 6, color: "rgba(220,38,38,0.8)" },
    line: { width: 1, color: "#1e3a8a" },
  }));

  const layout = {
    xaxis: { title: "Grupos", color: "#1e293b" },
    yaxis: { title: "Valores", gridcolor: "rgba(0,0,0,0.1)", color: "#1e293b" },
    paper_bgcolor: "#fff",
    plot_bgcolor: "#fff",
    boxmode: "group",
  };

  Plotly.newPlot("grafica3d", traces, layout, { responsive: true });
}

export function graficarChi2(txt) {
  const filas = txt.split(";").map(parseLista);
  const ctx = document.getElementById("grafica").getContext("2d");
  if (grafica) grafica.destroy();

  const numCols = filas[0].length;
  const labels = Array.from({ length: numCols }, (_, i) => `Columna ${i + 1}`);
  const colores = ["#2563eb","#16a34a","#f59e0b","#dc2626","#7c3aed","#06b6d4","#84cc16","#d946ef","#f97316"];

  const datasets = filas.map((fila, i) => ({
    label: `Fila ${i + 1}`,
    data: fila,
    backgroundColor: colores[i % colores.length],
    borderColor: "#1e293b",
    borderWidth: 1,
    borderRadius: 6
  }));

  grafica = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: "Distribución Chi-Cuadrado", color: "#1e293b", font: { size: 18, weight: "bold" } },
        legend: { labels: { color: "#1e293b" } },
      },
      scales: {
        x: { stacked: true, title: { display: true, text: "Categorías" } },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: "Frecuencias" } },
      },
    },
  });
}

export function graficarCorrelacion(txt) {
  const [x, y] = txt.split(";").map(parseLista);
  const ctx = document.getElementById("grafica").getContext("2d");
  if (grafica) grafica.destroy();

  // Calcular regresión lineal
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  const num = x.reduce((s, xi, i) => s + (xi - meanX) * (y[i] - meanY), 0);
  const den = x.reduce((s, xi) => s + Math.pow(xi - meanX, 2), 0);
  const m = num / den; // Pendiente
  const b = meanY - m * meanX; // Intercepto
  const r = num / Math.sqrt(den * y.reduce((s, yi) => s + Math.pow(yi - meanY, 2), 0));

  // Crear línea de tendencia
  const minX = Math.min(...x);
  const maxX = Math.max(...x);
  const linea = [
    { x: minX, y: m * minX + b },
    { x: maxX, y: m * maxX + b },
  ];

  grafica = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Datos",
          data: x.map((xi, i) => ({ x: xi, y: y[i] })),
          backgroundColor: "#1e3a8a",
          pointRadius: 5,
        },
        {
          label: `Línea de tendencia (R = ${r.toFixed(2)})`,
          data: linea,
          type: "line",
          borderColor: "rgba(128,0,128,0.7)",
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [6, 4],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#1e293b" } },
        annotation: {
          annotations: {
            rValue: {
              type: "label",
              content: `R = ${r.toFixed(2)}`,
              backgroundColor: "rgba(16,185,129,0.8)",
            },
          },
        },
      },
      scales: {
        x: { title: { display: true, text: "Variable X", color: "#1e293b" } },
        y: { title: { display: true, text: "Variable Y", color: "#1e293b" } },
      },
    },
  });
}

export function graficarPCA(txt) {
  const grupos = txt.split(";").map(parseLista);
  const n = grupos[0].length;
  const m = grupos.length;
  const graf2d = document.getElementById("grafica");
  const graf3d = document.getElementById("grafica3d");

  if (grafica) grafica.destroy();
  graf2d.style.display = "block";
  graf3d.style.display = "none";
  graf3d.innerHTML = "";

  if (m === 1) {
    const ctx = graf2d.getContext("2d");
    grafica = new Chart(ctx, {
      type: "bar",
      data: {
        labels: grupos[0].map((_, i) => `Dato ${i + 1}`),
        datasets: [{ label: "Variable 1", data: grupos[0], backgroundColor: "#1d4ed8" }]
      }
    });
    return;
  }

  if (m === 2) {
    const datos = Array.from({ length: n }, (_, i) => ({ x: grupos[0][i], y: grupos[1][i] }));
    const ctx = graf2d.getContext("2d");
    grafica = new Chart(ctx, {
      type: "scatter",
      data: { datasets: [{ label: "PCA 2D", data: datos, backgroundColor: "#16a34a" }] }
    });
    return;
  }

  if (m === 3) {
    graf2d.style.display = "none";
    graf3d.style.display = "block";
    const trace = { x: grupos[0], y: grupos[1], z: grupos[2], mode: "markers", type: "scatter3d", marker: { size: 6, color: "#2dd4bf" } };
    Plotly.newPlot("grafica3d", [trace], {
      margin: { l: 0, r: 0, b: 0, t: 30 },
      scene: { xaxis: { title: "Var 1" }, yaxis: { title: "Var 2" }, zaxis: { title: "Var 3" } },
      title: "Gráfica PCA 3D"
    });
    return;
  }

  graf2d.style.display = "none";
  graf3d.style.display = "block";
  graf3d.innerHTML = `
    <div class="flex flex-col items-center justify-center text-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg p-4 w-full h-full">
      <p class="text-lg font-semibold">⚠️ No se puede graficar PCA con más de 3 componentes.</p>
      <p class="text-sm text-yellow-600 mt-1">Solo se admite visualización 2D o 3D.</p>
    </div>`;
}