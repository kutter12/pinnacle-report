document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('page-selector');
  const loadButton = document.getElementById('load-page');
  const saveButton = document.getElementById('save-page');
  const textarea = document.getElementById('page-data');
  const status = document.getElementById('admin-status');

  const showStatus = (message, type) => {
    status.textContent = message;
    status.className = `admin-status ${type}`;
  };

  const fetchPages = () => {
    fetch('/api/pages')
      .then(response => response.json())
      .then(pages => {
        selector.innerHTML = pages
          .map(page => `<option value="${page}">${page}</option>`)
          .join('');
        if (pages.length) {
          loadPage(pages[0]);
        }
      })
      .catch(() => showStatus('Unable to load admin pages.', 'error'));
  };

  const adminKey = new URLSearchParams(window.location.search).get('admin_key');
  const buildUrl = (url) => {
    if (!adminKey) return url;
    return `${url}${url.includes('?') ? '&' : '?'}admin_key=${encodeURIComponent(adminKey)}`;
  };

  const loadPage = (page) => {
    showStatus('Loading content…', '');
    fetch(buildUrl(`/api/content/${page}`))
      .then(response => {
        if (!response.ok) throw new Error('Failed to load page content');
        return response.json();
      })
      .then(data => {
        textarea.value = JSON.stringify(data, null, 2);
        showStatus(`Loaded ${page}.`, 'success');
      })
      .catch(() => showStatus('Unable to load content JSON.', 'error'));
  };

  const savePage = () => {
    const page = selector.value;
    let payload;
    try {
      payload = JSON.parse(textarea.value);
    } catch (error) {
      showStatus('Invalid JSON. Please fix the syntax and try again.', 'error');
      return;
    }

    showStatus('Saving…', '');
    fetch(`/api/content/${page}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          showStatus(`Saved ${page}.`, 'success');
        } else {
          showStatus(data.message || 'Save failed.', 'error');
        }
      })
      .catch(() => showStatus('Unable to save content.', 'error'));
  };

  loadButton.addEventListener('click', () => loadPage(selector.value));
  saveButton.addEventListener('click', savePage);
  selector.addEventListener('change', () => loadPage(selector.value));

  fetchPages();
});
