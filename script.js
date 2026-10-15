/**
 * ==============================================================================
 * Módulo 4 & Aplicaciones: script.js
 * Orquestador global del sistema, reloj, lanzadores de apps,
 * lógica de pestañas de CV, proyectos con iframe y bloc de notas.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gestor de ventanas
  window.wm.init();

  // Inicializar reloj
  initClock();

  // Inicializar Menú de Inicio
  initStartMenu();

  // Inicializar Iconos del Escritorio
  initDesktopIcons();

  // Inicializar App de CV
  initCvApp();

  // Inicializar App de Proyectos
  initProjectsApp();

  // Inicializar App de Juegos Arcade
  initGamesApp();

  // Inicializar Explorador sys-files/
  initSysfilesApp();

  // Inicializar Modal Lightbox
  initLightbox();

  // Inicializar App de Bloc de Notas
  initNotepadApp();

  // Inicializar Efecto de Apagado CRT
  initShutdownEffect();

  // Abrir por defecto la ventana del CV para que el reclutador/visitante vea el contenido de inmediato
  setTimeout(() => {
    if (window.innerWidth <= 768) {
      window.wm.openWindow('win-cv');
    } else {
      window.wm.openWindow('win-cv', { top: 40, left: 140, width: 880, height: 600 });
    }
  }, 400);
});

/* ------------------------------------------------------------------------------
   1. Reloj del Sistema
   ------------------------------------------------------------------------------ */
function initClock() {
  const timeEl = document.getElementById('tray-time');
  const dateEl = document.getElementById('tray-date');

  function updateClock() {
    const now = new Date();
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('es-MX', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ------------------------------------------------------------------------------
   2. Menú de Inicio
   ------------------------------------------------------------------------------ */
function initStartMenu() {
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');

  if (!startBtn || !startMenu) return;

  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = startMenu.classList.contains('open');
    if (isOpen) {
      startMenu.classList.remove('open');
      startBtn.classList.remove('active');
    } else {
      startMenu.classList.add('open');
      startBtn.classList.add('active');
    }
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('pointerdown', (e) => {
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
      startMenu.classList.remove('open');
      startBtn.classList.remove('active');
    }
  });

  // Enlaces de apps dentro del menú de inicio
  document.querySelectorAll('.start-item[data-open-win]').forEach((item) => {
    item.addEventListener('click', () => {
      const winId = item.dataset.openWin;
      const tab = item.dataset.cvTab;
      if (tab) {
        switchCvTab(tab);
      }
      window.wm.openWindow(winId);
      startMenu.classList.remove('open');
      startBtn.classList.remove('active');
    });
  });

  // Enlaces directos a PDFs en el menú de inicio
  document.querySelectorAll('.start-item[data-open-pdf]').forEach((item) => {
    item.addEventListener('click', () => {
      const pdfUrl = item.dataset.openPdf;
      const pdfTitle = item.dataset.pdfTitle || 'Documento PDF';
      window.wm.openPdfViewer(pdfUrl, pdfTitle);
      startMenu.classList.remove('open');
      startBtn.classList.remove('active');
    });
  });
}

/* ------------------------------------------------------------------------------
   3. Iconos del Escritorio (Click y Doble Clic / Touch)
   ------------------------------------------------------------------------------ */
function initDesktopIcons() {
  const icons = document.querySelectorAll('.desktop-icon');
  let lastClickTime = 0;
  let lastClickedIcon = null;

  icons.forEach((icon) => {
    // Selección visual
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      icons.forEach((i) => i.classList.remove('selected'));
      icon.classList.add('selected');

      const currentTime = new Date().getTime();
      const isDoubleClick = lastClickedIcon === icon && currentTime - lastClickTime < 350;

      // En móviles o pantallas táctiles permitimos click directo, en desktop doble click
      const isMobileDevice = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;

      if (isDoubleClick || isMobileDevice) {
        launchIconAction(icon);
      }

      lastClickTime = currentTime;
      lastClickedIcon = icon;
    });

    // Doble clic nativo de mouse para escritorio
    icon.addEventListener('dblclick', () => {
      launchIconAction(icon);
    });
  });

  // Deseleccionar al hacer click en el escritorio
  document.getElementById('desktop')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('desktop') || e.target.id === 'desktop-icons') {
      icons.forEach((i) => i.classList.remove('selected'));
    }
  });
}

