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
    if (getTheme() === 'light') {
      themeToggle.setAttribute('aria-label', '切换暗色主题');
      themeToggle.title = '切换暗色主题';
    } else {
      themeToggle.setAttribute('aria-label', '切换亮色主题');
      themeToggle.title = '切换亮色主题';
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
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
  var searchResultCount = document.getElementById('searchResultCount');
  var closeSearchBtn = document.getElementById('closeSearch');
  var searchableElements = document.querySelectorAll('[data-keywords]');
  var craftSearchInput = document.getElementById('craftSearchInput');
  var craftSearchHint = document.getElementById('craftSearchHint');
  var craftItems = document.querySelectorAll('#craft .craft-item');
  var craftCategories = document.querySelectorAll('#craft .craft-category');

  var SECTION_NAMES = {
    about: '游戏介绍',
    modes: '游戏模式',
    start: '新手入门',
    survival: '生存攻略',
    craft: '合成指南',
    build: '建造技巧',
    advanced: '进阶内容',
    ai: 'AI 助手',
    faq: '常见问题'
  };

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function tokenize(query) {
    return (query || '').toLowerCase().split(/\s+/).filter(Boolean);
  }

  function getSectionLabel(el) {
    var section = el.closest('section[id]');
    if (!section) return '其他';
    return SECTION_NAMES[section.id] || section.id;
  }

  function buildSearchIndex() {
    var index = [];
    searchableElements.forEach(function (el) {
      var keywords = el.getAttribute('data-keywords') || '';
      var title = '';
      var heading = el.querySelector('h3, h4, summary');
      if (heading) title = heading.textContent.trim();

      var text = el.textContent.trim().substring(0, 120);
      index.push({
        el: el,
        keywords: keywords,
        title: title,
        text: text,
        section: getSectionLabel(el)
      });
    });
    return index;
  }

  var searchIndex = buildSearchIndex();

  function performSearch(query) {
    var tokens = tokenize(query);
    if (!tokens.length) return [];

    return searchIndex.filter(function (item) {
      var haystack = (item.keywords + ' ' + item.title + ' ' + item.text + ' ' + item.section).toLowerCase();
      return tokens.every(function (token) {
        return haystack.indexOf(token) !== -1;
      });
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

  function showResults(results, query) {
    if (!searchResults || !searchResultsList) return;

    searchResultsList.innerHTML = '';

    if (searchResultCount) {
      searchResultCount.textContent = results.length ? '（' + results.length + ' 条）' : '';
    }

    if (results.length === 0) {
      var emptyLi = document.createElement('li');
      emptyLi.className = 'no-result';
      emptyLi.textContent = '未找到与「' + query + '」相关的内容，请换关键词试试';
      searchResultsList.appendChild(emptyLi);
    } else {
      results.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML =
          '<span class="search-result-badge">' + escapeHtml(item.section) + '</span>' +
          '<strong>' + escapeHtml(item.title || '相关内容') + '</strong>' +
          '<small>' + escapeHtml(item.text) + '...</small>';
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

  function runGlobalSearch() {
    if (!searchInput) return;
    var query = searchInput.value.trim();
    if (!query) {
      hideResults();
      return;
    }
    showResults(performSearch(query), query);
  }

  var searchDebounceTimer;
  function debouncedGlobalSearch() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(runGlobalSearch, 200);
  }

  if (searchInput) {
    searchInput.addEventListener('input', debouncedGlobalSearch);
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(searchDebounceTimer);
        runGlobalSearch();
      }
    });
  }

  function filterCraftItems(query) {
    var tokens = tokenize(query);
    var visible = 0;

    craftItems.forEach(function (item) {
      var titleEl = item.querySelector('h4');
      var title = titleEl ? titleEl.textContent.trim() : '';
      var keywords = item.getAttribute('data-keywords') || '';
      var text = item.textContent.trim();
      var haystack = (keywords + ' ' + title + ' ' + text).toLowerCase();
      var match = !tokens.length || tokens.every(function (token) {
        return haystack.indexOf(token) !== -1;
      });

      item.classList.toggle('craft-hidden', !match);
      if (match) visible += 1;
    });

    craftCategories.forEach(function (category) {
      var grid = category.nextElementSibling;
      if (!grid || !grid.classList.contains('craft-grid')) return;
      var hasVisible = grid.querySelector('.craft-item:not(.craft-hidden)');
      var hide = tokens.length > 0 && !hasVisible;
      category.classList.toggle('craft-hidden', hide);
      grid.classList.toggle('craft-hidden', hide);
    });

    if (craftSearchHint) {
      craftSearchHint.hidden = !tokens.length || visible > 0;
    }
  }

  var craftDebounceTimer;
  if (craftSearchInput) {
    craftSearchInput.addEventListener('input', function () {
      clearTimeout(craftDebounceTimer);
      craftDebounceTimer = setTimeout(function () {
        filterCraftItems(craftSearchInput.value.trim());
      }, 150);
    });
    craftSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(craftDebounceTimer);
        filterCraftItems(craftSearchInput.value.trim());
      }
    });
  }

  document.querySelectorAll('.tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      var keyword = tag.getAttribute('data-search');
      if (searchInput) searchInput.value = keyword;
      runGlobalSearch();
      if (craftSearchInput && keyword) {
        craftSearchInput.value = keyword;
        filterCraftItems(keyword);
        var craftSection = document.getElementById('craft');
        if (craftSection) craftSection.scrollIntoView({ behavior: 'smooth' });
      }
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

  // ===== Craft Nav Active Category on Scroll =====
  var craftNavLinks = document.querySelectorAll('.craft-nav-link');
  var craftCategoryHeadings = document.querySelectorAll('#craft .craft-category[id]');

  function updateCraftNav() {
    if (!craftNavLinks.length || !craftCategoryHeadings.length) return;
    var scrollY = window.scrollY + 130;
    var activeId = null;

    craftCategoryHeadings.forEach(function (h) {
      if (h.offsetTop <= scrollY) activeId = h.id;
    });

    craftNavLinks.forEach(function (link) {
      link.classList.toggle('active', activeId && link.getAttribute('href') === '#' + activeId);
    });
  }

  window.addEventListener('scroll', updateCraftNav, { passive: true });
  updateCraftNav();

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
