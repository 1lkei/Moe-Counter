(function () {
  const btn = document.getElementById('get');
  const img = document.getElementById('result');
  const code = document.getElementById('code');

  const elements = {
    name: document.getElementById('name'),
    theme: document.getElementById('theme'),
    padding: document.getElementById('padding'),
    offset: document.getElementById('offset'),
    scale: document.getElementById('scale'),
    pixelated: document.getElementById('pixelated'),
    darkmode: document.getElementById('darkmode'),
  };

  btn.addEventListener('click', throttle(handleButtonClick, 500));
  code.addEventListener('click', selectCodeText);

  const mainTitle = document.querySelector('#main_title i');
  const themes = document.querySelector('#themes');
  const moreTheme = document.querySelector('#more_theme');

  mainTitle.addEventListener('click', throttle(() => party.sparkles(document.documentElement, { count: party.variation.range(40, 100) }), 1000));
  moreTheme.addEventListener('click', scrollToThemes);

  function handleButtonClick() {
    const { name, theme, padding, offset, scale, pixelated, darkmode } = elements;
    const nameValue = name.value.trim();

    if (!nameValue) {
      alert('Please input counter name.');
      return;
    }

    const params = {
      name: nameValue,
      theme: theme.value || 'moebooru',
      padding: padding.value || '7',
      offset: offset.value || '0',
      scale: scale.value || '1',
      pixelated: pixelated.checked ? '1' : '0',
      darkmode: darkmode.value || 'auto'
    };

    const query = new URLSearchParams(params).toString();
    const imgSrc = `${__global_data.site}/@${nameValue}?${query}`;

    img.src = `${imgSrc}&_=${Math.random()}`;
    btn.setAttribute('disabled', '');

    img.onload = () => {
      img.scrollIntoView({ block: 'start', behavior: 'smooth' });
      code.textContent = imgSrc;
      code.style.visibility = 'visible';
      party.confetti(btn, { count: party.variation.range(20, 40) });
      btn.removeAttribute('disabled');
    };

    img.onerror = async () => {
      try {
        const res = await fetch(imgSrc);
        if (!res.ok) {
          const { message } = await res.json();
          alert(message);
        }
      } finally {
        btn.removeAttribute('disabled');
      }
    };
  }

  function selectCodeText(e) {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function scrollToThemes() {
    if (!themes.hasAttribute('open')) {
      party.sparkles(moreTheme.querySelector('h3'), { count: party.variation.range(20, 40) });
      themes.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  function throttle(fn, threshold = 250) {
    let last, deferTimer;
    return function (...args) {
      const now = Date.now();
      if (last && now < last + threshold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(() => {
          last = now;
          fn.apply(this, args);
        }, threshold);
      } else {
        last = now;
        fn.apply(this, args);
      }
    };
  }
})();

// Lazy Load
(() => {
  function lazyLoad(options = {}) {
    const { selector = 'img[data-src]:not([src])', loading = '', failed = '', rootMargin = '200px', threshold = 0.01 } = options;

    const images = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          observer.unobserve(img);

          img.onerror = failed ? () => { img.src = failed; img.setAttribute('data-failed', ''); } : null;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-loading');
        }
      });
    }, { rootMargin, threshold });

    images.forEach(img => {
      if (loading) {
        img.src = loading;
        img.setAttribute('data-loading', '');
      }
      observer.observe(img);
    });
  }

  const lazyLoadOptions = {
    selector: 'img[data-src]:not([src])',
    loading: '/img/loading.svg',
    failed: '/img/failed.svg',
    rootMargin: '200px',
    threshold: 0.01
  };

  document.readyState === 'loading'
    ? document.addEventListener("DOMContentLoaded", () => lazyLoad(lazyLoadOptions))
    : lazyLoad(lazyLoadOptions);
})();

// Back to top
(() => {
  let isShow = false, lock = false;
  const btn = document.querySelector('.back-to-top');

  const handleScroll = () => {
    if (lock) return;
    if (document.body.scrollTop >= 1000) {
      if (!isShow) {
        btn.classList.add('load');
        isShow = true;
      }
    } else if (isShow) {
      btn.classList.remove('load');
      isShow = false;
    }
  };

  const handleClick = () => {
    lock = true;
    btn.classList.add('ani-leave');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      btn.classList.remove('ani-leave');
      btn.classList.add('leaved');
    }, 390);

    setTimeout(() => btn.classList.add('ending'), 120);
    setTimeout(() => btn.classList.remove('load'), 1500);

    setTimeout(() => {
      lock = false;
      isShow = false;
      btn.classList.remove('leaved', 'ending');
    }, 2000);
  };

  window.addEventListener('scroll', handleScroll);
  btn.addEventListener('click', handleClick);
})();

// Prevent gesture
(() => {
  document.addEventListener('gesturestart', e => e.preventDefault());
})();