function launchIconAction(icon) {
  const action = icon.dataset.action;
  const targetWin = icon.dataset.window;
  const pdfUrl = icon.dataset.pdf;
  const pdfTitle = icon.dataset.pdfTitle;
  const cvTab = icon.dataset.cvTab;

  if (action === 'open-pdf' && pdfUrl) {
    window.wm.openPdfViewer(pdfUrl, pdfTitle);
  } else if (action === 'open-cv-tab' && cvTab) {
    switchCvTab(cvTab);
    window.wm.openWindow('win-cv');
  } else if (targetWin) {
    window.wm.openWindow(targetWin);
  }
}

/* ------------------------------------------------------------------------------
   4. App de Currículums (Pestañas y Acciones)
   ------------------------------------------------------------------------------ */
function initCvApp() {
  const tabBtns = document.querySelectorAll('.cv-tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      switchCvTab(tabName);
    });
  });

  // Botón para imprimir / exportar
  document.getElementById('btn-print-cv')?.addEventListener('click', () => {
    window.print();
  });

  // Botones para abrir PDF desde el CV interactivo
  document.getElementById('btn-view-pdf-tecnico')?.addEventListener('click', () => {
    window.wm.openPdfViewer('cvs/tecnicio%20en%20sistemas.pdf', 'CV - Técnico en Sistemas.pdf');
  });

  document.getElementById('btn-view-pdf-sysadmin')?.addEventListener('click', () => {
    window.wm.openPdfViewer('cvs/sys-admin.pdf', 'CV - Sys Admin.pdf');
  });

  document.getElementById('btn-view-pdf-rust')?.addEventListener('click', () => {
    window.wm.openPdfViewer('cvs/dev.pdf', 'CV - Backend Developer Rust.pdf');
  });
}

function switchCvTab(tabName) {
  const tabBtns = document.querySelectorAll('.cv-tab-btn');
  const panels = document.querySelectorAll('.cv-profile-panel');

  tabBtns.forEach((b) => {
    b.classList.remove('active');
    if (b.dataset.tab === tabName) {
      b.classList.add('active');
    }
  });

  panels.forEach((p) => {
    p.classList.remove('active');
    if (p.id === `panel-${tabName}`) {
      p.classList.add('active');
    }
  });
}

/* ------------------------------------------------------------------------------
   5. App de Proyectos (Full-Stack Showcase con Multimedia e iFrames)
   ------------------------------------------------------------------------------ */
