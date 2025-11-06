// Datos de ejemplo y función cargarEjemplo.

import { baseResultado } from "./utils.js";

export function cargarEjemplo(tipo){
  const datos = document.getElementById("datos");
  const metodo = document.getElementById("metodo");
  const salida = document.getElementById("resultado");

  const ejemplos = {
    media: ["72,75,78,80,82,85,88,90,91,93,95,96,97,98,99,100,92,85,83,77",
      "Ejemplo: Promedios de 20 estudiantes en un examen final de matemáticas.\nSe usa para calcular la nota media general del grupo."],
    mediana: ["1050,1100,1150,1200,1250,1300,1320,1340,1360,1380,1400,1420,1440,1460,1480,1500,1520,1540,1560,1580,1600",
      "Ejemplo: Ingresos semanales de 21 trabajadores de una empresa.\nPermite encontrar el ingreso central."],
    moda: ["5,6,6,7,8,9,9,9,10,10,10,10,11,12,12,12,13,13,14,15,15,15,15,16",
      "Ejemplo: Número de horas diarias que 24 empleados dedican al trabajo remoto.\nLa moda revela la jornada más común."],
    varianza: ["18,19,21,22,24,25,25,26,28,28,29,30,30,31,33,35,36,37,38,40",
      "Ejemplo: Temperaturas diarias (°C) durante 20 días en una ciudad.\nMide qué tanto fluctúan las temperaturas respecto al promedio."],
    desviacion: ["10,12,15,16,18,20,22,25,27,28,29,30,32,33,35,36,37,38,39,40,42,43,45,46,47,48,49,50",
      "Ejemplo: Pesos (kg) de 28 personas en un gimnasio.\nIndica cuánta variabilidad hay en el peso respecto al promedio."],
    anova: ["58,60,62,63,65,67,69,70,72,74,75,77,79,80,81; 65,68,70,72,74,76,77,78,80,82,84,86,87,89,91; 55,57,59,60,62,63,65,67,69,70,72,74,75,77,79",
      "Ejemplo: Tres grupos de estudiantes, cada uno usando un método distinto de estudio (lectura, videos, ejercicios).\nANOVA analiza si las medias difieren significativamente."],
    chi2: ["45,30,25,20; 35,25,30,10; 40,20,35,15",
      "Ejemplo: Preferencias de 90 personas entre cuatro sabores de helado (chocolate, vainilla, fresa, menta) y tres rangos de edad (niños, jóvenes, adultos).\nEvalúa si la preferencia depende de la edad."],
    correlacion: ["5,7,9,11,12,13,15,16,18,20,21,23,24,25,27,28,30,31,33,35; 10,1,3,5,4,6,7,8,7,7,10,9,6,7,8,9,10,8,8,0",
      "Ejemplo: Horas de estudio (X) vs calificación obtenida (Y) de 20 alumnos.\nMide la relación lineal entre ambas variables."],
    pca2: ["5,10,15,20,25,30,35,40,45,50; 4,9,13,19,22,28,33,39,41,49",
      "Ejemplo: Dos variables relacionadas (ingreso mensual y gasto mensual) en 20 hogares.\nPCA 2D muestra la correlación entre ambas."],
    pca3: ["5,10,15,20,25,30,35,40,45,50; 2,4,6,8,10,12,14,16,18,20; 50,48,46,44,42,40,38,36,34,32",
      "Ejemplo: Tres variables (altura, peso y edad) de 10 personas.\nLa gráfica 3D visualiza la relación entre las tres."]
  };

  if (!ejemplos[tipo]) return;

  metodo.value = tipo.startsWith("pca") ? "pca" : tipo;
  datos.value = ejemplos[tipo][0];
  salida.textContent = ejemplos[tipo][1];
  salida.className = baseResultado() + " text-blue-700 bg-blue-100 border-blue-300";
}