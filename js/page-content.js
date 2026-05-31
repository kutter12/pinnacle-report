document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (!page) return;

  const escapeHTML = text => String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const renderItem = item => {
    if (typeof item === 'string') {
      return `<p>${escapeHTML(item)}</p>`;
    }

    if (item.html) {
      return item.html;
    }

    if (item.title && item.details) {
      const contactLine = item.contact
        ? `<p><strong>${escapeHTML(item.contact)}</strong></p>`
        : '';
      return `
        <article class="info-card">
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.details)}</p>
          ${contactLine}
        </article>
      `;
    }

    const tag = item.tag ? `<div class="${escapeHTML(item.tagClass || 'card-tag')}">${escapeHTML(item.tag)}</div>` : '';
    const title = item.title ? `<div class="${escapeHTML(item.titleClass || (item.feature ? 'feature-title' : item.side ? 'side-title' : item.tall ? 'tall-card-title' : 'card-title'))}">${escapeHTML(item.title)}</div>` : '';
    const excerpt = item.excerpt ? `<div class="${escapeHTML(item.excerptClass || (item.feature ? 'feature-excerpt' : item.side ? 'side-excerpt' : item.tall ? '' : 'card-excerpt'))}">${escapeHTML(item.excerpt)}</div>` : '';
    const link = item.linkText ? `<a class="${escapeHTML(item.linkClass || 'read-link')}" href="${escapeHTML(item.linkHref || '#')}">${escapeHTML(item.linkText)}</a>` : '';
    const image = item.imageClass ? `<div class="${escapeHTML(item.imageClass)}"></div>` : '<div class="card-image"></div>';

    if (item.feature) {
      return `
        <div class="feature-card">
          ${image}
          ${tag}
          ${title}
          ${excerpt}
          ${link}
        </div>
      `;
    }

    if (item.side) {
      return `
        <div class="side-card">
          <div class="side-image"></div>
          <div class="side-content">
            ${tag}
            ${title}
            ${excerpt}
          </div>
        </div>
      `;
    }

    if (item.tall) {
      return `
        <div class="tall-card">
          <div class="tall-card-image"></div>
          ${tag}
          ${title}
        </div>
      `;
    }

    return `
      <div class="card">
        ${image}
        ${tag}
        ${title}
        ${excerpt}
      </div>
    `;
  };

  fetch(`/api/content/${page}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Page content not found');
      }
      return response.json();
    })
    .then(data => {
      Object.entries(data).forEach(([key, value]) => {
        const element = document.querySelector(`[data-content="${key}"]`);
        if (!element) return;

        if (Array.isArray(value)) {
          element.innerHTML = value.map(renderItem).join('');
        } else if (value && typeof value === 'object') {
          if (value.html) {
            element.innerHTML = value.html;
          } else if (value.title || value.details || value.tag || value.excerpt) {
            element.innerHTML = renderItem(value);
          } else {
            element.textContent = JSON.stringify(value);
          }
        } else {
          element.textContent = value;
        }
      });
    })
    .catch(error => {
      console.warn('Page content failed to load:', error);
    });
});