const projectsData = {
  marketplace: {
    type: 'showcase',
    name: 'Marketplace & Gestor Modular',
    tag: 'Rust (Axum) • React • PostgreSQL • JWT',
    desc: 'Plataforma full-stack de comercio electrónico, gestión de negocios y arquitectura modular. El backend está construido en Rust utilizando Axum, Tokio runtime, SQLx sobre PostgreSQL, validaciones con bcrypt, autenticación mediante tokens JWT y tipos compartidos con ts-rs. El frontend en React, TypeScript y Vite ofrece un entorno interactivo y conversacional con módulos de negocio dinámicos.',
    repos: [
      { label: '🐙 Backend en Rust (finit)', url: 'https://github.com/IvanMatias1618/finit' },
      { label: '🐙 Frontend en React (okupo)', url: 'https://github.com/IvanMatias1618/okupo' }
    ],
    techStack: ['Rust 2024', 'Axum 0.8', 'Tokio Async', 'PostgreSQL', 'SQLx', 'JWT Auth', 'bcrypt', 'ts-rs', 'Tower HTTP / CORS', 'React', 'TypeScript', 'Vite'],
    architecture: {
      backend: 'Estructurado en capas de Dominio, Repositorios (Bussines, Collaborator, User) y Aplicación con enrutadores declarativos en Axum. Pool de conexiones asíncrono con PostgreSQL.',
      frontend: 'Interfaz con selector de módulos, gestión de estado de salud del backend en vivo (Health Checks) y sesión con JWT guardada de forma segura.'
    },
    images: [
      {
        src: 'marketplace/login.png',
        title: 'Inicio de Sesión de Usuarios',
        desc: 'Verificación de conectividad en vivo con el servidor Rust y login con JWT.'
      },
      {
        src: 'marketplace/registro.png',
        title: 'Registro de Negocios y Comercios',
        desc: 'Alta de perfiles y usuarios con almacenamiento seguro y encriptación de contraseñas.'
      },
      {
        src: 'marketplace/modulos.png',
        title: 'Selección Modular del Sistema',
        desc: 'Arquitectura escalable para habilitar módulos de catálogo, inventario y gestión.'
      },
      {
        src: 'marketplace/gestor.png',
        title: 'Panel del Gestor de Negocios',
        desc: 'Consola administrativa para supervisión de sucursales, colaboradores y permisos.'
      },
      {
        src: 'marketplace/loged.png',
        title: 'Dashboard de Sesión Activa',
        desc: 'Entorno de trabajo con sesión validada e interacción conversacional.'
      }
    ]
  },
  inventario: {
    type: 'showcase',
    name: 'Sistema de Inventario & Recetas',
    tag: 'Rust (Actix-web) • TypeScript • REST API',
    desc: 'Sistema de software full-stack diseñado para el control de inventario de materias primas, formulación de recetas y cálculo de mermas y costos para el sector gastronómico (cafeterías y restaurantes). Backend reactivo desarrollado en Rust con Actix-web, CORS y endpoints REST de alta velocidad, integrado a un frontend reactivo en TypeScript y Vite.',
    repos: [
      { label: '🐙 Backend en Rust (sis-inventario-rust)', url: 'https://github.com/IvanMatias1618/sis-inventario-rust' },
      { label: '🐙 Frontend en TypeScript (inventario-front)', url: 'https://github.com/IvanMatias1618/inventario-front' }
    ],
    techStack: ['Rust', 'Actix-web', 'TypeScript', 'REST API', 'CORS Middleware', 'Vite', 'HTML5 WebM Video', 'Modelado Relacional'],
    architecture: {
      backend: 'Servidor HTTP concurrente en Rust con Actix-web. Control estricto de CORS para permitir conexiones desde clientes locales o LAN, endpoints REST para gestión de insumos y recetas.',
      frontend: 'Aplicación en TypeScript para el registro rápido de existencias, cálculo automático de precios en recetas y listado de materias primas.'
    },
    video: {
      src: 'inventario/Video.webm',
      title: 'Demostración en Video del Flujo Completo',
      desc: 'Grabación de pantalla del sistema en operación: alta de ingredientes, estructuración de recetas y sincronización cliente-servidor.'
    },
    images: [
      {
        src: 'inventario/Crear receta.png',
        title: 'Creación y Formulación de Recetas',
        desc: 'Formulario para composición de platillos y bebidas con insumos calculados.'
      },
      {
        src: 'inventario/insumos.png',
        title: 'Catálogo de Insumos & Existencias',
        desc: 'Listado de materia prima con unidades de medida, stock disponible y precios unitarios.'
      },
      {
        src: 'inventario/recetas.png',
        title: 'Listado General de Recetas',
        desc: 'Resumen de recetas activas registradas en la base de datos con rendimientos.'
      },
      {
        src: 'inventario/codigo.png',
        title: 'Código Fuente & Estructura',
        desc: 'Modelado en Rust y frontend modular en TypeScript para fácil mantenimiento.'
      }
    ]
  },
  mediaweb: {
    type: 'iframe',
    name: 'Mediaweb',
    tag: 'Multimedia & Audio Web',
    src: 'programs/Mediaweb/index.html',
    github: 'https://github.com/IvanMatias1618/Mediaweb',
    desc: 'Aplicación web interactiva con reproductor musical, galería visual, efectos dinámicos y minijuego embebido.'
  },
  manual: {
    type: 'iframe',
    name: 'Manual Técnico PC',
    tag: 'Operaciones & Control Industrial',
    src: 'programs/Manual-tecnico_PC/index.html',
    github: 'https://github.com/IvanMatias1618/Manual-tecnico_PC',
    desc: 'Documentación técnica interactiva para soporte en hardware, gabinetes E-Box, calibración de touchscreens y plataformas de casino.'
  }
};

