/**
 * ==============================================================================
 * Módulo 2: Sistema de Ventanas Flotantes (window-manager.js)
 * Responsabilidad: Motor lógico de simulación de escritorio, arrastre,
 * redimensión, control de capas (Z-Index) y estados de ventanas.
 * ==============================================================================
 */

class WindowManager {
  constructor() {
    this.highestZIndex = 100;
    this.windows = new Map();
    this.taskbarContainer = document.getElementById('taskbar-windows');
    this.cascadeOffset = 0;
  }

  init() {
    const windowElements = document.querySelectorAll('.window');
    windowElements.forEach((winEl) => {
      this.registerWindow(winEl);
    });

    // Event listener global para clics fuera de ventanas
    document.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('.window') && !e.target.closest('#taskbar') && !e.target.closest('#start-menu')) {
        this.deactivateAllWindows();
      }
    });

    // Adaptar dinámicamente si el usuario cambia el tamaño o rota la pantalla
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.windows.forEach((win) => {
          if (win.isOpen && !win.isMaximized) {
            win.element.style.top = '';
            win.element.style.left = '';
            win.element.style.width = '';
            win.element.style.height = '';
          }
        });
      }
    });
  }

  registerWindow(winEl) {
    const winId = winEl.id;
    const header = winEl.querySelector('.window-header');
    const btnMin = winEl.querySelector('.win-min');
    const btnMax = winEl.querySelector('.win-max');
    const btnClose = winEl.querySelector('.win-close');
    const resizeHandle = winEl.querySelector('.window-resize-handle');

    const winData = {
      id: winId,
      element: winEl,
      title: winEl.dataset.title || winEl.querySelector('.window-title span:last-child')?.textContent || 'Ventana',
      iconSvg: winEl.querySelector('.window-title-icon')?.innerHTML || '',
      isMaximized: false,
      isMinimized: false,
      isOpen: !winEl.classList.contains('minimized') && winEl.style.display !== 'none',
      previousRect: null,
      taskbarItem: null
    };

    this.windows.set(winId, winData);

    // Evento de foco al hacer click en cualquier parte de la ventana
    winEl.addEventListener('pointerdown', (e) => {
      // Si el click no fue en un botón de control, traer al frente
      if (!e.target.closest('.win-btn')) {
        this.bringToFront(winId);
      }
    });

    // Drag & drop
    if (header) {
      this.makeDraggable(winEl, header);
    }

    // Resize handle
    if (resizeHandle) {
      this.makeResizable(winEl, resizeHandle);
    }

    // Botones de control
    if (btnMin) {
      btnMin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(winId);
      });
    }

    if (btnMax) {
      btnMax.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize(winId);
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(winId);
      });
    }

    // Doble clic en cabecera para maximizar (solo en desktop)
    if (header) {
      header.addEventListener('dblclick', (e) => {
        if (window.innerWidth <= 768) return;
        if (!e.target.closest('.win-btn')) {
          this.toggleMaximize(winId);
        }
      });
    }
  }

  bringToFront(winId) {
    const win = this.windows.get(winId);
    if (!win) return;

    this.highestZIndex += 1;
    win.element.style.zIndex = this.highestZIndex;

    // Actualizar clase activa en ventanas
    document.querySelectorAll('.window').forEach((w) => w.classList.remove('active'));
    win.element.classList.add('active');

    // Actualizar barra de tareas
    this.updateTaskbarState(winId, 'active');
  }

  deactivateAllWindows() {
    document.querySelectorAll('.window').forEach((w) => w.classList.remove('active'));
    document.querySelectorAll('.taskbar-item').forEach((ti) => ti.classList.remove('active'));
  }

  openWindow(winId, defaultCoords = null) {
    const win = this.windows.get(winId);
    if (!win) return;

    win.isOpen = true;
    win.isMinimized = false;
    win.element.classList.remove('minimized');
    win.element.style.display = 'flex';

    // Si es móvil, limpiar estilos fijos inline para que mande el CSS responsive
    if (window.innerWidth <= 768) {
      win.element.style.top = '';
      win.element.style.left = '';
      win.element.style.width = '';
      win.element.style.height = '';
    } else if (!win.element.style.top || !win.element.style.left) {
      const desktop = document.getElementById('desktop');
      const dWidth = desktop.clientWidth;
      const dHeight = desktop.clientHeight;

      if (defaultCoords) {
        win.element.style.top = `${defaultCoords.top}px`;
        win.element.style.left = `${defaultCoords.left}px`;
        if (defaultCoords.width) win.element.style.width = `${defaultCoords.width}px`;
        if (defaultCoords.height) win.element.style.height = `${defaultCoords.height}px`;
      } else {
        // Cascada centrada
        const baseTop = 50 + (this.cascadeOffset % 6) * 28;
        const baseLeft = Math.max(120, (dWidth - 850) / 2 + (this.cascadeOffset % 6) * 28);
        win.element.style.top = `${baseTop}px`;
        win.element.style.left = `${baseLeft}px`;
        this.cascadeOffset += 1;
      }
    }

    this.bringToFront(winId);
    this.ensureTaskbarItem(winId);
  }

  closeWindow(winId) {
    const win = this.windows.get(winId);
    if (!win) return;

    win.isOpen = false;
    win.element.style.display = 'none';
    win.element.classList.remove('active');

    // Remover de la barra de tareas
    if (win.taskbarItem) {
      win.taskbarItem.remove();
      win.taskbarItem = null;
    }
  }

  minimizeWindow(winId) {
    const win = this.windows.get(winId);
    if (!win) return;

    win.isMinimized = true;
    win.element.classList.add('minimized');
    win.element.classList.remove('active');

    this.updateTaskbarState(winId, 'minimized');
  }

  restoreWindow(winId) {
    const win = this.windows.get(winId);
    if (!win) return;

    win.isMinimized = false;
    win.element.classList.remove('minimized');
    this.bringToFront(winId);
  }

  toggleMaximize(winId) {
    const win = this.windows.get(winId);
    if (!win) return;

    const btnMax = win.element.querySelector('.win-max');

    if (win.isMaximized) {
      // Restaurar
      win.element.classList.remove('maximized');
      if (win.previousRect) {
        win.element.style.top = win.previousRect.top;
        win.element.style.left = win.previousRect.left;
        win.element.style.width = win.previousRect.width;
        win.element.style.height = win.previousRect.height;
      }
      win.isMaximized = false;
      if (btnMax) btnMax.textContent = '🗖';
    } else {
      // Guardar medidas y maximizar
      win.previousRect = {
        top: win.element.style.top,
        left: win.element.style.left,
        width: win.element.style.width || `${win.element.offsetWidth}px`,
        height: win.element.style.height || `${win.element.offsetHeight}px`
      };
      win.element.classList.add('maximized');
      win.isMaximized = true;
      if (btnMax) btnMax.textContent = '🗗';
    }

    this.bringToFront(winId);
  }

  // ----------------------------------------------------------------------------
  // Mecanismo de Arrastre (Drag & Drop con Pointer Events)
  // ----------------------------------------------------------------------------
  makeDraggable(winEl, headerEl) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    headerEl.addEventListener('pointerdown', (e) => {
      // Ignorar si se presiona sobre un botón de la cabecera
      if (e.target.closest('.win-btn')) return;
      if (winEl.classList.contains('maximized')) return;
      if (window.innerWidth <= 768) return; // En móvil no arrastrar la ventana

      isDragging = true;
      headerEl.setPointerCapture(e.pointerId);

      startX = e.clientX;
      startY = e.clientY;
      initialLeft = winEl.offsetLeft;
      initialTop = winEl.offsetTop;

      this.bringToFront(winEl.id);
      e.preventDefault();
    });

    headerEl.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      // Limitar bordes para que no se pierda la cabecera
      const desktop = document.getElementById('desktop');
      const maxLeft = desktop.clientWidth - 80;
      const maxTop = desktop.clientHeight - 40;

      newLeft = Math.max(-winEl.offsetWidth + 100, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));

      winEl.style.left = `${newLeft}px`;
      winEl.style.top = `${newTop}px`;
    });

    const stopDragging = (e) => {
      if (isDragging) {
        isDragging = false;
        try {
          headerEl.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    headerEl.addEventListener('pointerup', stopDragging);
    headerEl.addEventListener('pointercancel', stopDragging);
  }

  // ----------------------------------------------------------------------------
  // Mecanismo de Redimensión
  // ----------------------------------------------------------------------------
  makeResizable(winEl, handleEl) {
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    handleEl.addEventListener('pointerdown', (e) => {
      if (winEl.classList.contains('maximized')) return;
      if (window.innerWidth <= 768) return; // En móvil no redimensionar la ventana

      isResizing = true;
      handleEl.setPointerCapture(e.pointerId);

      startX = e.clientX;
      startY = e.clientY;
      startWidth = winEl.offsetWidth;
      startHeight = winEl.offsetHeight;

      this.bringToFront(winEl.id);
      e.preventDefault();
      e.stopPropagation();
    });

    handleEl.addEventListener('pointermove', (e) => {
      if (!isResizing) return;

      const newWidth = Math.max(320, startWidth + (e.clientX - startX));
      const newHeight = Math.max(200, startHeight + (e.clientY - startY));

      winEl.style.width = `${newWidth}px`;
      winEl.style.height = `${newHeight}px`;
    });

    const stopResizing = (e) => {
      if (isResizing) {
        isResizing = false;
        try {
          handleEl.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    handleEl.addEventListener('pointerup', stopResizing);
    handleEl.addEventListener('pointercancel', stopResizing);
  }

  // ----------------------------------------------------------------------------
  // Sincronización con la Barra de Tareas
  // ----------------------------------------------------------------------------
  ensureTaskbarItem(winId) {
    const win = this.windows.get(winId);
    if (!win || !this.taskbarContainer) return;

    if (!win.taskbarItem) {
      const item = document.createElement('div');
      item.className = 'taskbar-item active';
      item.id = `tb-item-${winId}`;
      item.innerHTML = `
        <span class="item-icon">${win.iconSvg}</span>
        <span class="item-title">${win.title}</span>
      `;

      item.addEventListener('click', () => {
        if (win.isMinimized) {
          this.restoreWindow(winId);
        } else if (win.element.classList.contains('active')) {
          this.minimizeWindow(winId);
        } else {
          this.bringToFront(winId);
        }
      });

      this.taskbarContainer.appendChild(item);
      win.taskbarItem = item;
    }
  }

  updateTaskbarState(winId, state) {
    const win = this.windows.get(winId);
    if (!win || !win.taskbarItem) return;

    if (state === 'active') {
      document.querySelectorAll('.taskbar-item').forEach((ti) => ti.classList.remove('active'));
      win.taskbarItem.classList.remove('minimized');
      win.taskbarItem.classList.add('active');
    } else if (state === 'minimized') {
      win.taskbarItem.classList.remove('active');
      win.taskbarItem.classList.add('minimized');
    }
  }

  // Método auxiliar para abrir el visor de PDF
  openPdfViewer(pdfUrl, title = 'Visor de PDF') {
    const winPdf = document.getElementById('win-pdf');
    const iframe = document.getElementById('pdf-viewer-frame');
    const titleEl = document.getElementById('pdf-viewer-filename');
    const downloadBtn = document.getElementById('pdf-download-link');
    const fallbackNotice = document.getElementById('pdf-fallback-container');
    const fallbackMsg = document.getElementById('pdf-fallback-message');

    if (!winPdf) return;

    // Actualizar título y links
    if (titleEl) titleEl.textContent = title;
    if (downloadBtn) downloadBtn.href = pdfUrl;

    if (fallbackNotice) fallbackNotice.style.display = 'none';

    // Comprobar si el archivo está disponible
    fetch(pdfUrl, { method: 'HEAD' })
      .then((res) => {
        if (!res.ok && res.status === 404) {
          if (fallbackNotice) {
            fallbackNotice.style.display = 'block';
            if (fallbackMsg) {
              fallbackMsg.innerHTML = `El archivo <code>${decodeURIComponent(pdfUrl)}</code> aún no está en la carpeta.<br>Guarda tu archivo ahí y se mostrará de inmediato. Mientras tanto puedes ver la versión interactiva en la app de CV.`;
            }
          }
        }
      })
      .catch(() => {
        // En file:// o cors local puede dar error de fetch, dejamos que el iframe lo intente
      });

    // Cargar en el iframe
    if (iframe) {
      iframe.src = pdfUrl;
    }

    if (window.innerWidth <= 768) {
      this.openWindow('win-pdf');
    } else {
      this.openWindow('win-pdf', { top: 60, left: 180, width: 850, height: 600 });
    }
  }
}

// Exportar instancia global
window.wm = new WindowManager();
