let grafica;

// BOTON PRINCIPAL
document.getElementById("btnCalcular").addEventListener("click", calcular);

function calcular() {
  const entrada = document.getElementById("datos").value.trim();
  const metodo = document.getElementById("metodo").value;
  const salida = document.getElementById("resultado");

  if (!entrada) {
    salida.textContent = "Por favor, introduce los datos.";
    salida.className = baseResultado() + " text-red-700 bg-red-100 border-red-300";
    return;
  }

  // limpiar estilos previos
  salida.className = baseResultado();

  if (grafica) grafica.destroy();
  document.getElementById("grafica3d").style.display = "none";
  document.getElementById("grafica").style.display = "block";

  // separar por grupos (;)
  const grupos = entrada.split(";").map(parseLista);
  const numGrupos = grupos.length;

  // validación general por método
  const error = validarGruposPorMetodo(metodo, numGrupos);
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
      case "varianza": res = varianza(grupos[0]); graficarVarianza(grupos[0], "Varianza"); break;
      case "desviacion": res = desviacion(grupos[0]); graficarDesviacion(grupos[0], "Desviación estándar"); break;
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

// VALIDACION POR METODO
function validarGruposPorMetodo(metodo, n) {
  switch (metodo) {
    case "media":
    case "mediana":
    case "moda":
    case "varianza":
    case "desviacion":
      if (n > 1 ) return "Solo puede manejar 1 grupo de datoss.";
      break;

    case "anova":
      if (n < 2) return "ANOVA requiere al menos 2 grupos de datos.";
      break;

    case "chi2":
      if (n < 2) return "Chi-cuadrado requiere al menos 2 filas o columnas.";
      break;

    case "correlacion":
      if (n !== 2) return "La correlación de Pearson requiere exactamente 2 grupos (X;Y).";
      break;

    case "pca":
      if (n < 2) return "PCA requiere al menos 2 componentes.";
      break;
  }
  return null;
}

function baseResultado() {
  return "bg-gray-100 border border-gray-300 rounded-lg p-4 mt-6 text-center text-slate-700 font-semibold whitespace-pre-wrap overflow-auto";
}

// FUNCIONES
function parseLista(txt) {
  return txt.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
}
const media = arr => (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(4);
const mediana = arr => { arr.sort((a,b)=>a-b); const m=Math.floor(arr.length/2); return arr.length%2?arr[m]:((arr[m-1]+arr[m])/2).toFixed(4); }
const moda = arr => { const f={}; arr.forEach(x=>f[x]=(f[x]||0)+1); const max=Math.max(...Object.values(f)); return Object.keys(f).filter(k=>f[k]===max).join(", "); }
const varianza = arr => { const m=arr.reduce((a,b)=>a+b,0)/arr.length; return (arr.reduce((a,b)=>a+Math.pow(b-m,2),0)/arr.length).toFixed(4); }
const desviacion = arr => Math.sqrt(varianza(arr)).toFixed(4);

// GRAFICAS
function graficarBasico(datos, titulo) {
  const ctx = document.getElementById("grafica").getContext("2d");
  const nombre = titulo.toLowerCase();

  let lineaReferencia = null;
  let etiqueta = "";

  // Calcular valor de referencia según el método
  if (nombre.includes("media") && !nombre.includes("mediana")) {
    const mean = datos.reduce((a, b) => a + b, 0) / datos.length;
    lineaReferencia = mean;
    etiqueta = `Media = ${mean.toFixed(2)}`;
  } 
  else if (nombre.includes("mediana")) {
    const sorted = [...datos].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
    lineaReferencia = median;
    etiqueta = `Mediana = ${median.toFixed(2)}`;
  } 
  else if (nombre.includes("moda")) {
    const frec = {};
    datos.forEach(x => frec[x] = (frec[x] || 0) + 1);
    const max = Math.max(...Object.values(frec));
    const moda = Object.keys(frec).filter(k => frec[k] === max)[0];
    lineaReferencia = parseFloat(moda);
    etiqueta = `Moda = ${moda}`;
  }

  // Dataset principal (barras)
  const datasets = [
    {
      label: "Datos",
      data: datos,
      backgroundColor: "#1d4ed8",
    },
  ];

  // Si hay valor de referencia, agregar línea
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

  // Crear gráfico
  grafica = new Chart(ctx, {
    type: "bar",
    data: {
      labels: datos.map((_, i) => `Dato ${i + 1}`),
      datasets: datasets,
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { labels: { color: "#1e293b" } },
      },
    },
  });
}
function graficarVarianza(datos) {
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

function graficarDesviacion(datos) {
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

function graficarAnova(txt) {
  const grupos = txt.split(";").map(parseLista);
  const graf2d = document.getElementById("grafica");
  const graf3d = document.getElementById("grafica3d");

  // Ocultar canvas Chart.js y mostrar contenedor Plotly
  graf2d.style.display = "none";
  graf3d.style.display = "block";

  // Limpiar gráfico anterior
  graf3d.innerHTML = "";

  // Crear trazas de boxplot por grupo
  const traces = grupos.map((g, i) => ({
    y: g,
    type: "box",
    name: `Grupo ${i + 1}`,
    boxpoints: "all",          // muestra todos los puntos
    jitter: 0.5,               // dispersión de puntos
    whiskerwidth: 0.2,
    fillcolor: "rgba(56, 189, 248, 0.5)", // azul translúcido
    marker: { size: 6, color: "rgba(220, 38, 38, 0.8)" }, // rojo para puntos
    line: { width: 1, color: "#1e3a8a" }, // azul oscuro para bordes
  }));

  // Configuración del layout
  const layout = {
    xaxis: {
      title: "Grupos",
      showgrid: false,
      zeroline: false,
      color: "#1e293b",
    },
    yaxis: {
      title: "Valores",
      gridcolor: "rgba(0,0,0,0.1)",
      color: "#1e293b",
    },
    paper_bgcolor: "rgba(255,255,255,1)",
    plot_bgcolor: "rgba(255,255,255,1)",
    boxmode: "group",
    margin: { t: 50, r: 30, b: 70, l: 60 },
  };

  // Dibujar boxplot con Plotly
  Plotly.newPlot("grafica3d", traces, layout, { responsive: true });
}

function graficarChi2(txt) {
  const filas = txt.split(";").map(parseLista);
  const ctx = document.getElementById("grafica").getContext("2d");
  if (grafica) grafica.destroy();

  const numFilas = filas.length;
  const numCols = filas[0].length;

  // Etiquetas de columnas (categorías)
  const labels = Array.from({ length: numCols }, (_, i) => `Columna ${i + 1}`);

  // Paleta de colores agradable
  const colores = [
    "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed",
    "#06b6d4", "#84cc16", "#d946ef", "#f97316"
  ];

  // Crear datasets (una barra por fila)
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
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Distribución Chi-Cuadrado",
          color: "#1e293b",
          font: { size: 18, weight: "bold" }
        },
        legend: {
          position: "top",
          labels: { color: "#1e293b", font: { size: 13 } }
        },
        tooltip: {
          callbacks: {
            label: ctx => `Valor: ${ctx.raw}`
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          title: { display: true, text: "Categorías", color: "#1e293b" },
          grid: { color: "rgba(0,0,0,0.1)" }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: "Frecuencias observadas", color: "#1e293b" },
          grid: { color: "rgba(0,0,0,0.1)" }
        }
      }
    }
  });
}

