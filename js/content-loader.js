(function () {
  const content = window.PinnacleReportContent;
  if (!content || !content.pages) return;

  const page = document.body.dataset.page;
  if (!page || !content.pages[page]) return;

  const pageData = content.pages[page];

  Object.entries(pageData).forEach(([key, value]) => {
    if (key === 'cards') return;
    const element = document.querySelector(`[data-content="${key}"]`);
    if (!element) return;

    if (typeof value === 'string') {
      element.textContent = value;
    } else if (Array.isArray(value)) {
      element.innerHTML = value.map(item => `<p>${item}</p>`).join('');
    }
  });

  if (pageData.cards) {
    const cardsContainer = document.querySelector('[data-content="cards"]');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = pageData.cards
      .map(card => {
        return `
          <article class="info-card">
            <h3>${card.title}</h3>
            <p>${card.details}</p>
            <p><strong>${card.contact}</strong></p>
          </article>
        `;
      })
      .join('');
  }
})();
