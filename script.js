document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('pdv_theme');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pdv_theme', theme);
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark.matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Reading Progress Bar
  const progressBar = document.getElementById('reading-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }
  }, { passive: true });

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Print button
  const printBtn = document.getElementById('btn-print');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Toast Notification Helper
  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Copy anchor links
  document.querySelectorAll('.btn-copy-anchor').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const url = `${window.location.origin}${window.location.pathname}#${targetId}`;
        navigator.clipboard.writeText(url).then(() => {
          showToast('✓ Enlace directo copiado al portapapeles');
        }).catch(() => {
          showToast('Enlace listo: #' + targetId);
        });
      }
    });
  });

  // Table of Contents ScrollSpy
  const sections = document.querySelectorAll('.clause-block, .doc-section');
  const tocLinks = document.querySelectorAll('.toc-link');

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => {
    if (sec.id) observer.observe(sec);
  });

  // Quick Search / Filter
  const searchInput = document.getElementById('doc-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const clauseBlocks = document.querySelectorAll('.clause-block');
      
      if (!query) {
        clauseBlocks.forEach(block => {
          block.style.display = '';
        });
        return;
      }

      clauseBlocks.forEach(block => {
        const text = block.textContent.toLowerCase();
        if (text.includes(query)) {
          block.style.display = '';
        } else {
          block.style.display = 'none';
        }
      });
    });
  }

  // Mobile Table of Contents Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const tocSidebar = document.querySelector('.toc-sidebar');
  if (mobileMenuBtn && tocSidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = tocSidebar.style.display === 'block';
      tocSidebar.style.display = isVisible ? 'none' : 'block';
    });
  }
});
