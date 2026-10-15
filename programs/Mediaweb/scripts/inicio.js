/**
 * MEDIAWEB - Motor de Galería, Lecturas, Audio y Presentación Interactiva
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Catálogo Completo de Memorias
  const memorias = [
    // Colección Reloj
    { id: 1, ruta: 'reloj/Dougie.jpeg', titulo: 'Dougie', coleccion: 'reloj', badge: 'Recuerdo' },
    { id: 2, ruta: 'reloj/el_museo_encantado.jpeg', titulo: 'El Museo Encantado', coleccion: 'reloj', badge: 'Aventura' },
    { id: 3, ruta: 'reloj/GG.jpeg', titulo: 'GG', coleccion: 'reloj', badge: 'Instante' },
    { id: 4, ruta: "reloj/GG's_Day.jpeg", titulo: "GG's Day", coleccion: 'reloj', badge: 'Especial' },
    { id: 5, ruta: 'reloj/hechizo.jpeg', titulo: 'Hechizo', coleccion: 'reloj', badge: 'Mágico' },
    { id: 6, ruta: 'reloj/juego_en_las_alturas.jpeg', titulo: 'Juego en las Alturas', coleccion: 'reloj', badge: 'Aventura' },
    { id: 7, ruta: 'reloj/Kattiu.jpeg', titulo: 'Kattiu', coleccion: 'reloj', badge: 'Ternura' },
    { id: 8, ruta: 'reloj/lasagna_familiar.jpeg', titulo: 'Lasagna Familiar', coleccion: 'reloj', badge: 'Hogar' },
    { id: 9, ruta: 'reloj/lluvia_de_vacas.jpeg', titulo: 'Lluvia de Vacas', coleccion: 'reloj', badge: 'Risas' },
    { id: 10, ruta: 'reloj/luna.jpeg', titulo: 'Luna', coleccion: 'reloj', badge: 'Noche' },
    { id: 11, ruta: 'reloj/maldades.jpeg', titulo: 'Maldades', coleccion: 'reloj', badge: 'Cómplices' },
    { id: 12, ruta: 'reloj/michelle.jpeg', titulo: 'Michelle', coleccion: 'reloj', badge: 'Luz' },
    { id: 13, ruta: 'reloj/pocima.jpeg', titulo: 'Pócima', coleccion: 'reloj', badge: 'Mágico' },
    { id: 14, ruta: 'reloj/tu_tú.jpeg', titulo: 'Tú, Tú', coleccion: 'reloj', badge: 'Esencia' },
    { id: 15, ruta: 'reloj/tus_cuadros.jpeg', titulo: 'Tus Cuadros', coleccion: 'reloj', badge: 'Arte' },
    { id: 16, ruta: 'reloj/tus_manos.jpeg', titulo: 'Tus Manos', coleccion: 'reloj', badge: 'Calidez' },
    { id: 17, ruta: 'reloj/your_day.jpeg', titulo: 'Your Day', coleccion: 'reloj', badge: 'Celebración' },
    
    // Colección Glitch
    { id: 18, ruta: 'glitch/Magia(POV_cuando_recibes_lo_que_no_sabias_que_buscaste_toda_tu_vida).jpeg', titulo: 'Magia (POV: Lo que siempre buscaste)', coleccion: 'glitch', badge: 'Magia' },
    { id: 19, ruta: 'glitch/comerciales.jpeg', titulo: 'Comerciales', coleccion: 'glitch', badge: 'Cotidiano' },
    { id: 20, ruta: 'glitch/con_paraguas.jpeg', titulo: 'Con Paraguas', coleccion: 'glitch', badge: 'Bajo la Lluvia' },
    { id: 21, ruta: 'glitch/el_dia_que_nos caimos.jpeg', titulo: 'El Día Que Nos Caímos', coleccion: 'glitch', badge: 'Risas' },
    { id: 22, ruta: 'glitch/esperando.jpeg', titulo: 'Esperando', coleccion: 'glitch', badge: 'Calma' },
    { id: 23, ruta: 'glitch/mirada.jpeg', titulo: 'Mirada', coleccion: 'glitch', badge: 'Luz' },
    { id: 24, ruta: 'glitch/otro_universo.jpeg', titulo: 'Otro Universo', coleccion: 'glitch', badge: 'Fantasía' },
    { id: 25, ruta: 'glitch/pulpina_y_conejo(no_me_acuerdo_del_nombre.jpeg', titulo: 'Pulpina y Conejo', coleccion: 'glitch', badge: 'Compañía' },
    { id: 26, ruta: 'glitch/siempre.jpeg', titulo: 'Siempre', coleccion: 'glitch', badge: 'Eterno' },
    { id: 27, ruta: 'glitch/tu_ta_ta_tu_ta_ta_tu_ta_ta.jpeg', titulo: 'Tu-Ta-Ta', coleccion: 'glitch', badge: 'Ritmo' },
    { id: 28, ruta: 'glitch/vacaaaaa.jpeg', titulo: 'Vacaaaaa', coleccion: 'glitch', badge: 'Espontáneo' }
  ];

  // Estado
  let listaActual = [...memorias];
  let indiceLightbox = 0;

  // 2. Elementos del DOM
  const contenedorGaleria = document.getElementById('galeria');
  const navLinks = document.querySelectorAll('.nav-link, .shortcut-pill');
  const sections = document.querySelectorAll('.view-section');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Lecturas
  const poetryBtns = document.querySelectorAll('.poetry-btn');
  const poemArticles = document.querySelectorAll('.poem-article');

  // 3. Renderizado de Tarjetas de Galería
  function renderGaleria(items) {
    if (!contenedorGaleria) return;
    contenedorGaleria.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('li');
      card.className = 'gallery-card';
      card.style.setProperty('--imagen-url', `url("${encodeURI(item.ruta)}")`);

      card.innerHTML = `
        <div class="gallery-img-wrapper">
          <img src="${encodeURI(item.ruta)}" alt="${item.titulo}" loading="lazy">
        </div>
        <div class="card-overlay">
          <h3 class="card-title">${item.titulo}</h3>
          <div class="card-meta">
            <span class="card-badge">${item.badge}</span>
            <span>${item.coleccion === 'reloj' ? 'Reloj de Vida' : 'Instante Glitch'}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        abrirLightbox(index, items);
      });

      contenedorGaleria.appendChild(card);
    });
  }

  // 4. Lightbox Modal
  function abrirLightbox(index, lista) {
    listaActual = lista;
    indiceLightbox = index;
    actualizarLightbox();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function actualizarLightbox() {
    const item = listaActual[indiceLightbox];
    if (!item) return;

    lightboxImg.src = encodeURI(item.ruta);
    lightboxImg.alt = item.titulo;
    lightboxTitle.textContent = item.titulo;
    lightboxCounter.textContent = `${indiceLightbox + 1} de ${listaActual.length} • ${item.badge}`;
  }

  function cerrarLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function anteriorImagen() {
    indiceLightbox = (indiceLightbox - 1 + listaActual.length) % listaActual.length;
    actualizarLightbox();
  }

  function siguienteImagen() {
    indiceLightbox = (indiceLightbox + 1) % listaActual.length;
    actualizarLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', cerrarLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', anteriorImagen);
  if (lightboxNext) lightboxNext.addEventListener('click', siguienteImagen);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) cerrarLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') cerrarLightbox();
    if (e.key === 'ArrowLeft') anteriorImagen();
    if (e.key === 'ArrowRight') siguienteImagen();
  });

  // 5. Filtros de Galería
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (filter === 'todos') {
        renderGaleria(memorias);
      } else {
        const filtrados = memorias.filter(m => m.coleccion === filter);
        renderGaleria(filtrados);
      }
    });
  });

  // 6. Navegación por Pestañas (SPA)
  function cambiarSeccion(targetId) {
    sections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.id === targetId) {
        sec.classList.add('active');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.target === targetId) {
        link.classList.add('active');
      }
    });

    if (navMenu) navMenu.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.dataset.target;
      if (target) {
        e.preventDefault();
        cambiarSeccion(target);
      }
    });
  });

  // Menú Móvil
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // 7. Navegación de Lecturas (Poemas)
  poetryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      poetryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetPoem = btn.dataset.poem;
      poemArticles.forEach(article => {
        article.classList.remove('active');
        if (article.id === targetPoem) {
          article.classList.add('active');
        }
      });
    });
  });

  // 8. Selector de Tema (Amanecer / Anochecer)
  const savedTheme = localStorage.getItem('mediaweb-theme') || 'amanecer';
  aplicarTema(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const actual = document.documentElement.getAttribute('data-theme') === 'anochecer' ? 'amanecer' : 'anochecer';
      aplicarTema(actual);
      localStorage.setItem('mediaweb-theme', actual);
    });
  }

  function aplicarTema(tema) {
    if (tema === 'anochecer') {
      document.documentElement.setAttribute('data-theme', 'anochecer');
      if (themeToggle) themeToggle.innerHTML = '🌙';
      if (themeToggle) themeToggle.title = 'Cambiar a Modo Amanecer';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) themeToggle.innerHTML = '☀️';
      if (themeToggle) themeToggle.title = 'Cambiar a Modo Anochecer';
    }
  }

  // 9. PAISAJE SONORO (Web Audio API - Sin dependencias externas)
  let audioCtx = null;
  let isPlaying = false;
  let currentPreset = 'campanas';
  let soundTimer = null;
  let rainNode = null;
  let gainMaster = null;

  const playBtn = document.getElementById('play-audio-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const visualizer = document.getElementById('sound-visualizer');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const audioFileInput = document.getElementById('audio-file-input');
  const customAudioPlayer = document.getElementById('custom-audio-player');
  const customAudioStatus = document.getElementById('custom-audio-status');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      gainMaster = audioCtx.createGain();
      gainMaster.gain.setValueAtTime(parseFloat(volumeSlider?.value || 0.4), audioCtx.currentTime);
      gainMaster.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Generador de Campanas Etéreas / Chimes
  const escalaPentatonica = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

  function sonarCampana() {
    if (!isPlaying || currentPreset !== 'campanas' || !audioCtx) return;

    const nota = escalaPentatonica[Math.floor(Math.random() * escalaPentatonica.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(nota, audioCtx.currentTime);

    // Envolvente de campana suave
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.8);

    osc.connect(gain);
    gain.connect(gainMaster);

    osc.start();
    osc.stop(audioCtx.currentTime + 3.0);

    const proximoIntervalo = 700 + Math.random() * 1400;
    soundTimer = setTimeout(sonarCampana, proximoIntervalo);
  }

  // Generador de Lluvia Relajante
  function iniciarLluvia() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filtro pasa bajos para dar sensación de lluvia suave
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, audioCtx.currentTime);

    const rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0.35, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(gainMaster);

    whiteNoise.start();
    rainNode = { source: whiteNoise, gain: rainGain };
  }

  function detenerLluvia() {
    if (rainNode) {
      try {
        rainNode.source.stop();
        rainNode.source.disconnect();
      } catch (e) {}
      rainNode = null;
    }
  }

  // Generador de Dron Crepuscular
  let droneOsc1 = null;
  let droneOsc2 = null;

  function iniciarDrone() {
    if (!audioCtx) return;
    droneOsc1 = audioCtx.createOscillator();
    droneOsc2 = audioCtx.createOscillator();
    const droneGain = audioCtx.createGain();

    droneOsc1.type = 'sine';
    droneOsc2.type = 'triangle';
    droneOsc1.frequency.setValueAtTime(110, audioCtx.currentTime); // A2
    droneOsc2.frequency.setValueAtTime(164.81, audioCtx.currentTime); // E3

    droneGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

    droneOsc1.connect(droneGain);
    droneOsc2.connect(droneGain);
    droneGain.connect(gainMaster);

    droneOsc1.start();
    droneOsc2.start();
  }

  function detenerDrone() {
    if (droneOsc1) {
      try { droneOsc1.stop(); droneOsc1.disconnect(); } catch (e) {}
      droneOsc1 = null;
    }
    if (droneOsc2) {
      try { droneOsc2.stop(); droneOsc2.disconnect(); } catch (e) {}
      droneOsc2 = null;
    }
  }

  function togglePlayAudio() {
    initAudioContext();

    if (isPlaying) {
      detenerTodoAudio();
    } else {
      reproducirPresetActual();
    }
  }

  function reproducirPresetActual() {
    detenerTodoAudio();
    isPlaying = true;
    if (playBtn) playBtn.innerHTML = '⏸';
    if (visualizer) visualizer.classList.add('playing');

    if (currentPreset === 'campanas') {
      sonarCampana();
    } else if (currentPreset === 'lluvia') {
      iniciarLluvia();
    } else if (currentPreset === 'crepusculo') {
      iniciarDrone();
    }
  }

  function detenerTodoAudio() {
    isPlaying = false;
    clearTimeout(soundTimer);
    detenerLluvia();
    detenerDrone();
    if (playBtn) playBtn.innerHTML = '▶';
    if (visualizer) visualizer.classList.remove('playing');
  }

  if (playBtn) {
    playBtn.addEventListener('click', togglePlayAudio);
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (gainMaster && audioCtx) {
        gainMaster.gain.setValueAtTime(val, audioCtx.currentTime);
      }
      if (customAudioPlayer) {
        customAudioPlayer.volume = val;
      }
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPreset = btn.dataset.preset;
      if (isPlaying) {
        reproducirPresetActual();
      }
    });
  });

  // Reproductor de archivo MP3 propio
  if (audioFileInput && customAudioPlayer) {
    audioFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        detenerTodoAudio();
        const fileURL = URL.createObjectURL(file);
        customAudioPlayer.src = fileURL;
        customAudioPlayer.style.display = 'block';
        customAudioPlayer.play();
        if (customAudioStatus) {
          customAudioStatus.textContent = `Reproduciendo pista personal: ${file.name}`;
        }
      }
    });
  }

  // Inicializar galería
  renderGaleria(memorias);
});
