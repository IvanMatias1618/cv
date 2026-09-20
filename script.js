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
   5. App de Proyectos (Visor con <iframe> interactivo)
   ------------------------------------------------------------------------------ */
const projectsData = {
  mediaweb: {
    name: 'Mediaweb',
    tag: 'Multimedia & Audio Web',
    src: 'programs/Mediaweb/index.html',
    github: 'https://github.com/IvanMatias1618/Mediaweb',
    desc: 'Aplicación web interactiva con reproductor musical, galería y minijuego embebido.'
  },
  chess: {
    name: 'Chess',
    tag: 'Juego de Ajedrez JS',
    src: 'programs/chess/index.html',
    github: 'https://github.com/IvanMatias1618/chess',
    desc: 'Implementación lógica del juego de ajedrez con renderizado de casillas y turnos.'
  },
  manual: {
    name: 'Manual Técnico PC',
    tag: 'Operaciones & Control Industrial',
    src: 'programs/Manual-tecnico_PC/index.html',
    github: 'https://github.com/IvanMatias1618/Manual-tecnico_PC',
    desc: 'Documentación técnica interactiva para soporte en hardware, E-Box, calibración y máquinas de juego.'
  }
};

function initProjectsApp() {
  const navItems = document.querySelectorAll('.project-nav-item');
  const iframe = document.getElementById('project-frame');
  const titleEl = document.getElementById('project-current-name');
  const tagEl = document.getElementById('project-current-tag');
  const openExternalBtn = document.getElementById('project-btn-external');
  const githubBtn = document.getElementById('project-btn-github');
  const reloadBtn = document.getElementById('project-btn-reload');

  function loadProject(key) {
    const proj = projectsData[key];
    if (!proj) return;

    navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.project === key);
    });

    if (titleEl) titleEl.textContent = proj.name;
    if (tagEl) tagEl.textContent = proj.tag;
    if (iframe) iframe.src = proj.src;
    if (openExternalBtn) openExternalBtn.href = proj.src;
    if (githubBtn) githubBtn.href = proj.github;
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      loadProject(item.dataset.project);
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

  // Cargar el primer proyecto por defecto
  loadProject('mediaweb');
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
