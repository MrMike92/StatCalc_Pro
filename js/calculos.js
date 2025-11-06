// Todas las operaciones estadísticas.

import { parseLista } from "./utils.js";

export const media = arr => (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(4);
export const mediana = arr => { arr.sort((a,b)=>a-b); const m=Math.floor(arr.length/2); return arr.length%2?arr[m]:((arr[m-1]+arr[m])/2).toFixed(4); };
export const moda = arr => { const f={}; arr.forEach(x=>f[x]=(f[x]||0)+1); const max=Math.max(...Object.values(f)); return Object.keys(f).filter(k=>f[k]===max).join(", "); };
export const varianza = arr => { const m=arr.reduce((a,b)=>a+b,0)/arr.length; return (arr.reduce((a,b)=>a+Math.pow(b-m,2),0)/arr.length).toFixed(4); };
export const desviacion = arr => Math.sqrt(varianza(arr)).toFixed(4);

export function anova(txt){
  const g=txt.split(";").map(parseLista);
  const k=g.length;
  const n=g.reduce((a,b)=>a+b.length,0);
  const mg=g.flat().reduce((a,b)=>a+b,0)/n;
  const ssb=g.reduce((s,x)=>s+x.length*Math.pow(media(x)-mg,2),0);
  const ssw=g.reduce((s,x)=>s+x.reduce((q,v)=>q+Math.pow(v-media(x),2),0),0);
  const glb=k-1,glw=n-k,msb=ssb/glb,msw=ssw/glw,f=msb/msw;
  return`SSB=${ssb.toFixed(4)}\nSSW=${ssw.toFixed(4)}\nF=${f.toFixed(4)}`;
}

export function chiCuadrado(txt){
  const filas=txt.split(";").map(parseLista);
  const total=filas.flat().reduce((a,b)=>a+b,0);
  const sumF=filas.map(f=>f.reduce((a,b)=>a+b,0));
  const sumC=filas[0].map((_,j)=>filas.reduce((a,f)=>a+f[j],0));
  let chi2=0;
  for(let i=0;i<filas.length;i++){
    for(let j=0;j<filas[i].length;j++){
      const e=(sumF[i]*sumC[j])/total;
      chi2+=Math.pow(filas[i][j]-e,2)/e;
    }
  }
  const gl=(filas.length-1)*(filas[0].length-1);
  return`Chi²=${chi2.toFixed(4)}\nGl=${gl}`;
}

export function correlacion(txt){
  const[x,y]=txt.split(";").map(parseLista);
  const n=x.length,mx=x.reduce((a,b)=>a+b,0)/n,my=y.reduce((a,b)=>a+b,0)/n;
  const num=x.map((xi,i)=>(xi-mx)*(y[i]-my)).reduce((a,b)=>a+b,0);
  const den=Math.sqrt(x.reduce((a,b)=>a+Math.pow(b-mx,2),0)*y.reduce((a,b)=>a+Math.pow(b-my,2),0));
  const r=num/den;
  return`r=${r.toFixed(4)}`;
}

export function pca(txt){
  const g=txt.split(";").map(parseLista);
  const m=g.length,n=g[0].length;
  if(!g.every(x=>x.length===n))return"⚠️ Error: todas las variables deben tener el mismo número de observaciones.";
  const med=g.map(a=>a.reduce((p,q)=>p+q,0)/n);
  const c=g.map((a,i)=>a.map(x=>x-med[i]));
  const cov=Array.from({length:m},()=>Array(m).fill(0));
  for(let i=0;i<m;i++){for(let j=0;j<m;j++){let s=0;for(let k=0;k<n;k++)s+=c[i][k]*c[j][k];cov[i][j]=s/(n-1);}}
  let det;
  if(m===2)det=(cov[0][0]*cov[1][1]-cov[0][1]*cov[1][0]).toFixed(4);
  else if(m===3){const[a,b,c1]=cov[0],[d,e,f]=cov[1],[g1,h,i]=cov[2];det=(a*(e*i-f*h)-b*(d*i-f*g1)+c1*(d*h-e*g1)).toFixed(4);}
  else det="⚠️ Error: Solo se puede calcular con 3 componentes";
  const tr=cov.map((_,i)=>cov[i][i]).reduce((a,b)=>a+b,0);
  return`Matriz:\n${cov.map(r=>r.map(v=>v.toFixed(4)).join(" ")).join("\n")}\nSuma varianzas:${tr.toFixed(4)}\nDeterminante:${det}`;
}