function graficarCorrelacion(txt){
  const[x,y]=txt.split(";").map(parseLista);
  const ctx=document.getElementById("grafica").getContext("2d");
  grafica=new Chart(ctx,{type:"scatter",data:{datasets:[{label:"Dispersión",data:x.map((xi,i)=>({x:xi,y:y[i]})),backgroundColor:"#dc2626"}]}});
}

// PCA
function graficarPCA(txt){
  const grupos=txt.split(";").map(parseLista);
  const n=grupos[0].length;
  const m=grupos.length;
  const graf2d=document.getElementById("grafica");
  const graf3d=document.getElementById("grafica3d");
  graf2d.style.display="block";
  graf3d.style.display="none";
  if(grafica)grafica.destroy();
  graf3d.innerHTML="";

  if(m===1){const ctx=graf2d.getContext("2d");grafica=new Chart(ctx,{type:"bar",data:{labels:grupos[0].map((_,i)=>`Dato ${i+1}`),datasets:[{label:"Variable 1",data:grupos[0],backgroundColor:"#1d4ed8"}]}});return;}
  if(m===2){const datos=Array.from({length:n},(_,i)=>({x:grupos[0][i],y:grupos[1][i]}));const ctx=graf2d.getContext("2d");grafica=new Chart(ctx,{type:"scatter",data:{datasets:[{label:"Puntos PCA (2D)",data:datos,backgroundColor:"#16a34a"}]}});return;}
  if(m===3){graf2d.style.display="none";graf3d.style.display="block";const trace={x:grupos[0],y:grupos[1],z:grupos[2],mode:"markers",type:"scatter3d",marker:{size:6,color:"#2dd4bf"}};Plotly.newPlot("grafica3d",[trace],{margin:{l:0,r:0,b:0,t:30},scene:{xaxis:{title:"Variable 1"},yaxis:{title:"Variable 2"},zaxis:{title:"Variable 3"}},title:"Gráfica PCA 3D"});return;}

  graf2d.style.display="none";graf3d.style.display="block";
  graf3d.innerHTML=`<div class="flex flex-col items-center justify-center text-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg p-4 w-full h-full">
    <p class="text-lg font-semibold">⚠️ No se puede graficar PCA con más de 3 componentes.</p>
    <p class="text-sm text-yellow-600 mt-1">Solo se admite visualización 2D o 3D.</p>
  </div>`;
}