function initProjectsApp() {
  const navItems = document.querySelectorAll('.project-nav-item');
  const frameBox = document.getElementById('project-frame-box');
  const iframe = document.getElementById('project-frame');
  const showcaseBox = document.getElementById('project-showcase-box');
  const titleEl = document.getElementById('project-current-name');
  const tagEl = document.getElementById('project-current-tag');
  const actionsContainer = document.getElementById('project-toolbar-actions');

  function renderShowcase(proj) {
    if (!showcaseBox) return;

    let html = `
      <div class="project-showcase-hero">
        <div class="project-showcase-title">
          <span>${proj.name}</span>
        </div>
        <p class="project-showcase-desc">${proj.desc}</p>
        
        <div class="project-tech-pills">
          ${(proj.techStack || []).map(t => {
            const isRust = t.toLowerCase().includes('rust');
            const isGreen = t.toLowerCase().includes('postgres') || t.toLowerCase().includes('react');
            return `<span class="tech-pill ${isRust ? 'rust' : isGreen ? 'green' : ''}">${t}</span>`;
          }).join('')}
        </div>

        <div class="project-repos-row">
          ${(proj.repos || []).map(r => `
            <a href="${r.url}" target="_blank" rel="noopener" class="btn-cv-action primary">
              ${r.label}
            </a>
          `).join('')}
        </div>
      </div>
    `;

    // Sección de video si existe
    if (proj.video) {
      html += `
        <div class="project-section">
          <div class="project-section-title">
            <span>🎥 Video Demostrativo en Operación</span>
          </div>
          <div class="project-video-card">
            <div class="project-video-wrapper">
              <video class="project-video" controls preload="metadata">
                <source src="${proj.video.src}" type="video/webm">
                Tu navegador no soporta reproducción directa de video WebM.
              </video>
            </div>
            <div class="project-video-meta">
              <strong>${proj.video.title}</strong>
              <span>${proj.video.desc}</span>
            </div>
          </div>
        </div>
      `;
    }

    // Galería de imágenes
    if (proj.images && proj.images.length > 0) {
      html += `
        <div class="project-section">
          <div class="project-section-title">
            <span>📸 Capturas de Pantalla & Flujo del Sistema (Clic para ampliar)</span>
          </div>
          <div class="project-gallery-grid">
            ${proj.images.map(img => `
              <div class="project-gallery-card" data-img-zoom="${img.src}" data-img-title="${img.title} — ${img.desc}">
                <div class="project-gallery-img-box">
                  <img src="${img.src}" alt="${img.title}" loading="lazy">
                </div>
                <div class="project-gallery-caption">
                  <strong>${img.title}</strong>
                  <span>${img.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    showcaseBox.innerHTML = html;

    // Vincular lightbox a las tarjetas de galería
    showcaseBox.querySelectorAll('.project-gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        const src = card.dataset.imgZoom;
        const cap = card.dataset.imgTitle;
        if (window.openImageLightbox) {
          window.openImageLightbox(src, cap);
        }
      });
    });
  }

  function loadProject(key) {
    const proj = projectsData[key];
    if (!proj) return;

    navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.project === key);
    });

    if (titleEl) titleEl.textContent = proj.name;
    if (tagEl) tagEl.textContent = proj.tag;

    // Limpiar acciones de la toolbar
    if (actionsContainer) {
      actionsContainer.innerHTML = '';

      if (proj.type === 'iframe') {
        const reloadBtn = document.createElement('button');
        reloadBtn.className = 'btn-cv-action';
        reloadBtn.title = 'Recargar';
        reloadBtn.textContent = '🔄';
        reloadBtn.addEventListener('click', () => {
          if (iframe) {
            const s = iframe.src;
            iframe.src = '';
            setTimeout(() => { iframe.src = s; }, 50);
          }
        });

        const ghLink = document.createElement('a');
        ghLink.className = 'btn-cv-action';
        ghLink.href = proj.github;
        ghLink.target = '_blank';
        ghLink.rel = 'noopener';
        ghLink.textContent = '📂 GitHub';

        const extLink = document.createElement('a');
        extLink.className = 'btn-cv-action primary';
        extLink.href = proj.src;
        extLink.target = '_blank';
        extLink.rel = 'noopener';
        extLink.textContent = '🔗 Pantalla Completa';

        actionsContainer.appendChild(reloadBtn);
        actionsContainer.appendChild(ghLink);
        actionsContainer.appendChild(extLink);
      } else if (proj.type === 'showcase' && proj.repos) {
        proj.repos.forEach(r => {
          const rLink = document.createElement('a');
          rLink.className = 'btn-cv-action';
          rLink.href = r.url;
          rLink.target = '_blank';
          rLink.rel = 'noopener';
          rLink.textContent = r.label;
          actionsContainer.appendChild(rLink);
        });
      }
    }

    if (proj.type === 'iframe') {
      if (showcaseBox) showcaseBox.style.display = 'none';
      if (frameBox) frameBox.style.display = 'block';
      if (iframe && iframe.src !== proj.src) {
        iframe.src = proj.src;
      }
    } else {
      if (frameBox) frameBox.style.display = 'none';
      if (iframe) iframe.src = '';
      if (showcaseBox) {
        showcaseBox.style.display = 'flex';
        renderShowcase(proj);
      }
    }
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      loadProject(item.dataset.project);
    });
  });

  // Exponer para cambio programático desde otras ventanas
  window.loadProjectByKey = loadProject;

  // Cargar Marketplace por defecto
  loadProject('marketplace');
}

