(() => {
  'use strict';
  const data = window.AUCKLANDIA || { articles: [], videos: [] };
  const $ = (selector) => document.querySelector(selector);
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 }) : null;
  function reveal() {
    if (!observer || reduced.matches) return;
    document.querySelectorAll('.reveal:not([data-observed])').forEach(el => {
      el.dataset.observed = 'true'; el.classList.add('pending'); observer.observe(el);
    });
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.querySelectorAll('.pending').forEach(el => el.classList.remove('pending'));
  });
  function image(src, alt, className) {
    const img = make('img', className); img.src = src; img.alt = alt || ''; img.loading = 'lazy'; img.decoding = 'async'; return img;
  }
  function renderArticles(filter = 'all') {
    const container = $('#articles'); container.replaceChildren();
    const articles = data.articles.filter(a => filter === 'all' || a.category === filter);
    articles.forEach(article => {
      const card = make('article', 'article-card reveal');
      const link = make('a'); link.href = '?story=' + encodeURIComponent(article.slug);
      const art = make('div', 'card-image ' + (article.visual || ''));
      art.append(image(article.image, article.imageAlt));
      const arrow = make('span', 'card-arrow', '↗'); arrow.setAttribute('aria-hidden', 'true'); art.append(arrow);
      const meta = make('div', 'card-meta'); meta.append(make('span', '', article.category), make('span', '', article.minutes + ' min read'));
      link.append(art, meta, make('h3', '', article.title), make('p', '', article.excerpt));
      if (article.sample) link.append(make('span', 'draft-label', 'Sample story · Preview copy'));
      card.append(link); container.append(card);
    });
    if (!articles.length) container.append(make('p', '', 'No stories in this section yet. Take another route.'));
    $('#article-count').textContent = String(articles.length).padStart(2, '0') + (articles.length === 1 ? ' story / take your time' : ' stories / take your time');
    reveal();
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    renderArticles(button.dataset.filter);
  }));
  const dialog = $('#video-dialog');
  let videoTrigger = null;
  function openFilm(video, trigger) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(video.youtubeId)) return;
    videoTrigger = trigger;
    $('#video-dialog-title').textContent = video.title + ' — ' + video.credit;
    $('#youtube-fallback').href = 'https://www.youtube.com/watch?v=' + video.youtubeId;
    const frame = make('iframe');
    frame.title = video.title + ' by Guy Fraser';
    frame.src = 'https://www.youtube-nocookie.com/embed/' + video.youtubeId + '?autoplay=1&rel=0';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    $('#video-mount').replaceChildren(frame);
    dialog.showModal(); document.body.classList.add('modal-open'); $('#close-video').focus();
  }
  $('#close-video').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    $('#video-mount').replaceChildren(); document.body.classList.remove('modal-open'); if (videoTrigger) videoTrigger.focus();
  });
  data.videos.forEach(video => {
    const film = make('article', 'film reveal');
    const poster = make('button', 'film-poster'); poster.type = 'button'; poster.setAttribute('aria-label', 'Play ' + video.title + ', ' + video.duration);
    const thumbnail = image('https://i.ytimg.com/vi/' + video.youtubeId + '/hqdefault.jpg', '');
    poster.append(thumbnail);
    const play = make('span', 'play-circle', '▶'); play.setAttribute('aria-hidden', 'true'); poster.append(play);
    const overlay = make('span', 'film-overlay'); overlay.append(make('strong', '', video.title), make('small', '', 'PLAY FILM ↗ / ' + video.duration)); poster.append(overlay);
    poster.addEventListener('click', () => openFilm(video, poster));
    const details = make('div', 'film-details'); const heading = make('div'); heading.append(make('h3', '', video.subtitle), make('p', 'credit', video.credit + ' · ' + video.location));
    details.append(heading, make('p', '', video.description)); film.append(poster, details); $('#films').append(film);
  });
  function renderStory(slug) {
    $('#home-view').hidden = true;
    const view = $('#story-view'); view.hidden = false;
    const back = make('a', 'text-link', '← Back to the journal'); back.href = './#journal'; view.append(back);
    const article = data.articles.find(a => a.slug === slug);
    if (!article) { document.title = 'Story not found — Aucklandia'; view.append(make('h1', '', 'A slight detour.'), make('p', 'story-lede', 'That story isn’t here. Head back to the journal for a different view.')); return; }
    document.title = article.title + ' — Aucklandia';
    $('meta[name="description"]').content = article.excerpt;
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = article.excerpt;
    view.append(make('p', 'eyebrow', article.category + ' / ' + article.minutes + ' min read'), make('h1', '', article.title), make('p', 'story-lede', article.excerpt));
    if (article.sample) view.append(make('aside', 'sample-notice', 'Studio draft — this is sample writing created for the Aucklandia site preview, not a published article by Guy Fraser.'));
    else if (article.author || article.date) view.append(make('p', 'eyebrow', [article.author, article.date].filter(Boolean).join(' · ')));
    const hero = image(article.image, article.imageAlt, 'story-image'); hero.loading = 'eager'; view.append(hero);
    const body = make('div', 'story-body'); (article.paragraphs || []).forEach(p => body.append(make('p', '', p)));
    const actions = make('div', 'story-actions'); const share = make('button', 'share-button', 'Copy story link ↗'); share.type = 'button';
    const status = make('span', 'share-status'); status.setAttribute('role', 'status');
    share.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); status.textContent = 'Link copied. Pass it on.'; }
      catch { status.textContent = 'Copy this address: ' + location.href; }
    });
    actions.append(share, status); body.append(actions); view.append(body);
  }
  const slug = new URLSearchParams(location.search).get('story');
  if (slug !== null) renderStory(slug); else renderArticles();
  $('#year').textContent = new Date().getFullYear();
  function updateClock() {
    $('#local-time').textContent = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()) + ' / Auckland time';
  }
  updateClock(); setInterval(updateClock, 60000);
  let scheduled = false;
  function updateProgress() {
    const height = document.documentElement.scrollHeight - innerHeight;
    $('.reading-progress').style.width = (height > 0 ? Math.min(100, Math.max(0, scrollY / height * 100)) : 0) + '%'; scheduled = false;
  }
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  addEventListener('resize', updateProgress); updateProgress(); reveal();
})();
