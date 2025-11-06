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
      case "varianza": res = varianza(grupos[0]); graficarBasico(grupos[0], "Varianza"); break;
      case "desviacion": res = desviacion(grupos[0]); graficarBasico(grupos[0], "Desviación estándar"); break;
      case "rango": res = rango(grupos[0]); graficarBasico(grupos[0], "Rango"); break;
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
    case "rango":
      if (n > 1) return "Este método solo admite 1 lista de datos.";
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
const rango = arr => (Math.max(...arr)-Math.min(...arr)).toFixed(4);

// GRAFICAS
function graficarBasico(datos,titulo){
  const ctx=document.getElementById("grafica").getContext("2d");
  grafica=new Chart(ctx,{type:"bar",data:{labels:datos.map((_,i)=>`Dato ${i+1}`),datasets:[{label:titulo,data:datos,backgroundColor:"#1d4ed8"}]},options:{scales:{y:{beginAtZero:true}}}});
}
function graficarAnova(txt){
  const grupos=txt.split(";").map(parseLista);
  const ctx=document.getElementById("grafica").getContext("2d");
  grafica=new Chart(ctx,{type:"bar",data:{labels:grupos.map((_,i)=>`Grupo ${i+1}`),datasets:[{label:"Media de cada grupo",data:grupos.map(g=>parseFloat(media(g))),backgroundColor:"#0ea5e9"}]}});
}
function graficarChi2(txt){
  const filas=txt.split(";").map(parseLista);
  const ctx=document.getElementById("grafica").getContext("2d");
  grafica=new Chart(ctx,{type:"bar",data:{labels:filas[0].map((_,i)=>`Col ${i+1}`),datasets:filas.map((f,i)=>({label:`Fila ${i+1}`,data:f,backgroundColor:i%2?"#06b6d4":"#0ea5e9"}))}});
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
  const datos=document.getElementById("datos");
  const metodo=document.getElementById("metodo");
  switch(tipo){
    case "media":metodo.value="media";datos.value="12, 15, 18, 21, 24, 27";break;
    case "anova":metodo.value="anova";datos.value="8,9,6,7; 10,11,12,13; 14,13,15,16";break;
    case "chi2":metodo.value="chi2";datos.value="10,20; 15,25";break;
    case "correlacion":metodo.value="correlacion";datos.value="10,20,30,40,50; 8,22,28,39,52";break;
    case "pca2":metodo.value="pca";datos.value="5,10,25,30; 3,6,9,12";break;
    case "pca3":metodo.value="pca";datos.value="5,10,25,30; 3,6,9,12; 8,4,2,1";break;
  }
  document.getElementById("resultado").textContent="Ejemplo cargado. Presiona Calcular.";
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
