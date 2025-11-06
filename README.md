# StatCalc Pro

Es una calculadora estadística interactiva desarrollada en **JavaScript**, **HTML5** y **TailwindCSS**, diseñada para el aprendizaje visual de métodos estadísticos clásicos. Permite calcular medidas de tendencia central, dispersión, correlación, ANOVA, Chi-cuadrado y análisis de componentes principales (PCA) con generación automática de gráficas 2D y 3D.

## Características principales

- Cálculo de **media**, **mediana**, **moda**, **varianza** y **desviación estándar**  
- Métodos avanzados: **ANOVA**, **Chi-cuadrado**, **Correlación (Pearson)** y **PCA (2D / 3D)**  
- **Visualizaciones interactivas** con Chart.js y Plotly  
- **Ejemplos prácticos pre-cargados** con contexto educativo  
- **Descarga de resultados** en `.txt` y **descarga de gráficas** en `.png`  
- Validación automática de los datos según el método seleccionado

## Estructura del proyecto
```
StatCalc_Pro/
├── index.html # Interfaz principal de la aplicación
├── css/
│ └── style.css # Estilos personalizados con TailwindCSS
├── js/
│ ├── main.js # Controlador principal y eventos
│ ├── utils.js # Funciones generales y validaciones
│ ├── calculos.js # Implementación de cálculos estadísticos
│ ├── graficas.js # Generación de gráficas 2D y 3D
│ ├── ejemplos.js # Datos y textos de ejemplos prácticos
│ └── img/ # Iconos y logo
├── README.md
└── LICENSE
```

## Tecnologías utilizadas

| Tecnología | Uso principal |
|-------------|----------------|
| **HTML5 + TailwindCSS** | Estructura y diseño responsivo |
| **JavaScript (ES6 modules)** | Lógica y control de eventos |
| **Chart.js** | Gráficas 2D (barras, dispersión, líneas) |
| **Plotly.js** | Gráficas 3D y boxplots interactivos |
| **Blob API** | Descarga de resultados en texto |
| **FileSaver / Canvas API** | Exportación de imágenes de las gráficas |

## Métodos estadísticos incluidos

| Método | Descripción | Tipo de gráfico |
|--------|--------------|----------------|
| **Media** | Promedio de un conjunto de datos. | Barra con línea de referencia. |
| **Mediana** | Valor central en los datos ordenados. | Barra con línea de mediana. |
| **Moda** | Valor más frecuente. | Barra con marca de moda. |
| **Varianza** | Dispersión respecto a la media. | Dispersión con líneas verticales. |
| **Desviación estándar** | Cuantifica la variabilidad de los datos. | Banda sombreada ±1σ. |
| **ANOVA** | Compara medias de múltiples grupos. | Boxplot por grupo. |
| **Chi-cuadrado** | Evalúa relación entre variables categóricas. | Barras apiladas. |
| **Correlación (Pearson)** | Relación lineal entre dos variables. | Dispersión con línea de tendencia. |
| **PCA (2D/3D)** | Reduce dimensionalidad y visualiza relaciones. | Dispersión 2D o 3D. |

## Flujo general
<image src="flujo_general.svg" alt="Flujo general de StatCalc Pro">

## Uso

1. Abre `index.html` en tu navegador.  
2. Introduce los datos en el campo de texto:  
   - Ejemplo de un grupo:  
     ```
     10, 15, 20, 25, 30
     ```
   - Ejemplo con varios grupos (ANOVA, Chi², Correlación, PCA):  
     ```
     8,9,6,7; 10,11,12,13; 14,13,15,16
     ```
3. Selecciona el método estadístico.  
4. Presiona **Calcular**.  
5. Observa el resultado numérico y la gráfica generada.  
6. (Opcional) Usa los botones para **descargar los resultados** o la **gráfica**.

También puedes usar el panel lateral para **cargar ejemplos prácticos**.

---

Este proyecto se distribuye bajo la Licencia MIT. Puedes usarlo, modificarlo y compartirlo libremente, siempre que se mantenga la atribución correspondiente. Consulta el archivo LICENSE para obtener más detalles.

Si deseas contribuir a este proyecto, puedes enviar solicitudes de extracción (pull requests) con mejoras o características adicionales y si tienes alguna pregunta o problema, puedes contactarme a través de mi perfil de GitHub MrMike92.

2025 | MrMike92 🐢