/* ------------------------------------------------------------------------------
   6. App de Bloc de Notas
   ------------------------------------------------------------------------------ */
const notepadNotes = {
  'hardware-taller.txt': `# BITÁCORA DE TALLER & HARDWARE
==============================================
Fecha de revisión: 2026
Taller: Diagnóstico de sistemas y circuitería

1. MANTENIMIENTO PREVENTIVO & FUENTES ATX:
   - Verificar voltajes en rieles principales:
     * +12V (Tolerancia: ±5% -> 11.4V a 12.6V)
     * +5V  (Tolerancia: ±5% -> 4.75V a 5.25V)
     * +3.3V (Lógica y memoria)
   - Carga de capacitores: Revisar abombamiento o ESR alto.
   - Diagnóstico en gabinetes E-Box y terminales de punto de venta.

2. CIRCUITOS DE CONTROL INDUSTRIAL:
   - Relevadores de 24V DC para aislamiento galvánico de señales.
   - Fusibles rápidos y supresión de transitorios por inductancia en bobinas.
   - Soldadura de precisión: Temperatura ideal del cautín 320°C - 350°C (estaño 60/40).

3. PROYECTO GABINETE i486 DX2:
   - Limpieza de placa madre con alcohol isopropílico.
   - Pila de BIOS tipo Dallas reemplazada con socket CR2032.
   - Arranque exitoso en modo DOS/Linux retro.`,

  'backend-rust.txt': `// APUNTES DE DESARROLLO BACKEND EN RUST
// ============================================
// Enfoque: Rendimiento, seguridad de memoria y concurrencia sin garbage collector.

use tokio::sync::mpsc;
use std::sync::Arc;

// Modelo mental de Ownership & Borrowing:
// - Cada valor tiene exactamente un único dueño.
// - Puede haber múltiples referencias compartidas (&T)
//   O una única referencia mutable (&mut T), nunca ambas al mismo tiempo.
// - Cero data-races en tiempo de compilación.

#[derive(Debug, Clone)]
struct ServerConfig {
    bind_address: String,
    port: u16,
    max_connections: usize,
}

// Arquitectura Backend:
// 1. Frameworks: Axum / Actix-Web con Tokio runtime.
// 2. Base de datos: SQLx (consultas verificadas en tiempo de compilación) o Diesel.
// 3. Serialización: Serde (JSON / Bincode de altísima velocidad).
// 4. Concurrencia: Canales MPSC y tareas asíncronas ligeras.`,

  'filosofia.txt': `NOTAS PERSONALES & FILOSOFÍA DE TALLER
======================================

"Dado que iluminas cualquier lugar: 
quiero que ilumines mi alma, por eso te guardo ahí."

Aprender tecnología desde el fierro hasta el compilador:
- Saber cómo fluye un electrón por un cable de control.
- Entender cómo conmuta un transistor en una compuerta lógica.
- Saber cómo el kernel de Linux programa los hilos.
- Diseñar software en Rust que respete la memoria y los recursos.

La tecnología más valiosa es la que se entrega con alma, 
cuidando cada detalle con paciencia de artesano.`,

  'pendientes.txt': `[x] Organizar visor de proyectos con iframe para GitHub Pages.
[x] Integrar CV de Técnico en Sistemas, SysAdmin y Backend Rust.
[ ] Subir sys-admin.pdf y dev.pdf a la carpeta cvs/.
[ ] Configurar scripts en sys-files/ para automatización de respaldos.
[ ] Restaurar unidad de disquete 3.5 del i486.`
};