// === CALCULOS COMPLEJOS ===
function anova(txt){const g=txt.split(";").map(parseLista);const k=g.length;const n=g.reduce((a,b)=>a+b.length,0);const mg=g.flat().reduce((a,b)=>a+b,0)/n;const ssb=g.reduce((s,x)=>s+x.length*Math.pow(media(x)-mg,2),0);const ssw=g.reduce((s,x)=>s+x.reduce((q,v)=>q+Math.pow(v-media(x),2),0),0);const glb=k-1,glw=n-k,msb=ssb/glb,msw=ssw/glw,f=msb/msw;return`SSB=${ssb.toFixed(4)}\nSSW=${ssw.toFixed(4)}\nF=${f.toFixed(4)}`;}
function chiCuadrado(txt){const filas=txt.split(";").map(parseLista);const total=filas.flat().reduce((a,b)=>a+b,0);const sumF=filas.map(f=>f.reduce((a,b)=>a+b,0));const sumC=filas[0].map((_,j)=>filas.reduce((a,f)=>a+f[j],0));let chi2=0;for(let i=0;i<filas.length;i++){for(let j=0;j<filas[i].length;j++){const e=(sumF[i]*sumC[j])/total;chi2+=Math.pow(filas[i][j]-e,2)/e;}}const gl=(filas.length-1)*(filas[0].length-1);return`Chi²=${chi2.toFixed(4)}\nGl=${gl}`;}
function correlacion(txt){const[x,y]=txt.split(";").map(parseLista);const n=x.length,mx=x.reduce((a,b)=>a+b,0)/n,my=y.reduce((a,b)=>a+b,0)/n;const num=x.map((xi,i)=>(xi-mx)*(y[i]-my)).reduce((a,b)=>a+b,0);const den=Math.sqrt(x.reduce((a,b)=>a+Math.pow(b-mx,2),0)*y.reduce((a,b)=>a+Math.pow(b-my,2),0));const r=num/den;return`r=${r.toFixed(4)}`;}
function pca(txt){
  const g=txt.split(";").map(parseLista);const m=g.length,n=g[0].length;
  if(!g.every(x=>x.length===n))return"⚠️ Error: todas las variables deben tener el mismo número de observaciones.";
  const med=g.map(a=>a.reduce((p,q)=>p+q,0)/n);
  const c=g.map((a,i)=>a.map(x=>x-med[i]));
  const cov=Array.from({length:m},()=>Array(m).fill(0));
  for(let i=0;i<m;i++){for(let j=0;j<m;j++){let s=0;for(let k=0;k<n;k++)s+=c[i][k]*c[j][k];cov[i][j]=s/(n-1);}}
  let det;if(m===2)det=(cov[0][0]*cov[1][1]-cov[0][1]*cov[1][0]).toFixed(4);
  else if(m===3){const[a,b,c1]=cov[0],[d,e,f]=cov[1],[g1,h,i]=cov[2];det=(a*(e*i-f*h)-b*(d*i-f*g1)+c1*(d*h-e*g1)).toFixed(4);}
  else det="⚠️ Error: Solo se puede calcular con 3 componentes";
  const tr=cov.map((_,i)=>cov[i][i]).reduce((a,b)=>a+b,0);
  return`Matriz:\n${cov.map(r=>r.map(v=>v.toFixed(4)).join(" ")).join("\n")}\nSuma varianzas:${tr.toFixed(4)}\nDeterminante:${det}`;
}

