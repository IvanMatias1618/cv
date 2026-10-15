# ✨ Mediaweb • Álbum Multimedia & Memoria Digital

> *“Nació como un proyecto personal. Más me gustaría migrarlo a un proyecto que permita crear álbumes y media que generen un HTML para enviarse a cualquier tipo de público.”*

**Mediaweb** es un santuario interactivo y poético diseñado para preservar memorias, versos líricos, momentos fotográficos y paisajes sonoros en una experiencia web inmersiva, elegante y libre de dependencias pesadas.

---

## 🌟 Características Principales

- **📸 Galería de Memorias con Visor Inmersivo (Lightbox):**
  - Renderizado dinámico de tarjetas fotográficas con efecto de fondo difuminado de autor (`--imagen-url`).
  - Navegación a pantalla completa con teclado (flechas `←` y `→`, tecla `Esc`), botones de siguiente/anterior y títulos legibles.
  - Filtros por colección: *Reloj de Vida*, *Glitch & Magia*, y vista total.

- **📖 Antología Poética & Lecturas:**
  - Sección interactiva para lectura editorial de las obras:
    - 🐾 *Go Kitty!* (Canto de fuerza, exploración y cariño).
    - 🌅 *Amanece* (Ciclo del alba y renacimiento).
    - 🌙 *Anochece* (Sosiego crepuscular y superación).
    - ✨ *La Razón de Escribir* & Dedicatoria Íntima (*“Dado que iluminas cualquier lugar: quiero que ilumines mi alma, por eso te guardo ahí.”*).

- **🎵 Atmósfera Acústica (Web Audio API):**
  - Generador de ambientes sintetizados sin necesidad de archivos externos:
    - 🎐 **Campanas Etéreas:** notas pentatónicas relajantes en tiempo real.
    - 🌧️ **Lluvia Suave:** generador de ruido rosa filtrado para calma y concentración.
    - 🌌 **Crepúsculo Cálido:** sintetizador de onda dual para meditación y sosiego.
  - Soporte para cargar pistas de audio propias (MP3/WAV/M4A) localmente.
  - Ecualizador visual reactivo con barras animadas.

- **🌗 Selector de Atmósfera Dual:**
  - **Modo Amanecer (Alba):** tonos cálidos lino, rosa suave y dorado.
  - **Modo Anochecer (Crepúsculo):** tonos nocturnos profundos, índigo y lavanda estelar.
  - Guarda la preferencia automáticamente en el navegador.

- **📱 Diseño 100% Responsivo:**
  - Adaptado fluidamente a teléfonos móviles, tablets y monitores de escritorio.
  - Menú de navegación accesible y limpio.

---

## 📂 Estructura del Proyecto

```text
Mediaweb/
├── index.html                 # Experiencia principal interactiva (SPA)
├── estilos.css                # Sistema de diseño, temas y animaciones
├── Go_kitty.html              # Poema individual con estilo editorial
├── Hola.md                    # Nota de bienvenida original
├── notas.txt                  # Texto epistolar y dedicatoria personal
├── README.md                  # Documentación del proyecto
├── duelo/
│   ├── amanece.html           # Poema Amanece individual con paleta diurna
│   ├── anochece.html          # Poema Anochece individual con paleta nocturna
│   └── porque.txt             # Nota íntima de inspiración
├── glitch/                    # Fotografías e instantes espontáneos
├── reloj/                     # Fotografías de momentos cronológicos y entrañables
└── scripts/
    └── inicio.js              # Controlador de galería, visor modal, audio y pestañas
```

---

## 🚀 Cómo Usar y Visualizar

1. **Apertura Directa:**
   Simplemente abre `index.html` con cualquier navegador web moderno (Chrome, Firefox, Safari, Edge). No requiere instalación de paquetes ni servidores adicionales.

2. **Servidor Local (Opcional):**
   Si deseas servirlo localmente mediante Python:
   ```bash
   python3 -m http.server 8000
   ```
   Y abre `http://localhost:8000` en tu navegador.

---

## 💡 Hacia la Generación de Álbumes Personalizados

Para adaptar este proyecto como generador de álbumes para enviar a otras personas:
1. Agrega tus imágenes en las carpetas `reloj/` o `glitch/` (o una carpeta personalizada `fotos/`).
2. Actualiza el arreglo `memorias` en [scripts/inicio.js](file:///run/media/takolopez/Luna/proyectos/Mediaweb/scripts/inicio.js) con las rutas y títulos de tus recuerdos.
3. Personaliza la dedicatoria en [index.html](file:///run/media/takolopez/Luna/proyectos/Mediaweb/index.html) con tu mensaje especial.
4. ¡Empaqueta o sube el proyecto a GitHub Pages, Vercel o Netlify para compartirlo con un simple enlace!