function initNotepadApp() {
  const fileItems = document.querySelectorAll('.notepad-file-item');
  const textarea = document.getElementById('notepad-textarea');
  const titleEl = document.getElementById('notepad-filename-display');
  const charsEl = document.getElementById('notepad-char-count');

  function loadNote(filename) {
    fileItems.forEach((f) => {
      f.classList.toggle('active', f.dataset.file === filename);
    });

    const content = notepadNotes[filename] || '';
    if (textarea) textarea.value = content;
    if (titleEl) titleEl.textContent = filename;
    if (charsEl) charsEl.textContent = `${content.length} caracteres`;
  }

  fileItems.forEach((item) => {
    item.addEventListener('click', () => {
      loadNote(item.dataset.file);
    });
  });

  if (textarea && charsEl) {
    textarea.addEventListener('input', () => {
      charsEl.textContent = `${textarea.value.length} caracteres`;
    });
  }

  // Cargar primera nota
  loadNote('hardware-taller.txt');
}

/* ------------------------------------------------------------------------------
   7. Pantalla de Apagado CRT Simulada
   ------------------------------------------------------------------------------ */
function initShutdownEffect() {
  const shutdownBtn = document.getElementById('btn-shutdown');
  const screenOff = document.getElementById('screen-off');
  const powerOnBtn = document.getElementById('btn-power-on');

  if (shutdownBtn && screenOff) {
    shutdownBtn.addEventListener('click', () => {
      document.getElementById('start-menu')?.classList.remove('open');
      document.getElementById('start-btn')?.classList.remove('active');
      screenOff.classList.add('active');
    });
  }

  if (powerOnBtn && screenOff) {
    powerOnBtn.addEventListener('click', () => {
      screenOff.classList.remove('active');
    });
  }
}

/* ------------------------------------------------------------------------------
   8. App de Centro de Juegos Arcade (Little Game Trivia - JSGAME & Chess)
   ------------------------------------------------------------------------------ */
const gamesData = {
  jsgame: {
    name: 'Little Game Trivia (JSGAME)',
    tag: '2D Grid Game • JavaScript',
    src: 'programs/JSGAME/index.html',
    github: 'https://github.com/IvanMatias1618/JSGAME',
    desc: 'Juego interactivo 2D sobre cuadrícula dinámica y sistema de casillas en JavaScript puro y modular.'
  },
  chess: {
    name: 'Chess (Ajedrez)',
    tag: 'Juego de Ajedrez JS',
    src: 'programs/chess/index.html',
    github: 'https://github.com/IvanMatias1618/chess',
    desc: 'Implementación lógica del juego de ajedrez con renderizado de casillas, sprites y control de turnos.'
  }
};

function initGamesApp() {
  const navItems = document.querySelectorAll('.game-nav-item');
  const iframe = document.getElementById('game-frame');
  const titleEl = document.getElementById('game-current-name');
  const tagEl = document.getElementById('game-current-tag');
  const openExternalBtn = document.getElementById('game-btn-external');
  const githubBtn = document.getElementById('game-btn-github');
  const reloadBtn = document.getElementById('game-btn-reload');

  function loadGame(key) {
    const game = gamesData[key];
    if (!game) return;

    navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.game === key);
    });

    if (titleEl) titleEl.textContent = game.name;
    if (tagEl) tagEl.textContent = game.tag;
    if (iframe) iframe.src = game.src;
    if (openExternalBtn) openExternalBtn.href = game.src;
    if (githubBtn) githubBtn.href = game.github;
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      loadGame(item.dataset.game);
    });
  });

  if (reloadBtn && iframe) {
    reloadBtn.addEventListener('click', () => {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 50);
    });
  }

  // Cargar JSGAME por defecto
  loadGame('jsgame');
}

/* ------------------------------------------------------------------------------
   9. Explorador sys-files/ (concepts/, utils/, man/)
   ------------------------------------------------------------------------------ */
