(function () {
  'use strict';

  // ===== Theme Toggle =====
  var THEME_KEY = 'mcguide-theme';
  var themeToggle = document.getElementById('themeToggle');

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateThemeToggleLabel() {
    if (!themeToggle) return;
    themeToggle.setAttribute(
      'aria-label',
      getTheme() === 'dark' ? '切换亮色模式' : '切换暗色模式'
    );
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    updateThemeToggleLabel();
  }

  if (themeToggle) {
    updateThemeToggleLabel();
    themeToggle.addEventListener('click', function () {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  // ===== Mobile Navigation =====
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // ===== Tab Switching =====
  var tabs = document.querySelectorAll('.tab');
  var panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = tab.getAttribute('data-tab');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });

      tab.classList.add('active');
      var panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });

  // ===== Search =====
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var searchResultsList = document.getElementById('searchResultsList');
  var closeSearchBtn = document.getElementById('closeSearch');
  var searchableElements = document.querySelectorAll('[data-keywords]');

  function buildSearchIndex() {
    var index = [];
    searchableElements.forEach(function (el) {
      var keywords = el.getAttribute('data-keywords') || '';
      var title = '';
      var heading = el.querySelector('h3, h4, summary');
      if (heading) title = heading.textContent.trim();

      var text = el.textContent.trim().substring(0, 120);
      index.push({ el: el, keywords: keywords, title: title, text: text });
    });
    return index;
  }

  var searchIndex = buildSearchIndex();

  function performSearch(query) {
    if (!query || query.length < 1) return [];

    var q = query.toLowerCase();
    return searchIndex.filter(function (item) {
      return item.keywords.toLowerCase().indexOf(q) !== -1 ||
             item.title.toLowerCase().indexOf(q) !== -1 ||
             item.text.toLowerCase().indexOf(q) !== -1;
    });
  }

  function scrollToElement(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('search-highlight');
    setTimeout(function () {
      el.classList.remove('search-highlight');
    }, 2000);
  }

  function showResults(results) {
    if (!searchResults || !searchResultsList) return;

    searchResultsList.innerHTML = '';

    if (results.length === 0) {
      searchResultsList.innerHTML = '<li>未找到相关内容，请尝试其他关键词</li>';
    } else {
      results.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML = '<strong>' + item.title + '</strong><br><small>' + item.text + '...</small>';
        li.addEventListener('click', function () {
          hideResults();
          scrollToElement(item.el);
        });
        searchResultsList.appendChild(li);
      });
    }

    searchResults.hidden = false;
  }

  function hideResults() {
    if (searchResults) searchResults.hidden = true;
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var results = performSearch(searchInput.value.trim());
        showResults(results);
      }
    });
  }

  document.querySelectorAll('.tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      var keyword = tag.getAttribute('data-search');
      if (searchInput) searchInput.value = keyword;
      var results = performSearch(keyword);
      showResults(results);
    });
  });

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', hideResults);
  }

  if (searchResults) {
    searchResults.addEventListener('click', function (e) {
      if (e.target === searchResults) hideResults();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchResults && !searchResults.hidden) {
      hideResults();
    }
  });

  // ===== Active Nav on Scroll =====
  var sections = document.querySelectorAll('section[id], .section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  function onScroll() {
    var scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = 'var(--grass-light)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== FAQ: only one open at a time (optional UX) =====
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
