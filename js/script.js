/* ═══════════════════════════════════════════════════════════
   WAREZ TIME — script.js  v5
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────
     1.Pulsante torna su
  ───────────────────────────────────────────────────────── */
  const backBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visibile', window.scrollY > 300);
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const page = document.body.dataset.page;

  const pageHandlers = {
    'home': funHome,
    'giochi': funGiochi,
    'gruppi': funGruppi,
    'timeline': funTimeline,
  };

  if (pageHandlers[page]) {
    pageHandlers[page]();
  }

  function funHome() {
    /* ─────────────────────────────────────────────────────────
       1. Timeline
    ───────────────────────────────────────────────────────── */
    const timelineItems  = document.querySelectorAll('.timeline-articoli');
    const timelineSlides = document.querySelectorAll('.timeline-voce');
    let tlTimer = null;
    let currentTl = 0;

    function activateTimeline(i) {
      currentTl = i;
      timelineItems.forEach((el, j) => el.classList.toggle('active', j === i));
      timelineSlides.forEach((el, j) => el.classList.toggle('active', j === i));
    }

    function startAutoplay() {
      tlTimer = setInterval(() => activateTimeline((currentTl + 1) % timelineItems.length), 2000);
    }

    timelineItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        activateTimeline(i);
        clearInterval(tlTimer);
        startAutoplay();
      });
    });

    startAutoplay();

    /* ─────────────────────────────────────────────────────────
   2. Nuovi Rilasci
───────────────────────────────────────────────────────── */
    const releasesContainer = document.getElementById('contenitore-rilasci');

    const rowConfigs = [
      { speed: '30s', reverse: false },
      { speed: '24s', reverse: true  },
      { speed: '48s', reverse: false },
      { speed: '40s', reverse: true  },
    ];

    const PILL_W = 158;

    async function buildReleases() {
      // 1. Carica il file di configurazione
      const res = await fetch('../assets/pill/listaGiochi.json');
      const games = await res.json();
      // games = [{ id: 0, label: "D +1023" }, ...]

      // 2. Dividi i giochi in 4 gruppi (uno per riga)
      const chunkSize = Math.ceil(games.length / rowConfigs.length);
      const gamePools = rowConfigs.map((_, i) =>
          games.slice(i * chunkSize, (i + 1) * chunkSize)
      );

      const vw = window.innerWidth;

      rowConfigs.forEach((cfg, rowIdx) => {
        const pool = gamePools[rowIdx];
        if (!pool.length) return;

        const minPerSet = Math.ceil(vw / PILL_W) + 3;
        const totalPerSet = Math.max(pool.length, minPerSet);
        const setItems = Array.from({ length: totalPerSet }, (_, i) => pool[i % pool.length]);

        const row = document.createElement('div');
        row.style.setProperty('--speed', cfg.speed);

        const track = document.createElement('div');
        track.className = 'rilasci-binario';
        if (cfg.reverse) track.style.animationDirection = 'reverse';

        [false, true].forEach(isClone => {
          setItems.forEach(game => {
            const pill = document.createElement('div');
            pill.className = 'rilasci-pill';
            if (isClone) pill.setAttribute('aria-hidden', 'true');

            const img = document.createElement('img');
            img.src = `../assets/pill/icone/${game.id}.jpg`;   // ← prende l'immagine dalla cartella
            img.alt = isClone ? '' : `Game ${game.id}`;
            img.width = 44;
            img.height = 44;

            const lbl = document.createElement('span');
            lbl.textContent = game.label;          // ← prende il testo dal JSON

            pill.append(img, lbl);
            track.appendChild(pill);
          });
        });

        row.appendChild(track);
        releasesContainer.appendChild(row);
      });
    }

    buildReleases();


    /* ─────────────────────────────────────────────────────────
       3. Gruppi
    ───────────────────────────────────────────────────────── */
    const gruppoItems = document.querySelectorAll('.gruppo-voce');
    const gruppoLogo  = document.getElementById('gruppo-logo');


    const gruppoImages = {
      'CDX':      '../assets/Gruppi/CODEX.png',
      'CPY':      '../assets/Gruppi/CPY.png',
      'DenuvOwO': '../assets/Gruppi/DenuvOwO.png',
      'FLT':      '../assets/Gruppi/Fairlight FLT.png',
      'MKDEV':    '../assets/Gruppi/mkdev.png',
      'RZR':      '../assets/Gruppi/Razor 1911.png',
      'RLD':      '../assets/Gruppi/Reloaded RLD!.png',
    };

    gruppoLogo.src = "../assets/Gruppi/CODEX.png";
    gruppoLogo.alt = "CDX";
    gruppoLogo.style.opacity = '1';

    gruppoItems.forEach(item => {
      item.addEventListener('click', () => {
        gruppoItems.forEach(g => g.classList.remove('attivo'));
        item.classList.add('attivo');
        const src = gruppoImages[item.dataset.gruppo] || gruppoImages['CDX'];
        gruppoLogo.style.opacity = '0';
        setTimeout(() => {
          gruppoLogo.src = src;
          gruppoLogo.alt = item.dataset.gruppo;
          gruppoLogo.style.opacity = '1';
        }, 220);
      });
    });

  }

  function  funGiochi() {

    /* ─────────────────────────────────────────────────────────
        1. Lista dei giochi
  ───────────────────────────────────────────────────────── */

    /* path icone svg */
    const icons = {
      icoCalendario:  svgIco('<path d="M12.7666 3.19168V9.57501M25.5333 3.19168V9.57501M4.78748 15.9583H33.5125M7.97914 6.38335H30.3208C32.0835 6.38335 33.5125 7.8123 33.5125 9.57501V31.9167C33.5125 33.6794 32.0835 35.1083 30.3208 35.1083H7.97914C6.21643 35.1083 4.78748 33.6794 4.78748 31.9167V9.57501C4.78748 7.8123 6.21643 6.38335 7.97914 6.38335Z"/>'),
      icoGruppo:  svgIco('<path d="M25.5333 33.5125V30.3208C25.5333 28.6279 24.8608 27.0042 23.6637 25.8071C22.4666 24.61 20.843 23.9375 19.15 23.9375H9.57498C7.88202 23.9375 6.25839 24.61 5.06129 25.8071C3.86418 27.0042 3.19165 28.6279 3.19165 30.3208V33.5125M25.5333 4.99177C26.9022 5.34664 28.1144 6.14598 28.9798 7.26434C29.8452 8.3827 30.3148 9.75675 30.3148 11.1708C30.3148 12.5849 29.8452 13.959 28.9798 15.0773C28.1144 16.1957 26.9022 16.995 25.5333 17.3499M35.1083 33.5125V30.3208C35.1073 28.9065 34.6365 27.5326 33.77 26.4147C32.9035 25.2969 31.6903 24.4985 30.3208 24.145M20.7458 11.1708C20.7458 14.6963 17.8879 17.5542 14.3625 17.5542C10.8371 17.5542 7.97915 14.6963 7.97915 11.1708C7.97915 7.64542 10.8371 4.78751 14.3625 4.78751C17.8879 4.78751 20.7458 7.64542 20.7458 11.1708Z"/>'),
      icoScudo: svgIco('<path d="M31.9166 20.7458C31.9166 28.725 26.3312 32.7146 19.6926 35.0285C19.3449 35.1463 18.9673 35.1407 18.6233 35.0126C11.9687 32.7146 6.3833 28.725 6.3833 20.7458V9.575C6.3833 9.15176 6.55143 8.74585 6.85071 8.44658C7.14999 8.1473 7.55589 7.97917 7.97913 7.97917C11.1708 7.97917 15.1604 6.06417 17.9371 3.6385C18.2752 3.34965 18.7053 3.19095 19.15 3.19095C19.5946 3.19095 20.0247 3.34965 20.3628 3.6385C23.1555 6.08012 27.1291 7.97917 30.3208 7.97917C30.744 7.97917 31.15 8.1473 31.4492 8.44658C31.7485 8.74585 31.9166 9.15176 31.9166 9.575V20.7458Z"/>'),
      icoIngranaggio: svgIco('<path d="M17.5542 16.3892L11.1708 5.3301M17.5542 21.9108L11.1708 32.9699M19.15 35.1083V31.9167M19.15 31.9167C26.2008 31.9167 31.9167 26.2008 31.9167 19.15C31.9167 12.0992 26.2008 6.38335 19.15 6.38335M19.15 31.9167C12.0991 31.9167 6.38332 26.2008 6.38332 19.15M19.15 3.19168V6.38335M19.15 6.38335C12.0991 6.38335 6.38332 12.0992 6.38332 19.15M22.3417 19.15H35.1083M22.3417 19.15C22.3417 20.9127 20.9127 22.3417 19.15 22.3417C17.3873 22.3417 15.9583 20.9127 15.9583 19.15C15.9583 17.3873 17.3873 15.9583 19.15 15.9583C20.9127 15.9583 22.3417 17.3873 22.3417 19.15ZM27.1292 32.9699L25.5333 30.2091M27.1292 5.3301L25.5333 8.09089M3.19165 19.15H6.38332M32.9699 27.1292L30.2091 25.5333M32.9699 11.1708L30.2091 12.7667M5.33007 27.1292L8.09086 25.5333M5.33007 11.1708L8.09086 12.7667"/>'),
    };

    /* build icone svg */
    function svgIco(path) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40"
    fill="none" stroke="#9ccfd8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
    }

    /* build pannello gioco */
    function buildPanello(game) {
      const panel = document.createElement('div');
      panel.className = 'pnlGioco';

      const coverHTML = game.cover
          ? `<div class="pnlGioco-header-cont">
               <img class="pnlGioco-header-sfondo" src="${game.cover}" alt="" aria-hidden="true">
               <img class="pnlGioco-header" src="${game.cover}" alt="Cover ${game.title}" loading="lazy">
             </div>`
          : `<div class="pnlGioco-header-placeholder">${game.title}</div>`;
      panel.innerHTML = `
    ${coverHTML}
    <div class="pnlGioco-body">
      <div class="pnlGioco-titolo">${game.title}</div>
      <div class="pnlGioco-meta">
        <span class="pnlGioco-info">${icons.icoCalendario} ${game.release}</span>
        <span class="pnlGioco-info">${icons.icoGruppo} ${game.group}</span>
        <span class="pnlGioco-info">${icons.icoScudo} ${game.protection}</span>
        <span class="pnlGioco-info">${icons.icoIngranaggio} ${game.crack}</span>
      </div>
    </div>
    <div class="pnlGioco-pnl-D">
      <span class="D-singola">D</span>+${game.days}
    </div>
  `;

      return panel;
    }

    /* animazione comparsa pannello */
    function attachObserver(panels) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visibile');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      panels.forEach((p, i) => {
        p.style.transitionDelay = `${i * 30}ms`;
        observer.observe(p);
      });
    }

    /* fetch dal json, build panel e append al div */
    const list    = document.getElementById('giochi-container');
    const status  = document.getElementById('status');

    fetch('../assets/Header/listaGiochiHeader.json')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(games => {
          status.remove();

          const panels = games.map(game => {
            const el = buildPanello(game);
            list.appendChild(el);
            return el;
          });

          attachObserver(panels);
        })
        .catch(err => {
          status.textContent = `Errore nel caricamento di games.json: ${err.message}`;
          console.error(err);
        });

  }

  function  funGruppi () {
    /* ─────────────────────────────────────────────────────────
        2. Lista dei gruppi
  ───────────────────────────────────────────────────────── */

    /* icone svg */
    const icons = {
      icoInattivo: '<svg width="15" height="15" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="5" cy="5" r="4" stroke="#3E8FB0" stroke-opacity="0.3" stroke-width="2"/>' +
          '</svg>',
      icoAttivo: '<svg width="15" height="15" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="5" cy="5" r="5" fill="#9CCFD8"/>' +
          '</svg>',
    };

    /* build pannello gruppo */
    function buildPannello(gruppo) {
      const panel = document.createElement('div');
      panel.className = 'pnlGruppo';

      const coverHTML = gruppo.cover
          ? `<img class="pnlGruppo-cover" src="${gruppo.cover}" alt="Cover ${gruppo.title}" loading="lazy">`
          : `<div class="pnlGruppo-cover pnlGruppo-cover--placeholder">${gruppo.title}</div>`;

      const statusHTML = gruppo.attivo
          ? `attivo ${icons.icoAttivo}`
          : `inattivo ${icons.icoInattivo}`;

      panel.innerHTML = `
    <div class="pnlGruppo-body">
      <div class="pnlGruppo-titolo">${gruppo.title}</div>
      <div class="pnlGruppo-testo">${gruppo.testo}</div>
      <div class="pnlGruppo-status">${statusHTML}</div>
    </div>
    ${coverHTML}
  `;

      return panel;
    }

    /* animazione comparsa pannello */
    function attachObserver(panels) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visibile');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      panels.forEach((p, i) => {
        p.style.transitionDelay = `${i * 30}ms`;
        observer.observe(p);
      });
    }

    /* fetch dal json, build panel e append al div */
    const list   = document.getElementById('gruppi-grande-container');
    const status = document.getElementById('status');

    fetch('../assets/Gruppi/listaGruppi.json')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(gruppi => {
          status.remove();

          const panels = gruppi.map(gruppo => {
            const el = buildPannello(gruppo);
            list.appendChild(el);
            return el;
          });

          attachObserver(panels);
        })
        .catch(err => {
          status.textContent = `Errore nel caricamento: ${err.message}`;
          console.error(err);
        });
  }

  function funTimeline () {
    (async () => {
      // ── 1. Carica i dati ───────────────────────────────────────
      let articles;
      try {
        const res = await fetch('./assets/articoli/listaArticoli.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        articles = await res.json();
      } catch (err) {
        console.error('Impossibile caricare articles.json:', err);
        return;
      }

      // ── 2. Riferimenti DOM ────────────────────────────────────
      const spine = document.getElementById('tmLargeLinea');
      const container = document.getElementById('tmLargeArticoli');

      // ── 3. Badge color map ────────────────────────────────────
      const BADGE_CLASSES = {
        leak:   'cat-leak',
        gioco:  'cat-gioco',
        gruppo: 'cat-gruppo',
        speciali: 'cat-speciali',
      };

      // ── 4. Costruisce ogni riga ───────────────────────────────
      articles.forEach((article, index) => {
        const side = index % 2 === 0 ? 'sx' : 'dx';

        // ── row
        const row = document.createElement('div');
        row.className = `tmL-riga ${side}`;

        // ── node (dot + data)
        const node = document.createElement('div');
        node.className = 'tmL-nodo';

        const dateEl = document.createElement('span');
        dateEl.className = 'tml-data';
        dateEl.textContent = article.date;

        node.append(dateEl);

        // ── connettore orizzontale
        const connector = document.createElement('div');
        connector.className = 'tmL-linea-orizzontale';

        // ── spacer (lato opposto vuoto)
        const spacer = document.createElement('div');
        spacer.className = 'tmL-spazio';

        // ── card wrap (target animazione)
        const cardWrap = document.createElement('div');
        cardWrap.className = 'tmL-container-articolo';

        // ── card
        const card = document.createElement('div');
        card.className = 'tmL-articolo';

        // immagine
        const imgWrap = document.createElement('div');
        imgWrap.className = 'tmL-container-img';

        const img = document.createElement('img');
        img.src = article.image;
        img.alt = article.title;
        img.loading = 'lazy';
        img.decoding = 'async';
        imgWrap.appendChild(img);

        // badge (opzionale)
        if (article.badge) {
          const badge = document.createElement('span');
          badge.className = `tmL-categoria ${BADGE_CLASSES[article.badge.color] ?? 'badge-leak'}`;
          badge.textContent = article.badge.text;
          imgWrap.appendChild(badge);
        }

        // corpo
        const body = document.createElement('div');
        body.className = 'tmL-art-body';

        const title = document.createElement('h2');
        title.className = 'tmL-art-titolo';
        title.textContent = article.title;

        // freccia link
        const arrow = document.createElement('a');
        arrow.className = 'tmL-freccia';
        arrow.href = article.url ?? '#';
        arrow.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M36 32L44 24L36 16M44 24H4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;

        body.append(title, arrow);
        card.append(imgWrap, body);

        // ── assembla cardWrap con connettore secondo il lato
        if (side === 'sx') {
          cardWrap.append(card, connector); // articolo → linea
        } else {
          cardWrap.append(connector, card); // linea → articolo
        }

        // ── assembla la riga (connector rimosso da qui)
        if (side === 'sx') {
          row.append(cardWrap, node, spacer);
        } else {
          row.append(spacer, node, cardWrap);
        }

        container.appendChild(row);
      });

      // ── 5. IntersectionObserver per le animazioni di scroll ───
      const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visibile');
                observer.unobserve(entry.target); // anima una sola volta
              }
            });
          },
          { threshold: 0.15 }
      );

      document.querySelectorAll('.tmL-container-articolo').forEach((el) => observer.observe(el));
    })();
  }

});