const sysfilesContent = {
  'concepts/iptables.md': {
    badge: 'MARKDOWN DOC',
    perm: '-rw-r--r--',
    canRun: false,
    content: `# Conceptos Clave: iptables & Netfilter

\`iptables\` es la herramienta de espacio de usuario para interactuar y configurar las tablas y reglas provistas por el subsistema **Netfilter** del kernel de Linux. Permite implementar firewalls perimetrales, filtrado de paquetes y traducción de direcciones de red (NAT).

---

## 1. Arquitectura: Tablas y Cadenas

Netfilter organiza el flujo de paquetes a través de **Tablas** especializadas, y dentro de cada tabla existen **Cadenas** (Chains) que corresponden a diferentes etapas del ciclo de vida del paquete de red.

### Tablas Principales:
* **\`filter\`** (Por defecto): Filtrado y toma de decisiones sobre permitir o bloquear paquetes.
  - Cadenas: \`INPUT\`, \`FORWARD\`, \`OUTPUT\`.
* **\`nat\`**: Traducción de direcciones y puertos de red (Network Address Translation).
  - Cadenas: \`PREROUTING\`, \`POSTROUTING\`, \`OUTPUT\`.
* **\`mangle\`**: Modificación especializada de cabeceras de paquetes (TOS, TTL, marcas de control de tráfico QoS).
  - Cadenas: \`PREROUTING\`, \`INPUT\`, \`FORWARD\`, \`OUTPUT\`, \`POSTROUTING\`.
* **\`raw\`**: Configuración previa al seguimiento de conexiones (\`conntrack\`), útil para directivas \`NOTRACK\`.

---

## 2. Flujo del Paquete en Netfilter

[Paquete Entrante]
        │
        ▼
   PREROUTING (raw / mangle / nat [DNAT])
        │
        ├─────────────────────────────┐
        ▼ (Destinado al host local)    ▼ (Destinado a otro host)
      INPUT (mangle / filter)       FORWARD (mangle / filter)
        │                             │
        ▼                             │
 [Proceso Local]                      │
        │                             │
        ▼                             │
      OUTPUT (raw / mangle / nat / filter)
        │                             │
        └──────────────┬──────────────┘
                       ▼
                 POSTROUTING (mangle / nat [SNAT/MASQUERADE])
                       │
                       ▼
               [Paquete Saliente]

---

## 3. Comandos Esenciales de Inspección

# Listar todas las reglas de la tabla filter con números de línea y detalle
sudo iptables -L -n -v --line-numbers

# Listar reglas de la tabla NAT
sudo iptables -t nat -L -n -v

# Vaciar (Flush) todas las reglas existentes
sudo iptables -F
sudo iptables -t nat -F
sudo iptables -X

---

## 4. Configuración Segura Estándar (Hardening)

# 1. Establecer políticas por defecto a DROP
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# 2. Permitir tráfico de loopback interno
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT

# 3. Permitir conexiones establecidas y relacionadas (Stateful Inspection)
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 4. Permitir acceso SSH administrativo (puerto 22)
sudo iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -j ACCEPT

# 5. Permitir tráfico web HTTP (80) y HTTPS (443)
sudo iptables -A INPUT -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -m conntrack --ctstate NEW -j ACCEPT

# 6. Permitir ping ICMP entrante con límite para evitar inundación
sudo iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT

---

## 5. NAT y Reenvío de Puertos (Port Forwarding)

# Enmascaramiento para Router / Gateway (SNAT / MASQUERADE)
sudo iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j MASQUERADE

# Port Forwarding (DNAT de puerto 8080 público a 80 interno)
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.50:80
sudo iptables -A FORWARD -p tcp -d 192.168.1.50 --dport 80 -m conntrack --ctstate NEW,ESTABLISHED,RELATED -j ACCEPT`
  },

  'utils/disk-manager.sh': {
    badge: 'BASH SCRIPT',
    perm: '-rwxr-xr-x',
    canRun: true,
    content: `#! /bin/bash

echo "Hola, Gestionare tus discos por ti :)"
echo "Veamos que discos tienes"
lsblk -fp
echo "Ahora veamos Tu fstab"
grep -oP 'UUID=\\K[^ ]+' /etc/fstab
`,
    simulatedOutput: `ivan@workshop:~/cv/sys-files/utils$ ./disk-manager.sh
Hola, Gestionare tus discos por ti :)
Veamos que discos tienes
NAME             FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
/dev/nvme0n1                                                                             
├─/dev/nvme0n1p1 vfat   FAT32 BOOT  1B08-3F12                              480M    52% /boot/efi
└─/dev/nvme0n1p6 btrfs        FEDORA 8b29e2fa-6821-4f12-9c12-32a8e4f1c910  295G     7% /
/dev/sda                                                                                 
└─/dev/sda1      exfat  1.0   Luna   A1B2-C3D4                              910G     3% /run/media/takolopez/Luna
Ahora veamos Tu fstab
8b29e2fa-6821-4f12-9c12-32a8e4f1c910
1B08-3F12
[Proceso terminado exitosamente con código de salida 0]`
  },

  'man/tmux.md': {
    badge: 'MARKDOWN DOC',
    perm: '-rw-r--r--',
    canRun: false,
    content: `# TMUX (Terminal Multiplexer)

## USO ESENCIAL:

### CREAR VENTANA
- ctrl+b c

### CREAR SPLIT (División de panel)
- ctrl+b % [Vertical]
- ctrl+b " [Horizontal]

### Rotar Splits
- ctrl+b Space

### Navegación entre splits
- ctrl+b [h, j, k, l]  (Estilo Vim)
- ctrl+b [Flechas]

### Navegación en ventanas
##### ANTERIOR
- ctrl+b p 

##### SIGUIENTE
- ctrl+b n

##### LISTAR VENTANAS
- ctrl+b w

### SESIONES
- tmux new -s nombre_sesion    # Crear sesión con nombre
- tmux attach -t nombre_sesion # Reconectar a sesión
- ctrl+b d                     # Desacoplar sesión (Detach)`
  }
};

