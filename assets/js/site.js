/* Небольшой общий сценарий. Никаких внешних библиотек и запросов. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const iconUrl = new URL((document.documentElement.dataset.assetBase || 'assets/') + 'icons/icons.svg', document.baseURI).href;
  const contactHref = document.body.dataset.contactHref || 'kontakty/';
  const glyph = name => `<svg class="icon" aria-hidden="true"><use href="${iconUrl}#${name}"></use></svg>`;

  /* 1. ПЕРЕКЛЮЧАТЕЛЬ РЕКЛАМЫ: меняется в config.js, без правки HTML страниц. */
  const mode = window.ETERI_PROMO_MODE === 'free' ? 'free' : 'discount';
  const promo = mode === 'free'
    ? { banner: 'Получи уроки Этери бесплатно', mobileBanner: 'Бесплатные уроки вокала', sub: 'Один из 198 видеоуроков на выбор', button: 'Выбрать бесплатный урок', mobileButton: 'Бесплатный урок', icon: 'gift' }
    : { banner: 'Все курсы Этери со скидкой до 94%', mobileBanner: 'Курсы со скидкой до 94%', sub: 'Основные курсы со скидками до 94%', button: 'Получить курс со скидкой до 94%', mobileButton: 'Курсы со скидкой до 94%', icon: 'catalog' };
  /* Тексты баннеров задаются непосредственно в HTML страницы. */
  $$('[data-promo-button]').forEach(el => {
    el.textContent = el.hasAttribute('data-mobile-cta') ? promo.mobileButton : promo.button;
    el.href = mode === 'free' ? '/shkola-vokala/#free-lesson-catalog' : contactHref;
  });

  /* 2. МОБИЛЬНАЯ НАВИГАЦИЯ. */
  const menuButton = $('[data-menu-toggle]'), nav = $('#primary-nav');
  if(menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
      nav.classList.toggle('is-open',!isOpen);
    });
  }

  /* 3. ВЕРХНИЙ БАННЕР остаётся в потоке страницы и не перекрывает навигацию. */


  /* 3. ВЕРХНИЙ БАННЕР: закрепление включается переключателем data-sticky-mode.
     1 — закреплять после того, как исходный баннер прокручен выше шапки.
     2 — не закреплять. Исходный баннер всегда остаётся в потоке страницы. */
  const stickyHost = $('#sticky-promo');
  const topBanner = $('[data-top-banner]');
  if (stickyHost && topBanner && topBanner.dataset.stickyMode === '1' && 'IntersectionObserver' in window) {
    const stickyClone = topBanner.cloneNode(true);
    stickyClone.removeAttribute('data-top-banner');
    stickyClone.removeAttribute('data-sticky-mode');
    stickyClone.setAttribute('data-sticky-clone', '');
    stickyHost.replaceChildren(stickyClone);
    stickyHost.hidden = true;
    const header = $('.site-header');
    const headerHeight = () => header ? Math.round(header.getBoundingClientRect().height) : 0;
    const updateSticky = () => {
      const rect = topBanner.getBoundingClientRect();
      const shouldStick = rect.bottom <= headerHeight() && window.scrollY > 0;
      stickyHost.hidden = !shouldStick;
      stickyHost.classList.toggle('is-visible', shouldStick);
    };
    const observer = new IntersectionObserver(() => updateSticky(), {
      root: null,
      threshold: 0,
      rootMargin: `-${Math.max(0, headerHeight())}px 0px 0px 0px`
    });
    observer.observe(topBanner);
    window.addEventListener('scroll', updateSticky, {passive:true});
    window.addEventListener('resize', updateSticky);
    updateSticky();
  } else if (stickyHost) {
    stickyHost.replaceChildren();
    stickyHost.hidden = true;
  }

  /* 4. ВКЛАДКИ: активная панель без скачивания дополнительных библиотек. */
  $$('.tabs').forEach(group => {
    const tabs = $$('[role="tab"]',group);
    const select = (tab,focus=false) => {
      tabs.forEach(item => {
        const selected=item===tab;
        item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;
        const panel=document.getElementById(item.getAttribute('aria-controls'));
        if(panel) panel.hidden=!selected;
      });
      if(focus)tab.focus();
    };
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>select(tab));
      tab.addEventListener('keydown',ev=>{
        if(!['ArrowRight','ArrowLeft','Home','End'].includes(ev.key))return;
        ev.preventDefault();
        const next=ev.key==='Home'?0:ev.key==='End'?tabs.length-1:(index+(ev.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        select(tabs[next],true);
      });
    });
    if(tabs.length)select(tabs.find(t=>t.getAttribute('aria-selected')==='true') || tabs[0]);
  });

  /* 5. ВИДЕО: загружаем проигрыватель YouTube/Vimeo только по нажатию. */
  $$('[data-video-url]').forEach(button=>button.addEventListener('click',()=>{
    const src=button.getAttribute('data-video-url'); let u;
    try{u=new URL(src);}catch{return;}
    if(u.protocol!=='https:' || !['www.youtube-nocookie.com','www.youtube.com','player.vimeo.com'].includes(u.hostname))return;
    const iframe=document.createElement('iframe'); iframe.src=u.href;
    iframe.title=button.getAttribute('data-video-title') || 'Видеоурок';iframe.loading='lazy';
    iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen=true;button.replaceWith(iframe);
  }));

  /* 6. ЦЕНЫ: валюты независимы, курс конвертации не выдумывается. */
  const prices=window.ETERI_PRICES || {};
  $$('[data-price-course]').forEach(box=>{
    const course=box.getAttribute('data-price-course'), buttons=$$('[data-currency]',box);
    const oldEl=$('[data-price-old]',box),newEl=$('[data-price-new]',box),hint=$('[data-price-hint]',box);
    const fmt=(value,currency)=>new Intl.NumberFormat('ru-RU',{style:'currency',currency,maximumFractionDigits:currency==='RUB'?0:2}).format(value);
    const choose=(currency)=>{
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.currency===currency)));
      const pair=(prices[course] || {})[currency] || [null,null];
      const [oldPrice,newPrice]=pair;
      const valid=Number.isFinite(newPrice)&&newPrice>0;
      // Prices from the approved catalog; do not replace displayed prices with speculative placeholders.
      if (!valid) {
        if(hint){hint.textContent='';hint.hidden=true;}
        return;
      }
      newEl.textContent=fmt(newPrice,currency);
      if(oldEl){
        oldEl.hidden=!(Number.isFinite(oldPrice) && oldPrice>newPrice);
        oldEl.textContent=oldEl.hidden?'':fmt(oldPrice,currency);
      }
      if(hint){hint.textContent='';hint.hidden=true;}
    };
    buttons.forEach(b=>b.addEventListener('click',()=>choose(b.dataset.currency)));
    choose('RUB');
  });
})();