// LISTA DE EJEMPLOS
function cargarEjemplo(tipo){
  const datos = document.getElementById("datos");
  const metodo = document.getElementById("metodo");
  const salida = document.getElementById("resultado");

  switch(tipo){
    case "media":
      metodo.value = "media";
      datos.value = "72,75,78,80,82,85,88,90,91,93,95,96,97,98,99,100,92,85,83,77";
      salida.textContent = "Ejemplo: Promedios de 20 estudiantes en un examen final de matemáticas.\nSe usa para calcular la nota media general del grupo.";
      break;

    case "mediana":
      metodo.value = "mediana";
      datos.value = "105,110,115,120,125,130,132,134,136,138,140,142,144,146,148,150,152,154,156,158,160";
      salida.textContent = "Ejemplo: Ingresos semanales (en dólares) de 21 trabajadores de una empresa.\nPermite encontrar el ingreso central.";
      break;

    case "moda":
      metodo.value = "moda";
      datos.value = "5,6,6,7,8,9,9,9,10,10,10,10,11,12,12,12,13,13,14,15,15,15,15,16";
      salida.textContent = "Ejemplo: Número de horas diarias que 24 empleados dedican al trabajo remoto.\nLa moda revela la jornada más común.";
      break;

    case "varianza":
      metodo.value = "varianza";
      datos.value = "18,19,21,22,24,25,25,26,28,28,29,30,30,31,33,35,36,37,38,40";
      salida.textContent = "Ejemplo: Temperaturas diarias (°C) durante 20 días en una ciudad.\nMide qué tanto fluctúan las temperaturas respecto al promedio.";
      break;

    case "desviacion":
      metodo.value = "desviacion";
      datos.value = "10,12,15,16,18,20,22,25,27,28,29,30,32,33,35,36,37,38,39,40,42,43,45,46,47,48,49,50";
      salida.textContent = "Ejemplo: Pesos (kg) de 28 personas en un gimnasio.\nIndica cuánta variabilidad hay en el peso respecto al promedio.";
      break;

    case "anova":
      metodo.value = "anova";
      datos.value = "58,60,62,63,65,67,69,70,72,74,75,77,79,80,81; 65,68,70,72,74,76,77,78,80,82,84,86,87,89,91; 55,57,59,60,62,63,65,67,69,70,72,74,75,77,79";
      salida.textContent = "Ejemplo: Tres grupos de estudiantes, cada uno usando un método distinto de estudio (lectura, videos, ejercicios).\nANOVA analiza si las medias difieren significativamente.";
      break;

    case "chi2":
      metodo.value = "chi2";
      datos.value = "45,30,25,20; 35,25,30,10; 40,20,35,15";
      salida.textContent = "Ejemplo: Preferencias de 90 personas entre cuatro sabores de helado (chocolate, vainilla, fresa, menta) y tres rangos de edad (niños, jóvenes, adultos).\nEvalúa si la preferencia depende de la edad.";
      break;

    case "correlacion":
      metodo.value = "correlacion";
      datos.value = "1,2,3,4,5,6,7,8,9,10,0,9,6,7,8,9,10,8,8,9; 5,7,9,11,12,13,15,16,18,20,21,23,24,25,27,28,30,31,33,35";
      salida.textContent = "Ejemplo: Horas de estudio (X) vs calificación obtenida (Y) de 20 alumnos.\nMide la relación lineal entre ambas variables.";
      break;

    case "pca2":
      metodo.value = "pca";
      datos.value = "5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100; 4,9,13,19,22,28,33,39,41,49,55,61,67,73,79,82,89,93,98,103";
      salida.textContent = "Ejemplo: Dos variables relacionadas (ingreso mensual y gasto mensual) en 20 hogares.\nPCA 2D muestra la correlación entre ambas.";
      break;

    case "pca3":
      metodo.value = "pca";
      datos.value = "5,10,15,20,25,30,35,40,45,50; 2,4,6,8,10,12,14,16,18,20; 50,48,46,44,42,40,38,36,34,32";
      salida.textContent = "Ejemplo: Tres variables (altura, peso y edad) de 10 personas.\nLa gráfica 3D visualiza la relación entre las tres.";
      break;
  }

  salida.className = baseResultado() + " text-blue-700 bg-blue-100 border-blue-300";
}

// === DESCARGAR RESULTADOS COMO TXT ===
document.getElementById("btnDescargarResultados").addEventListener("click", () => {
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
});

// DESCARGAR GRAFICA COMO PNG
document.getElementById("btnDescargarGrafica").addEventListener("click", () => {
  const canvas2d = document.getElementById("grafica");
  const graf3d = document.getElementById("grafica3d");

  // Si es grafica 2D (Chart.js)
  if (canvas2d.style.display !== "none" && grafica) {
    const enlace = document.createElement("a");
    enlace.download = "grafica_estadistica.png";
    enlace.href = canvas2d.toDataURL("image/png");
    enlace.click();
  }
  // Si es grafica 3D (Plotly)
  else if (graf3d.style.display !== "none") {
    Plotly.downloadImage(graf3d, {
      format: "png",
      filename: "grafica_estadistica_3D",
      width: 1000,
      height: 800
    });
  } else {
    alert("No hay gráfica disponible para descargar.");
  }
});