function initSysfilesApp() {
  const fileItems = document.querySelectorAll('.sysfiles-file-item');
  const pathEl = document.getElementById('sysfile-current-path');
  const badgeEl = document.getElementById('sysfile-current-badge');
  const permEl = document.getElementById('sysfile-current-perm');
  const codeEl = document.getElementById('sysfiles-code-view');
  const runBtn = document.getElementById('sysfile-btn-run');
  const copyBtn = document.getElementById('sysfile-btn-copy');
  const termBox = document.getElementById('sysfiles-term-box');
  const termContent = document.getElementById('sysfiles-term-content');
  const termClose = document.getElementById('sysfiles-term-close');

  let currentKey = 'concepts/iptables.md';

  function loadSysfile(key) {
    const file = sysfilesContent[key];
    if (!file) return;
    currentKey = key;

    fileItems.forEach(item => {
      item.classList.toggle('active', item.dataset.sysfile === key);
    });

    if (pathEl) pathEl.textContent = `sys-files/${key}`;
    if (badgeEl) badgeEl.textContent = file.badge;
    if (permEl) permEl.textContent = file.perm;
    if (codeEl) codeEl.textContent = file.content;

    if (runBtn) {
      runBtn.style.display = file.canRun ? 'inline-flex' : 'none';
    }

    if (termBox) {
      termBox.style.display = 'none';
    }
  }

  fileItems.forEach(item => {
    item.addEventListener('click', () => {
      loadSysfile(item.dataset.sysfile);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const file = sysfilesContent[currentKey];
      if (!file || !file.simulatedOutput) return;

      if (termBox && termContent) {
        termBox.style.display = 'block';
        termContent.textContent = 'Ejecutando script en Bash...\n';
        setTimeout(() => {
          termContent.textContent = file.simulatedOutput;
        }, 350);
      }
    });
  }

  if (termClose && termBox) {
    termClose.addEventListener('click', () => {
      termBox.style.display = 'none';
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const file = sysfilesContent[currentKey];
      if (!file) return;

      navigator.clipboard.writeText(file.content).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = '✓ Copiado';
        copyBtn.style.color = '#86efac';
        setTimeout(() => {
          copyBtn.textContent = orig;
          copyBtn.style.color = '';
        }, 1500);
      }).catch(() => {
        // Fallback
      });
    });
  }

  loadSysfile('concepts/iptables.md');
}

/* ------------------------------------------------------------------------------
   10. Modal Lightbox de Imágenes
   ------------------------------------------------------------------------------ */
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  function openLightbox(src, caption) {
    if (!lightbox || !imgEl) return;
    imgEl.src = src;
    if (captionEl) captionEl.textContent = caption || '';
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
  }

  window.openImageLightbox = openLightbox;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
